// Copy button whose label/colour reflects the status from useCopy().
export function CopyButton({ status, onCopy, icons = false, class: className = 'btn-copy', failClass = 'btn-danger', idleClass = 'btn-outline-secondary' }) {
  const copied = status === 'Copied!'
  const failed = status === 'Copy Failed'
  const cls = copied ? 'btn-success' : failed ? failClass : idleClass

  return (
    <button onClick={onCopy} class={`btn ${className} ${cls}`} type="button">
      {icons && <i class={`bi ${copied ? 'bi-check2' : failed ? 'bi-x-lg' : 'bi-clipboard'} me-1`}></i>}
      {status}
    </button>
  )
}
