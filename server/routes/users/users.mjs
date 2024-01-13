import express from "express";
import db from "../../db/connection.mjs";
import auth from "./authenticate.mjs"
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken'

const router = express.Router();
import authentication from "../../middleware/authentication.mjs"
import { generateSalt, hash, compare } from '../../hasher.mjs';
import { Validator } from "express-json-validator-middleware";
const { validate } = new Validator();

let salt = generateSalt(10);

// Login
router.get("/authenticate", auth);

const formatUserResult = (user) => {
  return { email: user.email, createdAt: user.createdAt };
}

// Get a list of users
router.get("/", authentication, async (req, res) => {
  let collection = await db.collection("users");
  let users = await collection.find({})
    .limit(50)
    .toArray();

  res.send(users.map(user => formatUserResult(user))).status(200);
});

router.get("/:id", authentication, async (req, res) => {
  const collection = await db.collection("users");
  const query = {_id: new ObjectId(req.params.id)};
  const user = await collection.findOne(query);

  if (!user) {
    return res.send("Not found").status(404);
  }

  res.send(formatUserResult(user)).status(200);
});

const signUpUserRegisterSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      minLength: 5,
    },
    password: {
      type: "string",
      minLength: 5,
    },
  },
};

// Register new user
router.post("/signup", validate({ body: signUpUserRegisterSchema }), async (req, res) => {
  const { email, password } = req.body;
  let collection = await db.collection("users");
  let user = await collection.findOne({ email });
  if (user) {
    return res.send("Conflict").status(409)
  }
  const newUser = {
    email: email,
    password: await hash(password, salt),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  let result = await collection.insertOne(newUser);
  res.send(result).status(204);
});

const signInUserRegisterSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      minLength: 5,
    },
    password: {
      type: "string",
      minLength: 5,
    },
  },
};

function generateAccessToken(email) {
  return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

router.post('/signin', validate({body: signInUserRegisterSchema }), async (req, res) => {
  const { email, password } = req.body;
  let collection = await db.collection("users");
  let user = await collection.findOne({ email });

  if (!user) {
    return res.status(404).json({ type: "User not found" })
  }

  let match = await compare(password, user.password);
  if (match) {

    const token = generateAccessToken({ email });

    const result = {
      ...formatUserResult(user),
      authToken: token
    }

    res.status(200).json({
      status: "Success",
      message: "Correct Details",
      data: result
    })
  }
});


export default router;