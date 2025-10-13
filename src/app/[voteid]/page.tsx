"use client";

import { useRouter, useParams } from "next/navigation";

export default function FeatureDetailPage() {
  const router = useRouter();
  const params = useParams();
  const voteid = params.voteid;

  // Mock data - in a real app, you would fetch this based on the voteid
  const featureRequest = {
    id: voteid,
    title: "Implement Dark Mode",
    description: "Many users have requested a dark mode option for the application. This feature would improve user experience, especially for those who prefer working in low-light environments or have sensitivity to bright screens.",
    votes: 125,
    createdDate: "January 15, 2024",
    createdBy: "Olivia Bennett",
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <header className="bg-white border-b border-gray-200 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-[#137fec] w-6 h-6">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Votato</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDACKjCefhRFiUBUxT4UNojF3JFWqlYjDkQGmvZjR98QDNWqqX51C00WDI-eIZpZGbN4n8T00_sTyDCsQf72u7zn5tCWkasnywARjtvZbTW4sVPFWIgppGCSsNDsQF-nFcEcuKWTW_cvYKr_h1NX4QqtlWEURpOaw7nfml-AYoc62r4WG_-EF0z2E9NRznEl3yYk9NQwnWtvAJMfJFNpMkyRGL1mKCUSaPNc_Ch9CgzlEsSXp5mln4-dn168Gqpgx1kJhn4-udJi5P5")'}}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#137fec] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Home
            </button>
            <button
              onClick={() => {
                // Handle delete logic here
                console.log('Delete feature request:', voteid);
              }}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">delete</span>
              Delete
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
              <div className="flex flex-col items-center gap-2 bg-[#f6f7f8] rounded-lg p-3 border border-gray-200">
                <button className="p-2 rounded-full text-gray-600 hover:bg-[#137fec]/20 hover:text-[#137fec] cursor-pointer">
                  <span className="material-symbols-outlined">keyboard_arrow_up</span>
                </button>
                <span className="font-bold text-lg text-gray-900">{featureRequest.votes}</span>
                <button className="p-2 rounded-full text-gray-600 hover:bg-[#137fec]/20 hover:text-[#137fec] cursor-pointer">
                  <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {featureRequest.title}
                </h2>
                <p className="mt-3 text-base text-gray-600">
                  {featureRequest.description}
                </p>
                <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Created on <time>{featureRequest.createdDate}</time></span>
                  <span>by <span className="font-medium text-gray-700">{featureRequest.createdBy}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
