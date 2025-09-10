'use client'
import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const Input = (props: Props) => (
  <input
    {...props}
    className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:outline-none"
  />
)
