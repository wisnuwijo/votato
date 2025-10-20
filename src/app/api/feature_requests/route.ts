import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '../auth_handler';
import db from '@/lib/db';

// Type definition for the request body
interface CreateFeatureRequestBody {
  title: string;
  subtitle: string;
}

// Type definition for feature request
interface FeatureRequest {
  id: number;
  title: string;
  subtitle: string;
  number_of_upvote: number;
  number_of_downvote: number;
  user_id: number;
  user_detail: {
    username?: string;
    name?: string;
    email?: string;
  };
  created_at: Date;
}

/**
 * POST /api/feature_requests
 * Create a new feature request
 */
export async function POST(request: NextRequest) {
  try {
    // Extract the authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing or invalid authorization header'
        },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate the token
    const user = await validateToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token'
        },
        { status: 401 }
      );
    }

    // Parse the request body
    const body: CreateFeatureRequestBody = await request.json();

    // Validate required fields
    if (!body.title || !body.subtitle) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title and subtitle are required'
        },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (body.title.length > 255) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title must not exceed 255 characters'
        },
        { status: 400 }
      );
    }

    if (body.subtitle.length > 500) {
      return NextResponse.json(
        {
          success: false,
          message: 'Subtitle must not exceed 500 characters'
        },
        { status: 400 }
      );
    }

    // Insert the new feature request
    const [featureRequest] = await db<FeatureRequest>('feature_requests')
      .insert({
        title: body.title,
        subtitle: body.subtitle,
        number_of_upvote: 0,
        number_of_downvote: 0,
        user_id: user.ID,
        user_detail: {
          username: user.username,
          name: user.name,
          email: user.email,
        },
      })
      .returning('*');

    return NextResponse.json(
      {
        success: true,
        message: 'Feature request created successfully',
        data: {
            result: featureRequest,
            user: user,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating feature request:', error);

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
 * GET /api/feature_requests
 * Get all feature requests with calculated vote counts
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    // Fetch feature requests with pagination
    const featureRequests = await db<FeatureRequest>('feature_requests')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Calculate net votes for each feature request
    const featureRequestsWithVotes = featureRequests.map(request => ({
      id: request.id,
      title: request.title,
      subtitle: request.subtitle,
      votes: request.number_of_upvote - request.number_of_downvote,
      number_of_upvote: request.number_of_upvote,
      number_of_downvote: request.number_of_downvote,
      user_id: request.user_id,
      user_detail: request.user_detail,
      created_by: request.user_detail.username || request.user_detail.name || 'Unknown',
      created_at: request.created_at,
    }));

    // Sort by votes (highest first)
    featureRequestsWithVotes.sort((a, b) => b.votes - a.votes);

    // Get total count
    const [{ count }] = await db('feature_requests').count('* as count');

    return NextResponse.json(
      {
        success: true,
        data: featureRequestsWithVotes,
        pagination: {
          page,
          limit,
          total: parseInt(count as string),
          totalPages: Math.ceil(parseInt(count as string) / limit),
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching feature requests:', error);

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
