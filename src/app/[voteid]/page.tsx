"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthHeaders, isAuthenticated } from "@/lib/auth";

interface FeatureRequestDetail {
  id: number;
  title: string;
  subtitle: string;
  votes: number;
  number_of_upvote: number;
  number_of_downvote: number;
  created_by: string;
  created_at: string;
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
  created_at: string;
}

export default function FeatureDetailPage() {
  const router = useRouter();
  const params = useParams();
  const voteid = params.voteid as string;

  const [featureRequest, setFeatureRequest] = useState<FeatureRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const fetchFeatureRequest = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/feature_requests/${voteid}`);
      const data = await response.json();

      if (data.success) {
        setFeatureRequest(data.data);
      } else {
        setError(data.message || 'Failed to fetch feature request');
      }
    } catch (err) {
      setError('Failed to load feature request');
      console.error('Error fetching feature request:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(`/api/comments?feature_request_id=${voteid}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (voteid) {
      fetchFeatureRequest();
      fetchComments();
    }
  }, [voteid]);

  const handleUpvote = async () => {
    if (!isAuthenticated()) {
      alert('Please login to vote');
      return;
    }

    setIsVoting(true);

    try {
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ feature_request_id: parseInt(voteid) }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchFeatureRequest();
      } else {
        alert(data.message || 'Failed to upvote');
      }
    } catch (err) {
      console.error('Error upvoting:', err);
      alert('Failed to upvote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (!isAuthenticated()) {
      alert('Please login to vote');
      return;
    }

    setIsVoting(true);

    try {
      const response = await fetch('/api/downvote', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ feature_request_id: parseInt(voteid) }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchFeatureRequest();
      } else {
        alert(data.message || 'Failed to downvote');
      }
    } catch (err) {
      console.error('Error downvoting:', err);
      alert('Failed to downvote');
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    // This automatically converts UTC to user's local timezone
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDateTime(dateString);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      alert('Please login to comment');
      return;
    }

    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          feature_request_id: parseInt(voteid),
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComment('');
        // Refresh comments list
        await fetchComments();
      } else {
        alert(data.message || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <header className="bg-white/50 border-b border-slate-200/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center gap-4">
              <div className="text-[#137fec] w-7 h-7">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h1 className="text-lg font-bold text-slate-900">Feature Requests</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#137fec] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Home
            </button>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!isLoading && !error && featureRequest && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                <div className="flex flex-col items-center gap-2 bg-[#f6f7f8] rounded-lg p-3 border border-gray-200">
                  <button
                    onClick={handleUpvote}
                    disabled={isVoting}
                    className="p-2 rounded-full text-gray-600 hover:bg-[#137fec]/20 hover:text-[#137fec] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVoting ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined">keyboard_arrow_up</span>
                    )}
                  </button>
                  <span className="font-bold text-lg text-gray-900">{featureRequest.votes}</span>
                  <button
                    onClick={handleDownvote}
                    disabled={isVoting}
                    className="p-2 rounded-full text-gray-600 hover:bg-[#137fec]/20 hover:text-[#137fec] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVoting ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {featureRequest.title}
                  </h2>
                  <p className="mt-4 text-base text-gray-600">
                    {featureRequest.subtitle}
                  </p>
                  <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                    <span>Created on <time>{formatDate(featureRequest.created_at)}</time></span>
                    <span>by <span className="font-medium text-gray-700">{featureRequest.created_by}</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comment Section */}
          {!isLoading && !error && featureRequest && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>

              {/* Comment Input */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmitComment}>
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Add a comment
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      disabled={isSubmittingComment}
                      className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#137fec] focus:border-transparent py-3 px-4 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !comment.trim()}
                      className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#137fec] hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#137fec] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmittingComment ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        'Post Comment'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="mt-6 space-y-4">
                {isLoadingComments && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#137fec]"></div>
                  </div>
                )}

                {!isLoadingComments && comments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                )}

                {!isLoadingComments && comments.length > 0 && (
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <div key={c.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-[#137fec] flex items-center justify-center text-white font-semibold">
                              {(c.user_detail.name || c.user_detail.username || 'U')[0].toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {c.user_detail.name || c.user_detail.username || 'Anonymous'}
                              </span>
                              <span className="text-sm text-gray-500" title={formatDateTime(c.created_at)}>
                                {formatRelativeTime(c.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap break-words">
                              {c.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
