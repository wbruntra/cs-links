// Copies text to the clipboard, falling back to execCommand on insecure origins.
// Resolves true on success, false on failure.
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (!successful) return false
    }

    // Haptic feedback on mobile
    if (navigator.vibrate) navigator.vibrate(50)
    return true
  } catch (error) {
    console.error('Copy failed:', error)
    return false
  }
}
