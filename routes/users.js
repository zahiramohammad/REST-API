const express = require('express');

const usersRouter = express.Router();
const db = require('../firebaseconfig.js');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * ----------------------------------------------------------------
 *  SCHEMA DEFINITIONS
 * ----------------------------------------------------------------
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: "Femi Ola"
 *         username:
 *           type: string
 *           description: Unique username
 *           example: "Femi"
 *         email:
 *           type: string
 *           description: User email address
 *           example: "olumofemi@soezontech.com"
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               example: "Panatella Drive"
 *             suite:
 *               type: string
 *               example: "Apt. 556"
 *             city:
 *               type: string
 *               example: "Calgary"
 *             zipcode:
 *               type: string
 *               example: "T3J 3W2"
 */

/**
 * ----------------------------------------------------------------
 *  GET /users
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
usersRouter.get('/', async (req, res) => {
    try {
        const snapshot = await db.ref('users').once('value');
        res.json(snapshot.val());
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  GET /users/{id}
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
usersRouter.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const snapshot = await db.ref(`users/${userId}`).once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(snapshot.val());
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  POST /users
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
usersRouter.post('/', async (req, res) => {
    try {
        const newUser = req.body; // Get user data from request body
        const newUserRef = db.ref('users').push(); // Generate a new unique ID
        await newUserRef.set(newUser); // Save data to Firebase

        res.status(201).json({ id: newUserRef.key, ...newUser }); // Respond with created user ID
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  PUT /users/{id}
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
usersRouter.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body; // Data to update

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }

        await db.ref(`users/${userId}`).update(updates);

        res.json({ id: userId, ...updates, message: "User updated successfully" });
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});


/**
 * ----------------------------------------------------------------
 *  DELETE /users/{id}
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The user was deleted
 *       404:
 *         description: User not found
 */
usersRouter.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userRef = db.ref(`users/${userId}`);

        // Check if the user exists before deleting
        const snapshot = await userRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ error: "User not found" });
        }

        await userRef.remove(); // Delete the user

        res.json({ message: "User deleted successfully", id: userId });
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});




module.exports = usersRouter;