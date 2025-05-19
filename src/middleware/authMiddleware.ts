import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role?: string };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
     res.status(401).json({ message: 'No token provided' });
     return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      req.user = { id: (decoded as any).id, role: (decoded as any).role };
      next();
    } else {
       res.status(401).json({ message: 'Invalid token payload' });
       return
    }
  } catch (err) {
     res.status(401).json({ message: 'Invalid token' });
     return
  }
};


