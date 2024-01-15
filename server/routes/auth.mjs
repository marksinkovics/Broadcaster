import express from 'express';
import db from '../db/connection.mjs';
import authentication from '../middleware/authentication.mjs';
import { generateSalt, hash, compare } from '../hasher.mjs';
import { Validator } from 'express-json-validator-middleware';
import jwt from 'jsonwebtoken';
import User from '../models/user.mjs';

const { validate } = new Validator();
const salt = generateSalt(10);

const router = express.Router();

const signUpUserRegisterSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: {
            type: 'string',
            minLength: 5,
        },
        email: {
            type: 'string',
            minLength: 5,
        },
        password: {
            type: 'string',
            minLength: 5,
        },
    },
};

// Register new user
router.post('/signup', validate({ body: signUpUserRegisterSchema }), async (req, res) => {
    const { username, email, password } = req.body;
    let collection = await db.collection('users');
    let user = await collection.findOne({ username });
    if (user) {
        return res.send('Conflict').status(409);
    }
    const newUser = {
        username,
        email,
        password: await hash(password, salt),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    let result = await collection.insertOne(newUser);
    res.send(result).status(204);
});

const signInUserRegisterSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: {
            type: 'string',
            minLength: 5,
        },
        password: {
            type: 'string',
            minLength: 5,
        },
    },
};

function generateAccessToken(username, userId) {
    return jwt.sign({username, userId}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

router.post('/signin', validate({ body: signInUserRegisterSchema }), async (req, res) => {
    const { username, password } = req.body;
    let collection = await db.collection('users');
    let user = await collection.findOne({ username });

    if (!user) {
        return res.status(401).json({
            status: 'failed',
            data: [],
            message: 'Invalid username or password. Please try again with the correct credentials.',
        });
    }

    let match = await compare(password, user.password);
    if (match) {
        let sessions = await db.collection('sessions');

        const token = generateAccessToken(username, user._id);

        const newSession = {
            userId: user._id,
            authToken: token,
            createdAt: new Date(),
        };

        await sessions.findOneAndUpdate(
            { userId: user._id },
            { $set: newSession },
            { upsert: true }
        );

        const result = {
            ...User.formatUserResult(user),
            authToken: token,
        };

        res.status(200).json({
            status: 'success',
            message: 'You have successfully logged in.',
            data: result,
        });
    }
});

router.get('/signout', authentication, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const authToken = authHeader && authHeader.split(' ')[1];

    const sessions = await db.collection('sessions');

    let result = await sessions.deleteOne({ authToken });
    res.send(result).status(200);
});

export default router;
