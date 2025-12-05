"use client"

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import axiosInstance from '@/app/config/axiosInstance'

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

  const deleteItems = async () => {
    try {
      await axiosInstance.delete(`${endpoint}/${deleteId}`)
      if (onSuccess) onSuccess()  // refresh table or data
      setDeleteId(null)           // close modal
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={deleteItems}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Newdeletemodel
