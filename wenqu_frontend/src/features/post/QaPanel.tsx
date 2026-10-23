import { useEffect, useRef, useState } from 'react'

import { Markdown } from '@/features/post/Markdown'
import { streamSse } from '@/shared/api/sse'
import { Button, Icon } from '@/shared/ui'

import styles from './QaPanel.module.css'

const PRESETS = ['总结这篇知文的要点', '这篇文章解决了什么问题？', '有哪些值得深入学习的概念？']

interface QaTurn {
  question: string
  answer: string
  state: 'streaming' | 'done' | 'error'
}

export function QaPanel({ postId }: { postId: string }) {
  const [turns, setTurns] = useState<QaTurn[]>([])
  const [question, setQuestion] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const streaming = turns.some((t) => t.state === 'streaming')

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turns])

  // 卸载或切换文章时中止未完成的流
  useEffect(() => {
    setTurns([])
    return () => abortRef.current?.abort()
  }, [postId])

  const ask = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed || streaming) return
    setQuestion('')
    setTurns((prev) => [...prev, { question: trimmed, answer: '', state: 'streaming' }])

    const controller = new AbortController()
    abortRef.current = controller
    const url = `/api/v1/knowposts/${postId}/qa/stream?question=${encodeURIComponent(trimmed)}&topK=5&maxTokens=1024`

    void streamSse(url, {
      signal: controller.signal,
      onMessage: (chunk) => {
        setTurns((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.state === 'streaming') next[next.length - 1] = { ...last, answer: last.answer + chunk }
          return next
        })
      },
      onDone: () => {
        setTurns((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.state === 'streaming') next[next.length - 1] = { ...last, state: 'done' }
          return next
        })
      },
      onError: () => {
        setTurns((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.state === 'streaming') next[next.length - 1] = { ...last, state: 'error' }
          return next
        })
      },
    })
  }

  const stop = () => abortRef.current?.abort()

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <Icon name="sparkle" size={17} />
        <h2 className={styles.title}>AI 伴读</h2>
        <span className={styles.hint}>答案源自本文，可溯源</span>
      </header>

      <div className={styles.scroll} ref={scrollRef}>
        {turns.length === 0 && (
          <div className={styles.presets}>
            {PRESETS.map((p) => (
              <button key={p} type="button" className={styles.preset} onClick={() => ask(p)}>
                {p}
              </button>
            ))}
          </div>
        )}

        {turns.map((turn, i) => (
          <div key={i} className={styles.turn}>
            <div className={styles.question}>{turn.question}</div>
            <div className={styles.answer}>
              {turn.answer ? (
                <Markdown>{turn.answer}</Markdown>
              ) : (
                turn.state === 'streaming' && <span className={styles.thinking}>思考中…</span>
              )}
              {turn.state === 'streaming' && turn.answer && <span className={styles.cursor} />}
              {turn.state === 'error' && <span className={styles.error}>回答中断，请重试</span>}
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.composer}>
        <textarea
          className={styles.input}
          rows={2}
          placeholder="就这篇知文提问…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              ask(question)
            }
          }}
        />
        {streaming ? (
          <Button size="sm" variant="secondary" icon="stop" onClick={stop}>
            停止
          </Button>
        ) : (
          <Button size="sm" icon="send" disabled={!question.trim()} onClick={() => ask(question)}>
            提问
          </Button>
        )}
      </footer>
    </aside>
  )
}
