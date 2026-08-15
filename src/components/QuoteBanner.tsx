import { useEffect, useState } from 'react'

// Swap these for your own inside jokes / infamous callouts.
const quotes: { text: string; author: string }[] = [
  { text: "I'm just not having fun anymore", author: 'Matteo' },
  { text: "Don't fucking give me the bomb again", author: 'Andrew' },
  { text: 'Matteoooooo', author: 'Everyone at some point' },
  { text: 'Look at how much impact my death had', author: 'Paras' },
]

const FADE_MS = 300
const HOLD_MS = 6000

export function QuoteBanner() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let fade: ReturnType<typeof setTimeout>
    const rotate = setInterval(() => {
      setVisible(false) // fade out
      fade = setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length)
        setVisible(true) // fade the next one in
      }, FADE_MS)
    }, HOLD_MS)
    return () => {
      clearInterval(rotate)
      clearTimeout(fade)
    }
  }, [])

  const quote = quotes[index]

  return (
    <div className="mt-10 flex min-h-[7rem] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-8 text-center">
      <div
        className={
          'transition-opacity duration-300 ' +
          (visible ? 'opacity-100' : 'opacity-0')
        }
      >
        <p className="text-lg font-medium text-slate-200 sm:text-xl">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="mt-2 text-sm text-slate-500">— {quote.author}</p>
      </div>
    </div>
  )
}
