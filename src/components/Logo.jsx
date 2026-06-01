import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 font-bold text-xl group ${className}`}>
      <motion.div
        whileHover={{ rotate: 5, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 rounded-xl overflow-hidden"
      >
        <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="10" fill="url(#logo-gradient)" />
          <path d="M10 22V10L22 22V10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4f46e5" />
              <stop offset="1" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      <span className="gradient-text tracking-tight group-hover:opacity-90 transition-opacity font-extrabold text-2xl">
        Nexus
      </span>
    </Link>
  )
}
