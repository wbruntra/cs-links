import { useState, useRef, useEffect } from 'preact/hooks'
import { copyText } from '../clipboard.js'

const DEFAULT_LABEL = 'Share Link'

// Tracks the label of a copy button: 'Share Link' -> 'Copied!' | 'Copy Failed' -> back after 2s.
export function useCopy() {
  const [status, setStatus] = useState(DEFAULT_LABEL)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy(text) {
    const ok = await copyText(text)
    setStatus(ok ? 'Copied!' : 'Copy Failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus(DEFAULT_LABEL), 2000)
  }

  return [status, copy]
}
