import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../../routes/auth.routes';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeAll(async () => {
    // MongoDB connection handled by test setup
  });

  beforeEach(async () => {
    await User.deleteMany({});
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          role: 'student',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          // Missing password, firstName, lastName
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 if user already exists', async () => {
      const user = new User({
        email: 'existing@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Existing',
        lastName: 'User',
      });
      await user.save();

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });

    it('should hash password before saving', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'hashtest@example.com',
          password: 'password123',
          firstName: 'Hash',
          lastName: 'Test',
        });

      expect(response.status).toBe(201);

      const user = await User.findOne({ email: 'hashtest@example.com' });
      expect(user?.password).not.toBe('password123');
      expect(user?.password).toHaveLength(60); // bcrypt hash length
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        email: 'login@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Login',
        lastName: 'User',
        isActive: true,
      });
      await user.save();
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('login@example.com');
    });

    it('should return 401 with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid');
    });

    it('should return 401 if account is deactivated', async () => {
      const user = await User.findOne({ email: 'login@example.com' });
      if (user) {
        user.isActive = false;
        await user.save();
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('deactivated');
    });

    it('should return 400 if email or password missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/profile');

      expect(response.status).toBe(401);
    });

    it('should return user profile with valid token', async () => {
      const user = new User({
        email: 'profile@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Profile',
        lastName: 'User',
        isActive: true,
      });
      await user.save();

      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET!
      );

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('profile@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });
  });
});

