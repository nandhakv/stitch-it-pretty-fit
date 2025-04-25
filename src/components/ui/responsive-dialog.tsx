import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  position?: "center" | "right" | "left" | "bottom" | "top";
}

/**
 * ResponsiveDialog - Shows a modal on desktop and a sheet on mobile
 */
const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  position = "center",
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle animation and body scroll
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = ""; // Restore scrolling
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  // Map position to sheet side
  const getSheetSide = () => {
    switch (position) {
      case "right": return "right";
      case "left": return "left";
      case "top": return "top";
      default: return "bottom";
    }
  };

  // Mobile bottom sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side={getSheetSide()}
          className={cn("p-0", position === "bottom" ? "h-[90vh]" : "w-[85vw] max-w-md", className)}
          // Hide the built-in close button since we have our own in the header
          hideCloseButton={true}
        >
          {title && (
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div>
                {typeof title === "string" ? (
                  <h2 className="text-xl font-semibold">{title}</h2>
                ) : (
                  title
                )}
                {description && (
                  <div className="text-sm text-gray-500 mt-1">
                    {description}
                  </div>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          )}
          <div className={!title ? "pt-4" : ""}>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop modal
  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "bg-black/50" : "bg-black/0 pointer-events-none"
      } transition-colors duration-300 flex items-center justify-center`}
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white rounded-xl shadow-xl overflow-auto transform transition-all duration-300 ease-in-out",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
          position === "center" ? "max-w-md w-full max-h-[90vh]" : "",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div>
              {typeof title === "string" ? (
                <h2 className="text-xl font-semibold">{title}</h2>
              ) : (
                title
              )}
              {description && (
                <div className="text-sm text-gray-500 mt-1">
                  {description}
                </div>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        )}
        <div className={!title ? "pt-4" : ""}>{children}</div>
      </div>
    </div>
  );
};

export default ResponsiveDialog;
