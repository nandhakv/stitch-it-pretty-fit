import React, { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const BottomSheet = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  BottomSheetProps
>(({ open, onOpenChange, children, title, className, ...props }, ref) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"
        />
        {isMobile ? (
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-white p-6 shadow-lg",
              "animate-in data-[state=open]:slide-in-from-bottom-full",
              "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full",
              "duration-300 ease-in-out",
              className
            )}
            {...props}
          >
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">{title}</h3>
                <DialogPrimitive.Close className="rounded-full p-1.5 hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </DialogPrimitive.Close>
              </div>
            )}
            <div className={!title ? "mt-2" : ""}>{children}</div>
            <div className="absolute -top-8 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/80"></div>
          </DialogPrimitive.Content>
        ) : (
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg bg-white p-6 shadow-lg",
              "duration-200 animate-in fade-in-0 slide-in-from-bottom-10 zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-10 data-[state=closed]:zoom-out-95",
              className
            )}
            {...props}
          >
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <DialogPrimitive.Title className="text-lg font-medium">
                  {title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Close className="rounded-full p-1.5 hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </DialogPrimitive.Close>
              </div>
            )}
            <div>{children}</div>
          </DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
});

BottomSheet.displayName = 'BottomSheet';

export { BottomSheet };
