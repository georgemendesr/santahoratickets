
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import * as z from "zod";

// Since we're using this component separately from the main event form,
// we need to define its own schema
export const ticketingSchema = z.object({
  price: z.string().min(1, "O preço é obrigatório"),
  available_tickets: z.string().min(1, "A quantidade de ingressos é obrigatória"),
});

export type TicketingData = z.infer<typeof ticketingSchema>;

interface TicketingFieldsProps {
  form: UseFormReturn<TicketingData>;
}

export const TicketingFields = ({ form }: TicketingFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço do ingresso</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="available_tickets"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade de ingressos</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="100"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
