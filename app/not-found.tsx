import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 text-center">
      <h1 className="text-8xl font-extrabold text-red-500 tracking-tight">
        404
      </h1>

      <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800">
        Page Not Found
      </h2>

      <p className="mt-3 max-w-md text-gray-600">
        Sorry, the page you are looking for doesn’t exist or may have been moved.
      </p>


      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-[#7A5E39] px-6 py-3 text-white font-medium shadow-md transition hover:bg-[#7A5E39] hover:scale-105"
      >
      
          Go Back Home
     
      </Link>
    </div>
  );
}
