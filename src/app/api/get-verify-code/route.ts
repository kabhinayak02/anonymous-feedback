import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    dbConnect();

    try {
        const { username } = await req.json();
        // console.log(username);

        const decodedUsername = decodeURIComponent(username); // not neccessory 
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        // console.log(user);
        const code = user.verifyCode;

        return NextResponse.json({
            success: true,
            code: code,
            message: "Verification code send successfully"
        }, { status: 200 })
    } catch (error: any) {
        console.error("Error in sending verification code", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error in verification code"
            }, { status: 500 }
        );
    }
}