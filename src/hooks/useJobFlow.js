import { useState, useCallback } from "react";

import * as jobsApi from "../api/jobs";

export const JOB_STATUSES = {
  PENDING: "pending",

  ACCEPTED: "accepted",

  TRAVELING: "traveling",

  REACHED: "reached",

  IN_INSPECTION: "in_inspection",

  COMPLETED: "completed",
};

export const PROGRESS_STEPS = [
  { key: "accept", label: "Accept", status: JOB_STATUSES.PENDING },

  { key: "travel", label: "Travel", status: JOB_STATUSES.ACCEPTED },

  { key: "reached", label: "Reached", status: JOB_STATUSES.TRAVELING },

  { key: "inspection", label: "Inspection", status: JOB_STATUSES.REACHED },

  { key: "report", label: "Report", status: JOB_STATUSES.IN_INSPECTION },

  { key: "completed", label: "Completed", status: JOB_STATUSES.COMPLETED },
];

export const getStepIndex = (status) => {
  const map = {
    [JOB_STATUSES.PENDING]: 0,

    [JOB_STATUSES.ACCEPTED]: 1,

    [JOB_STATUSES.TRAVELING]: 2,

    [JOB_STATUSES.REACHED]: 3,

    [JOB_STATUSES.IN_INSPECTION]: 4,

    [JOB_STATUSES.COMPLETED]: 5,
  };

  return map[status] ?? 0;
};

const useJobFlow = () => {
  const [job, setJob] = useState(null);

  const [checklist, setChecklist] = useState(null);

  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchJob = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await jobsApi.getJobById(jobId);
      setJob(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch job");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptJob = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await jobsApi.acceptJob(jobId);
      setJob(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to accept job");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startTravel = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await jobsApi.startTravel(jobId);
      setJob(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to start travel");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reachedLocation = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await jobsApi.reachedLocation(jobId);
      setJob(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to mark as reached");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startInspection = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await jobsApi.startInspection(jobId);
      setJob(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to start inspection");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChecklist = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await jobsApi.getChecklist(jobId);
      setChecklist(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch checklist");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitCheckpoint = useCallback(async (jobId, checkpoint) => {
    setLoading(true);
    setError(null);

    try {
      const data = await jobsApi.submitCheckpoint(jobId, checkpoint);
      setJob(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit checkpoint");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeJob = useCallback(async (jobId, report) => {
    setLoading(true);
    setError(null);

    try {
      return await jobsApi.completeJob(jobId, {
        remarks: report?.remarks || "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to complete job");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await jobsApi.getCompletedSummary(jobId);
      setSummary(data);
      setJob(data.job);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch summary");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    job,
    checklist,
    summary,
    loading,
    error,
    setError,

    fetchJob,
    acceptJob,
    startTravel,
    reachedLocation,
    startInspection,

    fetchChecklist,
    submitCheckpoint,
    completeJob,
    fetchSummary,
  };
};

export default useJobFlow;
