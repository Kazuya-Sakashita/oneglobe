'use client'
import { cn } from '@/app/lib/utils'
import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button = ({ variant = 'primary', className, ...props }: Props) => {
  const base = 'px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'
  const styles = {
    primary: 'text-white bg-[var(--color-brand-primary)] hover:opacity-90 focus:ring-[var(--color-brand-primary)]',
    secondary: 'border border-[var(--color-border)] text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-gray-100 focus:ring-[var(--color-brand-primary)]',
    ghost: 'text-[var(--color-text-secondary)] hover:bg-gray-50 focus:ring-[var(--color-brand-primary)]',
  }
  return <button className={cn(base, styles[variant], className)} {...props} />
}
