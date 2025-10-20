import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '../auth_handler';
import db from '@/lib/db';

interface CreateCommentBody {
  feature_request_id: number;
  comment: string;
}

interface Comment {
  id: number;
  feature_request_id: number;
  user_id: number;
  user_detail: {
    username?: string;
    name?: string;
    email?: string;
  };
  comment: string;
  created_at: Date;
}

/**
 * POST /api/comments
 * Create a new comment on a feature request
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Extract and validate the authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing or invalid authorization header',
        },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.substring(7);

    // Validate the token
    const user = await validateToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    // Parse the request body
    const body: CreateCommentBody = await request.json();

    // Validate required fields
    if (!body.feature_request_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'feature_request_id is required',
        },
        { status: 400 }
      );
    }

    if (!body.comment || !body.comment.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment text is required',
        },
        { status: 400 }
      );
    }

    // Check if feature request exists
    const featureRequest = await db('feature_requests')
      .where('id', body.feature_request_id)
      .first();

    if (!featureRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Feature request not found',
        },
        { status: 404 }
      );
    }

    // Insert the comment
    const [comment] = await db<Comment>('comments')
      .insert({
        feature_request_id: body.feature_request_id,
        user_id: user.ID,
        user_detail: {
          username: user.username,
          name: user.name,
          email: user.email,
        },
        comment: body.comment.trim(),
      })
      .returning('*');

    return NextResponse.json(
      {
        success: true,
        message: 'Comment posted successfully',
        data: comment,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error posting comment:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/comments
 * Get all comments for a feature request
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featureRequestId = searchParams.get('feature_request_id');

    if (!featureRequestId) {
      return NextResponse.json(
        {
          success: false,
          message: 'feature_request_id query parameter is required',
        },
        { status: 400 }
      );
    }

    // Fetch comments for the feature request
    const comments = await db<Comment>('comments')
      .where('feature_request_id', parseInt(featureRequestId))
      .orderBy('created_at', 'desc')
      .select('*');

    return NextResponse.json(
      {
        success: true,
        data: comments,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching comments:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
