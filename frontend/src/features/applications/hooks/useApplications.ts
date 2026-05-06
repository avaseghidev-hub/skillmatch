import { useEffect, useState } from "react";
import {
  analyzeApplication,
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "../api/applicationApi";
import type {
  CreateJobApplicationRequest,
  JobApplication,
} from "../../../types/application";

type ToastState = {
  message: string;
  variant: "success" | "error" | "info";
} | null;

export const useApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [errorById, setErrorById] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreateApplication = async (
    data: CreateJobApplicationRequest
  ) => {
    try {
      setIsSubmitting(true);
      setFormSubmitError("");

      const createdApplication = await createApplication(data);

      setApplications((prev) => [createdApplication, ...prev]);

      setToast({
        message: "Application saved successfully.",
        variant: "success",
      });

      return true;
    } catch (error) {
      console.error("Create application failed", error);

      setFormSubmitError("Failed to save application. Please try again.");

      setToast({
        message: "Failed to save application.",
        variant: "error",
      });

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyze = async (applicationId: number) => {
    try {
      setLoadingId(applicationId);

      setErrorById((prev) => {
        const next = { ...prev };
        delete next[applicationId];
        return next;
      });

      const result = await analyzeApplication(applicationId);

      // Store persisted analysis result inside the related application
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, skillMatchResult: result }
            : app
        )
      );

      setToast({
        message: "Analysis completed successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Analyze failed", error);

      setErrorById((prev) => ({
        ...prev,
        [applicationId]: "Failed to analyze this job. Please try again.",
      }));

      setToast({
        message: "Failed to analyze application.",
        variant: "error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleClearAnalysis = (applicationId: number) => {
    // Hide analysis result locally without deleting persisted backend data
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, skillMatchResult: null }
          : app
      )
    );
  };

  const handleUpdateApplication = async (
    id: number,
    data: Partial<CreateJobApplicationRequest>
  ) => {
    try {
      setUpdatingId(id);

      const updated = await updateApplication(id, data);

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );

      setToast({
        message: "Application updated successfully.",
        variant: "success",
      });

      return true;
    } catch (error) {
      console.error("Update failed", error);

      setToast({
        message: "Failed to update application.",
        variant: "error",
      });

      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteApplication = async (id: number) => {
    try {
      setDeletingId(id);

      await deleteApplication(id);

      setApplications((prev) => prev.filter((app) => app.id !== id));

      setToast({
        message: "Application deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Delete failed", error);

      setToast({
        message: "Failed to delete application.",
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return {
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
  };
};