import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { colors } from "@/styles/theme";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "outline"
    | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  shape?: "rounded" | "pill" | "square";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      shape = "rounded",
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors";

    const sizeStyles = {
      xs: "px-1.5 py-0.5 text-xs gap-1",
      sm: "px-2 py-1 text-xs gap-1.5",
      md: "px-2.5 py-1 text-sm gap-1.5",
      lg: "px-3 py-1.5 text-base gap-2",
    };

    const shapeStyles = {
      rounded: "rounded-md",
      pill: "rounded-full",
      square: "rounded-none",
    };

    const getStyles = (variant: BadgeProps["variant"]) => {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: colors.primary[50],
            color: colors.primary[700],
          };
        case "secondary":
          return {
            backgroundColor: colors.ui.alternative,
            color: colors.ui.strong,
          };
        case "error":
          return {
            backgroundColor: colors.semantic.error,
            color: colors.semantic.white,
          };
        case "outline":
          return {
            backgroundColor: "transparent",
            color: colors.neutral[700],
            border: `1px solid ${colors.neutral[200]}`,
          };
        case "ghost":
          return {
            backgroundColor: "transparent",
            color: colors.neutral[700],
          };
        case "default":
        default:
          return {
            backgroundColor: colors.neutral[100],
            color: colors.neutral[700],
          };
      }
    };

    const badgeStyle = getStyles(variant);

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          shapeStyles[shape],
          className
        )}
        style={badgeStyle}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };