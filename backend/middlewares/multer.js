import multer from "multer";

const multerMiddleware = (size) => {
    const upload = multer({ 
        storage: multer.memoryStorage(),
        limits: { fileSize: size * 1024 * 1024 },
    });

    return upload;
};

export default multerMiddleware;