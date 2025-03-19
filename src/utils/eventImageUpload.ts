
import { supabase } from "@/integrations/supabase/client";

export const uploadEventImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("Nenhum arquivo fornecido");
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    
    console.log('Iniciando upload da imagem:', {
      fileName,
      fileType: file.type,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });
    
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

    console.log('Upload da imagem concluído:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Falha ao fazer upload da imagem:", error);
    throw new Error(`Erro no upload da imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
