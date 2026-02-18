import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/SidebarContext"

export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect("/")
    }

    // @ts-ignore
    const userId = session.user.id

    const chats = await prisma.chat.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
    })

    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
                <Sidebar chats={chats} className="truncate" />
                <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-white dark:bg-gray-900 transition-colors">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

