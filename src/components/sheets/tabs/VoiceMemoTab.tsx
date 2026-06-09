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
    <div style={{ paddingBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          padding: '16px 0',
        }}
      >
        {micState === 'recording' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#e05858',
                animation: 'pulse 1s infinite',
              }}
            />
            <span style={{ fontSize: 14, fontFamily: 'monospace', color: 'var(--ink)' }}>
              {fmt(seconds)}
            </span>
          </div>
        )}

        <button
          onClick={micState === 'recording' ? stopRecording : startRecording}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: micState === 'recording' ? '#e05858' : 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            opacity: micState === 'denied' || micState === 'unavailable' ? 0.4 : 1,
          }}
        >
          {micState === 'recording' ? (
            <div style={{ width: 20, height: 20, background: '#fff', borderRadius: 4 }} />
          ) : (
            <MicIcon size={24} style={{ color: '#fff' }} />
          )}
        </button>

        {micState === 'idle' && (
          <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Tap to record</p>
        )}
        {micState === 'recording' && (
          <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Tap to stop</p>
        )}
        {micState === 'denied' && (
          <div
            style={{
              textAlign: 'center',
              padding: '10px 16px',
              borderRadius: 10,
              background: 'color-mix(in srgb, #e05858 12%, var(--surface))',
              border: '1px solid color-mix(in srgb, #e05858 30%, transparent)',
              maxWidth: 260,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: '#e05858', margin: '0 0 4px' }}>
              Microphone access denied
            </p>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: 0 }}>
              Allow microphone access in your browser settings and try again.
            </p>
          </div>
        )}
        {micState === 'unavailable' && (
          <div
            style={{
              textAlign: 'center',
              padding: '10px 16px',
              borderRadius: 10,
              background: 'color-mix(in srgb, #e05858 12%, var(--surface))',
              border: '1px solid color-mix(in srgb, #e05858 30%, transparent)',
              maxWidth: 260,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: '#e05858', margin: '0 0 4px' }}>
              Microphone not available
            </p>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: 0 }}>
              {isSecure
                ? 'No microphone was found on this device.'
                : 'Voice recording requires a secure connection. Open the app over HTTPS to use this feature.'}
            </p>
          </div>
        )}
      </div>

      {clips.length > 0 && (
        <div style={{ maxHeight: 192, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {clips.map((clip) => (
            <div
              key={clip.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--surface-2)',
                borderRadius: 10,
                padding: '8px 12px',
              }}
            >
              <audio controls src={clip.url} style={{ height: 32, flex: 1 }} />
              <span style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
                {fmt(clip.duration)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
