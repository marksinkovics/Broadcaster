import express from 'express';
import db from '../db/connection.mjs';
import { ObjectId } from 'mongodb';
import authentication from '../middleware/authentication.mjs';
import { PostCreationInputValidationSchema } from '../models/post.mjs';
import { Validator } from 'express-json-validator-middleware';
import User from '../models/user.mjs';

const router = express.Router();
const { validate } = new Validator();

// Get a list of 50 posts
router.get('/', authentication, async (req, res) => {
    let posts = await db.collection('posts');
    const users = await db.collection('users');

    const fetchAuthorForPost = async (post) => {
      const author = await users.findOne({ _id: new ObjectId(post.author) });
      if (author) {
        return {
          ...post,
          author: User.formatUserResult(author)
        }
      }
      return post
    }

    let results = await posts.find({}).limit(50).toArray();
    results = await Promise.all(results.map(post => fetchAuthorForPost(post)))
    res.send(results).status(200);
});

router.post(
    '/',
    authentication,
    validate({ body: PostCreationInputValidationSchema }),
    async (req, res) => {
        const { description } = req.body;
        const { userId } = req.user;
        const newPost = {
            author: userId,
            description,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        let posts = await db.collection('posts');
        let result = await posts.insertOne(newPost);
        res.send(result).status(204);
    }
);

router.get('/:id', authentication, async (req, res) => {
    const { userId } = req.user;
    const posts = await db.collection('posts');
    const users = await db.collection('users');
    const post = await posts.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) {
        return res.send('Not found').status(404);
    }
    let result = post;
    const author = await users.findOne({ _id: new ObjectId(userId) });
    if (author) {
        result = {
            ...result,
            author: User.formatUserResult(author),
        };
    }
    res.send(result).status(200);
});

router.put('/:id', authentication, async (req, res) => {
    const posts = await db.collection('users');
    const post = await collection.updateOne({ _id: new ObjectId(req.params.id) });

    if (!post) {
        return res.send('Not found').status(404);
    }

    const newPost = {
        description: req.body.description,
        updatedAt: new Date(),
    };

    await posts.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: newPost },
        { upsert: false }
    );

    res.send(post).status(200);
});
router.delete('/:id', authentication, async (req, res) => {});

export default router;
