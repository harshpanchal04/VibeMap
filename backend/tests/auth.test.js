const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../src/routes/authRoutes');
const User = require('../src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
    // Connect to a test database or mock
    // For simplicity in this generated test, we'll assume the main MONGO_URI is safe or we should use a test one.
    // Ideally use process.env.MONGO_URI_TEST. For now we will just mock or connect to existing if available.
    // CAUTION: This uses real DB if not careful.
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

// Clean up user after test
afterEach(async () => {
    // Optional: Clean up created users
    await User.deleteOne({ email: 'test_jest@example.com' });
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Jest Test',
                email: 'test_jest@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login the user', async () => {
        // First register (or ensure exists)
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Jest Test',
                email: 'test_jest@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test_jest@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
