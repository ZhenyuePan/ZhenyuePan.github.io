'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'

export default function PageContent() {
  const downwaveRef = useRef<HTMLDivElement>(null)
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const [isAnimationEnded, setIsAnimationEnded] = useState(false)
  const [isVideo1Ended, setIsVideo1Ended] = useState(false)
  const [showBlogContent, setShowBlogContent] = useState(false)

  const searchParams = useSearchParams()
  const skipIntro = searchParams.get('skip_intro') === 'true'

  useEffect(() => {
    const downwave = downwaveRef.current
    const video1 = video1Ref.current
    const video2 = video2Ref.current

    if (!video1 || !video2) return

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
    <main>
      <style jsx>{`
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
      {showBlogContent && (
        <div className="container mx-auto px-4 py-8 animate-[in_1.5s_forwards]">
          <Navbar />
          <header className="text-center mb-12">
          </header>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Blog content can be added here */}
          </motion.div>
        </div>
      )}
    </main>
  )
}