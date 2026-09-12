import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 ring-offset-background cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md hover:shadow-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md hover:shadow-destructive/20",
        outline:
          "border border-input bg-card/50 hover:bg-accent hover:text-accent-foreground hover:border-primary/40",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 border-0 font-semibold",
        success: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20 font-semibold",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 rounded-lg",
        lg: "h-11 px-6 rounded-lg text-base font-semibold",
        icon: "h-9 w-9 rounded-lg",
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
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
