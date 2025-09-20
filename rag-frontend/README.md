# RAG Chat Bot

A modern, responsive RAG (Retrieval-Augmented Generation) chatbot application built with React, TypeScript, and Material-UI. This application provides an intuitive chat interface with thread management, real-time messaging, and robust error handling.

## 🚀 Features

### Core Functionality
- **Real-time Chat Interface** - Send and receive messages with typing indicators
- **Thread Management** - Organize conversations into separate threads
- **Message History** - Persistent chat history with pagination
- **Google OAuth Authentication** - Secure login with Google accounts
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### User Experience
- **Modern UI/UX** - Beautiful Material-UI design with custom theming
- **Smooth Animations** - Elegant transitions and loading states
- **Global Error Handling** - User-friendly error messages with snackbar notifications
- **Timezone Support** - Automatic timezone detection and formatting
- **Copy Messages** - Easy message copying functionality

### Technical Features
- **TypeScript** - Full type safety throughout the application
- **Redux Toolkit** - Centralized state management with RTK Query
- **Modular Architecture** - Clean separation of concerns
- **Error Recovery** - Graceful error handling prevents app crashes
- **Performance Optimized** - Efficient rendering and state updates

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Cloud Console** account (for OAuth setup)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Copy the Client ID to your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Chat/            # Chat interface components
│   ├── Login/           # Authentication components
│   ├── GlobalSnackbar/  # Global error notifications
│   └── LoadingScreen/   # Loading states
├── modules/             # Redux modules
│   ├── auth/           # Authentication state
│   ├── chat/           # Chat messages state
│   ├── threads/        # Thread management state
│   └── global/         # Global app state
├── store/              # Redux store configuration
├── api/                # API client and endpoints
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # Global styles and themes
└── constants/          # Application constants
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

### Backend API Endpoints

The application expects the following API endpoints:

- `GET /health` - Health check
- `POST /query` - Send chat message
- `GET /chat/threads` - Get user threads
- `GET /chat/threads/{id}` - Get thread messages
- `DELETE /chat/threads/{id}` - Delete thread

## 🎨 Customization

### Theming
The application uses Material-UI theming. Customize the theme in `src/styles/theme.ts`:

```typescript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  // ... other theme options
})
```

### Styling
Component styles are organized using Material-UI's `sx` prop and custom style functions. Each component has its own styles file for maintainability.

## 🧪 Testing

### Running Tests
```bash
npm run test
# or
yarn test
```

### Test Coverage
```bash
npm run test:coverage
# or
yarn test:coverage
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for new functions
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Google OAuth not working**
- Verify your Client ID is correct
- Check that your domain is added to authorized origins
- Ensure Google+ API is enabled

**API connection issues**
- Verify the backend server is running
- Check the API base URL in environment variables
- Ensure CORS is properly configured on the backend

**Build failures**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core chat functionality
- **v1.1.0** - Added thread management and improved UI
- **v1.2.0** - Enhanced error handling and global state management

---

Built with ❤️ using React, TypeScript, and Material-UI