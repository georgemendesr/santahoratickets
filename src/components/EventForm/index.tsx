
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./BasicInfoFields";
import { DateTimeFields } from "./DateTimeFields";
import { LocationField } from "./LocationField";
import { ImageUploadField } from "./ImageUploadField";
import { eventFormSchema, type EventFormProps } from "./schema";

export type { EventFormData } from "./schema";

export const EventForm = ({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  submitText = "Criar Evento",
  showImageField = true,
  imageFieldHelperText,
}: EventFormProps) => {
  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "Santa Hora",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <DateTimeFields form={form} />
        <LocationField form={form} />
        
        {showImageField && (
          <ImageUploadField helperText={imageFieldHelperText} />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processando..." : submitText}
        </Button>
      </form>
    </Form>
  );
};
