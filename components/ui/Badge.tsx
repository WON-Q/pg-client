import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { colors } from "@/styles/theme";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 배지의 변형 스타일
   * @default "default"
   */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "outline"
    | "ghost";

  /**
   * 배지의 크기
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg";

  /**
   * 배지의 모양
   * @default "rounded"
   */
  shape?: "rounded" | "pill" | "square";

  /**
   * 배지 시작 부분에 표시할 아이콘
   */
  leftIcon?: React.ReactNode;

  /**
   * 배지 끝 부분에 표시할 아이콘
   */
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
    // 기본 배지 스타일
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors";

    // 배지 크기에 따른 스타일
    const sizeStyles = {
      xs: "px-1.5 py-0.5 text-xs gap-1",
      sm: "px-2 py-1 text-xs gap-1.5",
      md: "px-2.5 py-1 text-sm gap-1.5",
      lg: "px-3 py-1.5 text-base gap-2",
    };

    // 배지 모양 스타일
    const shapeStyles = {
      rounded: "rounded-md",
      pill: "rounded-full",
      square: "rounded-none",
    };

    // theme.ts의 색상을 직접 사용하는 변형 스타일
    const getStyles = (variant: BadgeProps["variant"]) => {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: colors.primary[50],
            color: colors.primary[700],
          };
        case "secondary":
          return {
            backgroundColor: colors.secondary[50],
            color: colors.secondary[700],
          };
        case "accent":
          return {
            backgroundColor: colors.accent[50],
            color: colors.accent[700],
          };
        case "success":
          return {
            backgroundColor: "#DCFCE7", // success 색상의 밝은 버전
            color: "#166534", // success 색상의 어두운 버전
          };
        case "warning":
          return {
            backgroundColor: "#FEF3C7", // warning 색상의 밝은 버전
            color: "#92400E", // warning 색상의 어두운 버전
          };
        case "error":
          return {
            backgroundColor: "#FEE2E2", // error 색상의 밝은 버전
            color: "#B91C1C", // error 색상의 어두운 버전
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