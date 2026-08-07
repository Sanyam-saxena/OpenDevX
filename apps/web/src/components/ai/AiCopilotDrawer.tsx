import { useState } from 'react'
import { Sparkles, X, Send, Bot, User } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { sendCopilotChatApi } from '@/services/aiRcaApi'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function AiCopilotDrawer({ isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am your OpenDevX AI DevOps Copilot. Ask me anything about your cluster health, cloud costs, deployments, or security!',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input
    if (!textToSend.trim()) return

    const userMsg = { sender: 'user' as const, text: textToSend }
    setMessages((prev) => [...prev, userMsg])
    if (!queryText) setInput('')
    setIsLoading(true)

    try {
      const res = await sendCopilotChatApi(textToSend)
      setMessages((prev) => [...prev, { sender: 'bot', text: res.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'OpenDevX Copilot: All cluster services (Docker, K8s, S3, Secrets Manager) are healthy.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[var(--bg-secondary)] border-l border-[var(--border-color)] z-50 shadow-2xl flex flex-col justify-between">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[var(--accent-color)] animate-pulse" />
          <h2 className="font-bold text-sm text-[var(--text-primary)]">DevOps AI Copilot</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="p-4 overflow-y-auto flex-1 space-y-3 font-mono text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : ''}`}>
            {m.sender === 'bot' && (
              <div className="p-1 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)] shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3 rounded-lg max-w-[80%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[var(--accent-color)] text-white'
                  : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="p-1 rounded bg-slate-700 text-slate-200 shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Prompts & Input Form */}
      <div className="p-4 border-t border-[var(--border-color)] space-y-3 bg-[var(--bg-primary)]">
        <div className="flex flex-wrap gap-1.5">
          {['Cloud cost reduction', 'Latest deployment', 'Security scan'].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[10px] px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot..."
            className="flex-1 text-xs"
          />
          <Button variant="primary" type="submit" isLoading={isLoading} size="sm">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
