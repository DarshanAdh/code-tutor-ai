import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireRole, optionalAuth } from '../../middleware/auth';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token provided', async () => {
      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Access token required',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if invalid token', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid token',
      });
    });

    it('should authenticate valid token and attach user', async () => {
      // Create test user
      const user = new User({
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
        isActive: true,
      });
      await user.save();

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET!
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.email).toBe('test@example.com');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      const token = jwt.sign(
        { userId: '507f1f77bcf86cd799439011' },
        process.env.JWT_SECRET!
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid token',
      });
    });

    it('should return 401 if account is deactivated', async () => {
      const user = new User({
        email: 'inactive@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Inactive',
        lastName: 'User',
        role: 'student',
        isActive: false,
      });
      await user.save();

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET!
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Account is deactivated',
      });
    });
  });

  describe('requireRole', () => {
    it('should return 401 if user not authenticated', () => {
      const middleware = requireRole(['admin']);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
    });

    it('should return 403 if user lacks required role', async () => {
      const user = new User({
        email: 'student@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
        isActive: true,
      });
      await user.save();

      mockRequest.user = user as any;

      const middleware = requireRole(['admin']);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
    });

    it('should allow access if user has required role', async () => {
      const user = new User({
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
      });
      await user.save();

      mockRequest.user = user as any;

      const middleware = requireRole(['admin']);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should continue without user if no token provided', async () => {
      await optionalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
    });

    it('should attach user if valid token provided', async () => {
      const user = new User({
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
        isActive: true,
      });
      await user.save();

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET!
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      await optionalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.user).toBeDefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should continue without user if invalid token', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      await optionalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      // Should not throw error, just continue
    });
  });
});

