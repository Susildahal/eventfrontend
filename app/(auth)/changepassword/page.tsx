'use client'
import React, { useState } from 'react'
import axiosInstance from '../../config/axiosInstance';
import { useSearchParams } from 'next/navigation';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    interface FormValues {
        password: string;
        confirmPassword: string;
    }

    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const otp = searchParams.get('otp');
    console.log(otp, email)

    const initialValues = {
        password: '',
        confirmPassword: '',
    };

    const validationSchema = yup.object().shape({
        password: yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Required'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Passwords do not match')
            .required('Required'),
    });

    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);

    const handleSubmit = async (values: FormValues) => {
        try {
            const response = await axiosInstance.post('/users/reset-password', {
                email: email,
                otp: otp,
                newPassword: values.password,
            });
        if (response.status === 200) {
            router.push('/login');
          
        }

        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl border">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* PASSWORD */}
                            <div className="relative">
                                <Label htmlFor="password" className="mb-1">New Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showPwd ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
                                        onClick={() => setShowPwd(!showPwd)}
                                    >
                                        {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {touched.password && errors.password && (
                                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                                )}
                            </div>


                            {/* CONFIRM PASSWORD */}
                            <div className="relative">
                                <Label htmlFor="confirmPassword" className="mb-1">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPwd ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
                                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                                    >
                                        {showConfirmPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>


                            <Button
                                type="submit"
                                className="w-full py-5 text-[16px]"
                            >
                                Change Password
                            </Button>

                        </form>
                    )}
                </Formik>
                <div className=' pt-4'>
                    <Link href="/login">
  <Button
                             variant='outline'
                                className="w-full py-5 text-[16px]"
                            >
                              Back
                            </Button>
                    </Link>
                            </div>
            </div>
        </div>
    );
};

export default Page;
