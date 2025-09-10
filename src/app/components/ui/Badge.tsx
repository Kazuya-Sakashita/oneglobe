'use client'
import React from 'react'

type Props = {
  label: string
  color?: 'accent' | 'warning' | 'default'
}

export const Badge = ({ label, color = 'default' }: Props) => {
  const base = 'px-2 py-1 text-xs font-semibold rounded-md'
  const colors = {
    accent: 'bg-[var(--color-accent)] text-white',
    warning: 'bg-[var(--color-warning)] text-white',
    default: 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]',
  }
  return <span className={`${base} ${colors[color]}`}>{label}</span>
}
