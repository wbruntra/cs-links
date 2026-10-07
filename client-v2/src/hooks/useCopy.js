import { useState, useRef, useEffect } from 'preact/hooks'
import { copyText } from '../clipboard.js'

// Tracks a copy button's state: 'idle' -> 'copied' | 'failed' -> back to 'idle' after 2s.
export function useCopy() {
  const [status, setStatus] = useState('idle')
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy(text) {
    const ok = await copyText(text)
    setStatus(ok ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 2000)
  }

  return [status, copy]
}
