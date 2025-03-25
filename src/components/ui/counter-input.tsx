import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface CounterInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function CounterInput({
  value,
  min = 0,
  max = Infinity,
  onChange,
  disabled = false,
  size = "default",
  className = "",
}: CounterInputProps) {
  const [count, setCount] = useState(value);

  // Keep local state synced with prop value
  useEffect(() => {
    setCount(value);
  }, [value]);

  const increment = () => {
    if (count < max && !disabled) {
      const newValue = count + 1;
      setCount(newValue);
      onChange(newValue);
    }
  };

  const decrement = () => {
    if (count > min && !disabled) {
      const newValue = count - 1;
      setCount(newValue);
      onChange(newValue);
    }
  };

  // Determine button size
  const buttonSize = size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon";
  const buttonPadding = size === "sm" ? "px-2 h-8" : size === "lg" ? "px-3 h-11" : "px-2.5 h-10";
  const fontSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <div
      className={`flex items-center border rounded-md overflow-hidden ${className}`}
    >
      <Button
        type="button"
        variant="ghost"
        size={buttonSize}
        className={`${buttonPadding} rounded-none border-r`}
        onClick={decrement}
        disabled={count <= min || disabled}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className={`px-3 py-1 min-w-[50px] text-center ${fontSize} font-medium`}>
        {count}
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size={buttonSize}
        className={`${buttonPadding} rounded-none border-l`}
        onClick={increment}
        disabled={count >= max || disabled}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
