
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type EventFormData } from "./schema";

interface LocationFieldProps {
  form: UseFormReturn<EventFormData>;
}

export const LocationField = ({ form }: LocationFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Local</FormLabel>
          <FormControl>
            <Input placeholder="Santa Hora" {...field} />
          </FormControl>
          <FormDescription>
            O local padrão é "Santa Hora".
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
