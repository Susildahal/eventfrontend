"use client"

import React from 'react'
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title: string
  titledesc?: string
  linkname?: string
  link?: string
  onClickLink?: () => void
  additionalActions?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ title, titledesc = '', linkname = '', link = '', onClickLink, additionalActions }) => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex items-center gap-4'>
        <ArrowLeft className='h-5 w-5 cursor-pointer text-[#7A5E39]' onClick={handleBack} />
        <div className='flex flex-col'>
          <h2 className='text-lg font-medium'>{title}</h2>
          {titledesc && <p className='text-sm text-muted-foreground'>{titledesc}</p>}
        </div>
      </div>

      <div className='flex justify-end items-center gap-2'>
        {additionalActions}
        {onClickLink ? (
          <Button variant="default" size="sm" onClick={onClickLink}>
            <Plus className='mr-2 h-4 w-4' />{linkname || 'Add'}
          </Button>
        ) : link ? (
          <Link href={link}>
            <Button variant="default" size="sm">
              <Plus className='mr-2 h-4 w-4' />{linkname || 'Add'}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  )
}

export default Header
