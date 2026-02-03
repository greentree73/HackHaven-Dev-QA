import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// TODO: Define the JWT payload interface
interface JwtPayload {
  // TODO: Add user properties (id, email, username)
  id: number;
  email: string;
  username: string;
}

// TODO: Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      // TODO: Add user property
      user?: { id: number; 
        email: string; 
        username: string };
    }
  }
}

// TODO: Create the authenticate middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // TODO: Get token from Authorization header
  const authHeader = req.headers.authorization;

  // TODO: Extract token from "Bearer TOKEN" format
  const token = authHeader?.split(' ')[1];

  // TODO: Check if token exists
  // If no token, return 401 with message "No token provided"
  if (!token) {
    res.status(401).json({
      error: "No token provided",
      message: "Authorization header must be in format: Bearer <token>",
    });
    return;
  }
  // TODO: Verify and decode the token
  // Use try-catch block
  try {
    const secret = process.env.JWT_SECRET
    
    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables')
      res.status(500).json({ error: 'Server configuration error' })
      return
    }
    const decoded = jwt.verify(token, secret) as JwtPayload
    
    // 4. Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username
    }
    next()
    
  } catch (error: any) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Token expired',
        message: 'Your session has expired. Please login again.'
      })
      return
  }
  if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid.'
      })
      return
    }
    
    // Generic error
    res.status(401).json({
      error: 'Authentication failed',
      message: error.message
    })
}
};
