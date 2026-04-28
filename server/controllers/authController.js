import bcrypt from "bcryptjs"
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"

const registerUser = async(req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
       res.status(409)
       throw new Error("Please Fill All Details")
    }

    let emailExist = await User.findOne({email: email})
    if(emailExist){
        res.status(409)
        throw new Error("User Already Exists!")
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    let user = await User.create({name, email, password: hashedPassword})

    if(!user){
        res.status(400)
        throw new Error("User Not Created")
    }

    res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,   
        token: generateToken(user._id)
    })
}

const loginUser = async(req, res) => {
    const {email, password} = req.body

    if(!email || !password){
       res.status(409)
       throw new Error("Please Fill All Details")
    }

    let user = await User.findOne({email: email})

    if(user && await bcrypt.compare(password, user.password)){
       res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,  
            token: generateToken(user._id)
       })
    } else {
        res.status(400)
        throw new Error("Invalid Credentials!")
    }
}

const privateController = (req, res) => {
    res.send("I am Private Controller " + req.user.name)
}

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

const authController = {registerUser, loginUser, privateController}

export default authController