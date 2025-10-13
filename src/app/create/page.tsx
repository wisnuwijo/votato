"use client";

export default function CreatePage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");
    console.log({ title, description });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <header className="border-b border-[#dee2e6]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-[#111418]">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                </svg>
              </div>
              <h1 className="text-lg font-bold text-[#111418]">Feature Requests</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-[#111418] hover:bg-[#137fec]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#137fec] focus:ring-offset-[#f6f7f8]">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuAZIr6dhj9RzYDU87ocRfpUi2rGCaMDoKP9vOKFNn1jf2SqD1r9fZVI53uFmgXr30SmqT61mTc-rnT1pCdu5CYIpIWfaZ5fkPEG8MaNBwzWA3y9yH8-ij98pNyO18Zt87ASe2HfCHAQjVRBH94ckuVPUBRgV1iC6gDnmi72HrDR7ZUM2B79ohCpw-eUzYf8X-Zp0WLwDqXRBaa0YY7wtry3vYYYqoyV7Re4oOCFyPLPHlJAhGeJP8U9L-KbXS-ZfCJUMkBfo4u9eCIM\")"}}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#111418]">
                Create a new feature request
              </h2>
              <p className="mt-2 text-[#111418]/70">
                Fill out the details below to submit a new feature for consideration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#111418]">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g., Add dark mode support"
                    className="block w-full rounded-lg border-0 bg-[#eef0f2] text-[#111418] placeholder:text-[#617589] focus:ring-2 focus:ring-inset focus:ring-[#137fec] py-3 px-4 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#111418]">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe the feature in more detail..."
                    rows={4}
                    className="block w-full rounded-lg border-0 bg-[#eef0f2] text-[#111418] placeholder:text-[#617589] focus:ring-2 focus:ring-inset focus:ring-[#137fec] py-3 px-4 shadow-sm"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#137fec] hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#137fec] focus:ring-offset-[#f6f7f8]"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
