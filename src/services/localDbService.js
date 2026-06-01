/**
 * localDbService.js
 * 
 * A localStorage-based data layer that replaces the Spring Boot backend.
 * Data is seeded from db.json on first load and persisted in localStorage.
 */

import seedData from '@/data/db.json'

const DB_KEY = 'talentflow_db'
const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// ─── DB Bootstrap ─────────────────────────────────────────────────────────────

export function getDb() {
  const raw = localStorage.getItem(DB_KEY)
  if (!raw) {
    // First run — seed from db.json
    localStorage.setItem(DB_KEY, JSON.stringify(seedData))
    return JSON.parse(JSON.stringify(seedData))
  }
  return JSON.parse(raw)
}

export function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

/** Reset db to initial seed data (useful for testing) */
export function resetDb() {
  localStorage.setItem(DB_KEY, JSON.stringify(seedData))
}

// ─── Token / Session ──────────────────────────────────────────────────────────

export function generateToken(userId) {
  return btoa(`talentflow:${userId}:${Date.now()}`)
}

export function getUserIdFromToken(token) {
  if (!token) return null
  try {
    const decoded = atob(token)
    const parts = decoded.split(':')
    return parseInt(parts[1], 10)
  } catch {
    return null
  }
}

export function getCurrentUserId() {
  const token = localStorage.getItem(TOKEN_KEY)
  return getUserIdFromToken(token)
}

export function getCurrentUser() {
  const db = getDb()
  const id = getCurrentUserId()
  if (!id) return null
  return db.users.find((u) => u.id === id) || null
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

export function generateId(list) {
  if (!list || list.length === 0) return 1
  return Math.max(...list.map((i) => i.id)) + 1
}

// ─── Pagination Helper ────────────────────────────────────────────────────────

export function paginate(array, page = 0, size = 12) {
  const totalElements = array.length
  const totalPages = Math.max(1, Math.ceil(totalElements / size))
  const start = page * size
  const content = array.slice(start, start + size)
  return { content, totalElements, totalPages, number: page, size }
}

// ─── Simulate async delay (makes UI feel realistic) ───────────────────────────

export function delay(ms = 80) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function authLogin({ email, password }) {
  await delay()
  const db = getDb()
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!user) {
    const err = new Error('Invalid email or password')
    err.response = { data: { message: 'Invalid email or password' } }
    throw err
  }
  const token = generateToken(user.id)
  return {
    token,
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  }
}

export async function authRegister({ firstName, lastName, email, password, role }) {
  await delay()
  const db = getDb()
  if (db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    const err = new Error('Email already in use')
    err.response = { data: { message: 'Email already in use' } }
    throw err
  }
  const newUser = {
    id: generateId(db.users),
    firstName,
    lastName,
    email,
    password,
    role: role || 'ROLE_USER',
    phone: '',
    bio: '',
    resumeUrl: '',
  }
  db.users.push(newUser)
  saveDb(db)

  const token = generateToken(newUser.id)
  return {
    token,
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    role: newUser.role,
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getMyProfile() {
  await delay()
  const db = getDb()
  const me = getCurrentUser()
  if (!me) {
    const err = new Error('Unauthorized')
    err.response = { status: 401, data: { message: 'Unauthorized' } }
    throw err
  }
  const { password: _p, ...safeUser } = me
  return safeUser
}

export async function updateMyProfile(updates) {
  await delay()
  const db = getDb()
  const id = getCurrentUserId()
  const idx = db.users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error('User not found')
  db.users[idx] = { ...db.users[idx], ...updates }
  saveDb(db)
  const { password: _p, ...safeUser } = db.users[idx]
  return safeUser
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

function enrichJob(job, db, currentUserId) {
  const company = db.companies.find((c) => c.id === job.companyId) || { name: 'Unknown', location: '' }
  const saved = currentUserId
    ? db.savedJobs.some((s) => s.jobId === job.id && s.userId === currentUserId)
    : false
  const applied = currentUserId
    ? db.applications.some((a) => a.jobId === job.id && a.userId === currentUserId)
    : false
  return { ...job, company, saved, applied }
}

export async function searchJobs({ keyword, location, jobType, experienceLevel, page = 0, size = 12 } = {}) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()

  let jobs = db.jobs.filter((j) => j.status === 'ACTIVE')

  if (keyword) {
    const kw = keyword.toLowerCase()
    jobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(kw) ||
        j.description.toLowerCase().includes(kw) ||
        (db.companies.find((c) => c.id === j.companyId)?.name || '').toLowerCase().includes(kw)
    )
  }
  if (location) {
    const loc = location.toLowerCase()
    jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc))
  }
  if (jobType) jobs = jobs.filter((j) => j.jobType === jobType)
  if (experienceLevel) jobs = jobs.filter((j) => j.experienceLevel === experienceLevel)

  // Sort by newest first
  jobs = jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const enriched = jobs.map((j) => enrichJob(j, db, uid))
  return paginate(enriched, page, size)
}

