import { Request, Response, NextFunction } from 'express';
import { adminAuth, adminDb } from '../../core/firebaseAdmin';
import { logger } from '../../core/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role: 'customer' | 'admin' | 'support_agent';
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch user role from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    let role: 'customer' | 'admin' | 'support_agent' = 'customer';

    if (userDoc.exists) {
      const userData = userDoc.data();
      role = userData?.role || 'customer';
    }

    req.user = {
      uid,
      email: decodedToken.email,
      role,
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
