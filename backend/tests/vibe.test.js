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

beforeAll(async () => {
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
    }

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
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    // Cleanup vibes
    await Vibe.deleteMany({ prompt: 'Test Vibe Prompt' });
});

describe('Vibe Endpoints', () => {
    it('should fail without token', async () => {
        const res = await request(app)
            .post('/api/vibes')
            .send({ prompt: 'Test Vibe Prompt' });
        expect(res.statusCode).toEqual(401);
    });

    // NOTE: This test will actually CALL Gemini if we don't mock it. 
    // For a real unit test, we should mock the Gemini API response.
    // For this simple setup, we might skip the actual generation or assume it fails/succeeds depending on API Key.
    // We will just check if it returns 401/400 correctly for now to avoid consuming quota or failing due to missing env key in test.
    it('should return 400 if prompt is missing', async () => {
        const res = await request(app)
            .post('/api/vibes')
            .set('Authorization', `Bearer ${token}`)
            .send({});
        expect(res.statusCode).toEqual(400);
    });
});
