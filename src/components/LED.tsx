import { cn } from "@/lib/utils";

interface LEDProps {
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'purple';
  className?: string;
  active?: boolean;
}

export function LED({ color = 'green', className, active = true }: LEDProps) {
  if (!active) return <div className={cn("w-2 h-2 rounded-full bg-zinc-800", className)} />;
  
  const colorMap = {
    green: 'led-green',
    red: 'led-red',
    yellow: 'led-yellow',
    blue: 'led-blue',
    purple: 'led-purple',
  };

  return <div className={cn(colorMap[color], className)} />;
}
