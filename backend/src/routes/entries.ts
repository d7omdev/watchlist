import { Router, Request, Response } from "express";
import { db } from "../db/connection";
import { entries } from "../db/schema";
import {
  createEntrySchema,
  updateEntrySchema,
  querySchema,
} from "../schemas/entry";
import { eq, desc } from "drizzle-orm";

interface EntryRequest extends Request {
  user?: { id: number };
}

const router = Router();

// Middleware to require authentication and set req.user
function requireAuth(
  req: Request & { user?: { id: number } },
  res: Response,
  next: Function,
): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// GET /api/entries - Get all entries with pagination
router.get(
  "/",
  requireAuth,
  async (req: Request & { user?: { id: number } }, res: Response) => {
    try {
      const { page, limit } = querySchema.parse(req.query);
      const offset = (page - 1) * limit;

      // Only fetch entries for the authenticated user
      const allEntries = await db
        .select()
        .from(entries)
        .where(eq(entries.userId, req.user!.id))
        .orderBy(desc(entries.createdAt))
        .limit(limit)
        .offset(offset);

      const totalCount = await db
        .select()
        .from(entries)
        .where(eq(entries.userId, req.user!.id));
      const total = totalCount.length;
      const hasMore = offset + limit < total;

      res.json({
        data: allEntries,
        pagination: {
          page,
          limit,
          total,
          hasMore,
        },
      });
    } catch (error) {
      console.error("Error fetching entries:", error);
      res.status(500).json({ error: "Failed to fetch entries" });
    }
  },
);

// GET /api/entries/:id - Get single entry
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const entry = await db
      .select()
      .from(entries)
      .where(eq(entries.id, id))
      .limit(1);

    if (entry.length === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(entry[0]);
  } catch (error) {
    console.error("Error fetching entry:", error);
    res.status(500).json({ error: "Failed to fetch entry" });
  }
});

// POST /api/entries - Create new entry
router.post("/", async (req: EntryRequest, res: Response) => {
  try {
    const validatedData = createEntrySchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const newEntry = await db
      .insert(entries)
      .values({ ...validatedData, imageUrl: req.body.imageUrl, userId });
    const createdEntry = await db
      .select()
      .from(entries)
      .where(eq(entries.id, newEntry[0].insertId))
      .limit(1);
    res.status(201).json(createdEntry[0]);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error });
    }
    console.error("Error creating entry:", error);
    res.status(500).json({ error: "Failed to create entry" });
  }
});

// PUT /api/entries/:id - Update entry
router.put("/:id", async (req: EntryRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }
    const validatedData = updateEntrySchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const existingEntry = await db
      .select()
      .from(entries)
      .where(eq(entries.id, id))
      .limit(1);
    if (existingEntry.length === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }
    await db
      .update(entries)
      .set({ ...validatedData, imageUrl: req.body.imageUrl })
      .where(eq(entries.id, id));
    const updatedEntry = await db
      .select()
      .from(entries)
      .where(eq(entries.id, id))
      .limit(1);
    res.json(updatedEntry[0]);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error });
    }
    console.error("Error updating entry:", error);
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// DELETE /api/entries/:id - Delete entry
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const existingEntry = await db
      .select()
      .from(entries)
      .where(eq(entries.id, id))
      .limit(1);

    if (existingEntry.length === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }

    await db.delete(entries).where(eq(entries.id, id));

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

export default router;
