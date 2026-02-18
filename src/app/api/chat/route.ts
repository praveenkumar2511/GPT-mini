import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
console.log(genAI, "genAI");

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // @ts-ignore
        const userId = session.user.id
        const { content, chatId } = await req.json()
        console.log(content, chatId, ">>>>>>>>>>>>>>>>>>>>>")

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }

        let currentChatId = chatId

        // Create chat if not exists
        if (!currentChatId) {
            const title = content.split(" ").slice(0, 5).join(" ")
            const chat = await prisma.chat.create({
                data: {
                    title,
                    userId,
                },
            })
            currentChatId = chat.id
        } else {
            // Verify chat belongs to user
            const chat = await prisma.chat.findUnique({
                where: { id: currentChatId },
            })
            if (!chat || chat.userId !== userId) {
                return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 })
            }
        }

        // Save user message
        await prisma.message.create({
            data: {
                chatId: currentChatId,
                role: "user",
                content,
            },
        })

        // Get chat history for context (optional, but good for chat)
        const history = await prisma.message.findMany({
            where: { chatId: currentChatId },
            orderBy: { createdAt: "asc" },
            take: 20, // Limit context
        })

        // Prepare history for Gemini
        // Gemini format: parts: [{ text: "..." }], role: "user" | "model"
        const geminiHistory = history.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }))

        // Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const chat = model.startChat({
            history: geminiHistory.slice(0, -1), // Exclude the just added message? No, startChat history should use previous messages.
            // Wait, if I use sendMessage(content), I don't need to add the last message to history manually if I am using chat session.
            // But here I'm stateless per request mostly, recreating chat.
            // Actually `sendMessage` appends to history.
        })

        // If I use startChat with history, I should pass previous messages.
        // And then sendMessage(content).

        // Correct approach with history:
        // history should NOT include the current message I just saved? 
        // `startChat` history is "previous turns".
        // So distinct previous messages.

        const previousMessages = geminiHistory.slice(0, -1) // Excluding the one we just saved?
        // Wait, I saved the user message to DB.
        // If I pass it to sendMessage, I shouldn't pass it in history.

        // Let's rely on mapped history excluding the very last one if I am sending it now.
        // But `history` from DB includes the current message I just saved.

        const pastHistory = geminiHistory.filter((_, index) => index < geminiHistory.length - 1)

        const chatSession = model.startChat({
            history: pastHistory,
        })

        const result = await chatSession.sendMessage(content)
        const responseText = result.response.text()

        // Save assistant message
        const assistantMessage = await prisma.message.create({
            data: {
                chatId: currentChatId,
                role: "assistant", // DB uses 'assistant', Gemini uses 'model'
                content: responseText,
            },
        })

        return NextResponse.json({
            ...assistantMessage,
            chatId: currentChatId,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
