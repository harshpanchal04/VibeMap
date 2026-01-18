const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const vibeRoutes = require('../src/routes/vibeRoutes');
const authRoutes = require('../src/routes/authRoutes');
const User = require('../src/models/User');
const Vibe = require('../src/models/Vibe');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/vibes', vibeRoutes);

let token;
let userId;

beforeAll(async () => {
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
    }

    // cleanup
    await User.deleteOne({ email: 'vibe@test.com' });
    await Vibe.deleteMany({});

    // Register and login to get token
    await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Vibe Tester',
            email: 'vibe@test.com',
            password: 'password123'
        });

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'vibe@test.com',
            password: 'password123'
        });

    token = res.body.token;

    // Decode token or fetch user to get ID if needed, but we can verify via token
    const user = await User.findOne({ email: 'vibe@test.com' });
    userId = user._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    // Cleanup vibes
    // await Vibe.deleteMany({ prompt: 'Test Vibe Prompt' });
});

describe('Vibe Endpoints', () => {

    describe('POST /api/vibes/generate', () => {
        it('should fail without token', async () => {
            const res = await request(app)
                .post('/api/vibes/generate')
                .send({ prompt: 'Test Vibe Prompt' });
            expect(res.statusCode).toEqual(401);
        });

        it('should return 400 if prompt is missing', async () => {
            const res = await request(app)
                .post('/api/vibes/generate')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(res.statusCode).toEqual(400);
        });

        // Skip actual generation to avoid API costs/latency in CI/Test
        // it('should generate a itinerary', ...);
    });

    describe('GET /api/vibes/history', () => {
        it('should return empty list initially', async () => {
            const res = await request(app)
                .get('/api/vibes/history')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);
        });

        it('should return user history', async () => {
            // Seed a vibe
            await Vibe.create({
                userId,
                prompt: 'Test History',
                itineraryJson: {
                    itinerary_title: 'Test Trip',
                    stops: []
                }
            });

            const res = await request(app)
                .get('/api/vibes/history')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].itineraryJson.itinerary_title).toBe('Test Trip');
        });
    });
});
