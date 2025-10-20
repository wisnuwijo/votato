"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthHeaders, isAuthenticated } from "@/lib/auth";

interface FeatureRequest {
  id: number;
  title: string;
  subtitle: string;
  votes: number;
  number_of_upvote: number;
  number_of_downvote: number;
  created_by: string;
  created_at: string;
}

export default function Home() {
  const router = useRouter();
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<number | null>(null);

  const fetchFeatureRequests = async () => {
    try {
      const response = await fetch('/api/feature_requests');
      const data = await response.json();

      if (data.success) {
        setFeatureRequests(data.data);
      } else {
        setError(data.message || 'Failed to fetch feature requests');
      }
    } catch (err) {
      setError('Failed to load feature requests');
      console.error('Error fetching feature requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureRequests();
  }, []);

  const handleUpvote = async (featureRequestId: number) => {
    if (!isAuthenticated()) {
      alert('Please login to vote');
      return;
    }

    setVotingId(featureRequestId);

    try {
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ feature_request_id: featureRequestId }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the feature requests to get updated vote counts
        await fetchFeatureRequests();
      } else {
        alert(data.message || 'Failed to upvote');
      }
    } catch (err) {
      console.error('Error upvoting:', err);
      alert('Failed to upvote');
    } finally {
      setVotingId(null);
    }
  };

  const handleDownvote = async (featureRequestId: number) => {
    if (!isAuthenticated()) {
      alert('Please login to vote');
      return;
    }

    setVotingId(featureRequestId);

    try {
      const response = await fetch('/api/downvote', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ feature_request_id: featureRequestId }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the feature requests to get updated vote counts
        await fetchFeatureRequests();
      } else {
        alert(data.message || 'Failed to downvote');
      }
    } catch (err) {
      console.error('Error downvoting:', err);
      alert('Failed to downvote');
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] text-slate-800">
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

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
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

          {!isLoading && !error && featureRequests.length === 0 && (
            <div className="text-center p-8 max-w-lg mx-auto">
              <div className="w-full max-w-sm mx-auto mb-8">
                <img
                  alt="Illustration of an empty box"
                  className="w-full h-auto rounded-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtmuB28fdVpe1ugyS-I3NTsRRwVdx1hO74fccGmCr6gRK54PueTCfIOy7QUrEsBqTOkr10BPH1Mzrqb2BYh_KCyx_3D8iMXOxp4gyEfEDIzJAT3nHDckUFAA8-zNwVBshW7O9Fx32Dq9uvlopqepH4FLsHsg2IfYTQ0iVzrS2zroFHc2qbA6-4dCk2Or6YzANgVKTCR0qpUZx1GyIX-D6Pu-iZCxVbIYAH7ODfYFiTIGe10-14J8kFXBuvm-3id2kXOAH7k_Y9oIeO"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No feature requests yet
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to suggest a new feature or improvement. Your feedback helps us shape the future of our product.
              </p>
              <button 
                onClick={() => router.push(`/create`)}
                className="bg-[#137fec] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#137fec]/90 cursor-pointer transition-colors duration-300">
                Create Feature Request
              </button>
            </div>
          )}

          <div className="space-y-4">
            {featureRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => router.push(`/${request.id}`)}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex-grow pr-4">
                  <h3 className="text-base font-medium text-slate-900">
                    {request.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {request.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    by {request.created_by}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(request.id);
                    }}
                    disabled={votingId === request.id}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {votingId === request.id ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined text-lg">arrow_drop_up</span>
                    )}
                  </button>
                  <span className="font-semibold text-slate-800 text-sm w-6 text-center">
                    {request.votes}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownvote(request.id);
                    }}
                    disabled={votingId === request.id}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {votingId === request.id ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <button
        onClick={() => router.push('/create')}
        className="fixed bottom-8 right-8 bg-[#137fec] text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center cursor-pointer"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}
