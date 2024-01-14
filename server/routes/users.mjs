import express from 'express';
import db from '../db/connection.mjs';
import { ObjectId } from 'mongodb';
import User from '../models/user.mjs';

const router = express.Router();
import authentication from '../middleware/authentication.mjs';

// Get a list of users
router.get('/', authentication, async (req, res) => {
    let collection = await db.collection('users');
    let users = await collection.find({}).limit(50).toArray();

    res.send(users.map((user) => User.formatUserResult(user))).status(200);
});

router.get('/:id', authentication, async (req, res) => {
    const collection = await db.collection('users');
    const query = { _id: new ObjectId(req.params.id) };
    const user = await collection.findOne(query);

    if (!user) {
        return res.send('Not found').status(404);
    }

    res.send(User.formatUserResult(user)).status(200);
});

// Delete an entry
router.delete('/:id', async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection('users');
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
});

export default router;
