import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User; // can be issue 

    // Check if the user is authenticated
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, { status: 401 }
        )
    }

    const userId = user._id;

    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) { // user not found
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept message"
                }, { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance updated successfully",
                updatedUser
            }, { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update user status to accept message", error);
        return Response.json(
            {
                success: false,
                message: "Error in updating user acceptance messages status"
            }, { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    // Check if the user is authenticated
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticate"
            }, { status: 401 }
        );
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) { // user not found
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User found",
                isAcceptingMessages: foundUser.isAcceptingMessages
            }, { status: 200 }
        );

    } catch (error) {
        console.error("Error in getting message acceptance status", error);
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            }, { status: 500 }
        );
    }
}