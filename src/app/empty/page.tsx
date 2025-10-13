"use client";

export default function EmptyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#137fec] rounded-lg text-white">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Feature Requests</h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 bg-cover bg-center rounded-full"
            style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfo3yn6lNvBNE8InV73yNs9xSw7QYjJFoaBP6ZYKdiFmK0kWRUuE_qLA31XjTCREVO5ozihY_l75IfAnPgyZNDerwmoMLvvVtAlqAbk0-kZ7kSu4DBciNYwp4lYhslKfMwF8mGczyCccgn9rghU_pUSrtTYtBzJ3pbX7yyDXPWMFoGcEaQte-ROZUKeZclqNh67CIkpzezB5EAAbdP2pwyUq2H5BFGPRUE9IJPPqvWuubZeGS8aB0oPICAnFuLVs88vSTl6CIPtyOg')"}}
          ></div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
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
          <button className="bg-[#137fec] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#137fec]/90 transition-colors duration-300">
            Create Feature Request
          </button>
        </div>
      </main>
    </div>
  );
}
