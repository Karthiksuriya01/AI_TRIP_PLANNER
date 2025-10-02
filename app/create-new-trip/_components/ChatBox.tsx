"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import GroupSizeUi from "./GroupSizeUi";
import BudgetType from "./BudgetType";
import DaysSelector from "./DaysSelector";

type Message = {
  role: "user" | "assistant";
  content: string;
  ui: string;
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [isFinal, setisFinal] = useState(false);

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  //for final
  useEffect(() => {
    const lastMsg = messages[messages.length-1];
    if(lastMsg?.ui == 'final')
    {
      setisFinal(true)
      setUserInput('OK, Great')
      onSend()
    }
      
  })

  const onSend = async () => {
    if (!userInput.trim()) return;

    const newMsg: Message = {
      role: "user",
      content: userInput,
      ui: ""
    };

    // Update messages first
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);

    try {
      const result = await axios.post("/api/ai", {
        messages: updatedMessages,  // Use the updated messages array
        isFinal: isFinal
      });

      console.log("API Response JSON:", result.data);
      
      // Update with assistant's response
      !isFinal && setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.data.resp || "No response received",
          ui: result?.data?.ui
        },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong.", ui: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const RenderGenerativeUi = (ui: string) => {
    if (ui === 'budget') {
      return <BudgetType onSelecteOption={(v) => {
        setUserInput(v);
        onSend();
      }} />
    } else if (ui === 'groupSize') {
      return <GroupSizeUi onSelecteOption={(v: string) => {
        setUserInput(v);
        onSend();
      }} />
    } else if (ui === 'tripDuration') {
      return <DaysSelector onSelecteOption={(v: string) => {
        setUserInput(v);
        onSend();
      }} />
    }
    // else if(ui == 'final')
    //   return 
    return null;
  }

  return (
    <div className="h-[90vh] flex flex-col">
      {/* Chat messages */}
      <section
        ref={chatRef}
        className="flex-1 overflow-auto p-4 space-y-3 rounded-lg"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-lg px-4 py-2 rounded-2xl text-sm shadow ${msg.role === "user"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800"
                }`}
            >
              {msg.content}
              {RenderGenerativeUi(msg.ui)}
              {/* {console.log(msg.ui)} */}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-2xl text-sm italic">
              Typing...
            </div>
          </div>
        )}
      </section>

      {/* User input */}
      <section className="mt-2">
        <div className="border rounded-2xl p-4 relative bg-background">
          <Textarea
            className="w-full h-20 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <Button
            size="icon"
            className="absolute right-6 bottom-6"
            onClick={onSend}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ChatBox;
