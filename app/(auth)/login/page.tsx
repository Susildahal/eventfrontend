"use client"

import { Button } from "@/components/ui/button"
import {
  Card,

  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import * as yup from "yup"
import axiosInstance from "../../config/axiosInstance"
import {Eye , EyeOff} from "lucide-react"
import { useRouter } from "next/navigation";


const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
})

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    // Clear error for this field when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})


    try {
      await loginSchema.validate(formData, { abortEarly: false })
      // Form is valid, proceed with login
      const response = await axiosInstance.post("/users/login", formData)
    
      console.log("Login response:", response.data)
      const  authToken = response.data.token
      localStorage.setItem("authToken", authToken)
      // Add redirect logic here if needed
      router.push('/admin')
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: { email?: string; password?: string } = {}
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof typeof validationErrors] = error.message
          }
        })
        setErrors(validationErrors)
      
      } else if (err instanceof Error) {
       
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen" 
    style={{
      // backgroundImage :url("/loginpage.jpg")

    }}>
     
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="string"
                 
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
