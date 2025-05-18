export function formatDate(date: Date | null) {
  if (date) {
    const dateInstance = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    return dateInstance.toISOString().slice(0, 10)
  }
  return ''
}
