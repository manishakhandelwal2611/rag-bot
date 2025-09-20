import { parseJwt } from './tokenUtils'

/**
 * Interface representing timezone information
 */
export interface TimezoneInfo {
  /** The timezone identifier (e.g., 'America/New_York') */
  timezone: string
  /** The timezone offset (e.g., '+05:30', '-08:00') */
  offset: string
  /** Optional city name */
  city?: string
  /** Optional country name */
  country?: string
}

/**
 * Gets timezone information from JWT token or falls back to browser timezone.
 * 
 * This function first attempts to extract timezone information from the user's
 * JWT token. If not available, it falls back to the browser's detected timezone.
 * 
 * @returns TimezoneInfo object containing timezone, offset, and optional location data
 * 
 * @example
 * ```typescript
 * const timezoneInfo = getTimezoneInfo();
 * console.log(timezoneInfo.timezone); // 'Asia/Calcutta'
 * console.log(timezoneInfo.offset);   // '+05:30'
 * ```
 */
export const getTimezoneInfo = (): TimezoneInfo => {
  try {
    // First, try to get timezone from JWT token
    const token = localStorage.getItem('chat_user')
    if (token) {
      const decoded = parseJwt(token)
      
      // Check for timezone in token (common fields)
      const tokenTimezone = decoded?.timezone || 
                           decoded?.time_zone || 
                           decoded?.user_timezone ||
                           decoded?.tz
      
      if (tokenTimezone) {
        return {
          timezone: tokenTimezone,
          offset: getTimezoneOffset(tokenTimezone),
          city: decoded?.city,
          country: decoded?.country
        }
      }
    }
  } catch (error) {
    console.warn('Failed to get timezone from token:', error)
  }

  // Fallback to browser timezone
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  return {
    timezone: browserTimezone,
    offset: getTimezoneOffset(browserTimezone)
  }
}

/**
 * Get timezone offset string (e.g., "+05:30", "-08:00")
 */
export const getTimezoneOffset = (timezone: string): string => {
  try {
    const now = new Date()
    // Get the timezone offset in minutes for the given timezone
    const utcTime = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }))
    const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
    const offsetMs = localTime.getTime() - utcTime.getTime()
    const offsetMinutes = Math.round(offsetMs / (1000 * 60))
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60)
    const remainingMinutes = Math.abs(offsetMinutes) % 60
    
    const sign = offsetMinutes >= 0 ? '+' : '-'
    
    return `${sign}${offsetHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`
  } catch (error) {
    console.warn('Failed to calculate timezone offset:', error)
    return '+00:00'
  }
}

/**
 * Format timestamp with timezone awareness
 */
export const formatTimestamp = (
  timestamp: Date | string, 
  options: {
    timezone?: string
    showTimezone?: boolean
    format?: 'relative' | 'absolute' | 'both'
  } = {}
): string => {
  const { timezone, showTimezone = false, format = 'relative' } = options
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const timezoneInfo = timezone ? { timezone, offset: getTimezoneOffset(timezone) } : getTimezoneInfo()
  
  if (format === 'relative') {
    return formatRelativeTime(date, timezoneInfo.timezone)
  } else if (format === 'absolute') {
    return formatAbsoluteTime(date, timezoneInfo.timezone, showTimezone)
  } else {
    // Both relative and absolute
    const relative = formatRelativeTime(date, timezoneInfo.timezone)
    const absolute = formatAbsoluteTime(date, timezoneInfo.timezone, showTimezone)
    return `${relative} (${absolute})`
  }
}

/**
 * Format relative time (e.g., "2h ago", "Just now")
 */
export const formatRelativeTime = (date: Date, timezone?: string): string => {
  const now = new Date()
  const targetDate = timezone ? 
    new Date(date.toLocaleString("en-US", { timeZone: timezone })) :
    date
  
  const diff = now.getTime() - targetDate.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}

/**
 * Format absolute time with timezone
 */
export const formatAbsoluteTime = (
  date: Date, 
  timezone?: string, 
  showTimezone: boolean = false
): string => {
  const now = new Date()
  
  // If timezone is provided, compare dates in that timezone
  let isToday: boolean
  let isThisYear: boolean
  
  if (timezone) {
    const dateInTimezone = new Date(date.toLocaleString("en-US", { timeZone: timezone }))
    const nowInTimezone = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
    isToday = dateInTimezone.toDateString() === nowInTimezone.toDateString()
    isThisYear = dateInTimezone.getFullYear() === nowInTimezone.getFullYear()
  } else {
    isToday = date.toDateString() === now.toDateString()
    isThisYear = date.getFullYear() === now.getFullYear()
  }
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit'
  }
  
  if (!isToday) {
    options.month = 'short'
    options.day = 'numeric'
  }
  
  if (!isThisYear) {
    options.year = 'numeric'
  }
  
  let formatted = date.toLocaleString('en-US', options)
  
  if (showTimezone && timezone) {
    const offset = getTimezoneOffset(timezone)
    formatted += ` ${offset}`
  }
  
  return formatted
}

/**
 * Format date for display in chat history
 */
export const formatChatHistoryTime = (timestamp: Date | string): string => {
  return formatTimestamp(timestamp, { format: 'relative' })
}

/**
 * Formats a timestamp for display in message bubbles.
 * 
 * This function formats timestamps to show absolute time (e.g., "11:14 PM" or "Sep 19, 11:14 PM")
 * with proper timezone handling. It automatically detects the user's timezone and formats
 * the timestamp accordingly.
 * 
 * @param timestamp - The timestamp to format (Date object or ISO string)
 * @returns Formatted timestamp string for display
 * 
 * @example
 * ```typescript
 * const formatted = formatMessageTime('2025-01-20T17:44:43.978Z');
 * console.log(formatted); // '11:14 PM' (in Asia/Calcutta timezone)
 * 
 * const formatted2 = formatMessageTime(new Date());
 * console.log(formatted2); // '11:14 PM'
 * ```
 */
export const formatMessageTime = (timestamp: Date | string): string => {
  return formatTimestamp(timestamp, { format: 'absolute' })
}

/**
 * Get current time in user's timezone
 */
export const getCurrentTime = (): { time: string; timezone: string; offset: string } => {
  const timezoneInfo = getTimezoneInfo()
  const now = new Date()
  const time = now.toLocaleString('en-US', {
    timeZone: timezoneInfo.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  return {
    time,
    timezone: timezoneInfo.timezone,
    offset: timezoneInfo.offset
  }
}

/**
 * Convert UTC timestamp to user's timezone
 */
export const convertToUserTimezone = (utcTimestamp: string | Date): Date => {
  const timezoneInfo = getTimezoneInfo()
  const date = utcTimestamp instanceof Date ? utcTimestamp : new Date(utcTimestamp)
  
  // Convert to user's timezone
  return new Date(date.toLocaleString("en-US", { timeZone: timezoneInfo.timezone }))
}

/**
 * Get timezone display name
 */
export const getTimezoneDisplayName = (timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long'
    })
    
    const parts = formatter.formatToParts(new Date())
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value
    
    return timeZoneName || timezone
  } catch (error) {
    console.warn('Failed to get timezone display name:', error)
    return timezone
  }
}
