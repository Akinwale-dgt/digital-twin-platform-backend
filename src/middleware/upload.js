import multer from 'multer'

/** Set up Multer */
const storage = multer.memoryStorage()
const upload = multer({ storage })

const uploadFile = upload.single('input-data')

export default uploadFile
