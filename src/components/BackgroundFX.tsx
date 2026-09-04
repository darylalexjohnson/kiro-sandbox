import './BackgroundFX.css'

export interface BackgroundFXProps {
  className?: string
}

export function BackgroundFX({ className }: BackgroundFXProps = {}) {
  return (
    <div
      className={['bg-fx', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className="bg-fx__blob bg-fx__blob--1" />
      <span className="bg-fx__blob bg-fx__blob--2" />
      <span className="bg-fx__blob bg-fx__blob--3" />
      <span className="bg-fx__blob bg-fx__blob--4" />
    </div>
  )
}
