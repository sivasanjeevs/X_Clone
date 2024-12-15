import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

//models
import Notification from '../models/notification.models.js';
import User from '../models/user.model.js'

export const getUserprofile = async (req, res) => {
    const {username} = req.params; //we are using params(but in previous we used req.body) becoz we used dynamic :username
    
    try{
        const user = await User.findOne({username}).select("-password");
        console.log(user);
        if(!user) return res.status(404).json({error: 'User not found'});
        res.status(200).json(user);
    }
    catch(error){
        console.log("Error in getUserProfile", error.message);
        res.status(500).json({error: error.message});
    }
}

export const getSuggestedUsers = async (req, res) => {
    try{
        const userId = req.user.id;
        const usersFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            {
                $sample: { size:10 },
            }, 
        ]);

        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user.id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach((user) =>(user.password = null));

        res.status(200).json(suggestedUsers);

    }catch(error){
        console.log("Error in getSuggested", error.message);
        res.status(500).json({error: error.message});
    }
}

export const followUnfollowUser = async (req, res) => {
    try{
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user.id);

        if(!userToModify || !currentUser) return res.status(404).json({error: 'User not found'});

        if( id === currentUser.id) return res.status(400).json({error: 'You cannot follow/unfollow yourself'});

        const isFollowing = currentUser.following.includes(id);
        console.log('isFollowing', isFollowing);
        console.log("Current User:", req.user);

        if(isFollowing){
            //unfollow the user
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user.id}});// currentUser.following = currentUser.following.filter(follower => follower!== id);
            await User.findByIdAndUpdate(req.user.id, {$pull: {following: id}}) // userToModify.followers = userToModify.followers.filter(follower => follower!== req.user.id);
            res.status(200).json({message: 'Unfollowed Sucessfully'});
        }else{
            //follow the user
            await User.findByIdAndUpdate(id,{$push : {followers: req.user.id}}); // currentUser.following.push(id);
            await User.findByIdAndUpdate(req.user.id, {$push : {following: id}}); // userToModify.followers.push(req.user.id);


            //send notification
            const newNotification = new Notification({
                type: "follow",
                from: req.user.id,
                to: userToModify.id,
            });

            await newNotification.save(); //save this to the database

            //TODO IN UPCOMMING: return the id as the response
            res.status(200).json({message: 'followed successfully'}); //send notification to the user
        }


    }catch(error){
        console.log("Error in followUnfollowUser", error.message);
        res.status(500).json({error: error.message});
    }
}

export const updateUser = async (req,res) => {
    const {fullName, email, username, currentPassword, newPassword, bio, link} = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user.id;

    try{

        let user = await User.findById(userId);
        if(!user) return res.status(404).json({error: 'User not found'});

        if((!currentPassword && newPassword )||(!newPassword && currentPassword)){
            return res.status(400).json({error: 'Both Current password and new password required'});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({error: 'Incorrect current password'});
            if(newPassword.length < 6){
                return res.status(400).json({error: 'password must be at least 6 characters'});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        if(profileImg){

            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
                //remove old profile image from cloudinary
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url;
        }
        if(coverImg){

            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
                //remove old cover image from cloudinary
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save(); // save all these to database
        
        user.password = null;// it wont save in databse as it is after save

        return res.status(200).json(user);

    }catch(error){
        console.log("Error in updateUser", error.message);
        res.status(500).json({error: error.message});
    }
}