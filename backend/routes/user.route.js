import express from 'express';
import { register, login, logout, getProfile, editProfile, getSuggestedUsers, followOrUnfollow } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import multerMiddleware from '../middlewares/multer.js';

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router.route("/profile/edit").post(
    isAuthenticated, 
    multerMiddleware(3).single("profilePicture"), 
    editProfile
);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);

export default router;
