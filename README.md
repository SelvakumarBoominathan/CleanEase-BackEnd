# Clean Ease

**Clean Ease** is a MERN Stack application designed to provide users with an easy way to book services like cleaning, driving, plumbing, carpentry, gardening, and more. The platform enables users to schedule their slots seamlessly online.

---

## **Features**

- **User-Friendly Interface**: Book services with minimal effort.
- **Diverse Services**: Options for cleaning, driving, plumbing, carpentry, gardening, and more.
- **Slot Booking**: Users can schedule their preferred time slots.
- **Secure Authentication**: Ensures data safety with user login and registration.
- **Dynamic Backend**: Powered by Express.js and MongoDB.

---

## **Tech Stack**

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Environment Configuration**: dotenv
- **Version Control**: Git

---

## **Backend Directory Structure**

### **Files and Their Roles**

1. **`appcontroller.js`**

   - Handles core business logic for the application.
   - Manages requests related to booking services, user data, and employee operations.

2. **`connection.js`**

   - Sets up and manages the connection to the MongoDB database.
   - Ensures proper error handling for database connectivity.

3. **`auth.js`**

   - Manages user authentication and authorization.
   - Implements secure login, signup, and token verification processes.

4. **`employeeModel.js` and `userModel.js`**

   - **`employeeModel.js`**: Defines the schema for storing employee details such as name, category, city, availability, and rating.
   - **`userModel.js`**: Defines the schema for storing user details like name, email, password, and booking history.

5. **`route.js`**

   - Centralizes all application routes.
   - Routes API requests to their respective controllers.

6. **`.env` file**

   - Stores environment variables such as database URLs, API keys, and secret keys.
   - Ensures sensitive data remains secure and outside the codebase.

7. **`.gitignore`**

   - Specifies files and folders to be ignored by Git.
   - Ensures sensitive files like `.env` are not pushed to version control.

8. **`config.js`**

   - Contains configuration settings for the application.
   - Includes database settings, server ports, and environment-dependent variables.

9. **`server.js`**
   - Entry point for the backend application.
   - Sets up the Express server and integrates middleware, routes, and database connection.

---

## **Setup Instructions**

### **Prerequisites**

- Node.js and npm installed.
- MongoDB installed or access to a cloud MongoDB instance.
- Git installed.

### **Steps to Run the Backend**

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Setup Environment Variables**:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=5000
     MONGO_URI=<your-mongo-database-url>
     JWT_SECRET=<your-jwt-secret>
     ```

4. **Run the Server**:
   ```bash
   npm start
   ```
   The server will start on the specified port (default: 5000).

---

## **API Endpoints**

### **Authentication**

- `POST /auth/register` - Register a new user.
- `POST /auth/login` - User login.

### **Services**

- `GET /services` - Fetch available services.
- `POST /services/book` - Book a service slot.

### **Employees**

- `GET /employees` - Fetch list of available employees.
- `POST /employees` - Add a new employee (Admin only).

---

## **Contributing**

We welcome contributions to improve the platform. To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and commit them.
4. Submit a pull request for review.

---

## **License**

N/A

---
