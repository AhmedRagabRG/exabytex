import * as React from "react"
import { Button as BaseButton, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AccessibilityButtonProps extends ButtonProps {
  ariaLabel?: string
  describedBy?: string
}

const AccessibilityButton = React.forwardRef<HTMLButtonElement, AccessibilityButtonProps>(
  ({ className, ariaLabel, describedBy, children, ...props }, ref) => {
    return (
      <BaseButton
        className={cn(
          // إضافة focus states محسنة
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          // تحسين contrast للنصوص
          "text-foreground",
          className
        )}
        ref={ref}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </BaseButton>
    )
  }
)
AccessibilityButton.displayName = "AccessibilityButton"

export { AccessibilityButton } 