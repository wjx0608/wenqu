/* ============================================================
 * SSE 解析器：fetch + ReadableStream 手写解析 text/event-stream
 * 相比 EventSource 的优势：可用 AbortController 精确中止、可自定义头
 * 后端 Flux<String> 以 `data:<chunk>\n\n` 形式逐片推送纯文本
 * ============================================================ */

export interface StreamSseOptions {
  signal?: AbortSignal
  onMessage: (data: string) => void
  onError?: (error: unknown) => void
  onDone?: () => void
}

export async function streamSse(url: string, { signal, onMessage, onError, onDone }: StreamSseOptions): Promise<void> {
  try {
    const res = await fetch(url, { credentials: 'include', signal })
    if (!res.ok || !res.body) {
      throw new Error(`流式请求失败（${res.status}）`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // SSE 事件以空行分隔
      let boundary = buffer.indexOf('\n\n')
      while (boundary !== -1) {
        const rawEvent = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        for (const line of rawEvent.split('\n')) {
          if (line.startsWith('data:')) {
            onMessage(line.slice(5).replace(/^\s/, ''))
          }
        }
        boundary = buffer.indexOf('\n\n')
      }
    }

    // 流末尾可能残留未以空行结尾的事件
    if (buffer.trimStart().startsWith('data:')) {
      onMessage(buffer.trimStart().slice(5))
    }
    onDone?.()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      onDone?.()
      return
    }
    onError?.(error)
  }
}
