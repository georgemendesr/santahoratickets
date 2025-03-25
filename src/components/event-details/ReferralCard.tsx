
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ReferralCardProps {
  code?: string;
  referralCode?: string;
  eventUrl?: string;
}

export function ReferralCard({ code, referralCode, eventUrl }: ReferralCardProps) {
  const displayCode = code || referralCode || '';
  const shareUrl = eventUrl || '';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Link de Indicação</CardTitle>
        <CardDescription>
          Compartilhe este código com seus amigos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={displayCode}
            readOnly
            className="font-mono"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl.includes(displayCode) ? shareUrl : `${shareUrl}?ref=${displayCode}`);
              toast.success("Código copiado!");
            }}
          >
            Copiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
