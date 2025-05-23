import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
export default function About() {
  return (
      <Card className="max-w-lg mx-auto animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-3">
              <Image
                src="/profile.jpg?height=150&width=150"
                alt="my profile"
                width={125}
                height={125}
                className="rounded-full border-4 border-primary"
                priority
              />
              <h1 className="text-2xl font-bold">Kafka</h1>
              <p className='text-gray-500'>Master / Harbin Institute of Technology</p>
            </div>
            
            <div className="space-y-2">
              <p>
                Welcome to my about page! I&apos;m a passionate Coder with 1 years of experience in CS Master. 
                I specialize in C++/golang Backend and DataBase Core.
                my favorite game is bolders&apos;gate 3.
              </p>
              
              <p>
                When I&apos;m not studying, you can find me watch animate. 
                I&apos;m always eager to learn new things and take on challenging projects.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">Skills</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>C++</li>
                <li>linux</li>
                <li>react</li>
                <li>golang</li>
              </ul>
            </div>
          </CardContent>
      </Card>
    
  )
}