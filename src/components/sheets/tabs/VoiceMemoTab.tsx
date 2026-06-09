import { generateId } from '../../../lib/uuid'
import { useState, useRef } from 'react'
import { useUIStore } from '../../../store/ui'
import { MicIcon } from '../../icons'

interface Props {
  habitId: string
}

type MicState = 'idle' | 'recording' | 'denied' | 'unavailable'

export function VoiceMemoTab({ habitId: _ }: Props) {
  const [micState, setMicState] = useState<MicState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [clips, setClips] = useState<{ id: string; url: string; duration: number }[]>([])
  const recorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const pushToast = useUIStore((s) => s.pushToast)

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicState('unavailable')
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
        setClips((prev) => [...prev, { id: generateId(), url, duration: seconds }])
        stream.getTracks().forEach((t) => t.stop())
        pushToast('Voice memo saved', 'success')
      }
      recorderRef.current = recorder
      recorder.start()
      setMicState('recording')
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch (err) {
      const name = (err as DOMException).name
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setMicState('denied')
      } else {
        setMicState('unavailable')
      }
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setMicState('idle')
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'

  return (
    <div className="pb-4">
      <div className="flex flex-col items-center gap-3 py-4">
        {micState === 'recording' && (
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: '#e05858', animation: 'pulse 1s infinite' }}
            />
            <span className="font-mono text-sm text-ink">{fmt(seconds)}</span>
          </div>
        )}

        <button
          onClick={micState === 'recording' ? stopRecording : startRecording}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-none"
          style={{
            background: micState === 'recording' ? '#e05858' : 'var(--accent)',
            boxShadow: 'var(--shadow-md)',
            opacity: micState === 'denied' || micState === 'unavailable' ? 0.4 : 1,
          }}
        >
          {micState === 'recording' ? (
            <div className="h-5 w-5 rounded bg-white" />
          ) : (
            <MicIcon size={24} style={{ color: '#fff' }} />
          )}
        </button>

        {micState === 'idle' && <p className="text-xs text-ink-3">Tap to record</p>}
        {micState === 'recording' && <p className="text-xs text-ink-3">Tap to stop</p>}
        {micState === 'denied' && (
          <div
            className="max-w-[260px] rounded-[10px] border px-4 py-2.5 text-center"
            style={{
              background: 'color-mix(in srgb, #e05858 12%, var(--surface))',
              borderColor: 'color-mix(in srgb, #e05858 30%, transparent)',
            }}
          >
            <p className="m-0 mb-1 text-[13px] font-semibold" style={{ color: '#e05858' }}>
              Microphone access denied
            </p>
            <p className="m-0 text-xs text-ink-3">
              Allow microphone access in your browser settings and try again.
            </p>
          </div>
        )}
        {micState === 'unavailable' && (
          <div
            className="max-w-[260px] rounded-[10px] border px-4 py-2.5 text-center"
            style={{
              background: 'color-mix(in srgb, #e05858 12%, var(--surface))',
              borderColor: 'color-mix(in srgb, #e05858 30%, transparent)',
            }}
          >
            <p className="m-0 mb-1 text-[13px] font-semibold" style={{ color: '#e05858' }}>
              Microphone not available
            </p>
            <p className="m-0 text-xs text-ink-3">
              {isSecure
                ? 'No microphone was found on this device.'
                : 'Voice recording requires a secure connection. Open the app over HTTPS to use this feature.'}
            </p>
          </div>
        )}
      </div>

      {clips.length > 0 && (
        <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="flex items-center gap-2.5 rounded-[10px] bg-surface-2 px-3 py-2"
            >
              <audio controls src={clip.url} className="h-8 flex-1" />
              <span className="text-[11px] whitespace-nowrap text-ink-3">{fmt(clip.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
