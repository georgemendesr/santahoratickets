
import { Instagram, Share2, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: string;
  event?: any;
}

export function ShareButtons({ url, title, variant, event }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    instagram: `https://www.instagram.com/?url=${encodedUrl}`,
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).catch(err => console.error("Error sharing:", err));
    } else {
      window.open(shareLinks.whatsapp, '_blank');
    }
  };

  return (
    <div className="flex space-x-2 mt-4">
      <a 
        href={shareLinks.whatsapp} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-green-600 hover:text-green-800"
      >
        <Button variant="outline" size="icon">
          <MessageCircle size={18} />
        </Button>
      </a>
      <a 
        href={shareLinks.instagram} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-pink-600 hover:text-pink-800"
      >
        <Button variant="outline" size="icon">
          <Instagram size={18} />
        </Button>
      </a>
      <Button variant="outline" size="icon" onClick={handleShare}>
        <Share2 size={18} />
      </Button>
    </div>
  );
}
