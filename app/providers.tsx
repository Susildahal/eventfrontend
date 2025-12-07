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
          style: {
            background: "#ffffff",
            color: "#1f2937",
            padding: "14px 18px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontSize: "15px",
            fontWeight: 500,
          },
          success: {
            style: { borderLeft: "6px solid #22c55e" },
            iconTheme: { primary: "#22c55e", secondary: "#ffffff" },
          },
          error: {
            style: { borderLeft: "6px solid #ef4444" },
            iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
          },
        }}
      />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
