"use client";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
 
          },
          success: {
            style: {
              background: "#7A5E39",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#7A5E39",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#ef4444",
            },
          },
          loading: {
            style: {
              background: "#3b82f6",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#3b82f6",
            },
          },
        }}
      />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
  );
}