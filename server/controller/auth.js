import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userSchema from "../model/userSchema.js";
import {email_Confirmation} from './email.js';


export const SignIn = async ( req, res ) => {
    const { email, password } = req.body;

    try{
        const User = await userSchema.findOne({ email });

        if(!User) return res.status(404).json({ message: "User Not Found" });
        else if(User && User.active === false) return res.status(404).json({ message: "User Not Found" })

        const isPasswordCorrect = await bcrypt.compare(password, User.password);

        if(!isPasswordCorrect) return res.status(400).json({messsge: 'Password Wrong!!!'});

        const token = jwt.sign({ email: User.email, id: User._id }, 'test', { expiresIn: '1h'});

        res.status(200).json({ result: User, token});
    } catch (error) {
        res.status(500).json({ message: "something went wrong||"});
    }
}

export const SignUp = async ( req, res ) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try{
        const User = await userSchema.findOne({ email });

        if(User && User.active === true) return res.status(400).json({ message: "User Already Exists"});

        if(password !== confirmPassword) return res.status(400).json({ message: "Password Doesnt Match"});
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const randomNumber = Math.floor(Math.random()*(999999 - 100000 + 1) + 100000)

        if(User && User.active === false) {
            userSchema.findOneAndUpdate({ email }, { activation_Code: randomNumber, password: hashedPassword, name: `${firstName} ${lastName}` }, (err, result) => {
                if(err) return res.status(404).json({ msg: err});
                else {
                    email_Confirmation({email, randomNumber, name : `${firstName} ${lastName}`}, (cbData) => {
                        if(cbData.status == 'scc') {
                            return res.status(200).json(result);
                        } else {
                            return res.status(400).json({ msg: cbData.msg})
                        }
                    });
                }
            });
        } else {
            userSchema.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, activation_Code: randomNumber}, (err, result) => {
                if(err) return res.status(404).json({ message: err });
                else {
                    email_Confirmation({email, randomNumber, name: result.name}, (cbData) => {
                        if(cbData.status == 'scc') {
                            return res.status(200).json(result);
                        } else {
                            return res.status(400).json({ msg: cbData.msg})
                        }
                    });
                }
            });
        }

        // const token = jwt.sign({ email: result.email, id: result._id}, 'test', { expiresIn: '1h'});

        // res.status(200).json({ result, token});
    } catch (error) {
        res.status(500).json({ message: "something went wrong||"});
    }
}

export const GoogleSignUp = async (req, res) => {
    const { email, givenName, googleId, imageUrl, name } = req.body;

    try {
        const User =  await userSchema.findOne({ email });

        if(!User) {
            const result = await userSchema.create({ email, password: '', name: name, imageURL: imageUrl, googleId: googleId });

            return res.status(200).json(result);
        }

        if(User.password === "") return res.status(200).json(User);

        res.status(400).json({ message: "User Already Exists With Same Id" });

    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong!!!"});
    }
}