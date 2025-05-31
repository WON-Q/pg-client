import React, { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * 모달의 열림/닫힘 상태
   * @default false
   */
  isOpen?: boolean;

  /**
   * 모달이 닫힐 때 호출될 함수
   */
  onClose?: () => void;

  /**
   * 모달 크기
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /**
   * 모달 제목
   */
  title?: React.ReactNode;

  /**
   * 모달 설명
   */
  description?: React.ReactNode;

  /**
   * 닫기 버튼 표시 여부
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * 오버레이 클릭시 모달 닫기 여부
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * 모달 푸터
   */
  footer?: React.ReactNode;

  /**
   * 모달 내용이 길 때 스크롤 가능 여부
   * @default true
   */
  scrollable?: boolean;

  /**
   * 모달 가운데 정렬 여부
   * @default true
   */
  centered?: boolean;

  /**
   * 모달 배경 블러 효과 여부
   * @default false
   */
  blur?: boolean;

  /**
   * ESC 키로 닫기 여부
   * @default true
   */
  closeOnEsc?: boolean;

  /**
   * 모달이 열릴 때 실행될 함수
   */
  onOpen?: () => void;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen = false,
      onClose,
      size = "md",
      title,
      description,
      showCloseButton = true,
      closeOnOverlayClick = true,
      footer,
      scrollable = true,
      centered = true,
      blur = false,
      closeOnEsc = true,
      onOpen,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    // 모달 열림 상태 관리
    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
        document.body.style.overflow = "hidden"; // 스크롤 방지

        if (onOpen) {
          onOpen();
        }
      } else {
        const timer = setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = ""; // 스크롤 복원
        }, 200);

        return () => clearTimeout(timer);
      }
    }, [isOpen, onOpen]);

    // ESC 키 이벤트 처리
    useEffect(() => {
      const handleEscKey = (event: KeyboardEvent) => {
        if (closeOnEsc && isOpen && event.key === "Escape" && onClose) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscKey);
      }

      return () => {
        document.removeEventListener("keydown", handleEscKey);
      };
    }, [isOpen, closeOnEsc, onClose]);

    // 모달이 닫혀있고 visible 상태도 아니면 렌더링하지 않음
    if (!isOpen && !isVisible) return null;

    // 모달 크기 설정
    const sizeStyles = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-2xl",
      lg: "max-w-3xl",
      xl: "max-w-4xl",
      "2xl": "max-w-5xl",
      full: "max-w-full mx-6",
    };

    // 오버레이 클릭 이벤트
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Ensure the click is directly on the overlay div
      if (closeOnOverlayClick && onClose && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex overflow-auto p-4 md:p-6",
          centered
            ? "items-center justify-center"
            : "items-start justify-center pt-16",
          blur ? "backdrop-blur-sm" : "",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        ref={ref}
        {...props}
      >
        {/* 배경 오버레이 */}
        <div
          className="fixed inset-0 bg-black/60"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* 모달 컨텐츠 */}
        <div
          className={cn(
            "relative z-50 w-full bg-white shadow-xl rounded-xl",
            sizeStyles[size],
            "flex flex-col"
          )}
          onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 전파 방지
        >
          {/* 모달 헤더 */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              {" "}
              {title && (
                <div>
                  <h2
                    id="modal-title"
                    className="text-xl font-semibold text-neutral-900"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p
                      id="modal-description"
                      className="text-base text-neutral-500 mt-1.5"
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}
              {showCloseButton && (
                <Button
                  variant="primary"
                  size="sm"
                  shape="pill"
                  className="p-2 h-auto text-neutral-400 hover:text-neutral-900"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}

          {/* 모달 본문 */}
          <div
            className={cn(
              "p-6",
              scrollable ? "overflow-y-auto max-h-[calc(100vh-16rem)]" : "",
              !footer ? "rounded-b-xl" : ""
            )}
          >
            {children}
          </div>

          {/* 모달 푸터 */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
              {" "}
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };