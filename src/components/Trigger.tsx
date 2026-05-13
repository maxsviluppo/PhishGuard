import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LED } from "./LED";
import { cn } from "@/lib/utils";

interface TriggerProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  key?: string | number;
}

export function Trigger({ label, checked, onCheckedChange, className }: TriggerProps) {
  return (
    <div className={cn("flex items-center justify-between info-container hover:border-white/20 transition-colors", className)}>
      <div className="flex items-center gap-3">
        <LED color={checked ? 'green' : 'red'} />
        <Label className="text-xs uppercase tracking-widest font-bold cursor-pointer">{label}</Label>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
      />
    </div>
  );
}
