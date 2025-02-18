const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

let usersRouter = require('./routes/users.js');
let incomeRouter = require('./routes/income.js');
let expensesRouter = require('./routes/expenses.js');

let errorHandler = require('./middlewares/errorHandler.js');

const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Wealth Tracker API',
        version: '1.0.0',
        description: `This API provides endpoints for managing users, income, and expenses.
        Perform CRUD operations and integrate with Firebase seamlessly.`
      },
      servers: [
        { url: 'http://localhost:2000', description: 'Development server' }
      ]
    },
    apis: ['./routes/*.js'] // Path to your route files
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // Configure Swagger UI to hide the schemas section
    const swaggerUiOptions = {
        swaggerOptions: {
        defaultModelsExpandDepth: -1,
    },
    };
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  
 

const db = require('./firebaseconfig.js');


app.use('/users', usersRouter);
app.use('/income', incomeRouter);
app.use('/expenses', expensesRouter);
app.use(errorHandler)



app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
  


const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});