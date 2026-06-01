# Nexus Job Board — Complete Feature Documentation

> This document provides a comprehensive, detailed overview of every feature available in the Nexus Job Board platform. It is organized by user role and functional area.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Authentication & Account Management](#2-authentication--account-management)
3. [Job Seeker Features](#3-job-seeker-features)
4. [Recruiter Features](#4-recruiter-features)
5. [Admin Features](#5-admin-features)
6. [Public Pages](#6-public-pages)
7. [UI/UX & Design System](#7-uiux--design-system)
8. [Routing & Navigation](#8-routing--navigation)
9. [Tech Stack](#9-tech-stack)

---

## 1. Platform Overview

Nexus is an AI-powered smart career matching platform that connects top industry talent with leading companies worldwide. The platform supports three distinct user roles, each with their own dashboard and capabilities:

| Role | Description | Dashboard Route |
|------|-------------|-----------------|
| **Job Seeker** (`ROLE_USER`) | Browses jobs, applies, and tracks applications | `/dashboard/user` |
| **Recruiter** (`ROLE_RECRUITER`) | Posts jobs, manages companies, and reviews applicants | `/recruiter/dashboard` |
| **Admin** (`ROLE_ADMIN`) | Oversees the entire platform, manages users | `/admin/dashboard` |

---

## 2. Authentication & Account Management

### 2.1 User Registration
- **Route:** `/register`
- **Description:** New users can create an account by providing their first name, last name, email, and password (minimum 6 characters).
- **Role Selection:** During registration, users choose their role — either **Job Seeker** or **Recruiter**.
- **Post-Registration:** After successful registration, users are redirected to the **Login** page.

### 2.2 User Login
- **Route:** `/login`
- **Description:** Registered users sign in with their email and password.
- **Post-Login:** After successful authentication, users are redirected to their role-specific dashboard.
- **Security:** JWT-based token authentication. Tokens are stored in `localStorage`.

### 2.3 Forgot Password
- **Route:** `/forgot-password`
- **Description:** Users can request a password reset link by entering their registered email address.
- **Behavior:** If the email exists in the system, a reset link/token is sent. The system does not reveal whether an email is registered for security purposes.

### 2.4 Reset Password
- **Route:** `/reset-password`
- **Description:** Users enter a reset token (received via email) and a new password (minimum 6 characters) with confirmation.
- **Validation:** Passwords must match and meet the minimum length requirement.
- **Post-Reset:** Users are informed of success and can navigate back to login.

### 2.5 Logout
- **Description:** Users can log out from the navigation bar. This clears the JWT token from local storage and redirects to the home page.

---

## 3. Job Seeker Features

### 3.1 User Dashboard
- **Route:** `/dashboard/user`
- **Access:** Authenticated users with `ROLE_USER`
- **Description:** A personalized welcome dashboard displaying key statistics and quick-access cards:
  - **Applications Count** — Total number of applications submitted.
  - **Saved Jobs Count** — Total number of bookmarked jobs.
  - **Profile** — Quick link to edit profile settings.
  - **Browse Jobs** — Quick link to explore new opportunities.
- **CTA:** "Find New Opportunities" button linking to the Jobs listing page.

### 3.2 Browse & Search Jobs
- **Route:** `/jobs`
- **Access:** Public (anyone can browse jobs)
- **Description:** A comprehensive job listing page with powerful filtering capabilities:
  - **Keyword Search** — Search by job title, skills, or keywords.
  - **Location Filter** — Filter jobs by geographic location.
  - **Job Type Filter** — Filter by: Full Time, Part Time, Contract, Remote, Hybrid, Internship.
  - **Experience Level Filter** — Filter by: Entry, Mid, Senior, Lead, Executive.
- **Pagination:** Results are paginated (12 jobs per page) with Previous/Next navigation.
- **Loading States:** Skeleton loaders are displayed while jobs are being fetched.
- **Save Jobs:** Job seekers can bookmark/save jobs directly from the listing page.

### 3.3 Job Detail & Application
- **Route:** `/jobs/:id`
- **Access:** Public (anyone can view job details)
- **Description:** A detailed view of a specific job posting, including:
  - **Job Header:** Title, company name, job type badge, experience level, status.
  - **Location & Salary:** Displayed with icons for quick scanning.
  - **Posted Date:** Human-readable date format.
  - **Full Description:** Complete job description with preserved formatting.
  - **Requirements:** Detailed requirements section (if provided by recruiter).
- **Apply Now:**
  - Job seekers can submit an application directly from the job detail page.
  - An optional **cover letter** can be included via a text area.
  - Once applied, the button changes to "Applied" and is disabled to prevent duplicate submissions.
  - Success/error messages are displayed inline.
- **Save/Unsave:** Toggle bookmark on the job.
- **Related Jobs:** A list of related job postings is displayed below the main details.

### 3.4 My Applications
- **Route:** `/applications`
- **Access:** Authenticated users with `ROLE_USER`
- **Description:** A complete list of all applications the user has submitted.
- **Information Displayed:**
  - Job title (clickable link to job detail).
  - Company name.
  - Applied date.
  - Current application status with color-coded badges:
    - 🟡 **PENDING** — Application received, awaiting review.
    - 🔵 **REVIEWING** — Recruiter is reviewing the application.
    - 🟢 **SHORTLISTED** — Candidate has been shortlisted.
    - 🔵 **INTERVIEW** — Candidate has been selected for interview.
    - 🟢 **OFFERED** — An offer has been extended.
    - 🔴 **REJECTED** — Application has been declined.

### 3.5 Saved Jobs
- **Route:** `/saved`
- **Access:** Authenticated users with `ROLE_USER`
- **Description:** A list of all jobs the user has bookmarked/saved.
- **Actions:** Users can unsave (remove bookmark) from any job in this list. Removing a bookmark instantly removes the job from the list.

### 3.6 Notifications
- **Route:** `/notifications`
- **Access:** Authenticated users
- **Description:** A notification center displaying all platform notifications.
- **Features:**
  - Each notification has a **title**, **message**, and **timestamp**.
  - Unread notifications are visually highlighted with a primary-color border and background tint.
  - Clicking an unread notification marks it as read.
  - Notifications are displayed in chronological order with staggered entrance animations.

### 3.7 Profile Settings
- **Route:** `/profile`
- **Access:** Authenticated users
- **Description:** Users can view and edit their personal information:
  - **First Name** and **Last Name** — Editable text fields.
  - **Email** — Displayed but disabled (cannot be changed).
  - **Phone** — Optional phone number.
  - **Bio** — A text area for a personal bio/summary.
  - **Resume URL** — A link to the user's externally hosted resume.
- **Save:** Changes are saved with a success/error confirmation message.

---

## 4. Recruiter Features

### 4.1 Recruiter Dashboard
- **Route:** `/recruiter/dashboard`
- **Access:** Authenticated users with `ROLE_RECRUITER` or `ROLE_ADMIN`
- **Description:** A comprehensive management dashboard for recruiters, displaying:
  - **Total Jobs** — Number of jobs posted by the recruiter.
  - **Active Jobs** — Number of currently active job postings.
  - **Total Applications** — Total applications received across all jobs.
  - **Pending Applications** — Applications awaiting review.
- **Quick Actions:**
  - **Post Job** — Button linking to the job creation form.
  - **Manage Jobs** — Button linking to the recruiter's job listings page.

### 4.2 Application Management (ATS)
- **Location:** Recruiter Dashboard (bottom section)
- **Description:** An integrated Applicant Tracking System (ATS) displaying the 10 most recent applications.
- **For each application, recruiters can view:**
  - Applicant's full name and email.
  - The job title the candidate applied for.
  - Resume link (opens in new tab).
  - Cover letter (displayed inline in a styled block).
- **Status Management:** Recruiters can change an applicant's status using a dropdown selector with color-coded borders:
  - `PENDING` → `REVIEWING` → `SHORTLISTED` → `INTERVIEW` → `OFFERED` or `REJECTED`
- **Real-time Updates:** Changing a status immediately updates the dashboard statistics.

### 4.3 Job Postings Management
- **Route:** `/recruiter/jobs`
- **Access:** Authenticated users with `ROLE_RECRUITER` or `ROLE_ADMIN`
- **Description:** A list of all job postings created by the recruiter.
- **Actions per Job:**
  - **Edit** — Navigate to the edit form to modify job details.
  - **Delete** — Delete a job posting (with confirmation dialog).
- **Information Displayed:** Job title, company name, job type badge, and status badge.

### 4.4 Create / Edit Job Posting
- **Route:** `/recruiter/jobs/new` (create) | `/recruiter/jobs/:id/edit` (edit)
- **Access:** Authenticated users with `ROLE_RECRUITER` or `ROLE_ADMIN`
- **Description:** A comprehensive form to create or edit a job posting.
- **Fields:**
  - **Company** — Select from existing companies or create a new one inline.
  - **Job Title** — Required.
  - **Description** — Required. Rich text area.
  - **Requirements** — Optional. Text area.
  - **Location** — Optional.
  - **Salary Range** — Min and max salary (numeric inputs).
  - **Job Type** — Full Time, Part Time, Contract, Remote, Hybrid, Internship.
  - **Experience Level** — Entry, Mid, Senior, Lead, Executive.
  - **Status** — Active, Draft, or Closed.
- **Inline Company Creation:**
  - If the recruiter needs to add a new company, they can do so directly within the job posting form without leaving the page.
  - Company fields: Name, Website, Location, Description.

---

## 5. Admin Features

### 5.1 Admin Dashboard
- **Route:** `/admin/dashboard`
- **Access:** Authenticated users with `ROLE_ADMIN` only
- **Description:** A high-level platform overview dashboard displaying:
  - **Total Users** — All registered users on the platform.
  - **Total Recruiters** — Number of recruiter accounts.
  - **Total Jobs** — All job postings across the platform.
  - **Total Applications** — All applications submitted platform-wide.

### 5.2 User Management
- **Location:** Admin Dashboard (bottom section)
- **Description:** A tabular view of all registered users with management capabilities.
- **Columns:** Name, Email, Role (displayed as a badge), Actions.
- **Actions:**
  - **Delete User** — Remove a user from the platform (with confirmation dialog). Deleting a user refreshes the dashboard stats and the user list.

---

## 6. Public Pages

### 6.1 Home Page
- **Route:** `/` (root)
- **Description:** The main landing page designed to attract and convert visitors.
- **Sections:**
  1. **Hero Section** — Animated headline with gradient text ("Accelerate Your Dream Career") and a dual-input search bar (keyword + location) with a "Search Jobs" CTA.
  2. **Popular Searches** — Quick-click tags for trending searches (React, Remote, Product Manager, AI Engineer, Python).
  3. **Trust Logos** — Brand credibility section showing trusted companies (Vercel, Stripe, Airbnb, Linear, Supabase, Netflix).
  4. **Statistics Counter** — Key platform metrics (Active Jobs: 12,500+, Top Talent: 85,000+, Verified Employers: 3,200+, Successful Hires: 18,400+).
  5. **Explore Categories** — A 6-card grid of job categories (Tech & Engineering, AI & Data Science, Design & Creative, Product & Project, Marketing & Sales, Graduate & Interns). Each card is clickable and triggers a filtered job search.
  6. **How Nexus Works** — A tabbed workflow section with two views:
     - **For Job Seekers:** Upload Profile → Discover Jobs → Quick Apply → Track Progress.
     - **For Recruiters:** Define Roles → Receive Candidates → Screen Profiles → Update Status.
  7. **Success Stories** — Testimonials section with 5-star reviews from fictional users at companies like Stripe, Vercel, and Airbnb.
  8. **Dual CTA Section** — Two side-by-side cards targeting job seekers and recruiters with feature bullet points and registration CTAs.

---

## 7. UI/UX & Design System

### Design Philosophy
The Nexus platform uses a **Premium SaaS** aesthetic inspired by modern platforms like Stripe, Linear, and Vercel.

### Key Design Elements
| Element | Description |
|---------|-------------|
| **Color Palette** | Deep indigo primary (`#4f46e5`), electric sky-blue accent (`#0ea5e9`), with purple highlights |
| **Dark Mode** | Full dark mode support with muted slate backgrounds and glowing accents |
| **Glassmorphism** | `.glass` utility class with `backdrop-blur-2xl` and subtle border/shadow effects |
| **Gradient Text** | `.gradient-text` utility for striking headings (primary → accent → purple gradient) |
| **Typography** | Inter font family with careful weight hierarchy (400–800) |
| **Animations** | Framer Motion for page transitions, staggered card entrances, and hover effects |
| **Loading States** | Skeleton loaders for all data-fetching pages |
| **Responsive Design** | Fully responsive grid layouts from mobile to desktop |

### Reusable UI Components
- `Button` — Multiple variants: `default`, `outline`, `ghost`, `gradient`, `destructive`
- `Card` — Glass-effect container with header, title, description, and content slots
- `Input` — Styled form input with focus ring
- `Select` — Styled dropdown select
- `Textarea` — Multi-line text input
- `Badge` — Status indicators with variants: `default`, `secondary`, `outline`, `destructive`, `success`, `warning`
- `JobCard` — Reusable job listing card with save/apply actions
- `Skeleton` — Loading placeholder components
- `Logo` — Animated SVG logo with gradient "N" icon and brand text

---

## 8. Routing & Navigation

### Public Routes (No Authentication Required)
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home Page | Landing page |
| `/jobs` | Jobs Page | Browse and search all jobs |
| `/jobs/:id` | Job Detail | View full job details |
| `/login` | Login | Sign in |
| `/register` | Register | Create account |
| `/forgot-password` | Forgot Password | Request password reset |
| `/reset-password` | Reset Password | Set new password with token |

### Protected Routes (Authentication Required)
| Route | Page | Required Role |
|-------|------|---------------|
| `/dashboard` | Dashboard Redirect | Any authenticated user |
| `/dashboard/user` | User Dashboard | `ROLE_USER` |
| `/profile` | Profile Settings | Any authenticated user |
| `/applications` | My Applications | `ROLE_USER` |
| `/saved` | Saved Jobs | `ROLE_USER` |
| `/notifications` | Notifications | Any authenticated user |

### Recruiter Routes
| Route | Page | Required Role |
|-------|------|---------------|
| `/recruiter/dashboard` | Recruiter Dashboard | `ROLE_RECRUITER` or `ROLE_ADMIN` |
| `/recruiter/jobs` | Manage Job Postings | `ROLE_RECRUITER` or `ROLE_ADMIN` |
| `/recruiter/jobs/new` | Create New Job | `ROLE_RECRUITER` or `ROLE_ADMIN` |
| `/recruiter/jobs/:id/edit` | Edit Existing Job | `ROLE_RECRUITER` or `ROLE_ADMIN` |

### Admin Routes
| Route | Page | Required Role |
|-------|------|---------------|
| `/admin/dashboard` | Admin Dashboard | `ROLE_ADMIN` only |

---

## 9. Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 19.x |
| **Build Tool** | Vite | 8.x |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.x |
| **Routing** | React Router DOM | 7.x |
| **Icons** | Lucide React | 1.x |
| **Utilities** | clsx, tailwind-merge, class-variance-authority | Latest |
| **Deployment** | Vercel (Native GitHub Integration) | — |

---

*© 2026 Nexus. All rights reserved.*
