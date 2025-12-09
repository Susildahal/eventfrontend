'use client'
import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import axiosInstance from '../../config/axiosInstance'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'



const page = () => {
    const [loading ,setLoading] =useState(false)
    const inatioanlValues = {
    email: '',
  }
    const router = useRouter();
    const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
  }),
  onsubmit = async (values: typeof inatioanlValues) => {
   try {
    setLoading(true)

    const response =  await axiosInstance.post('/users/forgot-password', values)
    if(response.status === 200){
            router.push(`/otp?email=${encodeURIComponent(values.email)}`);

    }
    
   } catch (error) {
    console.error('Forgot Password error:', error)
    
   } finally {
    setLoading(false);
   }
  }
  return (
    <div>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>
            <Formik
            initialValues={inatioanlValues}
            validationSchema={validationSchema}
            onSubmit={onsubmit}
            >   
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 w-full"
                    />
                    {errors.email && touched.email && ( 
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                </div>

                <Button type="submit" className="w-full mt-4" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Otp'}
                </Button>
               
                </form>
            )}
            </Formik>
            <Link href="/login">    
               <Button  variant="outline" className="w-full mt-4">
                Back to Login
                </Button>
            </Link>
        </div>
        </div>
      
    </div>
  )
}

export default page
