"use client"

import * as React from "react"

// Temporary placeholder calendar component
// TODO: Fix react-day-picker integration issues
export function Calendar({ className, ...props }: any) {
  return (
    <div className={className} {...props}>
      <p className="text-sm text-muted-foreground p-4 text-center">
        Calendar component temporarily disabled
      </p>
    </div>
  )
}

export { Calendar as CalendarDayButton }
