import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { colors } from "@/styles/theme";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 변형
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "error";

  /**
   * 버튼 크기
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * 버튼 모양
   * @default "rounded"
   */
  shape?: "rounded" | "pill" | "square";

  /**
   * 버튼 왼쪽에 표시할 아이콘
   */
  leftIcon?: React.ReactNode;

  /**
   * 버튼 오른쪽에 표시할 아이콘
   */
  rightIcon?: React.ReactNode;

  /**
   * 전체 너비 차지 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 로딩 상태 표시
   * @default false
   */
  isLoading?: boolean;

  /**
   * 로딩 중일 때 표시할 텍스트입니다
   * @default "Loading..."
   */
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      shape = "rounded",
      leftIcon,
      rightIcon,
      fullWidth = false,
      isLoading = false,
      loadingText = "Loading...",
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    // 기본 버튼 스타일
    const baseStyles =
      "relative inline-flex items-center justify-center border font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    // 버튼 크기에 따른 스타일
    const sizeStyles = {
      xs: "h-6 px-2 text-xs gap-1.5",
      sm: "h-8 px-3 text-sm gap-2",
      md: "h-10 px-4 text-base gap-2",
      lg: "h-12 px-5 text-lg gap-2.5",
      xl: "h-14 px-6 text-xl gap-3",
    };

    // 버튼 모양 스타일
    const shapeStyles = {
      rounded: "rounded-lg",
      pill: "rounded-full",
      square: "rounded-none",
    };

    // 버튼 변형에 따른 스타일
    const getStyles = (variant: ButtonProps["variant"]) => {
      switch (variant) {
        case "primary":
          return cn(
            "text-white border-transparent",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:opacity-50"
          );
        case "secondary":
          return cn(
            "border-transparent",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:opacity-50"
          );
        case "error":
          return cn(
            "text-white border-transparent",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:opacity-50"
          );
        case "outline":
          return cn(
            "bg-transparent border-2",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:opacity-50"
          );
        case "ghost":
          return cn(
            "bg-transparent border-transparent",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:opacity-50"
          );
        default:
          return "";
      }
    };

    const getVariantStyle = (variant: ButtonProps["variant"]) => {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: colors.primary.DEFAULT,
            "--tw-ring-color": colors.primary.DEFAULT,
          } as React.CSSProperties;
        case "secondary":
          return {
            backgroundColor: colors.ui.alternative,
            color: colors.ui.strong,
            "--tw-ring-color": colors.ui.alternative,
          } as React.CSSProperties;
        case "error":
          return {
            backgroundColor: colors.semantic.error,
            "--tw-ring-color": colors.semantic.error,
          } as React.CSSProperties;
        case "outline":
          return {
            borderColor: colors.ui.normal,
            color: colors.ui.strong,
            "--tw-ring-color": colors.ui.normal,
          } as React.CSSProperties;
        case "ghost":
          return {
            color: colors.ui.strong,
            "--tw-ring-color": colors.ui.normal,
          } as React.CSSProperties;
        default:
          return {};
      }
    };

    // 로딩 스피너
    const LoadingSpinner = (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          shapeStyles[shape],
          getStyles(variant),
          "transform hover:scale-[1.02] active:scale-[0.98] motion-safe:transition-transform",
          {
            "w-full": fullWidth,
            "cursor-not-allowed opacity-70": isLoading,
          },
          "overflow-hidden",
          className
        )}
        style={getVariantStyle(variant)}
        disabled={disabled || isLoading}
        onClick={onClick}
        {...props}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {isLoading && LoadingSpinner}
          {!isLoading && leftIcon && <span>{leftIcon}</span>}
          <span>{isLoading && loadingText ? loadingText : children}</span>
          {!isLoading && rightIcon && <span>{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
