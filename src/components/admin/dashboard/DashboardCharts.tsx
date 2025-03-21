
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

type DashboardEvent = {
  title: string;
  gross_revenue: number;
  approved_tickets: number;
};

type DashboardChartsProps = {
  events: DashboardEvent[];
};

export function DashboardCharts({ events }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Receita por Evento</CardTitle>
          <CardDescription>Últimos 5 eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={events}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="gross_revenue" name="Receita" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Ingressos Vendidos</CardTitle>
          <CardDescription>Últimos 5 eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={events}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="approved_tickets" 
                  name="Ingressos" 
                  stroke="#f59e0b" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
