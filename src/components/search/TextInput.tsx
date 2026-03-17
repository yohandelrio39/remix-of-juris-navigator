import { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <Textarea
          ref={ref}
          className={cn(
            "min-h-[120px] resize-none bg-background border-border focus:border-primary transition-colors",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
