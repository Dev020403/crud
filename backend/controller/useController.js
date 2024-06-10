const { generateToken } = require("../middleware/middlewares");
const userModel = require("../model/userModel");

const registerController = async (req, res) => {
    try {
        const { name, email, password,contact } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is Required", status: 400 });
        }
        if (!password) {
            return res.status(400).send({ message: "Password is Required" });
        }
        if (!name) {
            return res.status(400).send({ message: "Name is Required" });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: "Already Registered User",
            });
        }
        const user = new userModel({ ...req.body });
        await user.save();

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in registration",
            error,
        });
        console.log(error);
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is Required" });
        }
        if (!password) {
            return res.status(400).send({ message: "Password is Required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(403).send({
                success: false,
                message: "User not found",
            });
        }
        if (existingUser.password !== password) {
            return res.status(401).send({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = generateToken(existingUser);
        res.status(200).send({
            success: true,
            message: "User Logged In Successfully",
            user: existingUser,
            token
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
        console.log(error);
    }
}

const deleteController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is Required" });
        }
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const isDelete = await existingUser.deleteOne();
        if (isDelete) {
            return res.status(204).send({
                success: true,
                message: "User Deleted Successfully",
            });
        } else {
            return res.status(400).send({
                success: false,
                message: "User not deleted",
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in delete",
            error,
        });;
    }
}


const updateController = async (req, res) => {
    try {
        const { email, name, contact } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is Required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        if (name) {
            existingUser.name = name;
        }

        if (contact) {
            existingUser.contact = contact;
        }

        await existingUser.save();

        res.status(200).send({
            success: true,
            message: "User information updated successfully",
            user: existingUser,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in updating user information",
            error,
        });
        console.log(error);
    }
}

const getAllUsersController = async (req, res) => {
    try {
        const allUsers = await userModel.find();
        res.status(200).send({
            success: true,
            message: "All users fetched successfully",
            users: allUsers,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in fetching users",
            error,
        });
        console.log(error);
    }
}


module.exports = { registerController, loginController, deleteController, updateController, getAllUsersController };
