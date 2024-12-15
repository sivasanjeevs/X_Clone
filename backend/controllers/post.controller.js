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

export const likeUnlikePost = async(req, res) => {
    try{
        const {id : postId} = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message : "Post not found"})
        
        const userLikedPost = post.likes.includes(userId);
        console.log(userLikedPost);
        if(userLikedPost) {
            // Unlike the post
            // post.likes.pull(userId);
            // await post.updateOne({id: postId}, {$pull : {likes: userId}});
            post.likes = post.likes.filter((like) => like.toString() !== userId); // Remove userId from likes
            await post.save();
            res.status(200).json({message: 'Post Unliked Sucessfully'});
        }
        else {
            post.likes.push(userId);
            await post.save();
            // await post.updateOne({id: postId}, {$push : {likes: userId}});
            const notification = new Notification({
                from : userId,
                to : post.user,
                type : "like",
            })
            await notification.save();
            res.status(200).json({message: 'Post Liked Sucessfully'});
        }
    }
    catch(error){
        console.log("Error in likeUnlikePost", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}
