
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe, Facebook, Instagram } from "lucide-react";

interface SiteConfigProps {
  siteInfo: {
    name: string;
    logoUrl: string;
    primaryColor: string;
    email: string;
    phone: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
  };
  setSiteInfo: (info: any) => void;
  setSocialMedia: (media: any) => void;
}

const SiteConfigTab = ({ siteInfo, socialMedia, setSiteInfo, setSocialMedia }: SiteConfigProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Informações do Site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Nome do Site</label>
            <Input 
              value={siteInfo.name} 
              onChange={(e) => setSiteInfo({...siteInfo, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">URL do Logo</label>
            <Input 
              value={siteInfo.logoUrl} 
              onChange={(e) => setSiteInfo({...siteInfo, logoUrl: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Cor Primária</label>
            <div className="flex gap-3">
              <div 
                className="w-10 h-10 rounded border" 
                style={{backgroundColor: siteInfo.primaryColor}}
              />
              <Input 
                value={siteInfo.primaryColor} 
                onChange={(e) => setSiteInfo({...siteInfo, primaryColor: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Email de Contato</label>
            <Input 
              value={siteInfo.email} 
              onChange={(e) => setSiteInfo({...siteInfo, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Telefone de Contato</label>
            <Input 
              value={siteInfo.phone} 
              onChange={(e) => setSiteInfo({...siteInfo, phone: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Redes Sociais e Integrações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-2">
              <Facebook className="h-4 w-4 text-blue-600" />
              URL do Facebook
            </label>
            <Input 
              value={socialMedia.facebook} 
              onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-2">
              <Instagram className="h-4 w-4 text-pink-600" />
              URL do Instagram
            </label>
            <Input 
              value={socialMedia.instagram} 
              onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteConfigTab;
