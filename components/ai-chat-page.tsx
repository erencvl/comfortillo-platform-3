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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-pink-500 rounded-2xl opacity-15 blur-lg" />
            <div className="relative bg-gradient-to-br from-primary/10 to-pink-500/10 p-3 rounded-xl border border-primary/20">
              <Bot className="h-7 w-7 text-primary" aria-label={t("aiChat.title")} />
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground tracking-tight" aria-label={t("aiChat.title")}>
              {t("aiChat.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("aiChat.subtitle")}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs">
          <Badge
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 font-medium"
            aria-label={t("aiChat.badge.active")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {t("aiChat.badge.active")}
          </Badge>
          <Badge
            className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-medium"
            aria-label={t("aiChat.badge.anonymous")}
          >
            {t("aiChat.badge.anonymous")}
          </Badge>
          <Badge
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-0.5 font-medium"
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
        className="border-0 luxury-card rounded-2xl animate-scale-in overflow-hidden"
        aria-label={t("aiChat.chatTitle")}
      >
        <CardHeader className="border-b border-border/40 py-3 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground">{t("aiChat.chatTitle")}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg px-2.5 py-1 transition-colors"
              aria-label={t("aiChat.clearChat")}
            >
              {t("aiChat.clearChat")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div
            className="h-[480px] overflow-y-auto p-4 space-y-4"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                role="article"
                aria-label={`${message.role === "user" ? "User" : "AI assistant"} message at ${formatTime(message.timestamp)}`}
              >
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-pink-500 shadow-md shadow-primary/20"
                      : "bg-gradient-to-br from-primary/10 to-pink-500/10 border border-primary/20"
                  }`}
                  aria-hidden="true"
                >
                  {message.role === "user" ? (
                    <User className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <Heart className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>

                <div className={`max-w-[75%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary to-pink-500 text-white shadow-md shadow-primary/15"
                        : "bg-secondary/80 text-foreground border border-border/30"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 px-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2.5" role="status" aria-label="AI is typing">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-primary/10 to-pink-500/10 border border-primary/20 flex items-center justify-center">
                  <Heart className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-secondary/80 border border-border/30 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Suggestions */}
          <ChatSuggestions onSuggestionClick={handleSuggestionClick} isVisible={messages.length <= 1} />

          {/* Input */}
          <div className="border-t border-border/40 p-3">
            <form onSubmit={handleSubmit} className="flex gap-2" aria-label="Chat message form">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("aiChat.placeholder")}
                disabled={isLoading}
                className="flex-1 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30"
                maxLength={500}
                aria-label="Message input"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="luxury-button-primary rounded-xl px-4"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">
              {t("aiChat.footer")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
