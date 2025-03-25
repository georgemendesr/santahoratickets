
import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export function CounterInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  className,
  disabled = false,
  size = "default",
}: CounterInputProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(value + step, max));
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(value - step, min));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(Math.max(newValue, min), max));
    }
  };

  return (
    <div
      className={cn(
        "flex items-center border rounded-md overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Button
        variant="ghost"
        size={size}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="px-2 rounded-none border-r"
      >
        <MinusIcon size={16} />
      </Button>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className="w-16 text-center border-none focus:outline-none focus:ring-0 py-1"
        min={min}
        max={max}
      />
      <Button
        variant="ghost"
        size={size}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="px-2 rounded-none border-l"
      >
        <PlusIcon size={16} />
      </Button>
    </div>
  );
}
