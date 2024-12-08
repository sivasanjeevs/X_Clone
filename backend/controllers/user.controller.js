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

export const getSuggested = async (req, res) => {
    try{

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
            res.status(200).json({message: 'followed successfully'}); //send notification to the user
        }


    }catch(error){
        console.log("Error in followUnfollowUser", error.message);
        res.status(500).json({error: error.message});
    }
}