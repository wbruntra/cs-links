const elements = ['copy-button', 'copy-button-2']

elements.forEach((el) => {
  document.getElementById(el).addEventListener('click', function () {
    copyToClipboard(document.getElementById(`${el}-target`), el)
  })
})

async function copyToClipboard(elem, buttonName) {
  const copyButton = document.getElementById(buttonName)
  const textToCopy = elem.value || elem.textContent
  
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy)
      showCopySuccess(copyButton)
      return true
    } else {
      // Fallback to older method for non-secure contexts
      return fallbackCopyToClipboard(textToCopy, copyButton)
    }
  } catch (error) {
    console.error('Copy failed:', error)
    // Try fallback method
    return fallbackCopyToClipboard(textToCopy, copyButton)
  }
}

function fallbackCopyToClipboard(text, copyButton) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  document.body.appendChild(textarea)
  
  // Select and copy the text
  const currentFocus = document.activeElement
  textarea.focus()
  textarea.select()
  
  let succeed = false
  try {
    succeed = document.execCommand('copy')
  } catch (e) {
    console.error('Fallback copy failed:', e)
    succeed = false
  }
  
  // Clean up
  document.body.removeChild(textarea)
  
  // Restore focus
  if (currentFocus && typeof currentFocus.focus === 'function') {
    currentFocus.focus()
  }
  
  if (succeed) {
    showCopySuccess(copyButton)
  } else {
    showCopyError(copyButton)
  }
  
  return succeed
}

function showCopySuccess(copyButton) {
  copyButton.classList.remove('button-secondary')
  copyButton.classList.add('button-success')
  copyButton.textContent = 'Copied!'
  
  // Reset button after 2 seconds
  setTimeout(() => {
    copyButton.classList.remove('button-success')
    copyButton.classList.add('button-secondary')
    copyButton.textContent = 'Share Link'
  }, 2000)
}

function showCopyError(copyButton) {
  copyButton.classList.remove('button-secondary')
  copyButton.classList.add('button-error')
  copyButton.textContent = 'Copy Failed'
  
  // Reset button after 2 seconds
  setTimeout(() => {
    copyButton.classList.remove('button-error')
    copyButton.classList.add('button-secondary')
    copyButton.textContent = 'Share Link'
  }, 2000)
}
