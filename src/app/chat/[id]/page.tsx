import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { ChatWindow } from "@/components/ChatWindow"

interface ChatPageProps {
    params: {
        id: string
    }
}

export default async function ChatPage({ params }: ChatPageProps) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect("/")
    }

    // @ts-ignore
    const userId = session.user.id

    const chat = await prisma.chat.findUnique({
        where: { id: params.id },
        include: {
            messages: {
                orderBy: { createdAt: "asc" },
            },
        },
    })

    if (!chat) {
        notFound()
    }

    if (chat.userId !== userId) {
        redirect("/chat")
    }

    // Convert dates to strings or keep as Date?
    // Client components need serializable props usually.
    // Prisma Dates are Date objects. Server components can pass Date objects to Client components in Next.js 13+? 
    // Next.js warns about Date objects passed to client components.
    // The 'Message' interface in ChatWindow expects strings or handle Date?
    // Let's check ChatWindow definition. It expects `initialMessages: Message[]`.
    // MessageBubble uses `createdAt?: Date`.
    // I should serialize them or ensure ChatWindow handles Date.
    // Next.js recommends serializing.

    const serializedMessages = chat.messages.map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        // createdAt: msg.createdAt.toISOString() // if I need it
    }))

    return <ChatWindow key={chat.id} chatId={chat.id} initialMessages={serializedMessages} />
}
