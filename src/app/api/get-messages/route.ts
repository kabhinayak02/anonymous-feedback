import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, { status: 401 }
        );
    }
    const user = session?.user as User;

    const userId = new mongoose.Types.ObjectId(user._id); // convert the user id to mongodb id format 
    try {
        const result = await UserModel.aggregate([
            { $match: { _id: userId } }, // Match the user's _id
            { $unwind: '$messages' }, // Unwind the messages array
            { $sort: { 'messages.createdAt': -1 } }, // Sort the messages by createdAt in descending order
            { $group: { _id: '$_id', messages: { $push: '$messages' } } } // Group by _id and push all messages into an array
        ]).exec();

        if(!result || result.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "No message"
                }, { status: 404}
            );
        }
        return Response.json(
            {
                success: true,
                messages: result[0].messages 
            }, { status: 200}
        );
    } catch (error) {
        console.error("An Unexpcetd error occured", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            }, { status: 500 }
        );
    }
}