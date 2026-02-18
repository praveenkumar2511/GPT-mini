"use client"

import * as React from "react"
import { Check, ChevronDown, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModelSelector() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedModel, setSelectedModel] = React.useState("ChatGPT")

    const toggleDropdown = () => setIsOpen(!isOpen)

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 rounded-lg py-2 px-3 text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <span>{selectedModel}</span>
                <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-[340px] z-50 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2 animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-1">
                            {/* Option 1: Plus (Upgrade) */}
                            <button
                                onClick={() => {
                                    setSelectedModel("ChatGPT Plus")
                                    setIsOpen(false)
                                }}
                                className="group flex w-full items-center justify-between gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        <Sparkles className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">ChatGPT Plus</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Our smartest model & more</div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-2.5 py-0.5 text-xs font-semibold text-gray-900 dark:text-white transition-colors cursor-pointer group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
                                        Upgrade
                                    </span>
                                </div>
                            </button>

                            {/* Option 2: Default (Selected) */}
                            <button
                                onClick={() => {
                                    setSelectedModel("ChatGPT")
                                    setIsOpen(false)
                                }}
                                className="group flex w-full items-center justify-between gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        <Zap className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">ChatGPT</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">For quick tasks & answers</div>
                                    </div>
                                </div>
                                {selectedModel === "ChatGPT" && (
                                    <div className="shrink-0">
                                        <Check className="h-5 w-5 text-gray-900 dark:text-white" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
