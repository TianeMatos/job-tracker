import { HtmlHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

type Base = {
  name: string;
  label: string;
  id?: string;
  error?: string | string[];
  description?: string;
  fieldClassName?: string;
};

type FormFieldProps =
  | (Base & { as?: "input" } & Omit<React.ComponentProps<typeof Input>, "id" | "name">)
  | (Base & { as: "textarea" } & Omit<React.ComponentProps<typeof Textarea>, "id" | "name">);

const fieldStyle = "px-3.5 py-2.5 rounded-lg text-sm text-secondary bg-transparent! shadow-sm border-border placeholder:text-muted-foreground focus-visible:ring-primary/50  focus-visible:ring-1";

export function FormField({
  as = "input",
  name,
  label,
  id,
  error,
  description,
  required,
  fieldClassName,
  className,
  ...rest
}: FormFieldProps) {
  const autoId = useId();
  const inputId = id ?? `${name}-${autoId}`;
  const message = Array.isArray(error) ? error[0] : error;

  const common = {
    id: inputId,
    name,
    required,
    "aria-invalid": !!message,
    className: cn(fieldStyle, className),
  };

  return (
    <Field data-invalid={!!message} className={cn("gap-2", fieldClassName)}>

      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={inputId} className="text-sm font-normal">
          {label}
          {required ? <span aria-hidden="true"> *</span> : <span aria-hidden="true" className="text-secondary/55 font-normal"> (opcional)</span>}
        </FieldLabel>
      </div>

      {as === "textarea" ? (
        <Textarea {...common} {...(rest as React.ComponentProps<typeof Textarea>)} />
      ) : (
        <Input {...common} {...(rest as React.ComponentProps<typeof Input>)} />
      )}

      {description && !message && (
        <FieldDescription className="text-xs text-muted-foreground">
          {description}
        </FieldDescription>
      )}
      {message && <FieldError>{message}</FieldError>}
    </Field>
  );
}