export async function getJobById(id) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const job = db.jobs.find((j) => j.id === id)
  if (!job) {
    const err = new Error('Job not found')
    err.response = { status: 404, data: { message: 'Job not found' } }
    throw err
  }
  return enrichJob(job, db, uid)
}

export async function getRelatedJobs(id) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const job = db.jobs.find((j) => j.id === id)
  if (!job) return []
  const related = db.jobs
    .filter(
      (j) =>
        j.id !== id &&
        j.status === 'ACTIVE' &&
        (j.jobType === job.jobType || j.experienceLevel === job.experienceLevel)
    )
    .slice(0, 3)
  return related.map((j) => enrichJob(j, db, uid))
}

export async function saveJob(jobId) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  if (!uid) {
    const err = new Error('Unauthorized')
    err.response = { status: 401, data: { message: 'Unauthorized' } }
    throw err
  }
  const alreadySaved = db.savedJobs.some((s) => s.jobId === jobId && s.userId === uid)
  if (!alreadySaved) {
    db.savedJobs.push({ id: generateId(db.savedJobs), jobId, userId: uid })
    saveDb(db)
  }
  return {}
}

export async function unsaveJob(jobId) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  db.savedJobs = db.savedJobs.filter((s) => !(s.jobId === jobId && s.userId === uid))
  saveDb(db)
  return {}
}

export async function getSavedJobs(page = 0, size = 12) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const savedIds = db.savedJobs.filter((s) => s.userId === uid).map((s) => s.jobId)
  const jobs = db.jobs
    .filter((j) => savedIds.includes(j.id))
    .map((j) => enrichJob(j, db, uid))
  return paginate(jobs, page, size)
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function applyToJob({ jobId, coverLetter }) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  if (!uid) {
    const err = new Error('Unauthorized')
    err.response = { status: 401, data: { message: 'Unauthorized' } }
    throw err
  }
  const alreadyApplied = db.applications.some((a) => a.jobId === jobId && a.userId === uid)
  if (alreadyApplied) {
    const err = new Error('Already applied to this job')
    err.response = { data: { message: 'Already applied to this job' } }
    throw err
  }
  const user = db.users.find((u) => u.id === uid)
  const job = db.jobs.find((j) => j.id === jobId)
  const company = db.companies.find((c) => c.id === job?.companyId)

  const app = {
    id: generateId(db.applications),
    jobId,
    userId: uid,
    applicantName: `${user.firstName} ${user.lastName}`,
    applicantEmail: user.email,
    jobTitle: job?.title || '',
    companyName: company?.name || '',
    coverLetter: coverLetter || '',
    resumeUrl: user.resumeUrl || '',
    status: 'PENDING',
    appliedAt: new Date().toISOString(),
  }
  db.applications.push(app)

  // Add notification for recruiter
  const recruiterId = job?.recruiterId
  if (recruiterId) {
    db.notifications = db.notifications || []
    db.notifications.push({
      id: generateId(db.notifications),
      userId: recruiterId,
      title: 'New Application',
      message: `${user.firstName} ${user.lastName} applied for ${job.title}`,
      read: false,
      createdAt: new Date().toISOString(),
    })
  }

  saveDb(db)
  return app
}

