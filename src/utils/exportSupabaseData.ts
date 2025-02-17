
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

// Definindo o tipo para as tabelas do Supabase
type SupabaseTables = 
  | "events"
  | "batches"
  | "tickets"
  | "payment_preferences"
  | "user_profiles"
  | "user_roles"
  | "loyalty_points_history"
  | "rewards"
  | "reward_redemptions"
  | "referrals"
  | "referral_uses"
  | "saved_cards"
  | "ticket_participants";

// Função auxiliar para formatar os valores para SQL
const formatValue = (value: any): string => {
  if (value === null) return 'NULL';
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (value instanceof Date) return `'${value.toISOString()}'`;
  return value.toString();
};

// Função para gerar INSERT statements
const generateInsertStatements = (tableName: string, data: any[]): string => {
  if (!data.length) return '';

  const columns = Object.keys(data[0]);
  const values = data.map(row => 
    `(${columns.map(col => formatValue(row[col])).join(', ')})`
  ).join(',\n');

  return `INSERT INTO ${tableName} (${columns.join(', ')})
VALUES\n${values};

`;
};

export const exportSupabaseData = async () => {
  const tables: SupabaseTables[] = [
    'events',
    'batches',
    'tickets',
    'payment_preferences',
    'user_profiles',
    'user_roles',
    'loyalty_points_history',
    'rewards',
    'reward_redemptions',
    'referrals',
    'referral_uses',
    'saved_cards',
    'ticket_participants'
  ];

  let sqlContent = '-- Arquivo de exportação de dados\n';
  sqlContent += `-- Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}\n\n`;

  // Desabilitar constraints temporariamente
  sqlContent += 'BEGIN;\n\n';
  sqlContent += 'SET CONSTRAINTS ALL DEFERRED;\n\n';

  try {
    // Exportar dados de cada tabela
    for (const table of tables) {
      console.log(`Exportando dados da tabela ${table}...`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Erro ao exportar tabela ${table}: ${error.message}`);
      }

      if (data && data.length > 0) {
        sqlContent += `-- Dados da tabela ${table}\n`;
        sqlContent += generateInsertStatements(table, data);
        sqlContent += '\n';
      }
    }

    // Reabilitar constraints
    sqlContent += 'COMMIT;\n';

    // Criar e baixar o arquivo SQL
    const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `supabase-export-${format(new Date(), 'dd-MM-yyyy-HH-mm')}.sql`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Erro durante a exportação:', error);
    throw error;
  }
};

