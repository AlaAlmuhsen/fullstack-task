import multer from 'multer'



export const fileStorage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file , cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname)
    }
})

export const fileFilter = (req : any, file : any, cb : any) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

export default {
    fileStorage, fileFilter
}