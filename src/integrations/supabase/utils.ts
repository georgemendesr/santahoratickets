
export const getImageUrl = (path: string | null) => {
  if (!path) return { publicUrl: null };
  
  // Se o caminho já começar com /lovable-uploads, está na pasta pública
  if (path.startsWith('/lovable-uploads')) {
    return { publicUrl: path };
  }
  
  // Para outras imagens armazenadas no Supabase
  const storageUrl = "https://swlqrejfgvmjajhtoall.supabase.co/storage/v1/object/public";
  return {
    publicUrl: `${storageUrl}/${path}`
  };
};
