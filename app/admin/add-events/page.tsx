"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import axiosInstance from "@/app/config/axiosInstance"
import Header from "@/dashbord/common/Header"
import * as yup from "yup"
import { toast } from "sonner"
import { Upload, X, ImageIcon } from "lucide-react"

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
  coverImage: yup.string().nullable(),
  galleryImages: yup.array().of(yup.string()).nullable(),
  reviewsText: yup.string().nullable(),
  isFeatured: yup.boolean(),
  status: yup.boolean(),
})

export default function Page() {
  const [form, setForm] = React.useState({
    title: "",
    slug: "",
    date: "",
    eventypes: "Birthday",
    location: "",
    shortSummary: "",
    detailDescription: "",
    coverImage: "",
    galleryImages: [] as string[],
    reviewsText: "",
    isFeatured: false,
    status: true,
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [coverDrag, setCoverDrag] = React.useState(false)
  const [galleryDrag, setGalleryDrag] = React.useState(false)

  const coverInputRef = React.useRef<HTMLInputElement>(null)
  const galleryInputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    const { id, value, type } = target
    if (type === "checkbox") {
      setForm((s) => ({ ...s, [id]: target.checked }))
      setErrors((prev) => ({ ...prev, [id]: "" }))
      return
    }
    setForm((s) => ({ ...s, [id]: value }))
    setErrors((prev) => ({ ...prev, [id]: "" }))
  }

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })

  const handleCoverFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const dataUrl = await readFileAsDataURL(files[0])
    setForm((s) => ({ ...s, coverImage: dataUrl }))
  }

  const handleGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const dataUrls = await Promise.all(Array.from(files).map(readFileAsDataURL))
    setForm((s) => ({ ...s, galleryImages: [...s.galleryImages, ...dataUrls] }))
  }

  const removeCover = () => setForm((s) => ({ ...s, coverImage: "" }))
  const removeGalleryImage = (idx: number) =>
    setForm((s) => ({ ...s, galleryImages: s.galleryImages.filter((_, i) => i !== idx) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const payload = { ...form }
      await eventSchema.validate(payload, { abortEarly: false })
       const res = await axiosInstance.post("/events", payload)
         toast.success("Event created", { description: "Event has been created successfully." })
       if(res.status === 201){
         setTimeout(() => {         
            window.location.href = '/admin/events';
         },100)
        }
    
      setForm({
        title: "",
        slug: "",
        date: "",
        eventypes: "Birthday",
        location: "",
        shortSummary: "",
        detailDescription: "",
        coverImage: "",
        galleryImages: [],
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
    <>
      <Header title="Add Event" titledesc="Create a new event" link="/admin/events" linkname="Events" />
      <div className="p-4 border border-gray-200 bg-white rounded-lg mt-2">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Row 1: Title, Slug, Date, Event Type */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="title" className="text-xs">Title</Label>
              <Input id="title" value={form.title} onChange={handleChange} className="h-8 text-sm" />
              {errors.title && <p className="text-[10px] text-red-500 mt-0.5">{errors.title}</p>}
            </div>
            <div>
              <Label htmlFor="slug" className="text-xs">Slug</Label>
              <Input id="slug" value={form.slug} onChange={handleChange} className="h-8 text-sm" />
              {errors.slug && <p className="text-[10px] text-red-500 mt-0.5">{errors.slug}</p>}
            </div>
            <div>
              <Label htmlFor="date" className="text-xs">Date</Label>
              <Input id="date" type="date" value={form.date} onChange={handleChange} className="h-8 text-sm" />
              {errors.date && <p className="text-[10px] text-red-500 mt-0.5">{errors.date}</p>}
            </div>
            <div>
              <Label htmlFor="eventypes" className="text-xs">Event Type</Label>
              <select id="eventypes" value={form.eventypes} onChange={handleChange} className="w-full h-8 text-sm rounded-md border px-2">
                <option>Birthday</option>
                <option>Beach and pool</option>
                <option>Branch Launch</option>
                <option>Night Music</option>
                <option>Custom</option>
              </select>
              {errors.eventypes && <p className="text-[10px] text-red-500 mt-0.5">{errors.eventypes}</p>}
            </div>
          </div>

          {/* Row 2: Location, Short Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="location" className="text-xs">Location</Label>
              <Input id="location" value={form.location} onChange={handleChange} className="h-8 text-sm" />
              {errors.location && <p className="text-[10px] text-red-500 mt-0.5">{errors.location}</p>}
            </div>
            <div>
              <Label htmlFor="shortSummary" className="text-xs">Short Summary</Label>
              <Input id="shortSummary" value={form.shortSummary} onChange={handleChange} className="h-8 text-sm" />
              {errors.shortSummary && <p className="text-[10px] text-red-500 mt-0.5">{errors.shortSummary}</p>}
            </div>
          </div>

          {/* Row 3: Detail Description */}
          <div>
            <Label htmlFor="detailDescription" className="text-xs">Detail Description</Label>
            <textarea
              id="detailDescription"
              value={form.detailDescription}
              onChange={handleChange}
              className="w-full rounded-md border p-2 text-sm min-h-[80px] resize-none"
            />
            {errors.detailDescription && <p className="text-[10px] text-red-500 mt-0.5">{errors.detailDescription}</p>}
          </div>

          {/* Row 4: Cover Image + Gallery Images (drag/drop zones) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Cover Image */}
            <div>
              <Label className="text-xs mb-1 block">Cover Image</Label>
              {form.coverImage ? (
                <div className="relative group w-full h-32 rounded-md overflow-hidden border">
                  <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeCover}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setCoverDrag(true) }}
                  onDragLeave={() => setCoverDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setCoverDrag(false); handleCoverFile(e.dataTransfer.files) }}
                  onClick={() => coverInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer transition ${coverDrag ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"}`}
                >
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Drag & drop or click to upload</span>
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverFile(e.target.files)} />
                </div>
              )}
              {errors.coverImage && <p className="text-[10px] text-red-500 mt-0.5">{errors.coverImage}</p>}
            </div>

            {/* Gallery Images */}
            <div>
              <Label className="text-xs mb-1 block">Gallery Images</Label>
              <div
                onDragOver={(e) => { e.preventDefault(); setGalleryDrag(true) }}
                onDragLeave={() => setGalleryDrag(false)}
                onDrop={(e) => { e.preventDefault(); setGalleryDrag(false); handleGalleryFiles(e.dataTransfer.files) }}
                onClick={() => galleryInputRef.current?.click()}
                className={`flex flex-col items-center justify-center h-20 border-2 border-dashed rounded-md cursor-pointer transition ${galleryDrag ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"}`}
              >
                <ImageIcon className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Drag & drop or click (multiple)</span>
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleGalleryFiles(e.target.files)} />
              </div>
              {form.galleryImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {form.galleryImages.map((src, idx) => (
                    <div key={idx} className="relative group w-14 h-14 rounded overflow-hidden border">
                      <img src={src} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx) }}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 5: Reviews Text + Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
            <div>
              <Label htmlFor="reviewsText" className="text-xs">Reviews Text</Label>
              <Input id="reviewsText" value={form.reviewsText} onChange={handleChange} className="h-8 text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Switch id="isFeatured" checked={form.isFeatured} onCheckedChange={(val) => setForm((s) => ({ ...s, isFeatured: val }))} />
                <Label htmlFor="isFeatured" className="text-xs">Featured</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <Switch id="status" checked={form.status} onCheckedChange={(val) => setForm((s) => ({ ...s, status: val }))} />
                <Label htmlFor="status" className="text-xs">Active</Label>
              </div>
            </div>
          </div>

          {/* Submit */}
         
          <div className="flex justify-end gap-10 pt-1">
            <Button type="submit" size="sm" disabled={loading}>{loading ? "Saving..." : "Create Event"}</Button>
            
          </div>
         
        
        </form>
      </div>
    </>
  )
}

