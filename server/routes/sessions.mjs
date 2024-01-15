import express from 'express';
import db from '../db/connection.mjs';
import { ObjectId } from 'mongodb';
import authentication from '../middleware/authentication.mjs';

const router = express.Router();

// Delete an entry
router.delete('/:id', async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection('sessions');
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
});


// Get a list of 50 posts
router.get('/', authentication, async (req, res) => {
    let collection = await db.collection('sessions');
    let results = await collection.find({}).limit(50).toArray();

    res.send(results).status(200);
});

export default router;
