"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Send, Bot, User, Sparkles } from "lucide-react"
import { ChatSuggestions } from "./chat-suggestions"
import { EmergencyResources } from "./emergency-resources"
import { useLanguage } from "@/hooks/use-language"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export function AIChatPage() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showEmergencyResources, setShowEmergencyResources] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const savedMessages = localStorage.getItem("comfortillo-chat-history")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      setMessages([
        {
          role: "assistant",
          content: t("aiChat.welcome"),
          timestamp: Date.now(),
        },
      ])
    }
  }, [t])

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem("comfortillo-chat-history", JSON.stringify(newMessages))
  }

  const checkForCrisisKeywords = (text: string) => {
    const crisisKeywords = [
      "intihar",
      "kendimi öldür",
      "ölmek istiyorum",
      "yaşamak istemiyorum",
      "kendime zarar",
      "acı çekmek",
      "dayanamıyorum",
      "son vermek",
    ]
    return crisisKeywords.some((keyword) => text.toLowerCase().includes(keyword))
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    if (checkForCrisisKeywords(input)) {
      setShowEmergencyResources(true)
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      let assistantMessage = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const data = JSON.parse(line.slice(2))
              if (data.type === "text-delta") {
                assistantMessage += data.textDelta

                const streamingMessages = [
                  ...updatedMessages,
                  {
                    role: "assistant" as const,
                    content: assistantMessage,
                    timestamp: Date.now(),
                  },
                ]
                setMessages(streamingMessages)
              }
            } catch (e) {
              // Ignore parsing errors for streaming data
            }
          }
        }
      }

      const finalMessages = [
        ...updatedMessages,
        {
          role: "assistant" as const,
          content: assistantMessage,
          timestamp: Date.now(),
        },
      ]
      setMessages(finalMessages)
      saveMessages(finalMessages)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: t("aiChat.error"),
        timestamp: Date.now(),
      }
      const errorMessages = [...updatedMessages, errorMessage]
      setMessages(errorMessages)
      saveMessages(errorMessages)
      setShowEmergencyResources(true)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    const welcomeMessage: Message = {
      role: "assistant",
      content: t("aiChat.welcome"),
      timestamp: Date.now(),
    }
    setMessages([welcomeMessage])
    localStorage.removeItem("comfortillo-chat-history")
    setShowEmergencyResources(false)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#D4C8BB] via-[#E8E2DA] to-[#C4B8AB] p-3 rounded-2xl shadow-lg">
            <Bot
              className="h-8 w-8 text-[#6B6258]"
              aria-label={t("aiChat.title")}
            />
          </div>
          <div>
            <h1
              className="text-3xl font-bold luxury-text luxury-text-glow"
              aria-label={t("aiChat.title")}
            >
              {t("aiChat.title")}
            </h1>
            <p className="luxury-muted font-light">{t("aiChat.subtitle")}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm">
          <Badge
            className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 border-2 rounded-full px-3 py-1"
            aria-label={t("aiChat.badge.active")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {t("aiChat.badge.active")}
          </Badge>
          <Badge
            className="bg-gradient-to-r from-[#F0EBE5] to-[#E8E2DA] text-[#6B6258] border-[#D4C8BB] border-2 rounded-full px-3 py-1"
            aria-label={t("aiChat.badge.anonymous")}
          >
            {t("aiChat.badge.anonymous")}
          </Badge>
          <Badge
            className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 border-2 rounded-full px-3 py-1"
            aria-label={t("aiChat.badge.nonjudgmental")}
          >
            {t("aiChat.badge.nonjudgmental")}
          </Badge>
        </div>
      </div>

      {/* Emergency Resources */}
      {showEmergencyResources && <EmergencyResources />}

      {/* Chat Interface */}
      <Card
        className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in"
        aria-label={t("aiChat.chatTitle")}
      >
        <CardHeader className="border-b border-luxury-warm/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg luxury-text">{t("aiChat.chatTitle")}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="luxury-text hover:text-red-600 border-luxury-warm bg-transparent rounded-xl luxury-hover"
              aria-label={t("aiChat.clearChat")}
            >
              {t("aiChat.clearChat")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div
            className="h-[500px] overflow-y-auto p-4 space-y-4"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                role="article"
                aria-label={`${message.role === "user" ? "User" : "AI assistant"} message at ${formatTime(message.timestamp)}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-[#D4C8BB] to-[#BDB1A4]"
                      : "bg-gradient-to-br from-[#D4C8BB] via-[#E8E2DA] to-[#C4B8AB]"
                  }`}
                  aria-hidden="true"
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-[#3D352C]" />
                  ) : (
                    <Heart className="h-4 w-4 text-[#6B6258]" />
                  )}
                </div>

                <div className={`max-w-[70%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#F0EBE5] to-[#E8E2DA] text-[#3D352C]"
                        : "luxury-card luxury-text"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs luxury-muted mt-1 px-2">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                className="flex items-start gap-3"
                role="status"
                aria-label="AI is typing"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#D4C8BB] via-[#E8E2DA] to-[#C4B8AB] flex items-center justify-center shadow-sm">
                  <Heart className="h-4 w-4 text-[#6B6258]" />
                </div>
                <div className="luxury-card rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#C4B8AB] rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-[#C4B8AB] rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#C4B8AB] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Suggestions */}
          <ChatSuggestions onSuggestionClick={handleSuggestionClick} isVisible={messages.length <= 1} />

          {/* Input */}
          <div className="border-t border-luxury-warm/30 p-4">
            <form
              onSubmit={handleSubmit}
              className="flex gap-3"
              aria-label="Chat message form"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("aiChat.placeholder")}
                disabled={isLoading}
                className="flex-1 border-luxury-warm focus:border-[#BDB1A4] focus:ring-[#BDB1A4] rounded-full luxury-text bg-luxury-beige/50"
                maxLength={500}
                aria-label="Message input"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="luxury-button-primary rounded-full px-6 luxury-hover shadow-lg"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs luxury-muted mt-2 text-center">
              {t("aiChat.footer")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
