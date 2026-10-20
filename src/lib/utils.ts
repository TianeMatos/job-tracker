import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export { cn } from "cn";

export function formatSavedAt(dateInput?: Date | string | null): string {
  if (!dateInput) return "Data Desconhecida";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "Data Inválida";
  }
  
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR
  })
};

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  // return `${year}-${month}-${day}`
  return `${day}-${month}-${year}`
}
