class ApiError extends Error{
    constructor(
        statusCode,
        message="Went Wrong",
        errors=[],
        stack=""
        
    ){
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.success=false
        this.stack=stack
        this.errors=errors
    }
}
//Example of this Class 


// const express = require('express');
// const app = express();

// // Simulating a database of users
// const usersDatabase = {
//   '1': { id: 1, name: 'John Doe' }
// };

// // Define an async route handler that fetches user data
// app.get('/user/:id', (req, res, next) => {
//   const userId = req.params.id;

//   // Simulate finding a user in the database
//   const user = usersDatabase[userId];

//   if (!user) {
//     // If the user is not found, throw an ApiError with a 404 status code
//     return next(new ApiError(404, "User not found", [{ userId }]));
//   }

//   // If the user is found, send the user data as JSON
//   res.json(user);
// });

// // General error-handling middleware that sends the error response
// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     message: err.message || 'Internal Server Error',
//     errors: err.errors || [],
//   });
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });

/////////////////////////////////////RESPONSE///////////////////////////////////////

// Successful Request:
// When the user with ID 1 exists in the database, the API will respond with the user data.

// Request: GET /user/1
// Response:
// {
//   "id": 1,
//   "name": "John Doe"
// }
// Error Request:
// When a user with ID 2 does not exist, the ApiError will be thrown with a 404 status code and an appropriate error message.

// Request: GET /user/2
// Response:
// json
// Copy code
// {
//   "message": "User not found",
//   "errors": [
//     {
//       "userId": "2"
//     }
//   ]
// }


export {ApiError}