// components/ui/AnimatedButton.tsx
"use client";

import { motion, HTMLMotionProps, MotionValue } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  hoverEffect?: "shine" | "scale" | "slide";
  gradient?: [string, string];
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  children?: ReactNode | MotionValue<number> | MotionValue<string>;
}

const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "md",
      hoverEffect = "shine",
      gradient = ["#B76E79", "#E8C4C0"],
      className,
      children,
      icon,
      iconPosition = "left",
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-6 py-2 text-sm",
      md: "px-8 py-3 text-base",
      lg: "px-10 py-4 text-lg",
    };

    const variantClasses = {
      solid: "text-white",
      outline: "border-2 bg-transparent",
      ghost: "bg-transparent hover:bg-opacity-10",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={hoverEffect === "scale" ? { scale: 1.05 } : {}}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative rounded-full font-semibold transition-all",
          "group mx-auto w-fit overflow-hidden",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={{
          background:
            variant === "solid"
              ? `linear-gradient(45deg, ${gradient[0]}, ${gradient[1]})`
              : "transparent",
          borderColor: variant === "outline" ? gradient[0] : "transparent",
          color: variant === "solid" ? "white" : gradient[0],
          boxShadow: `0 0 40px ${gradient[0]}40`,
        }}
        disabled={isLoading}
        {...props}
      >
        {/* Hover Effects */}
        {hoverEffect === "shine" && (
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {hoverEffect === "slide" && (
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-0 
            bg-gradient-to-r from-transparent via-white/20 to-transparent 
            transition-transform duration-300"
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center gap-2">
          {icon && iconPosition === "left" && (
            <span className={cn(isLoading && "invisible")}>{icon}</span>
          )}
          <motion.span className={cn(isLoading && "invisible")}>
            {children}
          </motion.span>
          {icon && iconPosition === "right" && (
            <span className={cn(isLoading && "invisible")}>{icon}</span>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </div>
          )}
        </div>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
