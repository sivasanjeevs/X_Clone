import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs';



export const signup = async(req, res) => {
    try{
        const {fullName, username, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({error: 'Invalid email format'});
        }

        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(400).json({error: 'Username already exists'});
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({error: 'email already exists'});
        }

        if(password.length < 6){
            return res.status(400).json({error: 'Password must be at least 6 characters long'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email ,
            password: hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser.id, res);
            await newUser.save();

            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,

            })
        }else{
            res.status(400).json({error: 'Invalid user data'});
        }


    } catch(error){
        
        console.log("error in signup", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const login = async(req, res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isCorrectpassword = await bcrypt.compare(password, user?.password || ""); // checks the password with the input password if userpassword not exits checks with empty(handles some errors)
        
        if(!user || !isCorrectpassword) {
            return res.status(400).json({error: 'Invalid username or password'});
        }

        generateTokenAndSetCookie(user.id, res);

        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    }
    catch(error)
    {
        console.log("error in Login", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const logout = async(req, res) => {
    try{
        res.cookie('jwt',"", {maxAge: 0});
        res.status(200).json({message: 'Logged out successfully'});  
    }
    catch(error){
        console.log("Error in logout", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMe = async ( req, res) => {
    try{
        const user = await User.findById(req.user.id);
    }
    catch(error){
        console.log("Error in getMe", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}