"use client"

import React, { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import axiosInstance from "@/app/config/axiosInstance"

interface DeleteModelProps {
  deleteId: string | null
  endpoint: string
  setDeleteId: (id: string | null) => void
  onSuccess?: () => void
}

const Newdeletemodel: React.FC<DeleteModelProps> = ({
  deleteId,
  setDeleteId,
  endpoint,
  onSuccess
}) => {

  const [loading, setLoading] = useState(false)

  const deleteItems = async () => {
    try {
      setLoading(true)
      await axiosInstance.delete(`${endpoint}/${deleteId}`)

      if (onSuccess) onSuccess()

      setDeleteId(null) // close after success only
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog
    
      // Prevent closing while loading
      open={!!deleteId}
      onOpenChange={(open) => {
        if (!loading && !open) setDeleteId(null)
      }}
    >
      <AlertDialogContent >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
            onClick={deleteItems}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Newdeletemodel
