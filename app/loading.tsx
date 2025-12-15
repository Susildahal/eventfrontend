import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 px-4">
      
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-10 flex flex-col items-center max-w-sm w-full animate-fadeIn">
        
        <Spinner className="w-16 h-16 text-blue-600 mb-6 animate-spin-slow" />

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 animate-pulse">
          Loading...
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
          Please wait while we prepare your experience.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="h-8 w-3/4 rounded-xl mx-auto" />
          <Skeleton className="h-6 w-full rounded-lg" />
          <Skeleton className="h-6 w-5/6 rounded-lg mx-auto" />
          <Skeleton className="h-6 w-2/3 rounded-lg mx-auto" />
        </div>

      </div>
    </div>
  );
};

export default Loading;
