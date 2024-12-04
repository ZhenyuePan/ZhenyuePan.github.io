'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'
import { ScrollIndicator } from '@/components/scrollIndicator'
export default function PageContent() {
  const downwaveRef = useRef<HTMLDivElement>(null)
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAnimationEnded, setIsAnimationEnded] = useState(false)
  const [isVideo1Ended, setIsVideo1Ended] = useState(false)
  const [showBlogContent, setShowBlogContent] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)

  const searchParams = useSearchParams()
  const skipIntro = searchParams.get('skip_intro') === 'true'

  useEffect(() => {
    const downwave = downwaveRef.current
    const video1 = video1Ref.current
    const video2 = video2Ref.current

    if (!video1 || !video2) return

    const handleScrollDown = () => {
      if (scrollContainerRef.current && currentSection < 1) {
        setCurrentSection(1)
        scrollContainerRef.current.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        })
      }
    }
    const startVideo1 = () => {
      setIsAnimationEnded(true)
      video1.play().catch(error => console.error("Error playing video 1:", error))
      setTimeout(() => setShowBlogContent(true), 2000)
    }

    const handleVideo1End = () => {
      setIsVideo1Ended(true)
      video2.play().catch(error => console.error("Error playing video 2:", error))
    }
    video1.addEventListener('ended', handleVideo1End)


    
    if (skipIntro) {
      startVideo1()
    } else if (downwave) {
      const handleAnimationEnd = () => {
        setIsAnimationEnded(true)
        startVideo1()
      }
      downwave.addEventListener('animationend', handleAnimationEnd)
      return () => downwave.removeEventListener('animationend', handleAnimationEnd)
    }

    return () => video1.removeEventListener('ended', handleVideo1End)
  }, [skipIntro])

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault()
      const container = scrollContainerRef.current
      if (!container) return

      const delta = event.deltaY
      const scrollAmount = window.innerHeight
      const maxScroll = container.scrollHeight - container.clientHeight

      if (delta > 0 && currentSection < 1) {
        // Scrolling down
        setCurrentSection(1)
        container.scrollTo({
          top: scrollAmount,
          behavior: 'smooth'
        })
      } else if (delta < 0 && currentSection > 0) {
        // Scrolling up
        setCurrentSection(0)
        container.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const container = scrollContainerRef.current
      if (!container) return

      if (event.key === 'ArrowDown' && currentSection < 1) {
        event.preventDefault()
        setCurrentSection(1)
        container.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        })
      } else if (event.key === 'ArrowUp' && currentSection > 0) {
        event.preventDefault()
        setCurrentSection(0)
        container.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false })
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [currentSection])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 overflow-hidden">
      <style jsx global>{`
        html, body {
          overflow: hidden;
        }
        @keyframes down {
          0% { transform: translateY(-10vh); }
          100% { transform: translateY(110vh); }
        }
        @keyframes out {
          100% { opacity: 0; display: none; }
        }
        @keyframes in {
          100% { opacity: 1; }
        }
      `}</style>
      
     

      <div ref={scrollContainerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        <section className="h-screen snap-start">
          {!skipIntro && (
            <div 
              ref={downwaveRef}
              className="startwaves fixed flex justify-center h-[120vh] w-full bg-[#469ce5] -translate-y-[10vh] animate-[down_3s_ease-out_1s] z-[998]"
              style={{ display: isAnimationEnded ? 'none' : 'flex' }}
            >
              <div className="waves absolute bottom-[120vh] w-full">
                <Image src="/waves/wave-1.svg" alt="Wave 1" width={1920} height={1080} />
                <Image src="/waves/wave-2.svg" alt="Wave 2" width={1920} height={1080} />
                <Image src="/waves/wave-3.svg" alt="Wave 3" width={1920} height={1080} />
                <Image src="/waves/wave-4.svg" alt="Wave 4" width={1920} height={1080} />
                <Image src="/waves/wave-5.svg" alt="Wave 5" width={1920} height={1080} id="shape" />
              </div>
            </div>
          )}

          <div id="videobg" className="w-full h-full">
            <video 
              ref={video1Ref}
              className="videos w-full h-full object-cover absolute"
              muted 
              playsInline
            >
              <source src="/assset/fv_movie1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <video 
              ref={video2Ref}
              className="videos w-full h-full object-cover absolute"
              muted 
              loop 
              playsInline
              style={{ display: isVideo1Ended ? 'block' : 'none' }}
            >
              <source src="/assset/fv_movie2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {!skipIntro && (
              
              <div 
                id="centertext" 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-[out_1.5s_3s_forwards]"
              >
                <h1>你好，我等待已久的人。</h1>
                <br /><p className="small-text">欢迎来到我的个人网站。<br />很高兴和你分享我的故事。</p>
              </div>
            )}
          </div>
        </section>

        {showBlogContent && (
          <section className="min-h-screen snap-start">
             <Navbar />
            <div className="animate-[in_1.5s_forwards]">
              {/* Portfolio Section */}
              <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">My Portfolio</h1>
                <motion.div 
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <BlogCard
                    imageSrc="/sakura/zhizhuzi.jpg"
                    title="建站指北"
                    description="如何用Next.js搭建属于自己的个人博客。"
                  />
                  <BlogCard
                    imageSrc="/sakura/myHeartDanger.jpg"
                    title="RoseDB"
                    description="一个轻量级的、基于bitcask的数据库内核"
                  />
                  <BlogCard
                    imageSrc="/sakura/littlePeach.jpg"
                    title="TinyWebserver"
                    description="麻雀虽小，五脏俱全。"
                  />
                </motion.div>
              </div>

              {/* Footer */}
              <ScrollIndicator onClick={handleScrollDown} />

            </div>
          </section>
        )}
      </div>
    </main>
  )
}

interface BlogCardProps {
  imageSrc: string
  title: string
  description: string
}

function BlogCard({ imageSrc, title, description }: BlogCardProps) {
  return (
    <motion.div
      className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-48">
        <Image
          className="object-cover"
          src={imageSrc}
          alt={`${title} image`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <button className="w-full bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          阅读更多
        </button>
      </div>
    </motion.div>
  )
}



