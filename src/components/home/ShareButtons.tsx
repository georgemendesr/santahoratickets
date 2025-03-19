
import { Facebook, Instagram, Share2, Twitter } from "lucide-react";
import { Button } from "../ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    instagram: `https://www.instagram.com/?url=${encodedUrl}`,
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).catch(err => console.error("Error sharing:", err));
    }
  };

  return (
    <div className="flex space-x-2 mt-4">
      <a 
        href={shareLinks.facebook} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        <Button variant="outline" size="icon">
          <Facebook size={18} />
        </Button>
      </a>
      <a 
        href={shareLinks.twitter} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-600"
      >
        <Button variant="outline" size="icon">
          <Twitter size={18} />
        </Button>
      </a>
      <Button variant="outline" size="icon" onClick={handleShare}>
        <Share2 size={18} />
      </Button>
    </div>
  );
}
