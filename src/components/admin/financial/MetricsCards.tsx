
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MetricsCardsProps = {
  totalRevenue: number;
  totalTickets: number;
  averageTicketPrice: number;
};

export function MetricsCards({ totalRevenue, totalTickets, averageTicketPrice }: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Receita Total</CardTitle>
          <CardDescription>Últimos 10 eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingressos Vendidos</CardTitle>
          <CardDescription>Últimos 10 eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalTickets}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Médio</CardTitle>
          <CardDescription>Por ingresso</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            R$ {averageTicketPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
