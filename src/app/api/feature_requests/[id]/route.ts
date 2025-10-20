import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

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
 * GET /api/feature_requests/[id]
 * Get a specific feature request with its details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const featureRequestId = parseInt(id);

    if (isNaN(featureRequestId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid feature request ID',
        },
        { status: 400 }
      );
    }

    // Fetch the feature request
    const featureRequest = await db<FeatureRequest>('feature_requests')
      .where('id', featureRequestId)
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

    // Calculate net votes
    const votes = featureRequest.number_of_upvote - featureRequest.number_of_downvote;

    // Prepare the response
    const response = {
      id: featureRequest.id,
      title: featureRequest.title,
      subtitle: featureRequest.subtitle,
      votes: votes,
      number_of_upvote: featureRequest.number_of_upvote,
      number_of_downvote: featureRequest.number_of_downvote,
      user_id: featureRequest.user_id,
      user_detail: featureRequest.user_detail,
      created_by: featureRequest.user_detail.username || featureRequest.user_detail.name || 'Unknown',
      created_at: featureRequest.created_at,
    };

    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching feature request:', error);

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
