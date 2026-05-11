import { useEffect, useMemo, useState } from "react";
import { ApplicationList } from "../components/ApplicationList";
import { ApplicationForm } from "../components/ApplicationForm";
import { Button } from "../../../components/ui/Button";
import { useApplications } from "../hooks/useApplications";
import type { CreateJobApplicationRequest } from "../../../types/application";
import { ApplicationSkeleton } from "../../../components/ui/ApplicationSkeleton";
import { Toast } from "../../../components/ui/Toast";
import {
  initialApplicationFilters,
  type ApplicationFilters,
} from "../../../types/applicationFilters";
import {
  filterApplications,
  hasActiveFilters,
} from "../utils/applicationFilterUtils";
import { ApplicationFiltersBar } from "../components/ApplicationFiltersBar";
import { ThemeToggle } from "../../../components/ui/ThemeToggle";
import Logo from "../../../assets/logoMark.svg?react";
import {
  getFiltersFromUrl,
  syncFiltersToUrl,
} from "../utils/applicationFilterUrlUtils";
import { useAuth } from "../../auth/context/AuthContext";

export const ApplicationsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { logoutUser, user } = useAuth();
  const [filters, setFilters] = useState<ApplicationFilters>(() =>
    getFiltersFromUrl()
  );

  const {
    applications,
    loading,
    loadingId,
    errorById,
    isSubmitting,
    formSubmitError,
    handleCreateApplication,
    handleAnalyze,
    handleClearAnalysis,
    handleUpdateApplication,
    toast,
    setToast,
    updatingId,
    deletingId,
    handleDeleteApplication,
  } = useApplications();

  const filteredApplications = useMemo(
    () => filterApplications(applications, filters),
    [applications, filters]
  );

  const filtersAreActive = hasActiveFilters(filters);

  useEffect(() => {
    syncFiltersToUrl(filters);
  }, [filters]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast, setToast]);

  const handleFormSubmit = async (data: CreateJobApplicationRequest) => {
    const isCreated = await handleCreateApplication(data);

    if (isCreated) {
      setIsFormOpen(false);
    }
  };

  return (
    <div className="p-6">
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-20 w-20 shrink-0" />

          <div>
            <h1 className="text-3xl font-bold">Job Applications</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Track your applications, interviews, and skill match results.
            </p>
          </div>
        </div>

        {!loading && !isFormOpen && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">
                {user?.name}
              </p>

              <p className="text-xs text-[var(--muted-foreground)]">
                {user?.email}
              </p>
            </div>

            <ThemeToggle />

            <Button
              type="button"
              variant="secondary"
              onClick={logoutUser}
            >
              Logout
            </Button>

            <Button onClick={() => setIsFormOpen(true)}>
              + Add Job Application
            </Button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <ApplicationForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {formSubmitError && (
        <p className="mb-4 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger-text)]">
          {formSubmitError}
        </p>
      )}

      {!loading && !isFormOpen && applications.length > 0 && (
        <>
          <ApplicationFiltersBar filters={filters} onChange={setFilters} />

          {filteredApplications.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">
                Showing{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {filteredApplications.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {applications.length}
                </span>{" "}
                applications
              </p>
            </div>
          )}
        </>
      )}

      {loading ? (
        <div className="space-y-4">
          <ApplicationSkeleton />
          <ApplicationSkeleton />
          <ApplicationSkeleton />
        </div>
      ) : !isFormOpen && filteredApplications.length > 0 ? (
        <ApplicationList
          applications={filteredApplications}
          onAnalyze={handleAnalyze}
          onClearAnalysis={handleClearAnalysis}
          onUpdate={handleUpdateApplication}
          loadingId={loadingId}
          errorById={errorById}
          updatingId={updatingId}
          onAddClick={() => setIsFormOpen(true)}
          onDelete={handleDeleteApplication}
          deletingId={deletingId}
        />
      ) : !isFormOpen && applications.length > 0 && filtersAreActive ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <h2 className="text-lg font-semibold">No applications found</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            No job applications match your current filters.
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFilters(initialApplicationFilters)}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      ) : !isFormOpen && applications.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <h2 className="text-lg font-semibold">No applications yet</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Add your first job application to start tracking and analyzing
            matches.
          </p>

          <div className="mt-4">
            <Button type="button" onClick={() => setIsFormOpen(true)}>
              + Add Job Application
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};