import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/temp') // this is where u want the files to be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // this is what u want the file to be called....
    }
})

export const upload = multer({ 
    storage 
})


// we use multer to create a local path of the file uploaded in the backend. 
//the file stored in the backend is in form of object and we extract the path from it
// and then upload the image to cloudinary using this path