'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
// import AutoPlay from "embla-carousel-autoplay"
import messages from "@/data/messages.json" // sample data 
import { useSession } from "next-auth/react"

const Home = () => {
  const { data: session } = useSession()
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">Dive into the world of Anonynmous Conversations</h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg"> Explore the Secret Message </p>
        </section>
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-lg font-semibold">{message.content}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Go to Dashboard Button */}
        <div className="mt-8">
          <Link href={session ? "/dashboard" : "#"} passHref>
            <button
              className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${session ? "bg-[#124E66] hover:bg-[#124E66]/80 text-white" : "bg-gray-500 cursor-not-allowed"
                }`}
              disabled={!session} // Disable if no session
            >
              Go to Dashboard
            </button>
          </Link>
        </div>

      </main>
      {/* <footer className="text-center p-4 md:p-6">
        @2024 Secret Message. All rights are reserved.
      </footer> */}
    </>
  )
}

export default Home