import { useId } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";

type FormCheckboxProps = {
  name: string;
  label: string;
  id?: string;
  error?: string | string[];
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  fieldClassName?: string;
};

export function FormCheckbox({
  name,
  label,
  id,
  error,
  description,
  checked,
  onCheckedChange,
  disabled,
  fieldClassName,
}: FormCheckboxProps) {
  const autoId = useId();
  const inputId = id ?? `${name}-${autoId}`;
  const message = Array.isArray(error) ? error[0] : error;

  return (
    <Field data-invalid={!!message} className={cn("gap-2", fieldClassName)}>
      <div className="flex items-start gap-3 justify-start">
        <Checkbox
          id={inputId}
          name={name}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-invalid={!!message}
          className="mt-0.5 size-5.5 rounded-md! border border-primary bg-transparent! data-checked:bg-primary!"
        />
        <div className="grid gap-1.5">
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-5 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          {description && !message && (
            <FieldDescription className="text-xs text-muted-foreground">
              {description}
            </FieldDescription>
          )}
        </div>
      </div>
      {message && <FieldError>{message}</FieldError>}
    </Field>
  );
}