
import api from './index';

 

export const getJobs = async (status) => {

  const params = status ? { status } : {};

  const response = await api.get('/jobs', { params });

  return response.data.data;

};

 

export const getJobById = async (jobId) => {

  const response = await api.get(`/jobs/${jobId}`);

  return response.data.data;

};

 

export const acceptJob = async (jobId) => {

  const response = await api.post(`/jobs/${jobId}/accept`);

  return response.data.data;

};

 

export const startTravel = async (jobId) => {

  const response = await api.post(`/jobs/${jobId}/start-travel`);

  return response.data.data;

};

 

export const reachedLocation = async (jobId) => {

  const response = await api.post(`/jobs/${jobId}/reached-location`);

  return response.data.data;

};

 

export const startInspection = async (jobId) => {

  const response = await api.post(`/jobs/${jobId}/start-inspection`);

  return response.data.data;

};

 

export const getChecklist = async (jobId) => {

  const response = await api.get(`/jobs/${jobId}/checklist`);

  return response.data.data;

};

 

export const submitCheckpoint = async (jobId, checkpoint) => {

  const response = await api.post(`/jobs/${jobId}/checkpoints`, checkpoint);

  return response.data.data;

};

 

export const completeJob = async (jobId, report) => {

  const response = await api.post(`/jobs/${jobId}/complete`, report);

  return response.data.data;

};

 

export const getCompletedSummary = async (jobId) => {

  const response = await api.get(`/jobs/${jobId}/completed-summary`);

  return response.data.data;

};

