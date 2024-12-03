import { Card, CardContent } from "@/components/ui/card"
import Navbar from '@/components/navbar'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />

      <Card className="max-w-2xl mx-auto animate-fade-in">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">施工中，敬请期待。</h1>
          </CardContent>
      </Card>
    </div>
  )
}