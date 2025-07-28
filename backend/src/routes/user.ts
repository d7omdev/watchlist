import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

interface UserRequest extends Request {
    user?: { id: number; email: string; name: string };
}

const router = Router();

const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
    avatarUrl: z.string().optional().or(z.literal('')),
});

// Middleware to require authentication and set req.user
function requireAuth(req: UserRequest, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}

// GET /api/profile/profile - Get current user profile
router.get('/profile', requireAuth, async (req: UserRequest, res: Response) => {
    try {
        const user = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
        if (!user.length) return res.status(404).json({ error: 'User not found' });
        
        // Remove password from response
        const foundUser = user[0]!;
        const { password, ...userWithoutPassword } = foundUser;
        return res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// PUT /api/profile/profile - Update user profile
router.put('/profile', requireAuth, async (req: UserRequest, res: Response) => {
    try {
        const validatedData = updateProfileSchema.parse(req.body);
        
        // Only update fields that are provided
        const updateData: any = {};
        if (validatedData.name !== undefined) updateData.name = validatedData.name;
        if (validatedData.avatarUrl !== undefined) updateData.avatarUrl = validatedData.avatarUrl || null;
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }
        
        await db.update(users).set(updateData).where(eq(users.id, req.user!.id));
        const updatedUser = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
        
        // Remove password from response
        const foundUser = updatedUser[0]!;
        const { password, ...userWithoutPassword } = foundUser;
        return res.json(userWithoutPassword);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        console.error('Error updating user profile:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router; 