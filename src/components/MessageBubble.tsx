import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    createdAt?: Date
}

interface MessageBubbleProps {
    message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user"

    return (
        <div
            className={cn(
                "flex w-full items-start gap-4 py-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm",
                    isUser ? "bg-blue-600" : "bg-green-600"
                )}
            >
                {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
            </div>

            <div
                className={cn(
                    "relative flex max-w-[80%] flex-col gap-1 rounded-lg px-4 py-3 text-sm shadow-sm",
                    isUser
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                )}
            >
                <div className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
                    {message.content}
                </div>
            </div>
        </div>
    )
}
