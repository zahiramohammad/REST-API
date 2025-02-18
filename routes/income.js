const express = require('express');

const incomeRouter = express.Router();
const db = require('../firebaseconfig.js');

/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Income management
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
 *     Income:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "inc-001"
 *         wages:
 *           type: number
 *           example: 1400
 *         secondaryIncome:
 *           type: number
 *           example: 700
 *         interest:
 *           type: number
 *           example: 120
 *         supportPayment:
 *           type: number
 *           example: 40
 *         others:
 *           type: number
 *           example: 100
 */

/**
 * ----------------------------------------------------------------
 *  GET /income
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /income:
 *   get:
 *     summary: Retrieve all income records
 *     tags: [Income]
 *     responses:
 *       200:
 *         description: A list of income records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Income'
 */
incomeRouter.get('/', async (req, res) => {
    try {
        const snapshot = await db.ref('income').once('value');
        res.json(snapshot.val());
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
   * ----------------------------------------------------------------
   *  GET /income/{id}
   * ----------------------------------------------------------------
   */
  /**
   * @swagger
   * /income/{id}:
   *   get:
   *     summary: Retrieve a single income record by ID
   *     tags: [Income]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The income record ID
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: An income record
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Income'
   *       404:
   *         description: Income record not found
   */
incomeRouter.get('/:id', async (req, res) => {
    try {
        const incomeId = req.params.id;
        const snapshot = await db.ref(`income/${incomeId}`).once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Income not found' });
        }

        res.json(snapshot.val());
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  POST /income
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /income:
 *   post:
 *     summary: Create a new income record
 *     tags: [Income]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Income'
 *     responses:
 *       201:
 *         description: The income record was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
 *       400:
 *         description: Bad request
 */
incomeRouter.post('/', async (req, res) => {
    try {
        const newIncome = req.body; // Get user data from request body
        const newIncomeRef = db.ref('income').push(); // Generate a new unique ID
        await newIncomeRef.set(newIncome); // Save data to Firebase

        res.status(201).json({ id: newIncomeRef.key, ...newIncome }); // Respond with created user ID
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  PUT /income/{id}
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /income/{id}:
 *   put:
 *     summary: Update an existing income record
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The income record ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Income'
 *     responses:
 *       200:
 *         description: The updated income record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
 *       404:
 *         description: Income record not found
 */
incomeRouter.put('/:id', async (req, res) => {
    try {
        const incomeId = req.params.id;
        const updates = req.body; // Data to update

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }

        await db.ref(`income/${incomeId}`).update(updates);

        res.json({ id: incomeId, ...updates, message: "Income updated successfully" });
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  DELETE /income/{id}
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /income/{id}:
 *   delete:
 *     summary: Delete an income record
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The income record ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The record was deleted
 *       404:
 *         description: Income record not found
 */
incomeRouter.delete('/:id', async (req, res) => {
    try {
        const incomeId = req.params.id;
        const incomeRef = db.ref(`income/${incomeId}`);

        // Check if the user exists before deleting
        const snapshot = await incomeRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ error: "Income not found" });
        }

        await incomeRef.remove(); // Delete the income

        res.json({ message: "Income deleted successfully", id: incomeId });
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});


module.exports = incomeRouter;