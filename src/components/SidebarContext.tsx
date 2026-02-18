"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
    isOpen: boolean
    toggle: () => void
    close: () => void
    open: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    // Default to open on desktop, closed on mobile would be handled by media queries usually,
    // but for "collapse" feature, we assume desktop user wants to toggle it.
    // Initial state: true (open)
    const [isOpen, setIsOpen] = useState(true)

    const toggle = () => setIsOpen((prev) => !prev)
    const close = () => setIsOpen(false)
    const open = () => setIsOpen(true)

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}
