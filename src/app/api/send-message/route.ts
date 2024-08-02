import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

import { Message } from "@/model/User.model";


export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 404 }
            )
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting new messages"
                }, { status: 403 }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.message.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            }, { status: 200 }
        )
    } catch (error) {
        console.error("Error in adding messages", error)
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            }, { status: 500 }
        )
    }
}