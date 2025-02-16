import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Share2, Ticket, ArrowLeft, Gift } from "lucide-react";
import { Event } from "@/types";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, createProfile, createReferral } = useProfile(session?.user.id);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [referralCode, setReferralCode] = useState<string | null>(() => searchParams.get('ref'));
  const [referrer, setReferrer] = useState<{ name: string } | null>(null);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Event;
    },
    enabled: !!id,
  });

  useEffect(() => {
    const fetchReferrer = async () => {
      if (!referralCode) return;

      try {
        const { data, error } = await supabase
          .from("referrals")
          .select(`
            *,
            user_profiles (
              id,
              cpf
            )
          `)
          .eq("code", referralCode)
          .single();

        if (error) throw error;
        if (data) {
          setReferrer({ name: `CPF: ${data.user_profiles.cpf.slice(-4)}` });
        }
      } catch (error) {
        console.error("Erro ao buscar informações do indicador:", error);
      }
    };

    fetchReferrer();
  }, [referralCode]);

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      const result = await createProfile(cpf, birthDate);
      if (!result) throw new Error("Erro ao criar perfil");
      return result;
    },
    onSuccess: () => {
      setShowProfileDialog(false);
      toast.success("Perfil criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar perfil. Por favor, tente novamente.");
      console.error("Erro:", error);
    },
  });

  const createReferralMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("ID do evento não encontrado");
      const result = await createReferral(id);
      if (!result) throw new Error("Erro ao gerar link de indicação");
      return result;
    },
    onSuccess: (data) => {
      setReferralCode(data.code);
      toast.success("Link de indicação gerado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao gerar link de indicação");
      console.error("Erro:", error);
    },
  });

  const createPaymentPreference = useMutation({
    mutationFn: async () => {
      if (!session?.user.id || !event) return null;

      const { data, error } = await supabase
        .from("payment_preferences")
        .insert([
          {
            user_id: session.user.id,
            event_id: event.id,
            ticket_quantity: 1,
            total_amount: event.price,
            init_point: "URL_DO_CHECKOUT",
            status: "pending"
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Pedido criado com sucesso!");
        navigate("/");
      }
    },
    onError: (error) => {
      console.error("Erro ao criar preferência de pagamento:", error);
      toast.error("Erro ao processar pedido. Por favor, tente novamente.");
    }
  });

  const handleShare = async () => {
    if (!session) {
      toast.error("Faça login para compartilhar o evento");
      return;
    }

    if (!profile) {
      setShowProfileDialog(true);
      return;
    }

    createReferralMutation.mutate();
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProfileMutation.mutate();
  };

  const handlePurchase = () => {
    if (!session) {
      toast.error(
        "É necessário fazer login para comprar pulseiras",
        {
          description: "Você será redirecionado para a página de login",
          action: {
            label: "Fazer Login",
            onClick: () => navigate("/auth")
          },
          duration: 5000
        }
      );
      return;
    }

    createPaymentPreference.mutate();
  };

  const getLowStockAlert = (availableTickets: number) => {
    if (availableTickets <= 5 && availableTickets > 0) {
      return (
        <p className="text-sm text-yellow-600 font-medium">
          Últimas unidades disponíveis!
        </p>
      );
    }
    if (availableTickets === 0) {
      return (
        <p className="text-sm text-red-600 font-medium">
          Ingressos esgotados
        </p>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 py-8">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 py-8">
          <p>Evento não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <p className="text-lg text-muted-foreground">
                {event.description}
              </p>
            </div>

            {referrer && (
              <Alert>
                <AlertDescription className="text-sm">
                  Você está comprando através da indicação de usuário final {referrer.name}
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {format(new Date(event.date), "PPP", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preço</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(event.price)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Local</p>
                  <p className="font-medium">{event.location}</p>
                </div>

                {getLowStockAlert(event.available_tickets)}

                <div className="flex gap-4">
                  <Button 
                    className="flex-1" 
                    onClick={handlePurchase}
                    disabled={event.available_tickets === 0}
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    Comprar Pulseira
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Indicar
                  </Button>
                  {session && (
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/edit/${event.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Programa de Fidelidade
                  </CardTitle>
                  <CardDescription>
                    Você tem {profile.loyalty_points} pontos acumulados
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {referralCode && (
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
                      value={referralCode}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(referralCode);
                        toast.success("Código copiado!");
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete seu perfil</DialogTitle>
              <DialogDescription>
                Para continuar, precisamos de algumas informações adicionais.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={createProfileMutation.isPending}
                className="w-full"
              >
                {createProfileMutation.isPending
                  ? "Salvando..."
                  : "Salvar Perfil"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EventDetails;
