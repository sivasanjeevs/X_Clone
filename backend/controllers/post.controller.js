import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";
import Post from "../models/post.model.js"; 
import Notification from "../models/notification.models.js";
import mongoose from "mongoose";

export const createPost = async( req, res) => {
    try{
        const { text } = req.body;
        let { img } = req.body;
        const userid = req.user.id.toString();

        const user = await User.findById(userid);
        if(!user) return res.status(404).json({message : "User not found"})
        
        if(!text && !img) return res.status(404).json({error : "Post should atleast have a text || image"});

        if (img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            text,
            img,
            user: user._id
        });
        await newPost.save();
        res.status(201).json({"Post created successfully": newPost });
    }
    catch(error){
        console.log("Error in createPost", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const deletePost = async(req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id.toString();
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message : "Post not found"})

        if(post.user.toString()!== userId) return res.status(401).json({message : "You are not authorized to delete this post"})
            
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(postId);

        res.status(200).json({"Post deleted successfully": postId});
    }
    catch(error){
        console.log("Error in deletePost", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const commentOnPost = async(req, res) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;
        const userId = req.user.id.toString();

        if(!text) return res.status(500).json({error: "Text is required"});

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message : "Post not found"})
        
        const newComment = {        // kept NewComment instead of comment
            text,
            user: userId
        }
        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ newComment });
    }
    catch(error){
        console.log("Error in commentOnPost", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params; // Extract postId from request params
        const userId = req.user.id; // Get userId from authenticated user

        // Fetch the post
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Fetch the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure arrays are initialized
        if (!post.likes) post.likes = [];
        if (!user.likedPosts) user.likedPosts = [];

        // Check if the user has already liked the post
        const userLikedPost = post.likes.includes(userId);
        console.log("User liked post:", userLikedPost);

        if (userLikedPost) {
            // Unlike the post
            post.likes = post.likes.filter((like) => like.toString() !== userId); // Remove userId from likes
            user.likedPosts = user.likedPosts.filter((likedPost) => likedPost.toString() !== postId); // Remove postId from likedPosts
            console.log(user.likedPosts);
            await post.save();
            await user.save();

            res.status(200).json({ message: "Post Unliked Successfully" });
        } else {
            // Like the post
            post.likes.push(userId); // Add userId to post likes
            user.likedPosts.push(postId); // Add postId to user likedPosts
            console.log(user.likedPosts);

            await post.save();
            await user.save();

            // Create a notification
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await notification.save();

            res.status(200).json({ message: "Post Liked Successfully" });
        }
    } catch (error) {
        console.log("Error in likeUnlikePost:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllPost = async (req, res) => {
    try{
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        if(posts.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(posts);

    }
    catch(error)
    {
        console.log("Error in getAllPosts", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getLikedPosts = async (req, res) =>{
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({message : "User not found"});

        const likedPosts = await Post.find({_id: {$in: user.likedPosts}}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json(likedPosts);

    }catch(error){
        console.log("Error in getLikedposts: ",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        // Get the following list from the user
        const following = user.following;

        if (following.length === 0) {
            return res.status(200).json({ message: "No posts to show", posts: [] });
        }

        // Find posts by users the user is following
        const feedPost = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(feedPost);
    } catch (error) {
        console.log("Error in getFollowingPosts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params; // Extract username from request parameters

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all posts by the user
        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts); // Send posts as response
    } catch (error) {
        console.error("Error in getUserPosts:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
