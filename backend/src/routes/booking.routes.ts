import { Router, Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Create booking
router.post("/", async (req: Request, res: Response) => {
  const {
    userId,
    destination,
    service,
    startDate,
    endDate,
    quantity,
    totalPrice
  } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "userId is required" });
  }
  if (!destination || typeof destination !== "string") {
    return res.status(400).json({ error: "destination is required" });
  }
  if (!service || typeof service !== "string") {
    return res.status(400).json({ error: "service is required" });
  }
  if (!startDate || typeof startDate !== "string") {
    return res.status(400).json({ error: "startDate is required" });
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) return res.status(400).json({ error: "Invalid startDate" });

  let end: Date | null = null;
  if (endDate) {
    end = new Date(endDate);
    if (isNaN(end.getTime())) return res.status(400).json({ error: "Invalid endDate" });
    if (end < start) return res.status(400).json({ error: "endDate must be after startDate" });
  }

  const qty = Number(quantity ?? 1);
  if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ error: "quantity must be an integer >= 1" });

  const priceNum = Number(totalPrice);
  if (Number.isNaN(priceNum) || priceNum < 0) return res.status(400).json({ error: "totalPrice must be a non-negative number" });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const booking = await prisma.booking.create({
      data: {
        userId,
        destination,
        service,
        startDate: start,
        endDate: end,
        quantity: qty,
        totalPrice: new Prisma.Decimal(priceNum)
      }
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error("POST /bookings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// List bookings with pagination and optional user filter
router.get("/", async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ? Number(req.query.page) : 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ? Number(req.query.limit) : 20)));
  const skip = (page - 1) * limit;
  const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;

  try {
    const where = userId ? { userId } : undefined;

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, country: true } } },
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
      data: bookings
    });
  } catch (err) {
    console.error("GET /bookings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;