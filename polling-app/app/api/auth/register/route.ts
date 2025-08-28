import { NextRequest, NextResponse } from "next/server";
import { userDb } from "@/lib/db";
import { RegisterData, ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userDb.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create user (password handled by Supabase auth)
    const user = await userDb.create({
      name,
      email,
      avatar: undefined,
    });

    // Remove password from response (not needed since Supabase handles auth)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response: ApiResponse = {
      success: true,
      data: userResponse,
      message: "User created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
