import type { ApplicationStatus } from "../../../types/application";
import type { ApplicationFilters } from "../../../types/applicationFilters";
import { initialApplicationFilters } from "../../../types/applicationFilters";
import { Button } from "../../../components/ui/Button";
import { FilterField } from "../../../components/ui/FilterField";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { hasActiveFilters } from "../utils/applicationFilterUtils";

interface ApplicationFiltersBarProps {
  filters: ApplicationFilters;
  onChange: (filters: ApplicationFilters) => void;
}

export const ApplicationFiltersBar = ({
  filters,
  onChange,
}: ApplicationFiltersBarProps) => {
  const isClearDisabled = !hasActiveFilters(filters);

  const updateFilter = <K extends keyof ApplicationFilters>(
    field: K,
    value: ApplicationFilters[K]
  ) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="mb-4">
        <h2 className="font-semibold">Filter Applications</h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Search and filter your job applications.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <FilterField label="Search">
          <Input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Company or job title"
          />
        </FilterField>

        <FilterField label="Status">
          <Select
            value={filters.status}
            onChange={(event) =>
              updateFilter("status", event.target.value as ApplicationStatus | "")
            }
          >
            <option value="">All statuses</option>
            <option value="SAVED">Saved</option>
            <option value="APPLIED">Applied</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        </FilterField>

        <FilterField label="Work mode">
          <Select
            value={filters.workMode}
            onChange={(event) => updateFilter("workMode", event.target.value)}
          >
            <option value="">All work modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </Select>
        </FilterField>

        <FilterField label="Location">
          <Input
            value={filters.location}
            onChange={(event) => updateFilter("location", event.target.value)}
            placeholder="Location"
          />
        </FilterField>

        <FilterField label="Created from">
          <Input
            type="date"
            value={filters.createdFrom}
            onChange={(event) => updateFilter("createdFrom", event.target.value)}
          />
        </FilterField>

        <FilterField label="Created to">
          <Input
            type="date"
            value={filters.createdTo}
            onChange={(event) => updateFilter("createdTo", event.target.value)}
          />
        </FilterField>

        <FilterField label="Updated from">
          <Input
            type="date"
            value={filters.updatedFrom}
            onChange={(event) => updateFilter("updatedFrom", event.target.value)}
          />
        </FilterField>

        <FilterField label="Updated to">
          <Input
            type="date"
            value={filters.updatedTo}
            onChange={(event) => updateFilter("updatedTo", event.target.value)}
          />
        </FilterField>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={isClearDisabled}
          onClick={() => onChange(initialApplicationFilters)}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};