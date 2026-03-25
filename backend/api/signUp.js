import User from "../models/User.js";
export const signUp = async (req, res) => {
    const { username, email, password, isBusinessOwner } = req.body;
    const newUser = new User({
        username,
        email,
        password,
        isBusinessOwner
    });
    try {
        const savedUser = await newUser.save(); // saves to MongoDB
        res.status(201).json(savedUser); // respond with the saved user
    }
    catch (err) {
        //res.status(400).json({ error: err.message }); // handle errors (like duplicate email)
    }
};
//# sourceMappingURL=signUp.js.map