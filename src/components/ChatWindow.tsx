"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageBubble } from "./MessageBubble"
import { ChatInput } from "./ChatInput"
import { Image, BookOpen, Pencil, Lightbulb, PanelLeftOpen } from "lucide-react"
import { useSidebar } from "./SidebarContext"
import { ModelSelector } from "./ModelSelector"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

interface ChatWindowProps {
    chatId?: string
    initialMessages?: Message[]
}

export function ChatWindow({ chatId, initialMessages = [] }: ChatWindowProps) {
    const router = useRouter()
    const { isOpen, toggle } = useSidebar()
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (content: string) => {
        const tempId = Date.now().toString()
        const userMessage: Message = { id: tempId, role: "user", content }

        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    chatId,
                }),
            })

            if (!response.ok) throw new Error("Failed to send message")

            const data = await response.json()

            // If we didn't have a chatId, the backend created one. 
            // We should probably redirect to the new chat URL to persist context.
            if (!chatId && data.chatId) {
                router.push(`/chat/${data.chatId}`)
                router.refresh()
            }

            const assistantMessage: Message = {
                id: data.id,
                role: "assistant",
                content: data.content,
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error(error)
            // Show error in UI
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <ModelSelector />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                        <div className="mb-8 rounded-full bg-white/10 p-4 dark:bg-white/5">
                            <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 blur-xl opacity-50 absolute" />
                            {/* Logo or Icon could go here, for now just the text */}
                        </div>
                        <h2 className="text-4xl font-semibold mb-8 text-gray-900 dark:text-white tracking-tight">
                            What can I help with?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl px-4">
                            <button
                                onClick={() => handleSend("Create an image of a futuristic city")}
                                className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-left shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md"
                            >
                                <span className="text-blue-500"><Image className="h-6 w-6" /></span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Create images</span>
                            </button>
                            <button
                                onClick={() => handleSend("Tell me something interesting about space")}
                                className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-left shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md"
                            >
                                <span className="text-orange-500"><BookOpen className="h-6 w-6" /></span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Learn something</span>
                            </button>
                            <button
                                onClick={() => handleSend("Help me write a professional email")}
                                className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-left shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md"
                            >
                                <span className="text-yellow-500"><Pencil className="h-6 w-6" /></span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Write or edit</span>
                            </button>
                            <button
                                onClick={() => handleSend("Plan a trip to Paris")}
                                className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-left shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md"
                            >
                                <span className="text-green-500"><Lightbulb className="h-6 w-6" /></span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Step-by-step help</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
    )
}
