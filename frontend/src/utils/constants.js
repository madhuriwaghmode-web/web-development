// Central constants shared across the app. Keep grade/role/language definitions
// here so services and components never hardcode these values independently.

export const DR_GRADES = [
  { grade: 0, label: 'No DR', shortLabel: 'No DR', risk: 'low' },
  { grade: 1, label: 'Mild Diabetic Retinopathy', shortLabel: 'Mild DR', risk: 'low' },
  { grade: 2, label: 'Moderate Diabetic Retinopathy', shortLabel: 'Moderate DR', risk: 'moderate' },
  { grade: 3, label: 'Severe Diabetic Retinopathy', shortLabel: 'Severe DR', risk: 'high' },
  { grade: 4, label: 'Proliferative Diabetic Retinopathy', shortLabel: 'PDR', risk: 'high' },
]

export function getGradeInfo(grade) {
  return DR_GRADES.find((g) => g.grade === grade) || DR_GRADES[0]
}

export const RISK_LEVELS = {
  low: { label: 'Low Risk', color: 'risk-low' },
  moderate: { label: 'Moderate Risk', color: 'risk-moderate' },
  high: { label: 'High Risk', color: 'risk-high' },
}

export const ROLES = {
  HEALTH_WORKER: 'health_worker',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  [ROLES.HEALTH_WORKER]: 'Health Worker',
  [ROLES.DOCTOR]: 'Doctor',
  [ROLES.ADMIN]: 'Admin',
}

// What each role is allowed to do. Consumed by AppContext.can(action).
export const ROLE_PERMISSIONS = {
  [ROLES.HEALTH_WORKER]: [
    'patient:create', 'patient:view', 'screening:create', 'screening:view',
    'quality:check', 'report:generate', 'followup:create',
  ],
  [ROLES.DOCTOR]: [
    'patient:view', 'screening:view', 'history:view', 'notes:add',
    'referral:review', 'report:generate', 'followup:create',
  ],
  [ROLES.ADMIN]: [
    'analytics:view', 'users:manage', 'settings:manage', 'patient:view', 'screening:view',
  ],
}

export const EYE_OPTIONS = [
  { value: 'left', label: 'Left Eye' },
  { value: 'right', label: 'Right Eye' },
]

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
]

// Default follow-up interval offered to the reviewer — not a clinical rule.
// A doctor/health worker can always change it before saving.
export const DEFAULT_FOLLOWUP_DAYS = 30

export const FOLLOWUP_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
}

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
export const MAX_IMAGE_SIZE_MB = 10
