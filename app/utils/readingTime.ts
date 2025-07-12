export function calculateReadingTime(content: string): number {
  // Average reading speed: 200-250 words per minute
  // We'll use 225 words per minute as a reasonable average
  const wordsPerMinute = 225
  
  // Remove HTML tags and count words
  const textContent = content.replace(/<[^>]*>/g, '')
  const wordCount = textContent.trim().split(/\s+/).length
  
  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  
  // Return at least 1 minute
  return Math.max(1, readingTime)
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return "1 min read"
  } else if (minutes < 60) {
    return `${minutes} min read`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} read`
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min read`
    }
  }
} 