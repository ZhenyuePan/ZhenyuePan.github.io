'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
//import "./globals.css"

export default function AnimatedIntro() {
  const downwaveRef = useRef<HTMLDivElement>(null)
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const [isAnimationEnded, setIsAnimationEnded] = useState(false)
  const [isVideo1Ended, setIsVideo1Ended] = useState(false)

  useEffect(() => {
    const downwave = downwaveRef.current
    const video1 = video1Ref.current
    const video2 = video2Ref.current

    if (!downwave || !video1 || !video2) return

    const handleAnimationEnd = () => {
      setIsAnimationEnded(true)
      video1.play().catch(error => console.error("Error playing video 1:", error))
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

  return (
    <>
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
          <Image src="/img/waves/wave-1.svg" alt="Wave 1" width={1920} height={1080} />
          <Image src="/img/waves/wave-2.svg" alt="Wave 2" width={1920} height={1080} />
          <Image src="/img/waves/wave-3.svg" alt="Wave 3" width={1920} height={1080} />
          <Image src="/img/waves/wave-4.svg" alt="Wave 4" width={1920} height={1080} />
          <Image src="/img/waves/wave-5.svg" alt="Wave 5" width={1920} height={1080} id="shape" />
        </div>
      </div>
      <div id="videobg" className="w-full h-full">
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
        <video 
          ref={video1Ref}
          className="videos w-full h-full object-cover absolute"
          muted 
		  
          playsInline
        >
          <source src="/assset/fv_movie1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div 
          id="centertext" 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-[out_1.5s_3s_forwards]"
        >
          <h1>你好，我等待已久的人。</h1>
          <p>欢迎来到我的个人网站。<br />很高兴和你分享我的故事。</p>
        </div>
        {/* Uncomment the following line if you want to include the P3RE logo */}
        <Image id="p3relogo" src="/P3RE.svg" alt="P3RE Logo" width={100} height={100} className="absolute right-[12%] top-1/2 -translate-y-1/2 opacity-0 animate-[in_1.5s_5s_forwards]" />
      </div>
    </>
  )
}
