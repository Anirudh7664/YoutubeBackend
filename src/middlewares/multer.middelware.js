import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, '/public/temp') // this is where u want the files to be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // this is what u want the file to be called....
    }
})

const upload = multer({ storage: storage })