'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import "./globals.css"
import Navbar from '@/components/navbar'

export default function Index() {
  const downwaveRef = useRef<HTMLDivElement>(null)
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const [isAnimationEnded, setIsAnimationEnded] = useState(false)
  const [isVideo1Ended, setIsVideo1Ended] = useState(false)
  const [showBlogContent, setShowBlogContent] = useState(false)

  useEffect(() => {
    const downwave = downwaveRef.current
    const video1 = video1Ref.current
    const video2 = video2Ref.current

    if (!downwave || !video1 || !video2) return

    const handleAnimationEnd = () => {
      setIsAnimationEnded(true)
      video1.play().catch(error => console.error("Error playing video 1:", error))
      setTimeout(() => setShowBlogContent(true), 2000) // Show blog content after a short delay
    }

    const handleVideo1End = () => {
      setIsVideo1Ended(true)
      video2.play().catch(error => console.error("Error playing video 2:", error))
    }

    downwave.addEventListener('animationend', handleAnimationEnd)
    video1.addEventListener('ended', handleVideo1End)

    return () => {
      downwave.removeEventListener('animationend', handleAnimationEnd)
      video1.removeEventListener('ended', handleVideo1End)
    }
  }, [])
  const blogPosts = [
    { id: 1, title: "我的第一篇博客", excerpt: "这是我的第一篇博客文章，分享我的故事和经历。" },
    { id: 2, title: "我最喜欢的旅行目的地", excerpt: "探索我最喜欢的旅行地点，以及为什么它们如此特别。" },
    { id: 3, title: "学习新技能的经验", excerpt: "分享我学习新技能的过程和心得体会。" },
    { id: 4, title: "我的摄影之旅", excerpt: "记录我在摄影领域的探索和成长。" },
    { id: 5, title: "美食探险记", excerpt: "品尝各地美食，分享独特的味蕾体验。" },
    { id: 6, title: "工作与生活的平衡", excerpt: "探讨如何在繁忙的生活中找到平衡点。" },
  ]
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
  return (
    <main>
      <Navbar />
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
      
      <div 
        ref={downwaveRef}
        className="startwaves fixed flex justify-center h-[120vh] w-full bg-[#469ce5] -translate-y-[10vh] animate-[down_3s_ease-out_1s] z-[999]"
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

        <div 
          id="centertext" 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-[out_1.5s_3s_forwards]"
        >
          <h1>你好，我等待已久的人。</h1>
          <br /><p className="small-text">欢迎来到我的个人网站。<br />很高兴和你分享我的故事。</p>
        </div>
        {/* Uncomment the following line if you want to include the P3RE logo */}
        {/*<Image id="p3relogo" src="/P3RE.svg" alt="P3RE Logo" width={100} height={100} className="absolute right-[12%] top-1/2 -translate-y-1/2 opacity-0 animate-[in_1.5s_5s_forwards]" />*/}
      </div>
      {showBlogContent && (
        <div className="container mx-auto px-4 py-8 animate-[in_1.5s_forwards]">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Kafka&apos;s Blog</h1>
          </header>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogPosts.map(post => (
              <motion.div 
                key={post.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  transition: { duration: 0.2 } 
                }}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="text-blue-500 hover:text-blue-600 font-medium">
                    阅读更多
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </main>
  )
}