
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type FinancialData = {
  title: string;
  date: string;
  gross_revenue: number;
  net_revenue: number;
  approved_tickets: number;
}

export const exportFinancialData = (data: FinancialData[]) => {
  // Cabeçalho do CSV com mais informações
  const headers = [
    "Evento",
    "Data",
    "Receita Bruta (R$)",
    "Receita Líquida (R$)",
    "Ingressos Vendidos",
    "Ticket Médio (R$)",
    "Margem (%)",
    "Taxa de Conversão (%)"
  ];

  // Formatar os dados com cálculos adicionais
  const rows = data.map(event => {
    const ticketMedio = event.approved_tickets ? event.gross_revenue / event.approved_tickets : 0;
    const margem = event.gross_revenue ? ((event.net_revenue / event.gross_revenue) * 100) : 0;
    const taxaConversao = ((event.approved_tickets || 0) / (event.gross_revenue || 1)) * 100;

    return [
      event.title,
      format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR }),
      event.gross_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      event.net_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      event.approved_tickets,
      ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      margem.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      taxaConversao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
    ];
  });

  // Adicionar linha de totais
  const totals = data.reduce((acc, event) => {
    return {
      gross_revenue: acc.gross_revenue + (event.gross_revenue || 0),
      net_revenue: acc.net_revenue + (event.net_revenue || 0),
      approved_tickets: acc.approved_tickets + (event.approved_tickets || 0),
    };
  }, {
    gross_revenue: 0,
    net_revenue: 0,
    approved_tickets: 0,
  });

  const ticketMedioTotal = totals.approved_tickets ? totals.gross_revenue / totals.approved_tickets : 0;
  const margemTotal = totals.gross_revenue ? ((totals.net_revenue / totals.gross_revenue) * 100) : 0;
  const taxaConversaoTotal = ((totals.approved_tickets || 0) / (totals.gross_revenue || 1)) * 100;

  const totalRow = [
    "TOTAL",
    "-",
    totals.gross_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
    totals.net_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
    totals.approved_tickets,
    ticketMedioTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
    margemTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
    taxaConversaoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
  ];

  // Juntar cabeçalho, linhas e totais
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(",")),
    totalRow.join(",")
  ].join("\n");

  // Criar blob e download com BOM para Excel
  const BOM = "\uFEFF"; // BOM para garantir que caracteres especiais apareçam corretamente no Excel
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `relatorio-financeiro-${format(new Date(), "dd-MM-yyyy")}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

