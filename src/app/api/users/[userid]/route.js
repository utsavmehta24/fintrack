// import { connectDb } from "@/helper/db";
// import { user } from "@/model/user";
// import { NextResponse } from "next/server";

// export async function GET(request, { params }) {
//     const { userid } = await params;

//     try {
//         await connectDb();
//         const foundUser = await user.findOne({ _id: userid });

//         if (!foundUser) {
//             return NextResponse.json({
//                 message: "User not found",
//                 status: 404
//             });
//         }

//         return NextResponse.json({
//             data: foundUser,
//             message: "User found successfully",
//             status: 200
//         });
//     } catch (error) {
//         console.error('Error finding the user:', error);

//         return NextResponse.json({
//             message: "Error finding the user",
//             status: 500
//         });
//     }
// }

// export async function PUT(request, { params }) {
//     const { userid } = await params;
//     const { name, email, password } = await request.json();
//     try {
//         await connectDb();
//         const User = await user.findById(userid);
//         if (User) {
//             User.name = name;
//             // User.email = email;
//             User.password = password;
//             const UpdatedUser = await User.save();
//             return NextResponse.json(UpdatedUser);
//         } else {
//             return NextResponse.json({
//                 message: "Failed to fetch the user",
//                 status: 500
//             })
//         }

//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({
//             message: "Error while upadting !!",
//             status: 200
//         })

//     }
// }

import { connectDb } from "@/helper/db";
import { user } from "@/model/user";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Scrypt hashing function (same as registration)
async function hashPassword(password) {
    const salt = crypto.randomBytes(parseInt(process.env.SALT_LENGTH)).toString("hex");
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, parseInt(process.env.KEY_LENGTH), (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString("hex")}`);
        });
    });
}

export async function PUT(request, { params }) {
    const { userid } = params;
    const { name, email, password } = await request.json();

    try {
        await connectDb();
        const User = await user.findById(userid);

        if (!User) {
            return NextResponse.json({
                message: "User not found",
                status: 404
            });
        }

        // Update name
        if (name) User.name = name;

        // Optional: Update email (if allowed)
        // if (email) User.email = email;

        // Update password (only if provided)
        if (password && password.trim() !== "") {
            User.password = await hashPassword(password);
        }

        const UpdatedUser = await User.save();

        return NextResponse.json({
            data: UpdatedUser,
            message: "User updated successfully",
            status: 200
        });
    } catch (error) {
        console.error("Error while updating user:", error);
        return NextResponse.json({
            message: "Error while updating user",
            status: 500
        });
    }
}

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