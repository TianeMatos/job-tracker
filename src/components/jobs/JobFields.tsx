"use client";

import { EmploymentType, WorkplaceType } from "@/generated/prisma/enums";
import { FormField } from "../shared/FormField";
import { SelectField } from "../shared/SelectField";
import { FieldGroup, FieldSet, FieldLegend } from "../ui/field";
import { BriefcaseBusiness } from "lucide-react";
import { EMPLOYMENT_LABEL, WORKPLACE_LABEL } from "@/lib/job-labels";

export type JobFieldsProps = {
  initialData?: {
    company: string;
    role: string;
    description: string | null;
    jobUrl: string | null;
    salary: string | null;
    location: string | null;
    source: string | null;
    deadline: Date | null;
    workplaceType: WorkplaceType;
    employmentType: EmploymentType | null;
  };

  workplaceType: WorkplaceType | null;
  onWorkplaceTypeChange: (value: WorkplaceType) => void;
  employmentType: EmploymentType | null;
  onEmploymentTypeChange: (value: EmploymentType | null) => void;
  errors: Partial<Record<string, string[]>>;
  disabled?: boolean;
};

export function JobFields({
  initialData,
  workplaceType,
  onWorkplaceTypeChange,
  employmentType,
  onEmploymentTypeChange,
  errors = {},
  disabled = false,
}: JobFieldsProps) {
  return (

      <FieldSet>
        <FieldLegend className="mb-4 flex items-center gap-2">
          <BriefcaseBusiness className="size-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium">Informações da vaga</span>
        </FieldLegend>

        <FieldGroup className="gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="company"
              label="Empresa"
              id="company"
              defaultValue={initialData?.company ?? ""}
              error={errors.company}
              required
              disabled={disabled}
              placeholder="Ex.: Nubank"
            />
            <FormField
              name="role"
              label="Cargo/ Título da vaga"
              id="role"
              defaultValue={initialData?.role ?? ""}
              error={errors.role}
              required
              disabled={disabled}
              placeholder="Ex.: Product Designer"
            />
          </div>
          <FormField
            as="textarea"
            name="description"
            label="Descrição"
            id="description"
            defaultValue={initialData?.description ?? ""}
            rows={5}
            error={errors.description}
            disabled={disabled}
            placeholder="Cole os principais detalhes e requisitos da vaga..."
            className="field-sizing-fixed"
          />
          <FormField
            name="jobUrl"
            label="Link da vaga"
            id="jobUrl"
            defaultValue={initialData?.jobUrl ?? ""}
            error={errors.jobUrl}
            disabled={disabled}
            placeholder="https://..."
            type="url"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="salary"
              label="Faixa salarial"
              id="salary"
              defaultValue={initialData?.salary ?? ""}
              error={errors.salary}
              disabled={disabled}
              placeholder="Ex.: R$ 5.000 – R$ 7.000"
            />
            <FormField
              name="location"
              label="Localização"
              id="location"
              defaultValue={initialData?.location ?? ""}
              error={errors.location}
              disabled={disabled}
              placeholder="Ex.: São Paulo, SP"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="workplaceType"
              label="Modelo de Trabalho"
              options={WORKPLACE_LABEL}
              value={workplaceType}
              onValueChange={(value) => {
                if (value !== null) onWorkplaceTypeChange(value);
              }}
              error={errors.workplaceType}
              placeholder="Selecione..."
              disabled={disabled}
            />
            <SelectField
              name="employmentType"
              label="Tipo de contratação"
              options={EMPLOYMENT_LABEL}
              value={employmentType}
              onValueChange={onEmploymentTypeChange}
              error={errors.employmentType}
              clearLabel="Não informado"
              disabled={disabled}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="source"
              label="Origem"
              id="source"
              defaultValue={initialData?.source ?? ""}
              error={errors.source}
              disabled={disabled}
              placeholder="Ex.: LinkedIn, Gupy..."
            />
            <FormField
              name="deadline"
              label="Prazo de inscrição"
              id="deadline"
              defaultValue={
                initialData?.deadline
                  ? new Date(initialData.deadline).toISOString().split("T")[0]
                  : ""
              }
              error={errors.deadline}
              disabled={disabled}
              type="date"
            />
          </div>
        </FieldGroup>
      </FieldSet>
  );
}
