// import { connectDb } from "@/helper/db";
// import { user } from "@/model/user";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//     await connectDb();

//     try {
//         const { name, email, password } = await request.json();

//         const existingUser = await user.findOne({ email });
//         if (existingUser) {
//             return NextResponse.json({
//                 message: "User already exists",
//                 status: 409,
//             });
//         }

//         const newUser = new user({ name, email, password });
//         await newUser.save();

//         return NextResponse.json(newUser, {
//             status: 200,
//             statusText: "User Created Successfully",
//         });
//     } catch (error) {
//         console.error("Error creating user:", error);
//         return NextResponse.json({
//             message: "Failed to create the user",
//             error: error.message,
//         }, { status: 500 });
//     }
// }
import { connectDb } from "@/helper/db";
import { user } from "@/model/user";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Function to hash password using scrypt
async function hashPassword(password) {
    const salt = crypto.randomBytes(parseInt(process.env.SALT_LENGTH)).toString("hex");
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, parseInt(process.env.KEY_LENGTH), (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString("hex")}`);
        });
    });
}

export async function POST(request) {
    await connectDb();

    try {
        const { name, email, password } = await request.json();

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                message: "User already exists",
                status: 409,
            });
        }

        // Hash password with scrypt
        const hashedPassword = await hashPassword(password);

        // Create new user with hashed password
        const newUser = new user({ name, email, password: hashedPassword });
        await newUser.save();

        return NextResponse.json(newUser, {
            status: 200,
            statusText: "User Created Successfully",
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            {
                message: "Failed to create the user",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
