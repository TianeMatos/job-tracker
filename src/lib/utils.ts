export { cn } from "cn";

export function formatSavedAt(dateInput?: Date | string | null): string {
  if (!dateInput) return "Data desconhecida";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
