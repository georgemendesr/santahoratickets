
import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  date: z.string().min(1, "A data é obrigatória"),
  time: z.string().min(1, "O horário é obrigatório"),
  location: z.string().default("Santa Hora"),
  status: z.enum(["published", "draft", "ended"]).optional(),
  is_featured: z.boolean().optional(),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  defaultValues?: Partial<EventFormData>;
  isSubmitting?: boolean;
  submitText?: string;
  showImageField?: boolean;
  imageFieldHelperText?: string;
  showAdvancedFields?: boolean;
}
