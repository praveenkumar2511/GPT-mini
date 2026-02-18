import { useState, useRef, useEffect } from "react"
import { SendHorizontal, Loader2, Plus, ArrowUp, AudioWaveform } from "lucide-react"

interface ChatInputProps {
    onSend: (content: string) => void
    isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [input, setInput] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        onSend(input)
        setInput("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [input])

    const hasContent = input.trim().length > 0;

    return (
        <div className="mx-auto w-full max-w-3xl px-4 md:px-0 bg-transparent pb-4">
            <div className="relative flex items-end w-full p-3 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-[26px] border-none shadow-sm dark:shadow-none ring-1 ring-black/5 dark:ring-white/10 transition-shadow focus-within:ring-black/10 dark:focus-within:ring-white/20">
                {/* Plus Button */}
                <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors mb-0.5"
                    title="Add attachment"
                >
                    <Plus className="h-5 w-5" />
                </button>

                <form onSubmit={handleSubmit} className="flex-1 flex items-end mx-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything"
                        rows={1}
                        disabled={isLoading}
                        className="w-full resize-none bg-transparent py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none disabled:opacity-50"
                        style={{ maxHeight: "200px", minHeight: "44px" }}
                    />
                </form>

                <div className="flex items-center gap-2 mb-0.5">
                    {!hasContent ? (
                        <>
                            {/* Mic Button */}
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="sr-only">Voice input</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                            </button>

                            {/* Voice Mode Button (Black) */}
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
                            >
                                <span className="sr-only">Voice Mode</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h2.25A1.875 1.875 0 017.5 5.625v12.75A1.875 1.875 0 015.625 20.25h-2.25A1.875 1.875 0 011.5 18.375V5.625zM21 7.875c0-1.036.84-1.875 1.875-1.875h.75A1.875 1.875 0 0125.5 7.875v8.25a1.875 1.875 0 01-1.875 1.875h-.75A1.875 1.875 0 0121 16.125V7.875zM10.125 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.036.84 1.875 1.875 1.875h3.75A1.875 1.875 0 0015.75 20.625V3.375A1.875 1.875 0 0013.875 1.5h-3.75z" clipRule="evenodd" />
                                    {/* Fallback to simple bars if svg path is complex/wrong, using simplified bars representation */}
                                    <rect x="3" y="8" width="2" height="8" rx="1" />
                                    <rect x="7" y="5" width="2" height="14" rx="1" />
                                    <rect x="11" y="2" width="2" height="20" rx="1" />
                                    <rect x="15" y="5" width="2" height="14" rx="1" />
                                    <rect x="19" y="8" width="2" height="8" rx="1" />
                                </svg>
                                {/* Actually let's use Lucide icon if possible, but the path above was a mix. Let's use AudioWaveform from lucide */}
                                <AudioWaveform className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !input.trim()}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-80 disabled:opacity-50 transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <ArrowUp className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                Gemini can make mistakes, so double-check it.
            </div>
        </div>
    )
}
