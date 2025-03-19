
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  // Configurar períodos predefinidos
  const setLastWeek = () => {
    const today = new Date();
    const from = addDays(today, -7);
    onChange({ from, to: today });
    setOpen(false);
  };

  const setLastMonth = () => {
    const today = new Date();
    const from = addDays(today, -30);
    onChange({ from, to: today });
    setOpen(false);
  };

  const setLastQuarter = () => {
    const today = new Date();
    const from = addDays(today, -90);
    onChange({ from, to: today });
    setOpen(false);
  };

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className="w-full justify-start text-left font-normal md:w-auto"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} {" - "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="border-r p-2 space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={setLastWeek}
              >
                Últimos 7 dias
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={setLastMonth}
              >
                Últimos 30 dias
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={setLastQuarter}
              >
                Últimos 90 dias
              </Button>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onChange}
              numberOfMonths={1}
              locale={ptBR}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
