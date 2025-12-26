"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginStatus = () => {
  const router = useRouter();

  useEffect(() => {
    // Prevent recheck after refresh
    const alreadyChecked = sessionStorage.getItem("checked");
    if (alreadyChecked) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
    } else {
 router.replace("/admin/dashboard");
    }

    // Mark checked for this session (resets on tab close)
    sessionStorage.setItem("checked", "true");
  }, []);

  return null;
};

export default LoginStatus;
