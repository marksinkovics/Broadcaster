import express from "express";
import db from "../db/connection.mjs";
import { ObjectId } from "mongodb";
import authentication from "../middleware/authentication.mjs"

const router = express.Router();

// Get a list of 50 posts
router.get("/", authentication, async (req, res) => {
    console.log('it is called')
  let collection = await db.collection("posts");
  let results = await collection.find({})
    .limit(50)
    .toArray();

  res.send(results).status(200);
});

export default router;