import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const NONE = "__none__";

type SelectFieldProps<T extends string> = {
  name: string;
  label: string;
  options: Record<T, string>;
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
  placeholder?: string;
  clearLabel?: string;
  error?: string | string[];
  description?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  fieldClassName?: string;
  className?: string;
};

export function SelectField<T extends string>({
  name,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecione",
  clearLabel,
  error,
  description,
  required,
  disabled,
  id,
  fieldClassName,
  className,
}: SelectFieldProps<T>) {
  const autoId = useId();
  const selectId = id ?? `${name}-${autoId}`;
  const message = Array.isArray(error) ? error[0] : error;
  const items = clearLabel ? { [NONE]: clearLabel, ...options } : options;
  const toInternal = (v?: T | null) =>
    v === undefined ? undefined : (v ?? (clearLabel ? NONE : null));

  return (
    <Field data-invalid={!!message} className={cn("gap-2", fieldClassName)}>
      <FieldLabel htmlFor={selectId} className="text-sm font-normal">
        {label}
        {required ? (
          <span aria-hidden="true"> *</span>
        ) : (
          <span aria-hidden="true" className="text-secondary/55 font-normal">
            (opcional)
          </span>
        )}
      </FieldLabel>

      <Select
        name={name}
        items={items}
        value={toInternal(value)}
        defaultValue={toInternal(defaultValue)}
        onValueChange={(v) =>
          onValueChange?.(v === NONE || v == null ? null : (v as T))
        }
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          id={selectId}
          aria-invalid={!!message}
          className={cn(
            "w-full px-3.5 py-2.5! rounded-lg text-sm text-secondary bg-transparent! border-border! placeholder:text-muted-foreground",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {/* Fix: Quando rolo o diolog o conteúdo do select vai junto  */}
        <SelectContent alignItemWithTrigger>
          <SelectGroup>
            {clearLabel && <SelectItem value={NONE}>{clearLabel}</SelectItem>}
            {Object.entries<string>(options).map(([v, text]) => (
              <SelectItem key={v} value={v}>
                {text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {description && !message && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {message && <FieldError>{message}</FieldError>}
    </Field>
  );
}
