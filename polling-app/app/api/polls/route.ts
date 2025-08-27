import { NextRequest, NextResponse } from "next/server";
import { pollDb, requireAuth } from "@/lib/db";
import { CreatePollData, ApiResponse, PaginatedResponse } from "@/lib/types";

// GET /api/polls - Get all polls with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isPublic = searchParams.get("isPublic") === "true" ? true : undefined;
    const userId = searchParams.get("userId") || undefined;

    const { polls, total } = await pollDb.findAll({
      page,
      limit,
      isPublic,
      userId,
    });

    const response: PaginatedResponse<any> = {
      data: polls,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

// POST /api/polls - Create a new poll
export async function POST(request: NextRequest) {
  try {
    // TODO: Replace with actual auth middleware
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body: CreatePollData = await request.json();
    const { title, description, options, isPublic, allowMultipleVotes, expiresAt } = body;

    // Validation
    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { success: false, error: "Title and at least 2 options are required" },
        { status: 400 }
      );
    }

    if (options.length > 10) {
      return NextResponse.json(
        { success: false, error: "Maximum 10 options allowed" },
        { status: 400 }
      );
    }

    // Validate expiration date
    if (expiresAt && new Date(expiresAt) <= new Date()) {
      return NextResponse.json(
        { success: false, error: "Expiration date must be in the future" },
        { status: 400 }
      );
    }

    // Create poll
    const poll = await pollDb.create({
      title,
      description,
      options: options.filter(option => option.trim()), // Remove empty options
      isPublic: isPublic ?? true,
      allowMultipleVotes: allowMultipleVotes ?? false,
      expiresAt,
      creatorId: user.id,
    });

    const response: ApiResponse = {
      success: true,
      data: poll,
      message: "Poll created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
