import express from 'express';
import './loadEnvironment.mjs';
import auth from './routes/auth.mjs';
import users from './routes/users.mjs';
import sessions from './routes/sessions.mjs';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { ValidationError } from 'express-json-validator-middleware';

const PORT = process.env.NODE_DOCKER_PORT || 8080;
const app = express();

// Defining middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Load the /posts routes
app.use('/auth', auth);
app.use('/users', users);
app.use('/sessions', sessions);

app.use((error, request, response, next) => {
    // Check the error is a validation error
    if (error instanceof ValidationError) {
        // Handle the error
        response.status(400).send(error.validationErrors);
        next();
    } else {
        // Pass error on if not a validation error
        next(error);
    }
});

// // Global error handling
// app.use((err, _req, res, next) => {
//   res.status(500).send("Uh oh! An unexpected error occurred.")
// })

app.listen(PORT, () => {
    console.log(`Env: ${process.env.NODE_ENV}`);
    console.log(`Express is listening on port ${PORT}!`);
});
