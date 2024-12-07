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

export const signin = async(req, res) => {
    res.json({
        "data" : "you entered into new world!!\nSignin",
    });
}

export const logout = async(req, res) => {
    res.json({
        "data" : "you entered into scube world!!\nLogout",
    })
}