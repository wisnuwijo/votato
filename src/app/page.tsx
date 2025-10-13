"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const featureRequests = [
    { id: 1, title: "Add dark mode", votes: 12 },
    { id: 2, title: "Improve search functionality", votes: 8 },
    { id: 3, title: "Integrate with other platforms", votes: 5 },
    { id: 4, title: "Mobile app support", votes: 3 },
    { id: 5, title: "Add user profiles", votes: 1 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] text-slate-800">
      <header className="bg-white/50 border-b border-slate-200/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-[#137fec] w-7 h-7">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h1 className="text-lg font-bold text-slate-900">Feature Requests</h1>
            </div>
            <div className="flex items-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1G7oWojYXM0nION8aOjtrgFFKgnDWas5SIXyU0TWCYsCd70d7p6_MaZXBLHhIZI1_OXdPiqw7VPNkCIQJnjD2xx7qztCCAL2V4nyG4PTL8XpxaJNA-ul1fNyLhEuZEhajhF078fHtkw5z_p5DK55f6kvrR5YCEpFPUGvcTFX-7YSe0_JZVJfch6EzynlyOvlVsBsE0laMA8lHtC3Cq4rQhTUQypuNeS7OcoAwR1DAY5dxZqWxPJfVTKBGXpG3xZlNjORznocse1J4")'}}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">
            Feature Requests
          </h2>
          <div className="space-y-4">
            {featureRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => router.push('/16867206943035763044')}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex-grow">
                  <h3 className="text-base font-medium text-slate-900">
                    {request.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {request.votes} {request.votes === 1 ? 'vote' : 'votes'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_drop_up</span>
                  </button>
                  <span className="font-semibold text-slate-800 text-sm w-6 text-center">
                    {request.votes}
                  </span>
                  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
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
