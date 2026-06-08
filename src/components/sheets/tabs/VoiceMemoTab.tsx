import { useState, useRef } from 'react'
import { useUIStore } from '../../../store/ui'

interface Props {
  habitId: string
}

export function VoiceMemoTab({ habitId: _ }: Props) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [clips, setClips] = useState<{ id: string; url: string; duration: number }[]>([])
  const recorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const pushToast = useUIStore((s) => s.pushToast)

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      pushToast('Microphone not available', 'error')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setClips((prev) => [...prev, { id: crypto.randomUUID(), url, duration: seconds }])
        stream.getTracks().forEach((t) => t.stop())
        pushToast('Voice memo saved', 'success')
      }
      recorderRef.current = recorder
      recorder.start()
      setRecording(true)
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch {
      pushToast('Could not access microphone', 'error')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setRecording(false)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="pb-4">
      <div className="flex flex-col items-center gap-3 py-4">
        {recording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-mono text-text">{fmt(seconds)}</span>
          </div>
        )}
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors ${
            recording ? 'bg-red-500' : 'bg-accent'
          }`}
        >
          {recording ? (
            <div className="w-5 h-5 bg-white rounded" />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2H3v2a9 9 0 008 8.94V23h2v-2.06A9 9 0 0021 12v-2h-2z" />
            </svg>
          )}
        </button>
        <p className="text-xs text-muted">{recording ? 'Tap to stop' : 'Tap to record'}</p>
      </div>

      {clips.length > 0 && (
        <div className="space-y-2 max-h-48 scrollable">
          {clips.map((clip) => (
            <div key={clip.id} className="flex items-center gap-3 bg-parchment/60 rounded-lg px-3 py-2">
              <audio controls src={clip.url} className="h-8 flex-1" />
              <span className="text-xs text-muted whitespace-nowrap">{fmt(clip.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
