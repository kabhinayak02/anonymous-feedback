'use client'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast'
import { verifyCodeSchema } from '@/schemas/verifyCodeSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);
    const [verifyCode, setVerifyCode] = useState();

    // zode implementation 
    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema)
    })

    // Fetching verify code when the page first time loading
    useEffect(() => {
        const fetchVerificationCode = async () => {
            if (!params.username) return;
            try {
                const response = await axios.post('/api/get-verify-code', {
                    username: params.username
                });
                setVerifyCode(response.data.code);
            } catch (error) {
                console.error("Error fetching verification code:", error);
            }
        };

        fetchVerificationCode();
    }, [params.username]); 

    const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            });

            toast({
                title: "Success",
                description: response.data.message
            });

            router.replace('/sign-in')
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: 'destructive'
            })
        }
    }
    /*
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lh shadow-md">
                <div className="text-center">
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Verify Your Account
                    </h1>
                    <p className='mb-4'>Enter the verification code, send to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
        
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Verify Your Account
                    </h1>
                    <p className='mb-4'>Enter the verification code sent to your email.</p>
                    
                    {verifyCode && (
                        <>
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
                                <p>We're experiencing issues with our email service. Please use the verification code displayed below to complete your account verification.</p>
                            </div>
                            <div className="bg-gray-200 text-gray-800 p-2 rounded-md mb-4">
                                <p>Your verification code is: <strong>{verifyCode}</strong></p>
                            </div>
                        </>
                    )}
                </div>
    
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
    */

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#212A31] via-[#2E3944] to-[#212A31] px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#2E3944] rounded-xl shadow-2xl border border-[#748D92]/20 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#124E66]/10 rounded-full blur-3xl -z-1 animate-float"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#124E66]/10 rounded-full blur-3xl -z-1 animate-float" style={{ animationDelay: '2s' }}></div>
    
                <div className="text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#D3D9D4] mb-4">
                        Verify Your Account
                    </h1>
                    <p className="text-[#748D92] mb-8">Enter the verification code sent to your email.</p>
    
                    {verifyCode && (
                        <>
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
                                <p>We&apos;re experiencing issues with our email service. Please use the verification code displayed below to complete your account verification.</p>
                            </div>
                            <div className="bg-gray-200 text-gray-800 p-2 rounded-md mb-4">
                                <p>Your verification code is: <strong>{verifyCode}</strong></p>
                            </div>
                        </>
                    )}
                </div>
    
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#D3D9D4]">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your code"
                                            {...field}
                                            className="bg-[#212A31] border-[#748D92]/20 text-[#D3D9D4] focus:border-[#124E66] focus:ring-[#124E66]/50 placeholder-[#748D92] rounded-lg"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-rose-400" />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] transition-all duration-200 shadow-lg hover:shadow-[#124E66]/20 border border-[#748D92]/20 hover:border-[#124E66] rounded-lg py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default VerifyAccount