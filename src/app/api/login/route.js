import { user } from "@/model/user";
import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { connectDb } from "@/helper/db";

// Function to verify password using scrypt
async function verifyPassword(inputPassword, storedHash) {
  const [salt, key] = storedHash.split(":"); // Split stored "salt:hash"
  return new Promise((resolve, reject) => {
    crypto.scrypt(inputPassword, salt, parseInt(process.env.KEY_LENGTH), (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex")); // Compare hash values
    });
  });
}

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    await connectDb();

    // Find user by email
    const User = await user.findOne({ email: email });
    if (!User) {
      return NextResponse.json(
        { message: "User not found", status: false },
        { status: 404 }
      );
    }

    // Verify password using scrypt
    const isPasswordValid = await verifyPassword(password, User.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Incorrect password", status: false },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: User._id,
        email: User.email,
      },
      process.env.JWT_TOKEN
    );

    // Create response JSON
    const response = NextResponse.json({
      message: "User logged in successfully",
      status: true,
      user: User,
    });

    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Unexpected error", status: false },
      { status: 500 }
    );
  }
}
