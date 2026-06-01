/**
 * jobService.js
 *
 * All API exports now use localDbService instead of the Spring Boot backend.
 * Response shape is { data: ... } to stay compatible with existing page components.
 */

import {
  authLogin,
  authRegister,
  getMyProfile,
  updateMyProfile,
  searchJobs,
  getJobById,
  getRelatedJobs,
  saveJob,
  unsaveJob,
  getSavedJobs,
  applyToJob,
  getMyApplications,
  getRecruiterDashboard,
  createCompany,
  getMyCompanies,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getRecruiterApplications,
  getJobApplications,
  updateApplicationStatus,
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  getNotifications,
  markNotificationRead,
} from './localDbService'

// ─── Wrap helpers ─────────────────────────────────────────────────────────────
// Pages access responses as `{ data }` (was axios convention). We preserve that.

const wrap = (promise) => promise.then((data) => ({ data }))

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (payload) => wrap(authLogin(payload)),
  register: (payload) => wrap(authRegister(payload)),
  // No real email server — these are no-ops that show success
  forgotPassword: async () => ({ data: { message: 'If this email exists, a reset link has been sent.' } }),
  resetPassword: async () => ({ data: { message: 'Password reset successfully.' } }),
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const userApi = {
  getProfile: () => wrap(getMyProfile()),
  updateProfile: (data) => wrap(updateMyProfile(data)),
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const jobApi = {
  search: (params) => wrap(searchJobs(params)),
  getById: (id) => wrap(getJobById(id)),
  getRelated: (id) => wrap(getRelatedJobs(id)),
  save: (id) => wrap(saveJob(id)),
  unsave: (id) => wrap(unsaveJob(id)),
  getSaved: (page = 0, size = 12) => wrap(getSavedJobs(page, size)),
}

// ─── Applications ─────────────────────────────────────────────────────────────

export const applicationApi = {
  apply: (data) => wrap(applyToJob(data)),
  getMine: (page = 0, size = 10) => wrap(getMyApplications(page, size)),
}

// ─── Recruiter ────────────────────────────────────────────────────────────────

export const recruiterApi = {
  getDashboard: () => wrap(getRecruiterDashboard()),
  createCompany: (data) => wrap(createCompany(data)),
  getCompanies: () => wrap(getMyCompanies()),
  createJob: (data) => wrap(createJob(data)),
  getJobs: (page = 0, size = 10) => wrap(getMyJobs(page, size)),
  updateJob: (id, data) => wrap(updateJob(id, data)),
  deleteJob: (id) => wrap(deleteJob(id)),
  getApplications: (page = 0, size = 10) => wrap(getRecruiterApplications(page, size)),
  getJobApplications: (jobId) => wrap(getJobApplications(jobId)),
  updateApplicationStatus: (id, status) => wrap(updateApplicationStatus(id, status)),
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard: () => wrap(getAdminDashboard()),
  getUsers: () => wrap(getAllUsers()),
  deleteUser: (id) => wrap(deleteUser(id)),
}

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationApi = {
  getAll: (page = 0, size = 20) => wrap(getNotifications(page, size)),
  markRead: (id) => wrap(markNotificationRead(id)),
}
