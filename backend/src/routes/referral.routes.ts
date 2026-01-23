import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const router = Router();

function generateCode(len = 8) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString("hex").slice(0, len);
}

router.post("/generate", async (req, res) => {
  const { userId } = req.body;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // attempt to create a unique code, retry on collision a few times
    let referral = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode(8);
      try {
        referral = await prisma.referral.create({
          data: {
            code,
            ownerId: userId
          }
        });
        break; // success
      } catch (err: any) {
        // if unique constraint on code, retry; otherwise throw
        if (err?.code === "P2002" && err?.meta?.target?.includes("code")) {
          continue;
        }
        throw err;
      }
    }

    if (!referral) {
      return res.status(500).json({ error: "Could not generate unique referral code" });
    }

    return res.json(referral);
  } catch (err) {
    console.error("POST /referrals/generate error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/use", async (req, res) => {
  const { code, userId } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "code is required" });
  }
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const referral = await prisma.referral.findUnique({ where: { code } });
    if (!referral) {
      return res.status(404).json({ error: "Referral code not found" });
    }
    if (referral.usedById) {
      return res.status(400).json({ error: "Referral code already used" });
    }
    if (referral.ownerId === userId) {
      return res.status(400).json({ error: "Owner cannot use their own referral code" });
    }

    // optionally ensure user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updated = await prisma.referral.update({
      where: { id: referral.id },
      data: { usedById: userId }
    });

    return res.json(updated);
  } catch (err) {
    console.error("POST /referrals/use error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
