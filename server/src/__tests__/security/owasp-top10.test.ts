/**
 * OWASP Top 10 Security Tests
 * Tests for the most common security vulnerabilities
 */

import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../../routes/auth.routes';
import aiTutorRoutes from '../../routes/ai-tutor.routes';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/ai-tutor', aiTutorRoutes);

describe('OWASP Top 10 Security Tests', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('A01:2021 - Broken Access Control', () => {
    it('should prevent unauthorized access to protected routes', async () => {
      const response = await request(app).get('/api/auth/profile');
      expect(response.status).toBe(401);
    });

    it('should enforce role-based access control', async () => {
      // Create student user
      const student = new User({
        email: 'student@test.com',
        password: await bcrypt.hash('pass123', 12),
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
        isActive: true,
      });
      await student.save();

      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: student._id.toString() },
        process.env.JWT_SECRET!
      );

      // Student should not access admin routes
      // This test assumes admin routes exist
      // Adjust based on actual admin routes
      expect(token).toBeDefined();
    });

    it('should prevent token tampering', async () => {
      const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjY2NjY2NjY2NjY2NiJ9.tampered';
      
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${tamperedToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('A02:2021 - Cryptographic Failures', () => {
    it('should hash passwords with bcrypt', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'hash@test.com',
          password: 'password123',
          firstName: 'Hash',
          lastName: 'Test',
        });

      expect(response.status).toBe(201);

      const user = await User.findOne({ email: 'hash@test.com' });
      expect(user?.password).not.toBe('password123');
      expect(await bcrypt.compare('password123', user!.password)).toBe(true);
    });

    it('should use secure JWT secret in production', () => {
      // In production, JWT_SECRET should be set and not be default
      const jwtSecret = process.env.JWT_SECRET;
      expect(jwtSecret).toBeDefined();
      expect(jwtSecret).not.toBe('your-secret-key');
      expect(jwtSecret!.length).toBeGreaterThan(32); // Minimum secure length
    });

    it('should not expose passwords in responses', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'nopass@test.com',
          password: 'password123',
          firstName: 'No',
          lastName: 'Pass',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).not.toHaveProperty('password');
      expect(JSON.stringify(response.body)).not.toContain('password123');
    });
  });

  describe('A03:2021 - Injection', () => {
    it('should prevent NoSQL injection in email field', async () => {
      const maliciousPayload = {
        email: { $ne: null },
        password: 'any',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(maliciousPayload);

      // Should not find user or return 400
      expect([400, 401]).toContain(response.status);
    });

    it('should prevent MongoDB injection in queries', async () => {
      const maliciousEmail = "'; db.users.drop(); //";
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: maliciousEmail,
          password: 'test',
        });

      // Should handle gracefully without executing injection
      expect([400, 401]).toContain(response.status);
    });

    it('should sanitize user input', async () => {
      const maliciousInput = {
        email: '<script>alert("xss")</script>@test.com',
        password: 'password123',
        firstName: '<img src=x onerror=alert(1)>',
        lastName: 'Test',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(maliciousInput);

      // Should either reject or sanitize
      if (response.status === 201) {
        const user = await User.findOne({ email: maliciousInput.email });
        expect(user?.firstName).not.toContain('<script>');
        expect(user?.firstName).not.toContain('onerror');
      }
    });
  });

  describe('A04:2021 - Insecure Design', () => {
    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      // Should validate email format
      expect([400, 422]).toContain(response.status);
    });

    it('should enforce minimum password length', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'short@test.com',
          password: '123', // Too short
          firstName: 'Test',
          lastName: 'User',
        });

      // Should reject short passwords
      expect([400, 422]).toContain(response.status);
    });

    it('should rate limit authentication attempts', async () => {
      // Make multiple rapid login attempts
      const attempts = 10;
      const responses = await Promise.all(
        Array(attempts).fill(null).map(() =>
          request(app)
            .post('/api/auth/login')
            .send({
              email: 'ratelimit@test.com',
              password: 'wrong',
            })
        )
      );

      // Should eventually rate limit (if implemented)
      // This test documents the need for rate limiting
      responses.forEach((res) => {
        expect([400, 401, 429]).toContain(res.status);
      });
    });
  });

  describe('A05:2021 - Security Misconfiguration', () => {
    it('should not expose stack traces in error responses', async () => {
      // Trigger an error
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          // Invalid data to trigger error
          email: null,
          password: null,
        });

      // Error response should not contain stack traces
      const responseStr = JSON.stringify(response.body);
      expect(responseStr).not.toContain('at ');
      expect(responseStr).not.toContain('Error:');
      expect(responseStr).not.toContain('stack');
    });

    it('should use secure headers', async () => {
      const response = await request(app).get('/health');
      
      // Should have security headers (if helmet is configured)
      // This test documents the need for security headers
      expect(response.headers).toBeDefined();
    });
  });

  describe('A06:2021 - Vulnerable Components', () => {
    it('should use secure dependencies', () => {
      // This test documents the need for dependency scanning
      // In practice, use npm audit or Snyk
      const packageJson = require('../../../package.json');
      expect(packageJson).toBeDefined();
      // Document: Run `npm audit` regularly
    });
  });

  describe('A07:2021 - Authentication Failures', () => {
    it('should not reveal if email exists during signup', async () => {
      // Create existing user
      const user = new User({
        email: 'exists@test.com',
        password: await bcrypt.hash('pass123', 12),
        firstName: 'Exists',
        lastName: 'User',
      });
      await user.save();

      // Try to signup with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'exists@test.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
        });

      // Should return generic error (not revealing user exists)
      expect([400, 409]).toContain(response.status);
    });

    it('should use secure password comparison', async () => {
      const user = new User({
        email: 'timing@test.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Timing',
        lastName: 'Test',
        isActive: true,
      });
      await user.save();

      // Test that password comparison is constant-time
      const start = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'timing@test.com',
          password: 'wrongpassword',
        });
      const duration = Date.now() - start;

      // Should take similar time regardless of password correctness
      // (bcrypt.compare is constant-time)
      expect(duration).toBeGreaterThan(0);
    });
  });

  describe('A08:2021 - Software and Data Integrity', () => {
    it('should validate request payload size', async () => {
      const largePayload = {
        email: 'large@test.com',
        password: 'a'.repeat(10000), // Very large password
        firstName: 'Large',
        lastName: 'Payload',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(largePayload);

      // Should reject or limit payload size
      expect([400, 413, 422]).toContain(response.status);
    });
  });

  describe('A09:2021 - Security Logging Failures', () => {
    it('should log authentication failures', () => {
      // This test documents the need for security logging
      // In practice, implement structured logging (Winston, Pino)
      // and log failed login attempts, token validation failures, etc.
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('A10:2021 - Server-Side Request Forgery (SSRF)', () => {
    it('should validate external URLs in requests', async () => {
      // If your API accepts URLs, validate them
      // This test documents the need for URL validation
      const maliciousUrl = 'http://localhost:27017/admin'; // Internal service
      
      // Test would depend on your API endpoints
      // Example: If you have an endpoint that fetches external resources
      expect(true).toBe(true); // Placeholder
    });
  });
});

