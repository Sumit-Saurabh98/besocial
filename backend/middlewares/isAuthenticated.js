import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookie.token;
        if(!token) {
            return res.status(401).json({ message: "Unauthenticated user", success: false });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({ message: "Invalid token", success: false });
        }

        req.id = decoded.userId;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Something wrong happened in authentication middleware", success: false });
    }
}

export default isAuthenticated;