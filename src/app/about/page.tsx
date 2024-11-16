import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Twitch, X } from 'lucide-react'
import Navbar from '@/components/navbar'
export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 ">
      <Navbar />
    
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/profile.jpg?height=150&width=150"
              alt="my profile"
              width={150}
              height={150}
              className="rounded-full border-4 border-primary"
              priority
            />
            <h1 className="text-3xl font-bold mt-4">Kafka</h1>
            <p className="text-xl text-muted-foreground">Master / Harbin Institute of Technology</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg">
              Welcome to my about page! I&apos;m a passionate Coder with 1 years of experience in CS Master. 
              I specialize in FullStack.
            </p>
            
            <p className="text-lg">
              When I&apos;m not studying, you can find me watch animate. 
              I&apos;m always eager to learn new things and take on challenging projects.
            </p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-2">Skills</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>C++</li>
              <li>Skill 2</li>
              <li>Skill 3</li>
              <li>Skill 4</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Me</h2>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon">
                <a href="https://github.com/ZhenyuePan" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <p>or mail 664945264@qq.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}