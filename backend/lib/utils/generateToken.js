import jwt from 'jsonwebtoken';  // Correct the typo here


export const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });

    res.cookie("jwt", token, { 
        maxAge: 15 * 24 * 60 * 60 * 1000, //ms
        httpOnly: true, //prevent xss attscks cross-site scripting attack
        sameSite: "strict", //csrf attscks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== 'development',
    });
}

