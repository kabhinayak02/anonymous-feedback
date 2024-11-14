'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, Loader2, EyeOffIcon } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from "react"

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // zode implementation 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive"
        });
      }

      if (result?.url) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  /*
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Secret Messages
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
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
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
  
  */

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#212A31] via-[#2E3944] to-[#212A31] px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#2E3944] rounded-xl shadow-2xl border border-[#748D92]/20 relative overflow-hidden">
        {/* Optional: Decorative element */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#124E66]/10 rounded-full blur-3xl -z-1"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#124E66]/10 rounded-full blur-3xl -z-1"></div>

        <div className="text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#D3D9D4] mb-4">
            Welcome Back to Secret Messages
          </h1>
          <p className="text-[#748D92] mb-8">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#D3D9D4]">Email/Username</FormLabel>
                  <Input
                    placeholder="email/username"
                    {...field}
                    className="bg-[#212A31] border-[#748D92]/20 text-[#D3D9D4] 
                    focus:border-[#124E66] focus:ring-[#124E66]/50 
                    placeholder-[#748D92] rounded-lg"
                  />
                  <FormMessage className="text-red-400" />
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
                      type={showPassword ? "text" : "password"}
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
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8 relative z-10">
          <p className="text-[#748D92]">
            Not a member yet?{' '}
            <Link
              href="/sign-up"
              className="text-[#124E66] hover:text-[#D3D9D4] transition-colors duration-200 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Forget Password feature */}
        {/* <div className="mt-6 text-center relative z-10">
          <Link
            href="/forgot-password"
            className="text-[#748D92] hover:text-[#D3D9D4] text-sm transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default Page;