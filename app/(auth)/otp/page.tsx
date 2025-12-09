'use client';

import React, { useRef, useEffect, useState, startTransition, ClipboardEvent, ChangeEvent, KeyboardEvent, FC } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '../../config/axiosInstance';

interface OtpFormValues {
    otp: string[];
}

interface AxiosResponse {
    status: number;
    data?: {
        message?: string;
    };
}

interface AxiosError {
    response?: {
        status: number;
        data?: {
            message?: string;
        };
    };
}

const Otp: FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    
    // State management
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isResendLoading, setIsResendLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [resendSuccess, setResendSuccess] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(120);
    const [canResend, setCanResend] = useState<boolean>(false);
    const [attempts, setAttempts] = useState<number>(0);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [isClient, setIsClient] = useState<boolean>(false);
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize component
    useEffect(() => {
        setIsClient(true);
        
        if (!email) {
            startTransition(() => router.push('/otp'));
        }
        startTimer();
        return () => clearTimer();
    }, [email, router]);

    useEffect(() => {
        inputRefs.current = Array(6).fill(null).map((_, i) => inputRefs.current[i] || null);
    }, []);

    // Timer functions
    const startTimer = (): void => {
        setCanResend(false);
        setTimer(120);
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const clearTimer = (): void => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    // Format timer display
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle resend OTP
    const handleResendOtp = async (): Promise<void> => {
        if (!canResend || isResendLoading || isBlocked) return;

        setIsResendLoading(true);
        setError('');
        setResendSuccess(false);

        try {
            const response: AxiosResponse = await axiosInstance.post('/users/forgot-password', { email: email });
            
            if (response.status === 200 || response.status === 201) {
                setResendSuccess(true);
                setAttempts(0);
                startTimer();
                
                setTimeout(() => {
                    setResendSuccess(false);
                }, 3000);
            } else {
                throw new Error(response.data?.message || 'Failed to resend OTP');
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError.response?.data?.message || 'Failed to resend OTP. Please try again.');
            
            if (axiosError.response?.status === 429) {
                setIsBlocked(true);
                setTimeout(() => setIsBlocked(false), 300000);
            }
        } finally {
            setIsResendLoading(false);
        }
    };

    // Validation schema
    const validationSchema = Yup.object().shape({
        otp: Yup.array()
            .of(Yup.string().matches(/^\d{1}$/, 'Only digits allowed').nullable())
            .test('is-complete', 'Please enter the complete 6-digit OTP', (value) => 
                value && value.filter(Boolean).length === 6
            )
    });

    // Enhanced input handling
    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
        setFieldValue: (field: string, value: any) => void,
        values: OtpFormValues
    ): void => {
        const { value } = e.target;
        
        if (error) setError('');
        if (!/^\d*$/.test(value)) return;
        
        const newOtp = [...values.otp];
        newOtp[index] = value.slice(0, 1);
        setFieldValue('otp', newOtp);
        
        if (value && index < 5) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 10);
        }
    };

    // Enhanced keydown handling
    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        index: number,
        values: OtpFormValues,
        setFieldValue: (field: string, value: any) => void
    ): void => {
        if (e.key === 'Backspace') {
            if (!values.otp[index] && index > 0) {
                setTimeout(() => {
                    inputRefs.current[index - 1]?.focus();
                    const newOtp = [...values.otp];
                    newOtp[index - 1] = '';
                    setFieldValue('otp', newOtp);
                }, 10);
            } else if (values.otp[index]) {
                const newOtp = [...values.otp];
                newOtp[index] = '';
                setFieldValue('otp', newOtp);
            }
        }
        
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Enhanced paste handling
    const handlePaste = (
        e: ClipboardEvent<HTMLDivElement>,
        setFieldValue: (field: string, value: any) => void
    ): void => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim().replace(/\s/g, '');
        
        if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.split('').slice(0, 6);
            const newOtp = [...digits, ...Array(6 - digits.length).fill('')];
            setFieldValue('otp', newOtp);
            
            const focusIndex = Math.min(digits.length, 5);
            setTimeout(() => {
                inputRefs.current[focusIndex]?.focus();
            }, 10);
        }
    };

    // Enhanced form submission
    const handleSubmit = async (
        values: OtpFormValues,
        { setSubmitting, setFieldValue }: FormikHelpers<OtpFormValues>
    ): Promise<void> => {
        setError('');
        setIsLoading(true);
        setSuccess(false);

        try {
            const otpString = values.otp.join('');
            const response: AxiosResponse = await axiosInstance.post('/users/checkotp', {
                email: email,
                otp: otpString
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setAttempts(0);
                clearTimer();
                localStorage.setItem("flag", "true");

                setTimeout(() => {
                    startTransition(() => router.push(`/changepassword?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpString)}`));
                }, 15);
            } else {
                throw new Error(response.data?.message || 'Invalid OTP');
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            
            setFieldValue('otp', Array(6).fill(''));
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
            
            if (axiosError.response?.status === 400) {
                setError('Invalid OTP. Please check and try again.');
            } else if (axiosError.response?.status === 410) {
                setError('OTP has expired. Please request a new one.');
                setCanResend(true);
                setTimer(0);
                clearTimer();
            } else if (newAttempts >= 5) {
                setError('Too many failed attempts. Please request a new OTP.');
                setCanResend(true);
                setTimer(0);
                clearTimer();
            } else {
                setError(
                    axiosError.response?.data?.message || 
                    'Verification failed. Please try again.'
                );
            }
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-slate-950">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm dark:shadow-xl border border-gray-200 dark:border-slate-700">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                        Verify Email
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Enter the 6-digit code sent to:
                    </p>
                    <p className="text-sm font-medium text-black dark:text-white">
                        {email}
                    </p>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <p className="text-sm text-green-600 dark:text-green-400">Verified! Redirecting...</p>
                    </div>
                )}

                {resendSuccess && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                        <p className="text-sm text-blue-600 dark:text-blue-400">New code sent!</p>
                    </div>
                )}

                {!success && (
                    <Formik
                        initialValues={{ otp: Array(6).fill('') }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-4">
                                
                                {/* OTP Input */}
                                <div>
                                    <div 
                                        className="flex gap-2 justify-center mb-2" 
                                        onPaste={(e) => handlePaste(e, setFieldValue)}
                                    >
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <Field
                                                key={index}
                                                innerRef={(el: HTMLInputElement) => {
                                                    inputRefs.current[index] = el;
                                                }}
                                                name={`otp[${index}]`}
                                                type="text"
                                                maxLength="1"
                                                inputMode="numeric"
                                                className={`
                                                    w-10 h-10 text-center font-medium border rounded-md
                                                    text-black dark:text-white
                                                    bg-white dark:bg-slate-800
                                                    focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 focus:border-transparent
                                                    ${values.otp[index] ? 'border-gray-400 dark:border-gray-600' : 'border-gray-300 dark:border-gray-700'}
                                                    ${error ? 'border-red-300 dark:border-red-700' : ''}
                                                `}
                                                value={values.otp[index]}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, index, setFieldValue, values)}
                                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index, values, setFieldValue)}
                                                autoComplete="off"
                                                disabled={isLoading}
                                            />
                                        ))}
                                    </div>
                                    <ErrorMessage
                                        name="otp"
                                        component="div"
                                        className="text-xs text-red-600 dark:text-red-400 text-center"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isLoading || values.otp.filter(Boolean).length !== 6}
                                    className="w-full py-2.5 px-4 mt-1 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-sm font-medium rounded-md transition focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 dark:focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Code'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                )}

                {/* Footer */}
                <div className="mt-4 text-center space-y-2">
                    {/* Timer or Resend */}
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResendLoading || isBlocked}
                            className="w-full py-1.5 px-3 mt-1 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-sm font-medium rounded-md transition"
                        >
                            {isBlocked
                                ? 'Try again later'
                                : isResendLoading
                                ? 'Sending...'
                                : 'Resend code'}
                        </button>
                    ) : timer > 0 ? (
                        <div className="flex flex-col items-center">
                            {/* Circular Live Timer */}
                            <div className="relative w-16 h-16">
                                <svg
                                    className="w-full h-full transform -rotate-90"
                                    viewBox="0 0 36 36"
                                >
                                    {/* Background track */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.9155"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-gray-300 dark:text-gray-700"
                                    />
                                    {/* Progress ring */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.9155"
                                        fill="none"
                                        strokeWidth="2"
                                        strokeDasharray="100"
                                        strokeDashoffset={100 - (timer / 120) * 100}
                                        className="text-gray-800 dark:text-gray-200 transition-colors duration-300"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    {formatTime(timer)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Resend in</p>
                        </div>
                    ) : null}
                    
                    {/* Back Link */}
                    <div>
                        <Link 
                            href="/forgotpassword" 
                            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                            ← Back to forgot password
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Otp;