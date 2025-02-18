const express = require('express');

const expensesRouter = express.Router();
const db = require('../firebaseconfig.js');

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management
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
 *     Expense:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the expense record
 *           example: "exp-001"
 *         name:
 *           type: string
 *           description: The name/title of this expense record
 *           example: "Monthly Expenses"
 *         items:
 *           type: object
 *           description: Key-value pairs for various expenses
 *           additionalProperties:
 *             type: number
 *           example:
 *             HouseRent: 700
 *             LightBill: 400
 *             GasBill: 300
 *         total:
 *           type: number
 *           description: Sum of all expense items
 *           example: 3000
 */

/**
 * ----------------------------------------------------------------
 *  GET /expenses
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Retrieve all expense records
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: A list of expense records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 */
expensesRouter.get('/', async (req, res) => {
    try {
        const snapshot = await db.ref('expenses').once('value');
        res.json(snapshot.val());
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  GET /expenses/{id}
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Retrieve a single expense record by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The expense record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An expense record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Expense record not found
 */
expensesRouter.get('/:id', async (req, res) => {
    try {
        const expenseId = req.params.id;
        const snapshot = await db.ref(`expenses/${expenseId}`).once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json(snapshot.val());
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  POST /expenses
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense record
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       201:
 *         description: The expense record was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Bad request
 */
expensesRouter.post('/', async (req, res) => {
    try {
        const newExpense = req.body; // Get expense data from request body
        const newExpenseRef = db.ref('expenses').push(); // Generate a new unique ID
        await newExpenseRef.set(newExpense); // Save data to Firebase

        res.status(201).json({ id: newExpenseRef.key, ...newExpense }); // Respond with created expense ID
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  PUT /expenses/{id}
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update an existing expense record
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The expense record ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       200:
 *         description: The updated expense record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Expense record not found
 */
expensesRouter.put('/:id', async (req, res) => {
    try {
        const expenseId = req.params.id;
        const updates = req.body; // Data to update

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }

        await db.ref(`expenses/${expenseId}`).update(updates);

        res.json({ id: expenseId, ...updates, message: "Expense updated successfully" });
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});

/**
 * ----------------------------------------------------------------
 *  DELETE /expenses/{id}
 * ----------------------------------------------------------------
 */
/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense record
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The expense record ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The record was deleted
 *       404:
 *         description: Expense record not found
 */
expensesRouter.delete('/:id', async (req, res) => {
    try {
        const expenseId = req.params.id;
        const expenseRef = db.ref(`expenses/${expenseId}`);

        // Check if the expense exists before deleting
        const snapshot = await expenseRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ error: "Expense not found" });
        }

        await expenseRef.remove(); // Delete the Expense

        res.json({ message: "Expense deleted successfully", id: expenseId });
    } catch (error) {
        next(error); // Pass error to the middleware
    }
});




module.exports = expensesRouter;