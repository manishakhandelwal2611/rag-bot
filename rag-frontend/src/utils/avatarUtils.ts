// Fun robot cartoonish avatars from the internet
export const ROBOT_AVATARS = [
  // Cute robot avatars
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1581092160561-40aa08e78837?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1581092160563-40aa08e78837?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1581092160564-40aa08e78837?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1581092160565-40aa08e78837?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1581092160566-40aa08e78837?w=100&h=100&fit=crop&crop=face&auto=format',
  // Alternative robot images from other sources
  'https://cdn-icons-png.flaticon.com/512/4712/4712027.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712034.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712041.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712048.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712055.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712062.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712069.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712076.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712083.png',
  'https://cdn-icons-png.flaticon.com/512/4712/4712090.png',
  // More fun robot avatars
  'https://img.icons8.com/color/96/000000/robot-2.png',
  'https://img.icons8.com/color/96/000000/robot-3.png',
  'https://img.icons8.com/color/96/000000/robot-4.png',
  'https://img.icons8.com/color/96/000000/robot-5.png',
  'https://img.icons8.com/color/96/000000/robot-6.png',
  'https://img.icons8.com/color/96/000000/robot-7.png',
  'https://img.icons8.com/color/96/000000/robot-8.png',
  'https://img.icons8.com/color/96/000000/robot-9.png',
  'https://img.icons8.com/color/96/000000/robot-10.png',
  'https://img.icons8.com/color/96/000000/robot-11.png',
  // Cute cartoon robots
  'https://img.icons8.com/fluency/96/000000/robot-2.png',
  'https://img.icons8.com/fluency/96/000000/robot-3.png',
  'https://img.icons8.com/fluency/96/000000/robot-4.png',
  'https://img.icons8.com/fluency/96/000000/robot-5.png',
  'https://img.icons8.com/fluency/96/000000/robot-6.png',
  'https://img.icons8.com/fluency/96/000000/robot-7.png',
  'https://img.icons8.com/fluency/96/000000/robot-8.png',
  'https://img.icons8.com/fluency/96/000000/robot-9.png',
  'https://img.icons8.com/fluency/96/000000/robot-10.png',
  'https://img.icons8.com/fluency/96/000000/robot-11.png',
]

// User avatars (more human-like)
export const USER_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format',
]

/**
 * Get a random robot avatar
 */
export const getRandomRobotAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * ROBOT_AVATARS.length)
  return ROBOT_AVATARS[randomIndex]
}

/**
 * Get a random user avatar
 */
export const getRandomUserAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * USER_AVATARS.length)
  return USER_AVATARS[randomIndex]
}

/**
 * Get a consistent avatar based on a seed (for consistent avatars per user/thread)
 */
export const getAvatarBySeed = (seed: string, isRobot: boolean = false): string => {
  const avatars = isRobot ? ROBOT_AVATARS : USER_AVATARS
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % avatars.length
  return avatars[index]
}

/**
 * Get avatar for a specific user ID (consistent across sessions)
 */
export const getUserAvatar = (userId: string): string => {
  return getAvatarBySeed(userId, false)
}

/**
 * Get avatar for a specific bot/thread (consistent across sessions)
 */
export const getBotAvatar = (botId: string = 'default-bot'): string => {
  return getAvatarBySeed(botId, true)
}

/**
 * Get avatar for current thread (consistent for the thread)
 */
export const getThreadAvatar = (threadId: string): string => {
  return getAvatarBySeed(threadId, true)
}

/**
 * Get avatar for message (consistent based on message ID)
 */
export const getMessageAvatar = (messageId: string, isUser: boolean): string => {
  return getAvatarBySeed(messageId, !isUser)
}
