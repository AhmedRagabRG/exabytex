"use client"

interface DateDisplayProps {
  date: string | Date
}

export function DateDisplay({ date }: DateDisplayProps) {
  const displayDate = typeof date === 'string' ? new Date(date) : date
  
  return (
    <span>
      {displayDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })}
    </span>
  )
} 