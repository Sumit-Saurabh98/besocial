import sharp from "sharp"
import getDataUri from "../utils/datauri.js";
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import Comment from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image){
            return res.status(400).json({ message: "Image is required", success: false });
        }
        
        // image upload
        const optimizeImageBuffer = await sharp(image.buffer).resize({width: 800, height: 800, fit: "inside"}).toFormat("jpeg", {quality: 80}).toBuffer();

        const fileUri = getDataUri(optimizeImageBuffer);
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        user.posts.push(post._id);
        await user.save();

        await post.populate({path:"author", select:"-password"});
        return res.status(201).json({ message: "Post added successfully", success: true, post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error while adding new post", success: false });
    }
}

export const getAllPost = async (req, res) =>{
    try {
        const posts = await Post.find.sort({createdAt: -1})
        .populate({path:"author", select:"username, profilePicture"})
        .populate({path:"comments", sort:{createdAt: -1}, populate:{path:"author", select:"username, profilePicture"}});
        return res.status(200).json({ message: "All posts fetched successfully", success: true, posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error while fetching all posts", success: false });
    }
}

export const getUserPost = async (req, res) =>{
    try {
        const authorId = req.id
        const posts = await Post.find({author: authorId}).sort({createdAt: -1})
        .populate({path:"author", select:"username, profilePicture"})
        .populate({path:"comments", sort:{createdAt: -1}, populate:{path:"author", select:"username, profilePicture"}});
        return res.status(200).json({ message: "All posts fetched successfully", success: true, posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error while fetching user posts", success: false });
    }
}

export const likePost = async (req, res) =>{
    try {
        const theUserWhoWantToLike = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        // Like logic here
        await post.updateOne({$addToSet: {likes: theUserWhoWantToLike}});
        await post.save();
        

        // TODO:- implement sockets here for real time notification 

        res.status(200).json({ message: "Post liked successfully", success: true, post });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while liking post", success: false });
    }
}


export const dislikePost = async (req, res) =>{
    try {
        theUserWhoWantToLike = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        // Like logic here
        await post.updateOne({$pull: {likes: theUserWhoWantToLike}});
        await post.save();
        

        // TODO:- implement sockets here for real time notification 

        res.status(200).json({ message: "Post disliked successfully", success: true, post });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while liking post", success: false });
    }
}

export const addComment = async (req, res) =>{
    try {
        const postId = req.params.id;
        const idOfUserWhoWantToComment = req.id;
        const {text} = req.body;

        if(!text) {
            return res.status(400).json({ message: "Text is required", success: false });
        }
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        const comment = await Comment.create({
            text,
            author: idOfUserWhoWantToComment,
            post: postId
        }).populate({path:"author", select:"username, profilePicture"});
        post.comments.push(comment._id);
        await post.save();
        return res.status(201).json({ message: "Comment added successfully", success: true, comment });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while adding comment", success: false });
    }
}

export const getCommentsOfPost = async (req, res) =>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post: postId}).populate({path:"author", select:"username, profilePicture"});
        if(comments.length === 0) {
            return res.status(404).json({ message: "No comments found", success: false });
        }
        return res.status(200).json({ message: "All comments fetched successfully", success: true, comments });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while fetching comments", success: false });
    }
}

export const deletePost = async (req, res) =>{
    try {
        const postId = req.params.id;
        const authorId = req.id
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        // check if the logged in user is the author of the post
        if(post.author.toString() !== authorId) {
            return res.status(403).json({ message: "You are not authorized to delete this post", success: false });
        }
        
        // find post and delete it
        await Post.findByIdAndDelete(postId);

        // remove post id from user posts
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({post: postId}); 
        return res.status(200).json({ message: "Post deleted successfully", success: true, post });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while deleting post", success: false });
    }
}   

export const bookmarkPost = async (req, res) =>{
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        const user = await User.findById(authorId);
        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if(user.bookmarks.includes(postId)) {
            // already bookmarked
            await user.updateOne({$pull: {bookmarks: postId}});
            await user.save();
           return res.status(200).json({message:"Post removed from bookmark", success: true, type:"unsaved"});
        }else{
            // not bookmarked
            await user.updateOne({$addToSet: {bookmarks: postId}});
            await user.save();
            return res.status(200).json({message:"Post saved to bookmark", success: true, type:"saved"});
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error while bookmarking post", success: false });
    }
}