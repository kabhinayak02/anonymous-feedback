import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 });
        }
        
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const existingVerifiedByEmail = await UserModel.findOne({ email });

        if (existingVerifiedByEmail) {
            if (existingVerifiedByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already Exist with this email"
                }, { status: 400 });
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingVerifiedByEmail.password = hashedPassword;
                existingVerifiedByEmail.verifyCode = verifyCode;
                existingVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingVerifiedByEmail.save();
            }
        }
        else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, { status: 201 });
    } catch (error) {
        console.error("Error in Registring User", error);
        return Response.json(
            {
                success: false,
                message: "Error in Registring User"
            },
            { status: 500 }
        );
    }
}