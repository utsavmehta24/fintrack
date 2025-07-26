import { connectDb } from "@/helper/db";
import { user } from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(request) {
    await connectDb();

    try {
        const { name, email, password } = await request.json();

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                message: "User already exists",
                status: 409,
            });
        }

        const newUser = new user({ name, email, password });
        await newUser.save();

        return NextResponse.json(newUser, {
            status: 200,
            statusText: "User Created Successfully",
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            message: "Failed to create the user",
            error: error.message,
        }, { status: 500 });
    }
}
