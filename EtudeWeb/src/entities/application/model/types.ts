export interface Application {
  id: string
  userId: string
  courseId: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface ApplicationsStore {
  filters: {
    status: string | null
    dateRange: [Date | null, Date | null]
  }
  setFilters: (filters: Partial<ApplicationsStore['filters']>) => void
  resetFilters: () => void
}
