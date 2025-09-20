import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import {
  Box,
  useTheme,
} from "@mui/material"
import { useAppSelector, useAppDispatch } from "../../store/hooks"
import { createChatStyles } from "./Chat.styles"
import type { Message } from "../../types/chat"
import {
  ChatHeader,
  WelcomeMessage,
  MessagesList,
  MessageInput,
} from "./ChatComponents"
import {
  addMessage,
  removeTypingMessage,
  sendMessageThunk,
  clearMessages
} from "../../modules/chat"
import { clearThreadMessages, setSelectedThreadId, addMessageToThread, removeTypingMessageFromThread } from "../../modules/threads"
import { GlobalFeature } from "../../types/global"

/**
 * Reference interface for Chat component methods
 */
export interface ChatRef {
  /** Clears current chat and starts a new conversation */
  handleNewChat: () => void
}

/**
 * Main Chat component that provides the chat interface with message handling,
 * thread management, and real-time messaging capabilities.
 * 
 * Features:
 * - Message display with typing indicators
 * - Thread and regular chat mode switching
 * - Auto-scroll to latest messages
 * - Error handling for message sending
 * - Welcome message for new conversations
 * 
 * @example
 * ```tsx
 * const chatRef = useRef<ChatRef>(null);
 * 
 * const handleNewChat = () => {
 *   chatRef.current?.handleNewChat();
 * };
 * 
 * <Chat ref={chatRef} />
 * ```
 */
const Chat = forwardRef<ChatRef>((_, ref) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { messages } = useAppSelector((state) => state.chat)
  const { currentThread, selectedThreadId } = useAppSelector((state) => state.threads)
  const { loading } = useAppSelector((state) => state.global)
  const styles = createChatStyles(theme)
  
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Convert thread messages to chat messages format
  const threadMessages: Message[] = currentThread.messages.map(threadMsg => ({
    id: threadMsg.id,
    content: threadMsg.content,
    isUser: threadMsg.role === 'user',
    timestamp: threadMsg.timestamp, // Already a string from thread messages
    isTyping: threadMsg.id.startsWith('typing-') // Check if it's a typing message
  }))

  // Use thread messages if a thread is selected, otherwise use regular chat messages
  const displayMessages = selectedThreadId ? threadMessages : messages

  useEffect(() => {
    scrollToBottom()
  }, [displayMessages])

  const handleNewChat = () => {
    dispatch(clearMessages())
    dispatch(clearThreadMessages())
    dispatch(setSelectedThreadId(null))
  }

  // Expose handleNewChat function to parent component
  useImperativeHandle(ref, () => ({
    handleNewChat
  }))

  const handleSend = async () => {
    if (!inputMessage.trim() || loading[GlobalFeature.CHAT_MESSAGE]) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    }

    // Add user message immediately to the appropriate state
    if (selectedThreadId) {
      // If we're in a thread context, add to thread messages
      const threadUserMessage = {
        id: userMessage.id,
        content: userMessage.content,
        role: 'user' as const,
        timestamp: userMessage.timestamp
      }
      dispatch(addMessageToThread(threadUserMessage))
    } else {
      // If we're in regular chat, add to regular messages
      dispatch(addMessage(userMessage))
    }
    
    setInputMessage("")

    // Add typing indicator to the appropriate state
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: "",
      isUser: false,
      timestamp: new Date().toISOString(),
      isTyping: true
    }
    
    if (selectedThreadId) {
      // Add typing indicator to thread messages
      const threadTypingMessage = {
        id: typingMessage.id,
        content: typingMessage.content,
        role: 'assistant' as const,
        timestamp: typingMessage.timestamp
      }
      dispatch(addMessageToThread(threadTypingMessage))
    } else {
      // Add typing indicator to regular messages
      dispatch(addMessage(typingMessage))
    }

    // Send message via thunk
    try {
      const result = await dispatch(sendMessageThunk(inputMessage))
      
      // Remove typing indicator from appropriate state
      if (selectedThreadId) {
        dispatch(removeTypingMessageFromThread())
      } else {
        dispatch(removeTypingMessage())
      }
      
      // Check if the thunk was rejected
      if (sendMessageThunk.rejected.match(result)) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "Sorry, I encountered an error. Please try again.",
          isUser: false,
          timestamp: new Date().toISOString()
        }
        
        if (selectedThreadId) {
          const threadErrorMessage = {
            id: errorMessage.id,
            content: errorMessage.content,
            role: 'assistant' as const,
            timestamp: errorMessage.timestamp
          }
          dispatch(addMessageToThread(threadErrorMessage))
        } else {
          dispatch(addMessage(errorMessage))
        }
      }
    } catch (error) {
      // Error is already handled by the global error system in the thunk
      
      // Remove typing indicator from appropriate state
      if (selectedThreadId) {
        dispatch(removeTypingMessageFromThread())
      } else {
        dispatch(removeTypingMessage())
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date().toISOString()
      }
      
      if (selectedThreadId) {
        const threadErrorMessage = {
          id: errorMessage.id,
          content: errorMessage.content,
          role: 'assistant' as const,
          timestamp: errorMessage.timestamp
        }
        dispatch(addMessageToThread(threadErrorMessage))
      } else {
        dispatch(addMessage(errorMessage))
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    textareaRef.current?.focus()
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // TODO: Add toast notification for copy success
  }

  const handleAttachFile = () => {
    // TODO: Implement file attachment functionality
  }

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <ChatHeader />

      {/* Messages Container */}
      <Box sx={styles.messagesContainer}>
        {displayMessages.length === 0 && !loading[GlobalFeature.MESSAGES] ? (
          <WelcomeMessage onSuggestionClick={handleSuggestionClick} />
        ) : (
          <MessagesList
            messages={displayMessages}
            userPicture={user?.picture}
            onCopyMessage={handleCopyMessage}
            isLoading={loading[GlobalFeature.MESSAGES]}
          />
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Container */}
      <MessageInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={handleSend}
        onAttach={handleAttachFile}
        disabled={loading[GlobalFeature.CHAT_MESSAGE]}
      />
    </Box>
  )
})

Chat.displayName = 'Chat'

export default Chat