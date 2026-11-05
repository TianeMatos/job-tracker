import { cn, toDateInputValue } from "@/lib/utils";
import { APPLY_STATUS_LABEL, type ApplyStatus } from "@/lib/job-labels";
import { FormField } from "../shared/FormField";
import { SelectField } from "../shared/SelectField";

type Props = {
  status: ApplyStatus;
  onStatusChange: (status: ApplyStatus) => void;
  errors?: { status?: string | string[]; appliedAt?: string | string[] };
  disabled?: boolean;
  className?: string;
};

export function ApplicationFields({
  status,
  onStatusChange,
  errors,
  disabled,
  className,
}: Props) {
  const today = toDateInputValue(new Date());
  return (
    <div className={cn("grid gap-4", className)}>
      <SelectField
        name="status"
        label="Status"
        options={APPLY_STATUS_LABEL}
        value={status}
        onValueChange={(v) => onStatusChange(v ?? "APPLIED")}
        error={errors?.status}
        disabled={disabled}
      />

      <FormField
        name="appliedAt"
        label="Data da candidatura"
        type="date"
        defaultValue={today}
        max={today}
        description="Preenchida com a data atual, mas pode ser alterada."
        error={errors?.appliedAt}
        disabled={disabled}
      />
    </div>
  );
}