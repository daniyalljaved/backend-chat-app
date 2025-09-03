import User from "../models/user.model.js"
import generateTokenAndSetCookie from "../utils/generateToken.js";
import bcrypt from "bcrypt"

export const login=async (req,res)=>{
    try {
        const {username,password}=req.body;
        const user= await User.findOne({username});
        const isPasswordCorrect=await bcrypt.compare(password,user?.password ||" ");
        if(!user||!isPasswordCorrect){
            return res.status(400).json({error:"invalid password or userName"})
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({message:"login"})
        
    } catch (error) {
        console.log(`error;${error.message}`)
        res.status(500).json({error:"internal login error"});

        
    }
}
export const logout= async(req,res)=>{
    try {
        res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
        
    } catch (error) {
         console.log(`error;${error.message}`)
        res.status(500).json({error:"internal login error"});
    }
}
export const signup= async (req,res)=>{
    try {
        const{fullName,username,password,confirmPassword,gender}=req.body;
        if(password!=confirmPassword)
        {
            return res.status(400).json({error:"password doesnt match"})
        }
        const user=await User.findOne({username});
        if(user){
            return res.status(400).json({error:"user already exist doesnt match"})
        }

      const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});
       if (newUser) {
			
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
    } catch (error) {
        console.log(`error;${error.message}`)
        res.status(500).json({error:"internal error"})
        
    }
}