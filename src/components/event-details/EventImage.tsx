
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getImageUrl } from "@/integrations/supabase/utils";

interface EventImageProps {
  src: string;
  alt: string;
}

export function EventImage({ src, alt }: EventImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Verificar se a imagem existe e formar a URL correta
  const imageUrl = src 
    ? (src.startsWith("http") 
       ? src 
       : (src.startsWith("/") 
         ? src 
         : getImageUrl(src).publicUrl))
    : "/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png";

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="relative group cursor-zoom-in overflow-hidden rounded-xl shadow-lg"
      >
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-[600px] object-cover bg-gradient-to-b from-red-500 to-purple-600"
          onError={(e) => {
            console.log("Erro ao carregar imagem:", imageUrl);
            if (imageUrl !== "/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png") {
              (e.target as HTMLImageElement).src = "/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png";
            }
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              if (imageUrl !== "/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png") {
                (e.target as HTMLImageElement).src = "/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png";
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
