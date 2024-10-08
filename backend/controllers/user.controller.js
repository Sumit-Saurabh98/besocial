import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import dotenv from "dotenv"
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user) {
            return res.status(400).json({ message: "User already exists with this username or email", success: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user to database
        await newUser.save();

        // Send success response
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error while registering user", success: false });
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const token = await jwt.sign(
            {userId: user._id},
            JWT_SECRET,
            {expiresIn: "1d"}
        )

        res.cookie("token", token, {httpOnly: true, sameSite: "strict", secure: true, maxAge: 24 * 60 * 60 * 1000});

        // populate post data

        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) =>{
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)) {
                    return post
                }
                return null
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
            bookmarks: user.bookmarks
        }

        return res.status(200).json({ message: "User logged in successfully", success: true, user, token });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while logging in user", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {maxAge: 0});
        return res.status(200).json({ message: "User logged out successfully", success: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while logging out user", success: false });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({ message: "Profile fetched successfully", success: true, user });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while fetching profile", success: false });
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;

        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse?.secure_url;
        await user.save();
        return res.status(200).json({ message: "Profile updated successfully", success: true, user });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while updating profile", success: false });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const asFollower = req.id;
        const toFollow = req.params.id;
        if(asFollower === toFollow) {
            return res.status(400).json({ message: "You cannot follow/unfollow yourself", success: false });
        }

        const user = await User.findById(asFollower);
        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const targetUser = await User.findById(toFollow);
        if(!targetUser) {
            return res.status(404).json({ message: "Target user not found", success: false });
        }

        // check i have to follow it or unfollow

        const isFollowing = user.following.includes(toFollow);
        if(isFollowing) {
            // unfollow
             await Promise.all([
                User.updateOne({_id: asFollower}, {$pull: {following: toFollow}}),
                User.updateOne({_id: toFollow}, {$pull: {followers: asFollower}}),
            ])
            return res.status(200).json({ message: "Unfollowed successfully", success: true });
        } else {
            // follow
            await Promise.all([
                User.updateOne({_id: asFollower}, {$push: {following: toFollow}}),
                User.updateOne({_id: toFollow}, {$push: {followers: asFollower}}),
            ])
            return res.status(200).json({ message: "Followed successfully", success: true });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error while following/unfollowing user", success: false });
    }
}