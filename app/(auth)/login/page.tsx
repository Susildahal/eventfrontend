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
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
    rememberMe: yup.boolean(),
})

import { Checkbox } from "@/components/ui/checkbox"
export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean
    messages: string[]
  }>({ isValid: false, messages: [] })

  const validateEmailRealtime = (email: string) => {
    const messages: string[] = []
    let isValid = true

    if (!email) {
      setEmailValidation({ isValid: false, messages: [] })
      return
    }

    // Check for @ symbol
    if (!email.includes("@")) {
      messages.push("Email must contain @")
      isValid = false
    } else {
      // Check what comes before @
      const beforeAt = email.split("@")[0]
      if (!beforeAt) {
        messages.push("Username before @ is required")
        isValid = false
      } else if (beforeAt.length < 2) {
        messages.push("Username must be at least 2 characters")
        isValid = false
      }

      // Check what comes after @
      const afterAt = email.split("@")[1]
      if (afterAt) {
        if (!afterAt.includes(".")) {
          messages.push("Domain must contain .")
          isValid = false
        } else {
          const domain = afterAt.split(".")[0]
          const extension = afterAt.substring(afterAt.lastIndexOf(".") + 1)

          if (!domain) {
            messages.push("Domain name is required")
            isValid = false
          } else if (domain.length < 2) {
            messages.push("Domain must be at least 2 characters")
            isValid = false
          }

          if (!extension) {
            messages.push("Extension (.com, .org, etc.) is required")
            isValid = false
          } else if (extension.length < 2) {
            messages.push("Extension must be at least 2 characters")
            isValid = false
          } else {
            messages.push(`✓ .${extension} is valid`)
          }
        }
      } else if (email.includes("@")) {
        messages.push("Domain is required after @")
        isValid = false
      }
    }

    setEmailValidation({ isValid, messages })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Real-time validation for email
    if (id === "email") {
      validateEmailRealtime(value)
    }

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
      const authToken = response.data.token
      localStorage.setItem("authToken", authToken)
      router.push("/admin/dashbord")
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: { email?: string; password?: string } = {}
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof typeof validationErrors] =
              error.message
          }
        })
        setErrors(validationErrors)
      } else if (err instanceof Error) {
        console.error("Login error:", err.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

  <div
    className="min-h-screen flex items-center justify-center bg-black relative"

  >
    {/* Black Overlay */}
    <div className="" />

    {/* Login Card */}

    <Card className="relative z-10 w-full max-w-sm bg-black text-white border-[#7A5E39] ">

      <CardHeader className="items-center  flex  flex-col justify-center text-center space-y-2">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Logo"
          className="h-14 w-auto object-contain"
        />

        <div>
          <CardTitle className="text-2xl">
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                className={
                  errors.email
                    ? "border-red-500"
                    : formData.email && emailValidation.isValid
                      ? "rounded py-5 border-[#7A5E39]"
                      : "rounded py-5 border-[#7A5E39]"
                }
              />

              {formData.email && (
                <div className="mt-2 space-y-1">
                  {emailValidation.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm"
                    >
                      {msg.includes("✓") ? (
                        <>
                          <CheckCircle2 size={16} className="text-[#be9545]" />
                          <span className="text-[#be9545]">{msg}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} className="text-red-500" />
                          <span className="text-red-500">{msg}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {errors.email && (
                <p className="text-sm text-red-500 font-semibold">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={
                    errors.password
                      ? "border-red-500 pr-10"
                      : "pr-10 rounded py-5 border-[#7A5E39]"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} className=" text-[#be9545]" /> : <Eye  className=" text-[#be9545]" size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: Boolean(checked),
                  }))
                }
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>

              <p
                onClick={() => router.push("/forgotpassword")}
                className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer "
              >
                Forgot your password?
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !emailValidation.isValid}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
)

}
