import { connectDb } from "@/helper/db";
import { user } from "@/model/user";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { userid } = await params;

    try {
        await connectDb();
        const foundUser = await user.findOne({ _id: userid });

        if (!foundUser) {
            return NextResponse.json({
                message: "User not found",
                status: 404
            });
        }

        return NextResponse.json({
            data: foundUser,
            message: "User found successfully",
            status: 200
        });
    } catch (error) {
        console.error('Error finding the user:', error);

        return NextResponse.json({
            message: "Error finding the user",
            status: 500
        });
    }
}

export async function PUT(request, { params }) {
    const { userid } = await params;
    const { name, email, password } = await request.json();
    try {
        await connectDb();
        const User = await user.findById(userid);
        if (User) {
            User.name = name;
            // User.email = email;
            User.password = password;
            const UpdatedUser = await User.save();
            return NextResponse.json(UpdatedUser);
        } else {
            return NextResponse.json({
                message: "Failed to fetch the user",
                status: 500
            })
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error while upadting !!",
            status: 200
        })

    }
}