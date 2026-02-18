"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
    id: string
    title: string
    onDelete: (id: string) => void
    onSelect?: () => void
}

export function SidebarItem({ id, title, onDelete, onSelect }: SidebarItemProps) {
    const pathname = usePathname()
    const isActive = pathname === `/chat/${id}`

    return (
        <div
            className={cn(
                "group relative flex items-center gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                isActive ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
        >
            <Link
                href={`/chat/${id}`}
                className="flex flex-1 items-center gap-3 overflow-hidden"
                onClick={onSelect}
            >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{title}</span>
            </Link>

            {/* Delete button visible on hover or if active */}
            <button
                onClick={(e) => {
                    e.preventDefault()
                    onDelete(id)
                }}
                className={cn(
                    "opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400",
                    isActive && "opacity-100" // Always show delete on active item? Maybe only hover. Let's stick to hover for cleaner look, but mobile might need persistent.
                    // For now, hover is fine.
                )}
                title="Delete chat"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {/* Adding a gradient fade for long text? Tailwind 'truncate' handles ellipsis. */}
        </div>
    )
}
