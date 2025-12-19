'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axiosInstance from '@/app/config/axiosInstance'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Newdeletemodel from '@/dashbord/common/Newdeletemodel'
interface PortfolioItem {
  id: string
  name: string
  description: string
  star: number
  image?: string
  _id: string
}

const Page = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const initialValues = {
    name: '',
    description: '',
    star: ''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    star: Yup.number().required('Star rating is required').min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  })

  // Fetch portfolio items
  useEffect(() => {
    fetchPortfolioItems()
    gatbyid(id as string)
  }, [])

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/preview/${id}`)
      setPortfolioItems(response?.data?.data || [])
    } catch (error) {
      console.error('Error fetching portfolio items:', error)
    } finally {
      setLoading(false)
    }
  }


  const onSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }) => {
    try {
      const payload = { ...values, star: Number(values.star) }
      if (editingId) {
        // Update
        await axiosInstance.put(`/preview/${editingId}`, payload)
        console.log('Portfolio updated successfully')
      } else {
        // Create
        await axiosInstance.post(`/preview/${id}`, payload)
        console.log('Portfolio created successfully')
      }

      fetchPortfolioItems()
      resetForm()
      setEditingId(null)
      setDialogOpen(false)
    } catch (error) {
      console.error('Error saving portfolio:', error)
    } finally {
      setSubmitting(false)
    }
  }

 

  // Edit portfolio item
  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item._id)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingId(null)
  }
const [data, setData] = useState<any>(null);
  const gatbyid = async (itemId: string) => {
    try {
      const response = await axiosInstance.get(`/portfolio/${id}`)
      setData(response.data.data || null)
      return response?.data?.data || null
    } catch (error) {
      console.error('Error fetching portfolio item by ID:', error)
      return null
    }
  }

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <ArrowLeft 
              className="w-5 h-5 cursor-pointer  text-[#7A5E39]" 
              onClick={() => router.back()}
            />
            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-white">Preview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add, edit or remove portfolio items for {data?.title|| ''} portfolio</p>
            </div>
          </div>

          {/* Add Button Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingId(null)
                }}
                className="flex items-center "
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-black dark:text-white">
                  {editingId ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  {editingId ? 'Update the portfolio item details below' : 'Fill in the details to create a new portfolio item'}
                </DialogDescription>
              </DialogHeader>

              <Formik
                initialValues={editingId
                  ? {
                      name: portfolioItems.find(item => item._id === editingId)?.name || '',
                      description: portfolioItems.find(item => item._id === editingId)?.description || '',
                      star: String(portfolioItems.find(item => item._id === editingId)?.star || '')
                    }
                  : initialValues
                }
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
              >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Name</label>
                      <Input
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Portfolio item name"
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Description</label>
                      <Textarea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        placeholder="Portfolio item description"
                        rows={4}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      {errors.description && touched.description && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    {/* Star Rating Field */}
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">Star Rating (1-5)</label>
                      <Input
                        type="number"
                        name="star"
                        value={values.star}
                        onChange={handleChange}
                        placeholder="Enter rating 1-5"
                        min="1"
                        max="5"
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      {errors.star && touched.star && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.star}</p>
                      )}
                    </div>

                    {/* Image upload removed */}

                    <DialogFooter className="pt-4">
                      <DialogClose asChild>
                        <Button 
                          type="button" 
                          variant="outline"
                          className=""
                          onClick={handleDialogClose}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-[#7A5E39] hover:bg-[#7A5E39] text-white"
                      >
                        {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio Items Table */}
        <div className="">
        

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
            ) : portfolioItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No portfolio items yet. Add one to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-900">
                    <TableRow className="">
                                            <TableHead className="">Index</TableHead>

                      <TableHead className="">Name</TableHead>
                      <TableHead className="">Description</TableHead>
                      <TableHead className="">Rating</TableHead>
                      <TableHead className="">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolioItems.map((item, idx) => (
                      <TableRow key={item.id ?? idx} className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableCell className="font-medium text-black dark:text-white">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-black dark:text-white">{item.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">{item.description}</TableCell>
                        <TableCell className=" text-black dark:text-white">
                          <span className="">
                            {item.star} ⭐
                          </span>
                        </TableCell>
                      
                        <TableCell className="">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit(item)}
                              variant="outline"
                              size="sm"
                              className="border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => setDeleteId(item._id)}
                              variant="outline"
                              size="sm"
                              className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      <Newdeletemodel
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        endpoint="/preview"
        onSuccess={fetchPortfolioItems}
      />
      
    </div>
    </div>
  )
}

export default Page