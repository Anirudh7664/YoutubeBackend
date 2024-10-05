const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>{
            next(err);
        })
    }
}

export {asyncHandler}



// Breakdown of the Corrected Code:
// asyncHandler: This is a higher-order function (a function that returns another function). It takes a requestHandler (an asynchronous function) as an argument.

// Returned function:

// This function takes in the standard Express arguments: req (request), res (response), and next (next middleware or error handler).
// It calls the requestHandler (which is asynchronous) with the req, res, and next parameters.
// By wrapping requestHandler in Promise.resolve(), it handles both synchronous and asynchronous code. If the requestHandler returns a promise that rejects or throws an error, the .catch block will capture it and pass it to next(err), which triggers the Express error-handling middleware.
