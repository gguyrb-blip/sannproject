'use client'
// lib/typing — Sasani's replies typed out letter by letter, the owner's ask.
// A copy of kiosk-app's lib/typing (separate repo); keep the two in step.
//
// Only what she says NOW types. A conversation restored after paying, the
// lines already on screen, a question the guest has answered and that moved up
// into the transcript — all appear whole; seeing old messages type themselves
// again reads as a glitch. So typing is claimed by a token, once:
//   - a string key ("q:<question>") for a line that has no object of its own;
//   - an object marked with markFresh() when it was created in this visit
//     (a reply that has just arrived), and only that object.
// A token claimed a moment ago may claim again (React's development mode
// mounts everything twice); after that it is spent.
//
// Typing goes by grapheme — a Thai consonant keeps its vowel and tone marks —
// and takes 0.5 to 2 seconds whatever the length, a few letters a frame for a
// long reply. Renderers draw the untyped rest invisibly (see cut()), so a
// bubble is its final size from the start and nothing below it jumps.
// A phone set to reduce motion gets every reply whole.
import React, { useEffect, useMemo, useState } from 'react'

export type TypeToken = string | object | null | undefined

const fresh = new WeakSet<object>()
const claimedObj = new WeakMap<object, number>()
const claimedKey = new Map<string, number>()
const AGAIN_MS = 1500

/** Mark a reply that has just arrived, so it types when it is first drawn. */
export function markFresh<T extends object>(o: T): T { fresh.add(o); return o }

function claim(token: TypeToken): boolean {
  if (token == null) return false
  const now = Date.now()
  if (typeof token === 'string') {
    const t = claimedKey.get(token)
    if (t == null) { claimedKey.set(token, now); return true }
    return now - t < AGAIN_MS
  }
  if (!fresh.has(token)) return false
  const t = claimedObj.get(token)
  if (t == null) { claimedObj.set(token, now); return true }
  return now - t < AGAIN_MS
}

/** Split into what a reader sees as one letter. */
export function graphemes(s: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string }> } }).Segmenter
  if (!Seg) return Array.from(s)
  return Array.from(new Seg('th', { granularity: 'grapheme' }).segment(s), x => x.segment)
}

/**
 * How many letters of `text` to show: Infinity once typed (or when it is not
 * this token's turn to type). `text` is the reply as written — its **bold**
 * markers do not count.
 */
export function useTyping(text: string, token: TypeToken): number {
  const play = useMemo(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
    return claim(token)
  }, [token])
  const total = useMemo(() => graphemes(text.replace(/\*\*/g, '')).length, [text])
  const [shown, setShown] = useState(play ? 0 : Infinity)
  useEffect(() => {
    if (!play || total === 0) { setShown(Infinity); return }
    const duration = Math.min(2000, Math.max(500, total * 28))
    const step = Math.max(1, Math.ceil(total * 16 / duration))
    let n = 0
    setShown(0)
    const id = setInterval(() => {
      n += step
      if (n >= total) { clearInterval(id); setShown(Infinity) } else setShown(n)
    }, 16)
    return () => clearInterval(id)
  }, [play, total])
  return shown
}

/**
 * A budget of letters spent across the pieces of one reply, in order. Each
 * piece shows what is left of the budget and draws the rest invisibly.
 */
export function typingBudget(limit: number) {
  let left = limit
  return (s: string): React.ReactNode => {
    if (left === Infinity) return s
    const g = graphemes(s)
    const shown = g.slice(0, left).join('')
    const rest = g.slice(left).join('')
    left = Math.max(0, left - g.length)
    return rest
      ? React.createElement(React.Fragment, null, shown, React.createElement('span', { style: { visibility: 'hidden' }, 'aria-hidden': true }, rest))
      : shown
  }
}
