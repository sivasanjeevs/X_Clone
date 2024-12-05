export const signup = async(req, res) => {
    res.json({
        "data" : "you entered into new world!!\nSignup to proceed further",
    });
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