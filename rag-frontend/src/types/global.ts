/**
/**
/**
 * Global state feature types for loading and error management
 */
export enum GlobalFeature {
  // Chat features
  CHAT_MESSAGE = 'chatMessage',
  MESSAGES = 'messages',
  // Thread features
  CHAT_HISTORY = 'chatHistory',
  DELETE_THREAD = 'deleteThread',
  
  // Auth features
  AUTH = 'auth',
  
  // General features
  APP = 'app',
}

/**
 * Type for feature keys
 */
export type FeatureKey = keyof typeof GlobalFeature

/**
 * Type for feature values
 */
export type FeatureValue = GlobalFeature
