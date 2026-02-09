"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}
import { ChatSuggestions } from "./chat-suggestions"

interface AIChatProps {
  apiEndpoint: string
  title: string
  description: string
  placeholder?: string
  emptyStateHeading?: string
  emptyStateDescription?: string
}

export const AIChat: React.FC<AIChatProps> = ({
  apiEndpoint,
  title,
  description,
  placeholder = "Ask me anything...",
  emptyStateHeading = "How can I help you today?",
  emptyStateDescription = "Start by asking a question.",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({ target: { value: suggestion } } as any)
    setShowSuggestions(false)
  }

  const handleInputChangeWithSuggestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e)
    if (e.target.value.trim()) {
      setShowSuggestions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const aiMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
      }

      setMessages([...updatedMessages, aiMessage])
    } catch (error: any) {
      console.error("Failed to fetch AI response:", error)
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={chatContainerRef} className="h-[500px] overflow-y-auto space-y-2 p-2">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-semibold">{emptyStateHeading}</h3>
              <p>{emptyStateDescription}</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 rounded-md",
                  message.role === "user"
                    ? "bg-secondary text-secondary-foreground self-end"
                    : "bg-muted text-muted-foreground self-start",
                )}
              >
                {message.content}
              </div>
            ))
          )}
        </div>
        <ChatSuggestions
          onSuggestionClick={handleSuggestionClick}
          isVisible={showSuggestions && messages.length <= 1}
        />
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={handleInputChangeWithSuggestions}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
