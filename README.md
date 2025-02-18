# Wealth Tracker API

### Overview 

 

This project is a RESTful API built with **Node.js** and **Express** that leverages **Firebase** for data storage. It provides endpoints to manage **Users**, **Income**, and **Expenses**. The API is fully documented using **Swagger**, making it easy to test and integrate. 

 

## Features 

 

- **Backend:** Node.js with Express, providing a RESTful API. 

- **Database:** Firebase for real-time data storage and retrieval. 

- **Swagger Documentation:** Auto-generated documentation accessible via a web interface. 

- **Modular Design:** Separate route files for Users, Income, and Expenses. 

- **Scalable Architecture:** Easily extendable for future features and endpoints. 

 

## Getting Started 

 

### Prerequisites 

 

- **Node.js and npm:** Ensure you have Node.js and npm installed. 

- **Firebase Project:** Set up a Firebase project with your desired database (Firestore or Realtime Database). 

- **Thunder Client(Optional):** For testing API endpoints. 

 

### Installation 

 

1. Clone the repository:

   git clone https://github.com/yourusername/firebase-rest-api.git 

   cd firebase-rest-api 

 

2. Install dependencies: 

npm install 

 

3. Configure Firebase: 

Create a Firebase project and retrieve your configuration details. 

(Optional) Create a .env file in the root directory and add your Firebase configuration variables. 

 

 

### Running the Application 

 

Start the server : node server.js 

Access the API: The server runs on http://localhost:2000 by default. 

 

 

### API Endpoints 

#### Users 

**GET /users** - Retrieve all users. 

**GET /users/:id** - Retrieve a user by ID. 

**POST /users** - Create a new user. 

**PUT /users/:id** - Update an existing user. 

**DELETE /users/:id** - Delete a user. 

#### Income 

**GET /income** - Retrieve all income records. 

**GET /income/:id** - Retrieve a single income record. 

**POST /income** - Create a new income record. 

**PUT /income/:id** - Update an existing income record. 

**DELETE /income/:id** - Delete an income record. 

#### Expenses 

**GET /expenses** - Retrieve all expense records. 

**GET /expenses/:id** - Retrieve a single expense record. 

**POST /expenses** - Create a new expense record. 

**PUT /expenses/:id** - Update an existing expense record. 

**DELETE /expenses/:id** - Delete an expense record. 

 

 

### Technologies Used 

Backend: Node.js, Express 

Database: Firebase (Realtime Database) 

Documentation: Swagger (swagger-ui-express, swagger-jsdoc) 

 

### Swagger Documentation 

The API documentation is auto-generated from JSDoc comments. 

Access the Swagger UI at http://localhost:2000/api-docs. 

The documentation includes details for each endpoint along with request/response schemas. 

 

### Project Structure 

firebase-rest-api/ 

├── server.js               		# Main application file with server and Swagger configuration 

├── package.json         	# Project configuration and dependencies 

├── routes/ 

│   ├── users.js         		# User endpoints and Swagger annotations 

│   ├── income.js       		# Income endpoints and Swagger annotations 

│   └── expenses.js      	# Expenses endpoints and Swagger annotations 

└── README.md            	# Project documentation (this file) 

 

 

### Workflow 

Client Requests: Clients send HTTP requests (GET, POST, PUT, DELETE) to the API endpoints. 

Firebase Integration: The API interacts with Firebase to perform CRUD operations. 

Swagger UI: Developers can test and explore the API using the Swagger interface. 

Error Handling: The API includes basic error handling to manage invalid requests and database issues. 

 

### Development and Deployment 

Development Server: Run the API locally using npm start or node server.js. 

Production Deployment: Configure environment variables for Firebase credentials and deploy the API using your preferred hosting platform. 

 

 

## Summary 

In summary, this project offers a robust RESTful API built with Node.js, Express, and Firebase, complete with comprehensive Swagger documentation. It is designed for scalability and ease of integration, making it an excellent foundation for applications that require managing users, income, and expenses. 

 

 

 
