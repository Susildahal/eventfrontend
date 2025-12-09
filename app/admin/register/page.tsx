"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import * as yup from "yup"
import axiosInstance from "../../config/axiosInstance"
import { toast, Toaster } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Header from "@/dashbord/common/Header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const registerSchema = yup.object().shape({
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: yup.string().oneOf(["admin", "user"], "Select a valid role").required("Role is required"),
})

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "" })
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; role?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        // remove the specific error key in a type-safe way
        delete (newErrors as any)[id]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const payload = { name: formData.name, email: formData.email, password: formData.password, role: formData.role }
      const response = await axiosInstance.post("/users/register", payload)
      toast.success("Registration successful!", { description: "You can now log in." })
      toast.success("Registration successful!", { description: "You can now log in." })

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: { name?: string; email?: string; password?: string; confirmPassword?: string, role?: string } = {}
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof typeof validationErrors] = error.message
          }
        })
        setErrors(validationErrors)
        toast.error("Validation failed", { description: "Please check the form fields." })
      } else if (err instanceof Error) {
        toast.error("Registration failed", { description: "   User alreaPlease try again." })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header title="Create Account" titledesc="Register a new admin account" />
      <div className="flex justify-center items-center ">
        <Toaster position="top-right" richColors />
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Fill in the details to create your account</CardDescription>

          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, role: value }))
                      if (errors.role) {
                        setErrors((prev) => {
                          const newErrors = { ...prev }
                          delete (newErrors as any).role
                          return newErrors
                        })
                      }
                    }}
                  >
                    <SelectTrigger className={(errors.role ? "border-red-500 " : "") + "w-full"}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
              
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
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
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
