'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginStatus = () => {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
    if (!token) {
      router.push("/login");
    }
    
    else {
      router.push("/admin");
    }
  }, [router]);
  return null;
};

export default LoginStatus;