export async function getMyApplications(page = 0, size = 10) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const apps = db.applications
    .filter((a) => a.userId === uid)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
  return paginate(apps, page, size)
}

// ─── Recruiter ────────────────────────────────────────────────────────────────

export async function getRecruiterDashboard() {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const myJobs = db.jobs.filter((j) => j.recruiterId === uid)
  const myJobIds = myJobs.map((j) => j.id)
  const myApps = db.applications.filter((a) => myJobIds.includes(a.jobId))
  return {
    totalJobs: myJobs.length,
    activeJobs: myJobs.filter((j) => j.status === 'ACTIVE').length,
    totalApplications: myApps.length,
    pendingApplications: myApps.filter((a) => a.status === 'PENDING').length,
  }
}

export async function createCompany(data) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const company = {
    id: generateId(db.companies),
    ...data,
    recruiterId: uid,
  }
  db.companies.push(company)
  saveDb(db)
  return company
}

export async function getMyCompanies() {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  return db.companies.filter((c) => c.recruiterId === uid)
}

export async function createJob(data) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const job = {
    id: generateId(db.jobs),
    ...data,
    recruiterId: uid,
    createdAt: new Date().toISOString(),
  }
  db.jobs.push(job)
  saveDb(db)
  return job
}

export async function getMyJobs(page = 0, size = 10) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const jobs = db.jobs
    .filter((j) => j.recruiterId === uid)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((j) => {
      const company = db.companies.find((c) => c.id === j.companyId) || { name: 'Unknown' }
      return { ...j, company }
    })
  return paginate(jobs, page, size)
}

export async function updateJob(id, data) {
  await delay()
  const db = getDb()
  const idx = db.jobs.findIndex((j) => j.id === id)
  if (idx === -1) throw new Error('Job not found')
  db.jobs[idx] = { ...db.jobs[idx], ...data, id }
  saveDb(db)
  return db.jobs[idx]
}

export async function deleteJob(id) {
  await delay()
  const db = getDb()
  db.jobs = db.jobs.filter((j) => j.id !== id)
  saveDb(db)
  return {}
}

export async function getRecruiterApplications(page = 0, size = 10) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const myJobIds = db.jobs.filter((j) => j.recruiterId === uid).map((j) => j.id)
  const apps = db.applications
    .filter((a) => myJobIds.includes(a.jobId))
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
  return paginate(apps, page, size)
}

export async function getJobApplications(jobId) {
  await delay()
  const db = getDb()
  return db.applications.filter((a) => a.jobId === jobId)
}

export async function updateApplicationStatus(id, status) {
  await delay()
  const db = getDb()
  const idx = db.applications.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error('Application not found')
  db.applications[idx].status = status

  // Notify the applicant
  const app = db.applications[idx]
  db.notifications = db.notifications || []
  db.notifications.push({
    id: generateId(db.notifications),
    userId: app.userId,
    title: 'Application Status Updated',
    message: `Your application for "${app.jobTitle}" has been updated to: ${status}`,
    read: false,
    createdAt: new Date().toISOString(),
  })

  saveDb(db)
  return db.applications[idx]
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminDashboard() {
  await delay()
  const db = getDb()
  return {
    totalUsers: db.users.length,
    totalRecruiters: db.users.filter((u) => u.role === 'ROLE_RECRUITER').length,
    totalJobs: db.jobs.length,
    totalApplications: db.applications.length,
  }
}

export async function getAllUsers() {
  await delay()
  const db = getDb()
  return db.users.map(({ password: _p, ...u }) => u)
}

export async function deleteUser(id) {
  await delay()
  const db = getDb()
  db.users = db.users.filter((u) => u.id !== id)
  saveDb(db)
  return {}
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(page = 0, size = 20) {
  await delay()
  const db = getDb()
  const uid = getCurrentUserId()
  const notifs = (db.notifications || [])
    .filter((n) => n.userId === uid)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return paginate(notifs, page, size)
}

export async function markNotificationRead(id) {
  await delay()
  const db = getDb()
  const idx = (db.notifications || []).findIndex((n) => n.id === id)
  if (idx !== -1) {
    db.notifications[idx].read = true
    saveDb(db)
  }
  return {}
}
