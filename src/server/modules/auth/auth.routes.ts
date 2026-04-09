import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from './auth.middleware';

const router = Router();

// Get current user session info from backend perspective
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export const authRouter = router;
