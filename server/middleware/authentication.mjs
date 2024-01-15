import jwt from 'jsonwebtoken';
import db from '../db/connection.mjs';

const authentication = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const authToken = authHeader && authHeader.split(' ')[1];

    if (authToken == null) {
        return res.sendStatus(401);
    }

    // Development only
    if (process.env.NODE_ENV == 'development' && authToken == 'supersecretbackdoor') {
        next();
        return;
    }

    const sessions = await db.collection('sessions');
    const session = await sessions.findOne({ authToken });
    if (!session) {
        return res.sendStatus(401);
    }

    jwt.verify(authToken, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

export default authentication;
