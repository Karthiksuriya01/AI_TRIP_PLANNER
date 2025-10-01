"use client"

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Send } from 'lucide-react';
import React, { useState } from 'react';

type Message = {
  role: string,
  content: string
}

const ChatBox = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState<string>();
  const onSend = async () => {
    if (!userInput?.trim()) return

    setUserInput('')
    const newMsg: Message = {
      role: 'user',
      content: userInput
    }

    setMessages((prev: Message[]) => [...prev, newMsg])

    const result = await axios.post('/api/ai', {
      messages: [...messages, newMsg]
    })
    setMessages((prev: Message[]) => [...prev, {
      role: 'assistant',
      content: result?.data?.resp
    }])

    console.log(result.data)
  }

  return (
    <div className='h-[90vh] flex flex-col'>
      {/* display messages */}
      <section className='flex-1 overflow-auto p-4'>
        {/* User Message - Right aligned */}
        <div className="flex justify-end mt-2">
          <div className='max-w-lg text-white px-4 py-2 rounded-lg  bg-primary'>
            User Msg
          </div>
        </div>

        {/* Agent Message - Left aligned */}
        <div className="flex justify-start mt-2">
          <div className='max-w-lg bg-gray-100 px-4 py-2 rounded-lg'>
            Agent Message
          </div>
        </div>
      </section>

      {/* User Input Box */}
      <section>
        <div className='border rounded-2xl p-4 relative bg-background'>
          <Textarea
            className='w-full h-20 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
            placeholder="Type your message..."
            onChange={e => setUserInput(e.target.value)}
            value={userInput}
          />
          <Button size={'icon'} className='absolute right-6 bottom-6' onClick={onSend}>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;
