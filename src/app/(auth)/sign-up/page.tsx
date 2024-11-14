'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, Loader2, EyeOffIcon } from "lucide-react"

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  // zode implementation 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);

          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  /*
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lh shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Secret Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p className={`test-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : ('Signup')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
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
            Join Secret Message
          </h1>
          <p className="text-[#748D92] mb-8">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-[#D3D9D4]">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      className="bg-[#212A31] border-[#748D92]/20 text-[#D3D9D4] 
                      focus:border-[#124E66] focus:ring-[#124E66]/50 
                      placeholder-[#748D92] rounded-lg"
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin absolute right-3 top-9 text-[#124E66]" />
                  )}
                  <p className={`text-sm mt-1 ${usernameMessage === "Username is unique"
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                    }`}>
                    {usernameMessage}
                  </p>
                  <FormMessage className="text-rose-400" />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#D3D9D4]">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                      className="bg-[#212A31] border-[#748D92]/20 text-[#D3D9D4] 
                      focus:border-[#124E66] focus:ring-[#124E66]/50 
                      placeholder-[#748D92] rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-400" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#D3D9D4]">Password</FormLabel>
                  <div className="relative">
                    <Input
                      placeholder="password"
                      type={showPassword ? "text" : "password"} // Toggle between text and password input type
                      {...field}
                      className="bg-[#212A31] border-[#748D92]/20 text-[#D3D9D4] 
                        focus:border-[#124E66] focus:ring-[#124E66]/50 
                        placeholder-[#748D92] rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleTogglePassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#748D92]"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] 
              transition-all duration-200 shadow-lg hover:shadow-[#124E66]/20 
              border border-[#748D92]/20 hover:border-[#124E66] 
              rounded-lg py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#D3D9D4]" />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Sign up'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8 relative z-10">
          <p className="text-[#748D92]">
            Already a member?{' '}
            <Link
              href="/sign-in"
              className="text-[#124E66] hover:text-[#D3D9D4] transition-colors duration-200 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* For professsional Look */}
        {/* <div className="mt-6 text-center text-sm text-[#748D92] relative z-10">
          <p>By signing up, you agree to our</p>
          <div className="space-x-2 mt-1">
            <Link href="/terms" className="text-[#124E66] hover:text-[#D3D9D4] transition-colors duration-200">
              Terms of Service
            </Link>
            <span>and</span>
            <Link href="/privacy" className="text-[#124E66] hover:text-[#D3D9D4] transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Page;