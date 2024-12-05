'use client'

import { useTransition } from 'react'
import { createComment } from '@/app/actions/createComment'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Youtube } from 'lucide-react'
export function ContactMe() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => createComment(formData))
  }

  return (
    <Card className="max-w-lg mx-auto animate-fade-in">
          <CardContent className="p-6">

    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <p>if any advice for my website,please feel free to contact me!</p>
        <br/>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 py-2">
            Send me a message
          </label>
          <input
            type="text"
            id="comment"
            name="comment"
            placeholder="Write your message"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
        <p className='py-2'>or you can contact me from ways under-listed.</p>
        <div className="flex space-x-4">
                <Button variant="outline" size="icon">
                  <a href="https://github.com/ZhenyuePan" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon">
                  <a href="https://space.bilibili.com/14904497?spm_id_from=333.788.0.0" target="_blank" rel="noopener noreferrer" aria-label="mail">
                    <Youtube className="h-5 w-5" />
                  </a>
                </Button>
              </div>
      </form>
    </div>
    </CardContent>
    </Card>

  );
}

