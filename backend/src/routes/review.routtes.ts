import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { userId, text, imageUrl, rating } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "userId is required and must be a string" });
  }
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "text is required" });
  }
  const parsedRating = Number(rating);
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ error: "rating must be an integer between 1 and 5" });
  }
  if (imageUrl && typeof imageUrl !== "string") {
    return res.status(400).json({ error: "imageUrl must be a string" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const review = await prisma.review.create({
      data: {
        userId,
        text: text.trim(),
        imageUrl: imageUrl ?? null,
        rating: parsedRating
      }
    });

    return res.status(201).json(review);
  } catch (err) {
    console.error("POST /reviews error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ? Number(req.query.page) : 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ? Number(req.query.limit) : 20)));
  const skip = (page - 1) * limit;

  try {
    const [total, reviews] = await Promise.all([
      prisma.review.count(),
      prisma.review.findMany({
        include: { user: { select: { id: true, name: true, country: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: reviews
    });
  } catch (err) {
    console.error("GET /reviews error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;