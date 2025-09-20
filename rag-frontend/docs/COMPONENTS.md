# Component Documentation

This document provides detailed information about the React components used in the RAG Chat Bot application.

## Component Architecture

The application follows a modular component architecture with clear separation of concerns:

```
components/
├── Chat/                    # Main chat interface
├── Login/                   # Authentication components
├── GlobalSnackbar/          # Global error notifications
├── LoadingScreen/           # Loading states
└── TimezoneInfo/           # Timezone display
```

## Chat Components

### ChatLayout

**Location:** `src/components/Chat/ChatLayout.tsx`

The main layout component that orchestrates the chat interface and chat history.

**Props:**
- None (uses Redux state)

**Features:**
- Responsive layout with chat history sidebar
- Minimum width constraints for mobile compatibility
- Flex-based layout system

**Usage:**
```tsx
<ChatLayout />
```

### Chat

**Location:** `src/components/Chat/Chat.tsx`

The main chat interface component with message handling and input functionality.

**Props:**
- `ref` - Forwarded ref for exposing `handleNewChat` method

**Features:**
- Message display with typing indicators
- Message input with send functionality
- Thread and regular chat mode switching
- Auto-scroll to latest messages
- Error handling for message sending

**Methods (via ref):**
- `handleNewChat()` - Clears current chat and starts new conversation

**Usage:**
```tsx
const chatRef = useRef<ChatRef>(null);

<Chat ref={chatRef} />
```

### ChatHeader

**Location:** `src/components/Chat/ChatComponents/ChatHeader.tsx`

Displays the chat header with bot information.

**Props:**
- None

**Features:**
- Bot avatar display
- Chat title and subtitle
- Consistent styling with Material-UI

### MessageBubble

**Location:** `src/components/Chat/ChatComponents/MessageBubble.tsx`

Individual message bubble component for displaying chat messages.

**Props:**
```typescript
interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: string;
    isTyping?: boolean;
    sources?: Source[];
  };
  userPicture?: string;
  onCopy?: (content: string) => void;
}
```

**Features:**
- User and bot message differentiation
- Timestamp display with timezone support
- Copy message functionality
- Source links for bot responses
- Typing indicator support

### MessageInput

**Location:** `src/components/Chat/ChatComponents/MessageInput.tsx`

Text input component for sending messages.

**Props:**
```typescript
interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  disabled?: boolean;
}
```

**Features:**
- Multi-line text input
- Send button with keyboard shortcut (Enter)
- File attachment button (placeholder)
- Disabled state during message sending
- Auto-resize textarea

### MessagesList

**Location:** `src/components/Chat/ChatComponents/MessagesList.tsx`

Container component for displaying a list of messages.

**Props:**
```typescript
interface MessagesListProps {
  messages: Message[];
  userPicture?: string;
  onCopyMessage?: (content: string) => void;
  isLoading?: boolean;
}
```

**Features:**
- Message list rendering with fade animations
- Loading state display
- Empty state handling
- Message copy functionality

### TypingIndicator

**Location:** `src/components/Chat/ChatComponents/TypingIndicator.tsx`

Animated typing indicator for showing when the bot is responding.

**Props:**
- None

**Features:**
- Animated bouncing dots
- CSS keyframe animations
- Consistent styling with message bubbles

### WelcomeMessage

**Location:** `src/components/Chat/ChatComponents/WelcomeMessage.tsx`

Welcome screen displayed when no messages are present.

**Props:**
```typescript
interface WelcomeMessageProps {
  onSuggestionClick?: (suggestion: string) => void;
}
```

**Features:**
- Welcome message with bot avatar
- Suggested conversation starters
- Clickable suggestions that populate input
- Centered layout with proper spacing

## Chat History Components

### ChatHistory

**Location:** `src/components/Chat/ChatHistory/ChatHistory.tsx`

Main chat history sidebar component.

**Props:**
```typescript
interface ChatHistoryProps {
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
}
```

**Features:**
- Thread list display with pagination
- Loading and error states
- Load more functionality
- Fixed header and footer layout
- Scrollable content area

### ChatHistoryHeader

**Location:** `src/components/Chat/ChatHistory/ChatHistoryComponents/ChatHistoryHeader.tsx`

Header component for the chat history sidebar.

**Props:**
```typescript
interface ChatHistoryHeaderProps {
  chatCount: number;
  onNewChat?: () => void;
}
```

**Features:**
- Chat count display
- New chat button
- Consistent styling with main header

### ChatHistoryItem

