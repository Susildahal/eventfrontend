"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginStatus = () => {
  const router = useRouter();

  useEffect(() => {
    // Prevent recheck after refreshffffffff
    const alreadyChecked = sessionStorage.getItem("checked");
    if (alreadyChecked) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
    } else {
      // Keep existing project route spelling
      router.replace("/admin/dashbord");
    }
//sadsdasda
    // Mark checked for this session (resets on tab close)
    sessionStorage.setItem("checked", "true");
  }, []);

  return null;
};

export default LoginStatus;
