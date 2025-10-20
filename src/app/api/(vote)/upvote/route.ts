import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '../../auth_handler';
import db from '@/lib/db';

interface UpvoteRequestBody {
  feature_request_id: number;
}

interface Vote {
  id: number;
  feature_request_id: number;
  user_id: number;
  user_detail: Record<string, unknown>;
  type: 'upvote' | 'downvote';
  created_at: Date;
}

/**
 * POST /api/upvote
 * Upvote a feature request
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
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

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
    const body: UpvoteRequestBody = await request.json();

    if (!body.feature_request_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'feature_request_id is required',
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

    // 2. Check if the user already voted on this feature request
    const existingVote = await db<Vote>('votes')
      .where('feature_request_id', body.feature_request_id)
      .where('user_id', user.ID)
      .first();

    if (!existingVote) {
      // 3. User hasn't voted yet - insert new vote and increment upvote count
      await db.transaction(async (trx) => {
        // Insert new vote
        await trx('votes').insert({
          feature_request_id: body.feature_request_id,
          user_id: user.ID,
          user_detail: {
            username: user.username,
            name: user.name,
            email: user.email,
          },
          type: 'upvote',
        });

        // Increment upvote count
        await trx('feature_requests')
          .where('id', body.feature_request_id)
          .increment('number_of_upvote', 1);
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Successfully upvoted',
          action: 'added',
        },
        { status: 200 }
      );
    }

    // 4. User already voted - check vote type
    if (existingVote.type === 'upvote') {
      return NextResponse.json(
        {
          success: true,
          message: 'You have already upvoted this feature request',
          action: 'already_upvoted',
        },
        { status: 200 }
      );
    }

    // 5. User previously downvoted - switch to upvote
    if (existingVote.type === 'downvote') {
      await db.transaction(async (trx) => {
        // Update vote type from downvote to upvote
        await trx('votes')
          .where('id', existingVote.id)
          .update({
            type: 'upvote',
            created_at: trx.fn.now(),
          });

        // Decrease downvote count and increase upvote count
        await trx('feature_requests')
          .where('id', body.feature_request_id)
          .decrement('number_of_downvote', 1)
          .increment('number_of_upvote', 1);
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Changed from downvote to upvote',
          action: 'switched',
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Error processing upvote:', error);

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
