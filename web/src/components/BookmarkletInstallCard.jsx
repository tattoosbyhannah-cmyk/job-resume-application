// Shows a personalized bookmarklet URL with a copy button and
// browser-specific install instructions.

import { useState } from 'react'

export default function BookmarkletInstallCard({ name, url, description }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback for older browsers — select the text node
      const sel = window.getSelection()
      sel.removeAllRanges()
    }
  }

  return (
    <div className="card">
      <h3>{name}</h3>
      <p className="meta">{description}</p>

      <p><strong>Option 1: Drag to bookmarks bar</strong></p>
      <p>
        Show your bookmarks bar (View → Show Bookmarks Bar in most browsers),
        then drag this link onto it:
      </p>
      <p>
        <a className="btn" href={url}>
          📌 {name}
        </a>
      </p>

      <p style={{ marginTop: 16 }}><strong>Option 2: Create manually</strong></p>
      <ol>
        <li>Right-click your bookmarks bar → Add bookmark / New bookmark</li>
        <li>Name: <code>{name}</code></li>
        <li>URL: paste the code below</li>
      </ol>

      <div className="bookmarklet-box">{url}</div>
      <button type="button" className="btn secondary" onClick={handleCopy}>
        {copied ? '✓ Copied' : 'Copy code'}
      </button>
    </div>
  )
}
