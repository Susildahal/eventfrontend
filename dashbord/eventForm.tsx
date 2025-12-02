"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import axiosInstance from "@/app/config/axiosInstance"
import * as yup from "yup"
import { toast } from "sonner"

const eventSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  slug: yup.string().required("Slug is required"),
  date: yup.string().required("Date is required"),
  eventypes: yup
    .string()
    .oneOf(["Birthday", "Beach and pool", "Branch Launch", "Night Music", "Custom"], "Select a valid event type")
    .required("Event type is required"),
  location: yup.string().required("Location is required"),
  shortSummary: yup.string().required("Short summary is required"),
  detailDescription: yup.string().required("Detail description is required"),
  coverImage: yup.string().url("Cover image must be a valid URL").nullable(),
  galleryImages: yup.array().of(yup.string().url("Gallery must contain valid URLs")).nullable(),
  reviewsText: yup.string().nullable(),
  isFeatured: yup.boolean(),
  status: yup.boolean(),
})

export default function EventForm() {
  const [form, setForm] = React.useState({
    title: "",
    slug: "",
    date: "",
    eventypes: "Birthday",
    location: "",
    shortSummary: "",
    detailDescription: "",
    coverImage: "",
    galleryImages: "",
    reviewsText: "",
    isFeatured: false,
    status: true,
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target as HTMLInputElement
    if (type === "checkbox") {
      setForm((s) => ({ ...s, [id]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm((s) => ({ ...s, [id]: value }))
    }
    setErrors((prev) => ({ ...prev, [id]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      // Prepare gallery as array of URLs (split by commas)
      const payload = {
        ...form,
        galleryImages: form.galleryImages ? (form.galleryImages as unknown as string).split(",").map((s) => s.trim()).filter(Boolean) : [],
      }

      await eventSchema.validate(payload, { abortEarly: false })

      const res = await axiosInstance.post("/events", payload)
      toast.success("Event created", { description: "Event has been created successfully." })
      // reset form
      setForm({
        title: "",
        slug: "",
        date: "",
        eventypes: "Birthday",
        location: "",
        shortSummary: "",
        detailDescription: "",
        coverImage: "",
        galleryImages: "",
        reviewsText: "",
        isFeatured: false,
        status: true,
      })
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const valErrors: Record<string, string> = {}
        err.inner.forEach((ve) => {
          if (ve.path) valErrors[ve.path] = ve.message
        })
        setErrors(valErrors)
        toast.error("Validation failed", { description: "Please correct the highlighted fields." })
      } else if (err instanceof Error) {
        toast.error("Create failed", { description: err.message })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={handleChange} />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={form.slug} onChange={handleChange} />
          {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={form.date} onChange={handleChange} />
          {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
        </div>
        <div>
          <Label htmlFor="eventypes">Event Type</Label>
          <select id="eventypes" value={form.eventypes} onChange={handleChange} className="w-full rounded-md border px-3 py-2">
            <option>Birthday</option>
            <option>Beach and pool</option>
            <option>Branch Launch</option>
            <option>Night Music</option>
            <option>Custom</option>
          </select>
          {errors.eventypes && <p className="text-xs text-red-500">{errors.eventypes}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={form.location} onChange={handleChange} />
        {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
      </div>

      <div>
        <Label htmlFor="shortSummary">Short Summary</Label>
        <Input id="shortSummary" value={form.shortSummary} onChange={handleChange} />
        {errors.shortSummary && <p className="text-xs text-red-500">{errors.shortSummary}</p>}
      </div>

      <div>
        <Label htmlFor="detailDescription">Detail Description</Label>
        <textarea id="detailDescription" value={form.detailDescription} onChange={handleChange} className="w-full rounded-md border p-2 min-h-[120px]" />
        {errors.detailDescription && <p className="text-xs text-red-500">{errors.detailDescription}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input id="coverImage" value={form.coverImage} onChange={handleChange} />
          {errors.coverImage && <p className="text-xs text-red-500">{errors.coverImage}</p>}
        </div>
        <div>
          <Label htmlFor="galleryImages">Gallery Image URLs (comma separated)</Label>
          <Input id="galleryImages" value={form.galleryImages as unknown as string} onChange={handleChange} />
        </div>
      </div>

      <div>
        <Label htmlFor="reviewsText">Reviews Text</Label>
        <Input id="reviewsText" value={form.reviewsText} onChange={handleChange} />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch id="isFeatured" checked={form.isFeatured} onCheckedChange={(val) => setForm((s) => ({ ...s, isFeatured: val as boolean }))} />
          <Label htmlFor="isFeatured">Featured</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="status" checked={form.status} onCheckedChange={(val) => setForm((s) => ({ ...s, status: val as boolean }))} />
          <Label htmlFor="status">Active</Label>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Event"}</Button>
      </div>
    </form>
  )
}

