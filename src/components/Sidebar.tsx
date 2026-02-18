"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { Plus, Search, MessageSquare, Menu, X, LogOut, User, Image as ImageIcon, LayoutGrid, Code, FolderOpen, PanelLeftClose, Sparkles } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { ThemeToggle } from "./ThemeToggle"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "next-auth/react"
import { useSidebar } from "./SidebarContext"

interface Chat {
    id: string
    title: string
    createdAt: Date
}

interface SidebarProps {
    chats: Chat[]
    className?: string
}

export function Sidebar({ chats: initialChats, className }: SidebarProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const { isOpen: isDesktopOpen, toggle: toggleDesktop, close: closeDesktop } = useSidebar()
    const [searchQuery, setSearchQuery] = useState("")
    const [chats, setChats] = useState(initialChats)

    const filteredChats = chats.filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        // Optimistic update
        setChats(chats.filter((c) => c.id !== id))

        try {
            const res = await fetch(`/api/chats?id=${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")

            router.refresh()
            if (window.location.pathname === `/chat/${id}`) {
                router.push("/chat")
            }
        } catch (error) {
            console.error(error)
            // Revert if failed (optional, but good UX)
            setChats(initialChats)
        }
    }

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed left-4 top-4 z-50 md:hidden p-2 bg-white dark:bg-gray-900 rounded-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm"
            >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
                    // Mobile: slide in/out
                    isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
                    // Desktop: override mobile styles
                    "md:relative md:translate-x-0",
                    // Desktop collapse: width transition
                    isDesktopOpen ? "md:w-64" : "md:w-20",
                    className
                )}
            >
                <div className={cn("flex h-full flex-col p-4", isDesktopOpen ? "w-64" : "w-20 items-center")}>
                    <div className={cn("mb-8 flex items-center", isDesktopOpen ? "justify-between" : "justify-center flex-col gap-4")}>
                        {isDesktopOpen ? (
                            <Link
                                href="/chat"
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"
                            >
                                <MessageSquare className="h-6 w-6" />
                                <span>Gemini Next</span>
                            </Link>
                        ) : (
                            <Link href="/chat" className="flex items-center justify-center mb-2">
                                <MessageSquare className="h-6 w-6 text-gray-900 dark:text-white" />
                            </Link>
                        )}

                        <button
                            onClick={toggleDesktop}
                            className="hidden md:flex p-1 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            title={isDesktopOpen ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            {isDesktopOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5 rotate-180" />}
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <Link
                        href="/chat"
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                            "flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 mb-4 shadow-sm",
                            isDesktopOpen ? "px-4 py-3" : "h-10 w-10 justify-center p-0 rounded-full"
                        )}
                        title="New Chat"
                    >
                        <Plus className="h-4 w-4" />
                        {isDesktopOpen && <span>New chat</span>}
                    </Link>

                    {/* Search Input - Hide in Rail Mode */}
                    {isDesktopOpen && (
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
                            />
                        </div>
                    )}

                    {/* Apps Navigation */}
                    <div className={cn("mb-6 space-y-1", !isDesktopOpen && "flex flex-col items-center")}>
                        <Link
                            href="/chat"
                            className={cn("flex items-center gap-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800", isDesktopOpen ? "w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300" : "p-2 justify-center text-gray-500 dark:text-gray-400")}
                            title="ChatGPT"
                        >
                            <Sparkles className="h-4 w-4" />
                            {isDesktopOpen && <span>ChatGPT</span>}
                        </Link>
                        <Link
                            href="/images"
                            className={cn("flex items-center gap-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800", isDesktopOpen ? "w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300" : "p-2 justify-center text-gray-500 dark:text-gray-400")}
                            title="Images"
                        >
                            <ImageIcon className="h-4 w-4" />
                            {isDesktopOpen && <span>Images</span>}
                        </Link>
                        <Link
                            href="/apps"
                            className={cn("flex items-center gap-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800", isDesktopOpen ? "w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300" : "p-2 justify-center text-gray-500 dark:text-gray-400")}
                            title="Apps"
                        >
                            <LayoutGrid className="h-4 w-4" />
                            {isDesktopOpen && <span>Apps</span>}
                        </Link>
                        <Link
                            href="/codex"
                            className={cn("flex items-center gap-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800", isDesktopOpen ? "w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300" : "p-2 justify-center text-gray-500 dark:text-gray-400")}
                            title="Codex"
                        >
                            <Code className="h-4 w-4" />
                            {isDesktopOpen && <span>Codex</span>}
                        </Link>
                        <Link
                            href="/projects"
                            className={cn("flex items-center gap-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800", isDesktopOpen ? "w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300" : "p-2 justify-center text-gray-500 dark:text-gray-400")}
                            title="Projects"
                        >
                            <FolderOpen className="h-4 w-4" />
                            {isDesktopOpen && <span>Projects</span>}
                        </Link>
                    </div>

                    {isDesktopOpen && (
                        <div className="px-3 mb-2">
                            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                Your chats
                            </div>
                        </div>
                    )}

                    {/* Chat List - Hide in rail mode */}
                    {isDesktopOpen && (
                        <div className="flex-1 overflow-y-auto space-y-1">
                            {filteredChats.map((chat) => (
                                <SidebarItem
                                    key={chat.id}
                                    id={chat.id}
                                    title={chat.title}
                                    onDelete={handleDelete}
                                    onSelect={() => setIsMobileOpen(false)}
                                />
                            ))}
                            {filteredChats.length === 0 && (
                                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                                    No chats found
                                </div>
                            )}
                        </div>
                    )}

                    {/* Spacer for rail mode to push profile to bottom if list is hidden */}
                    {!isDesktopOpen && <div className="flex-1" />}

                    {/* User Profile */}
                    <div className={cn("border-t border-gray-200 dark:border-gray-800 pt-4 mt-2", !isDesktopOpen && "flex flex-col items-center")}>
                        <div className={cn("flex items-center gap-3", isDesktopOpen ? "px-2" : "px-0 justify-center flex-col gap-4")}>
                            {session?.user?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={session.user.image}
                                    alt="User"
                                    className="h-8 w-8 rounded-full"
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                            )}

                            {isDesktopOpen && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        {session?.user?.name || "User"}
                                    </p>
                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            )}

                            <ThemeToggle />
                            {isDesktopOpen && (
                                <button
                                    onClick={() => signOut()}
                                    className="rounded p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                                    title="Sign out"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    )
}
