# Nexus — AI-Powered Smart Career Platform

Nexus is a next-generation, AI-powered career matching platform that seamlessly connects top industry talent with leading companies worldwide. 

## 🚀 Features

### For Job Seekers
- **Smart Matching:** AI-driven job recommendations based on skills, experience, and career goals.
- **Unified Profile:** A single, comprehensive profile that acts as your dynamic resume.
- **Real-Time Tracking:** Track your application status (Reviewed, Shortlisted, Interviewing, Offered) in real-time.
- **One-Click Apply:** Streamlined application process to apply for multiple roles instantly.

### For Employers & Recruiters
- **Streamlined Dashboard:** Manage all your job postings and applicants from a single, powerful dashboard.
- **Intelligent Screening:** Quickly filter candidates based on match percentage, skills, and experience.
- **Applicant Tracking System (ATS):** Built-in tools to move candidates through different stages of the hiring pipeline.
- **Analytics:** View insights on job post performance and applicant demographics.

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion for animations.
- **UI Components:** Shadcn UI, Lucide React (Icons).
- **Routing:** React Router DOM v7.
- **Styling:** Premium SaaS aesthetic with custom glassmorphism and gradient text utilities.

## 💻 Local Development

To run the Nexus platform locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajesh-Koppisetty/Job_Board.git
   cd Job_Board/frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 🚢 CI/CD & Deployment

This project utilizes **GitHub Actions** for Continuous Integration and Continuous Deployment (CI/CD). 
Every push to the `main` branch automatically triggers a pipeline that builds the React application and deploys it directly to **Vercel**.

To configure this in your own fork:
1. Ensure you have a Vercel account.
2. Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):
   - `VERCEL_TOKEN`: Your personal Vercel access token.
   - `VERCEL_ORG_ID`: Your Vercel organization ID.
   - `VERCEL_PROJECT_ID`: Your Vercel project ID.

## 📄 License
© 2026 Nexus. All rights reserved.
