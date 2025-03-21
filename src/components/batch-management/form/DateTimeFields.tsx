
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";

interface DateTimeFieldsProps {
  startDate: string;
  setStartDate: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
}) => {
  const [quickEndInterval, setQuickEndInterval] = useState<number | null>(null);

  const handleQuickStartDate = (daysToAdd: number) => {
    const date = addDays(new Date(), daysToAdd);
    setStartDate(format(date, "yyyy-MM-dd"));
  };

  const handleQuickEndDate = (daysToAdd: number) => {
    // Se a data de início não estiver definida, usar hoje como base
    const startDateObj = startDate 
      ? new Date(startDate) 
      : new Date();
    
    const date = addDays(startDateObj, daysToAdd);
    setEndDate(format(date, "yyyy-MM-dd"));
    setQuickEndInterval(daysToAdd);
  };

  const quickStartOptions = [
    { label: "Hoje", days: 0 },
    { label: "Amanhã", days: 1 },
    { label: "Próxima semana", days: 7 },
  ];

  const quickEndOptions = [
    { label: "1 dia", days: 1 },
    { label: "1 semana", days: 7 },
    { label: "1 mês", days: 30 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Data de início</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <div className="flex mt-2 gap-2">
            {quickStartOptions.map((option) => (
              <Button
                key={option.days}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickStartDate(option.days)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="startTime">Hora de início</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="endDate">Data de término</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div className="flex mt-2 gap-2">
            {quickEndOptions.map((option) => (
              <Button
                key={option.days}
                type="button"
                variant={quickEndInterval === option.days ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickEndDate(option.days)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="endTime">Hora de término</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
