import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-lg",
  {
    variants: {
      variant: {
        default:
          "text-white relative overflow-hidden btn-ds",
        destructive:
          "text-white relative overflow-hidden btn-ds-destructive",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "text-white relative overflow-hidden btn-ds-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

// Global keyframes for subtle gradient animation
declare global {
  interface CSSStyleSheet { }
}

const style = typeof document !== 'undefined' ? document.createElement('style') : null
if (style) {
  style.innerHTML = `
  @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes subtle-glow { 0%{box-shadow:0 0 30px rgba(75,85,99,.4),0 0 60px rgba(75,85,99,.2),inset 0 1px 0 rgba(255,255,255,.1)} 100%{box-shadow:0 0 40px rgba(75,85,99,.6),0 0 80px rgba(75,85,99,.3),inset 0 1px 0 rgba(255,255,255,.2)} }
  .btn-ds{background:linear-gradient(135deg,#1f2937 0%,#374151 25%,#1f2937 50%,#4b5563 75%,#1f2937 100%);background-size:200% 200%;animation:gradient-shift 3s ease-in-out infinite,subtle-glow 2s ease-in-out infinite alternate}
  .btn-ds-secondary{background:linear-gradient(135deg,#374151 0%,#4b5563 25%,#374151 50%,#6b7280 75%,#374151 100%);background-size:200% 200%;animation:gradient-shift 3s ease-in-out infinite,subtle-glow 2s ease-in-out infinite alternate}
  .btn-ds-destructive{background:linear-gradient(135deg,#b91c1c 0%,#ef4444 25%,#b91c1c 50%,#dc2626 75%,#b91c1c 100%);background-size:200% 200%;animation:gradient-shift 3s ease-in-out infinite,subtle-glow 2s ease-in-out infinite alternate}
  `
  document.head.appendChild(style)
}
