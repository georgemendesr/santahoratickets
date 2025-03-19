
import { supabase } from "@/integrations/supabase/client";

export const uploadEventImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from("event-images")
    .upload(fileName, file);

  if (error) {
    console.error("Erro no upload da imagem:", error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("event-images")
    .getPublicUrl(data.path);

  return publicUrl;
};