**Location:** `src/components/Chat/ChatHistory/ChatHistoryComponents/ChatHistoryItem.tsx`

Individual chat history item component.

**Props:**
```typescript
interface ChatHistoryItemProps {
  chat: {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
    isActive: boolean;
    messageCount: number;
  };
  onChatSelect?: (chatId: string) => void;
}
```

**Features:**
- Thread title and message count display
- Timestamp formatting
- Active state highlighting
- Delete thread functionality with confirmation
- Click to select thread

### ChatHistoryList

**Location:** `src/components/Chat/ChatHistory/ChatHistoryComponents/ChatHistoryList.tsx`

Container for chat history items.

**Props:**
```typescript
interface ChatHistoryListProps {
  chatHistory: ChatHistoryItem[];
  onChatSelect?: (chatId: string) => void;
}
```

**Features:**
- List rendering with Material-UI List component
- Proper spacing and styling
- Click handling for item selection

### ChatHistoryFooter

**Location:** `src/components/Chat/ChatHistory/ChatHistoryComponents/ChatHistoryFooter.tsx`

Footer component with logout functionality.

**Props:**
- None

**Features:**
- Logout button with confirmation
- Redux integration for auth state
- Full-width button design
- Error color scheme for logout action

## Authentication Components

### Login

**Location:** `src/components/Login/Login.tsx`

Main login component with Google OAuth integration.

**Props:**
- None

**Features:**
- Google OAuth login button
- Split-screen layout with branding
- Error handling with modal display
- Responsive design
- Loading states during authentication

## Global Components

### GlobalSnackbar

**Location:** `src/components/GlobalSnackbar/GlobalSnackbar.tsx`

Global error notification system.

**Props:**
- None

**Features:**
- Top-right positioning
- Auto-hide functionality (6 seconds for errors)
- Severity-based styling (error, warning, info, success)
- Manual close capability
- Redux integration for state management

### LoadingScreen

**Location:** `src/components/LoadingScreen/LoadingScreen.tsx`

Full-screen loading component.

**Props:**
```typescript
interface LoadingScreenProps {
  message?: string;
}
```

**Features:**
- Centered loading spinner
- Customizable loading message
- Full-screen overlay
- Consistent branding

## Styling System

### Theme Configuration

**Location:** `src/styles/theme.ts`

Material-UI theme configuration with custom colors and typography.

**Features:**
- Custom color palette
- Typography settings
- Component overrides
- Responsive breakpoints

### Component Styles

Each component has its own styles file following the pattern:
- `ComponentName.styles.ts` - Style functions using Material-UI's `sx` prop
- Consistent naming conventions
- Responsive design patterns
- Theme integration

## State Management

### Redux Integration

All components integrate with Redux for state management:

- **useAppSelector** - Access Redux state
- **useAppDispatch** - Dispatch actions
- **Typed hooks** - TypeScript support for Redux

### State Structure

```typescript
interface RootState {
  auth: AuthState;
  chat: ChatState;
  threads: ThreadsState;
  global: GlobalState;
}
```

## Performance Considerations

### Optimization Techniques

1. **React.memo** - Prevent unnecessary re-renders
2. **useCallback** - Memoize event handlers
3. **useMemo** - Memoize expensive calculations
4. **Lazy loading** - Code splitting for large components
5. **Virtual scrolling** - For large message lists (future)

### Best Practices

- Keep components small and focused
- Use TypeScript for type safety
- Implement proper error boundaries
- Optimize bundle size with tree shaking
- Use Material-UI's built-in optimizations

## Testing

### Component Testing

Each component should have:
- Unit tests for rendering
- Props validation tests
- User interaction tests
- Error state tests

### Testing Utilities

```typescript
// Example test setup
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};
```

## Accessibility

### ARIA Support

- Proper ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### Material-UI Accessibility

- Built-in accessibility features
- Color contrast compliance
- Touch target sizing
- Semantic HTML structure

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills

- Modern JavaScript features
- CSS Grid and Flexbox
- Web APIs (localStorage, fetch)

## Future Enhancements

### Planned Features

1. **Message Search** - Search through chat history
2. **File Upload** - Attach files to messages
3. **Message Editing** - Edit sent messages
4. **Dark Mode** - Theme switching
5. **Voice Messages** - Audio message support
6. **Reactions** - Message reactions and emojis

### Performance Improvements

1. **Virtual Scrolling** - For large message lists
2. **Message Pagination** - Lazy load messages
3. **Image Optimization** - Compress and resize images
4. **Service Worker** - Offline support
5. **WebSocket** - Real-time messaging
