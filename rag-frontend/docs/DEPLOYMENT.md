# Deployment Guide

This guide covers various deployment options for the RAG Chat Bot application.

## Prerequisites

Before deploying, ensure you have:

- A production-ready backend API
- Google OAuth credentials configured for production
- Domain name (for production deployments)
- SSL certificate (for HTTPS)

## Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```env
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_ENV=production
```

### Google OAuth Production Setup

1. **Update Google Cloud Console:**
   - Add your production domain to authorized origins
   - Update redirect URIs
   - Enable production APIs

2. **Update OAuth Settings:**
   ```javascript
   // In your Google OAuth configuration
   authorizedOrigins: [
     'https://yourdomain.com',
     'https://www.yourdomain.com'
   ]
   ```

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the build
npm run preview
```

### Build Optimization

The build process includes:

- **Code splitting** - Automatic chunk splitting
- **Tree shaking** - Remove unused code
- **Minification** - Compress JavaScript and CSS
- **Asset optimization** - Optimize images and fonts
- **Source maps** - For debugging (optional in production)

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides excellent support for React applications with automatic deployments.

#### Setup Steps:

1. **Connect Repository:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables:**
   - Go to Vercel Dashboard
   - Navigate to Project Settings
   - Add environment variables:
     - `VITE_GOOGLE_CLIENT_ID`
     - `VITE_API_BASE_URL`

3. **Custom Domain (Optional):**
   - Add your domain in Vercel Dashboard
   - Update DNS records
   - SSL certificate is automatically provisioned

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_GOOGLE_CLIENT_ID": "@google-client-id",
    "VITE_API_BASE_URL": "@api-base-url"
  }
}
```

### 2. Netlify

Netlify offers simple deployment with drag-and-drop or Git integration.

#### Setup Steps:

1. **Build Configuration:**
   Create `netlify.toml`:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Environment Variables:**
   - Set in Netlify Dashboard
   - Or use `netlify env:set` command

### 3. AWS S3 + CloudFront

For enterprise deployments with AWS infrastructure.

#### Setup Steps:

1. **Build and Upload:**
   ```bash
   # Build the application
   npm run build
   
   # Upload to S3
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

2. **CloudFront Configuration:**
   ```json
   {
     "Origins": [
       {
         "DomainName": "your-bucket-name.s3.amazonaws.com",
         "Id": "S3-your-bucket-name",
         "S3OriginConfig": {
           "OriginAccessIdentity": ""
         }
       }
     ],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-your-bucket-name",
       "ViewerProtocolPolicy": "redirect-to-https",
       "Compress": true
     }
   }
   ```

3. **Environment Variables:**
   - Use AWS Systems Manager Parameter Store
   - Or build-time environment injection

### 4. Docker Deployment

For containerized deployments.

#### Dockerfile:

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

#### Docker Commands:

```bash
# Build image
docker build -t rag-chat-bot .

# Run container
docker run -p 80:80 rag-chat-bot

# With environment variables
docker run -p 80:80 \
  -e VITE_GOOGLE_CLIENT_ID=your_client_id \
  -e VITE_API_BASE_URL=your_api_url \
  rag-chat-bot
```

### 5. GitHub Pages

For simple static hosting.

#### Setup Steps:

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/rag-chat-bot"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## Performance Optimization

### Build Optimizations

1. **Bundle Analysis:**
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   npm run build -- --analyze
   ```

2. **Code Splitting:**
   ```typescript
   // Lazy load components
   const Chat = lazy(() => import('./components/Chat'));
   const Login = lazy(() => import('./components/Login'));
   ```

3. **Asset Optimization:**
   - Compress images
   - Use WebP format
   - Implement lazy loading
   - Optimize fonts

### Runtime Optimizations

1. **Service Worker:**
   ```typescript
   // Register service worker for caching
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js');
   }
   ```

2. **CDN Integration:**
   - Use CDN for static assets
   - Implement edge caching
   - Optimize delivery

## Security Considerations

### HTTPS Configuration

1. **SSL Certificate:**
   - Use Let's Encrypt for free certificates
   - Configure automatic renewal
   - Implement HSTS headers

2. **Security Headers:**
   ```nginx
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com" always;
   ```

### Environment Security

1. **Environment Variables:**
   - Never commit sensitive data
   - Use secure storage for secrets
   - Rotate credentials regularly

2. **API Security:**
   - Implement CORS properly
   - Use JWT token validation
   - Rate limiting on backend

## Monitoring and Analytics

### Error Tracking

1. **Sentry Integration:**
   ```typescript
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: process.env.NODE_ENV,
   });
   ```

2. **Error Boundaries:**
   ```typescript
   <Sentry.ErrorBoundary fallback={ErrorFallback}>
     <App />
   </Sentry.ErrorBoundary>
   ```

### Performance Monitoring

1. **Web Vitals:**
   ```typescript
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

2. **Analytics:**
   - Google Analytics 4
   - Custom event tracking
   - User behavior analysis

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        VITE_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all environment variables are set
   - Clear node_modules and reinstall

2. **Runtime Errors:**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration

3. **Authentication Issues:**
   - Verify Google OAuth configuration
   - Check domain authorization
   - Validate JWT token handling

### Debug Mode

Enable debug mode for troubleshooting:

```typescript
// Add to environment variables
VITE_DEBUG=true

// In your code
if (import.meta.env.VITE_DEBUG) {
  console.log('Debug information:', data);
}
```

## Rollback Strategy

### Version Management

1. **Tag Releases:**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Rollback Process:**
   ```bash
   # Revert to previous version
   git checkout v0.9.0
   npm run build
   # Redeploy
   ```

### Database Migrations

- Always backup before deployment
- Test migrations in staging environment
- Implement rollback procedures
- Monitor deployment health

## Maintenance

### Regular Tasks

1. **Security Updates:**
   - Update dependencies monthly
   - Monitor security advisories
   - Apply patches promptly

2. **Performance Monitoring:**
   - Monitor Core Web Vitals
   - Analyze user feedback
   - Optimize based on metrics

3. **Backup Strategy:**
   - Regular database backups
   - Configuration backups
   - Disaster recovery plan

This deployment guide ensures a smooth, secure, and scalable deployment of your RAG Chat Bot application.
