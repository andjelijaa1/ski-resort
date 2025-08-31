import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center h-full bg-background">
      <div className="container flex items-center max-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          {/* Icon with proper dark mode colors */}
          <div className="p-3 text-sm font-medium text-primary rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Title with proper text colors */}
          <h1 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
            Page not found
          </h1>

          {/* Description */}
          <p className="mt-4 text-muted-foreground">
            The page you are looking for doesn't exist. Here are some helpful
            links:
          </p>

          {/* Buttons using shadcn Button component */}
          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-1/2 gap-x-2 sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 rtl:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              <span>Go back</span>
            </Button>

            <Button
              onClick={() => navigate("/")}
              className="w-1/2 shrink-0 sm:w-auto"
              variant="primary"
            >
              Take me home
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
