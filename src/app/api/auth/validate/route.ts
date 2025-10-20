import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '../../auth_handler';

interface ValidateRequestBody {
  token: string;
}

/**
 * POST /api/auth/validate
 * Validate a bearer token
 */
export async function POST(request: NextRequest) {
  try {
    const body: ValidateRequestBody = await request.json();

    if (!body.token) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Token is required',
        },
        { status: 400 }
      );
    }

    // Validate the token using the auth handler
    const user = await validateToken(body.token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        valid: true,
        message: 'Token is valid',
        user: {
          id: user.ID,
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Token validation error:', error);

    return NextResponse.json(
      {
        success: false,
        valid: false,
        message: 'Failed to validate token',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
