import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // @ts-ignore
    const userId = session.user.id

    const chats = await prisma.chat.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(chats)
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // @ts-ignore
    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    // Verify ownership
    const chat = await prisma.chat.findUnique({
        where: { id },
    })

    if (!chat || chat.userId !== userId) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    await prisma.chat.delete({
        where: { id },
    })

    return NextResponse.json({ success: true })
}
