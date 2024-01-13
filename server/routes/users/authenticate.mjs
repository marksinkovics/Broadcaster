import express from "express";
import db from "../../db/connection.mjs";
import { ObjectId } from "mongodb";

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

const router = express.Router();

// Get a list of 50 posts
router.get("/", async (req, res) => {
    //TODO: do the auth validation and return back with this
    const { username, password } = req.params;
    // const passwordHash =


    const token = generateAccessToken({ username: req.body.username });
    res.json(token);
});

export default router;