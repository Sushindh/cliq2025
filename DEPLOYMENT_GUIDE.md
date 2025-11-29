# Deployment & Production Guide

## Pre-Deployment Checklist

Before deploying to production, verify:

### Code Quality
- [ ] No console.log statements left in production code
- [ ] No API keys hardcoded anywhere
- [ ] Error handling implemented for all API calls
- [ ] No memory leaks in Socket.io listeners
- [ ] All dependencies installed and versions locked
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] No unused imports or variables

### Testing
- [ ] All manual test cases pass (see TESTING_GUIDE.md)
- [ ] API key validation works correctly
- [ ] Rate limiting prevents 429 errors
- [ ] Cache expiration working (5 minutes)
- [ ] Multi-user sync tested with 2+ users
- [ ] Error messages are helpful and clear
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable (<3s for suggestions)

### Configuration
- [ ] `.env` has valid Gemini API key
- [ ] `.env` file is in `.gitignore` (not committed)
- [ ] PORT variables set correctly in all configs
- [ ] CORS properly configured if needed
- [ ] Socket.io timeout settings optimized
- [ ] Build configuration finalized

### Documentation
- [ ] README.md updated with setup instructions
- [ ] All documentation files reviewed
- [ ] Troubleshooting guide covers common issues
- [ ] API documentation complete
- [ ] Component prop interfaces documented

---

## Production Build

### Step 1: Build Client
```powershell
cd D:\BTECH_CSEcore\Projects\zoho\client
npm run build
```

**Expected Output:**
```
✓ 123 modules transformed.
dist/index.html                  0.45 kB
dist/assets/App-abc123.js        45.2 kB
dist/assets/index-def456.css     12.3 kB
✓ built in 2.34s
```

**What it does:**
- Minifies and bundles all JavaScript
- Optimizes CSS with Tailwind purge
- Creates production-ready files in `dist/` folder
- Disables source maps for security

### Step 2: Build Server (if needed)
The Express server doesn't need a build step, but verify:
```powershell
cd D:\BTECH_CSEcore\Projects\zoho\server
npm install --production
```

This removes dev dependencies and reduces package size.

### Step 3: Verify Build Artifacts
```powershell
# Check client build
Get-ChildItem D:\BTECH_CSEcore\Projects\zoho\client\dist

# Should show:
# - index.html
# - assets/ (with .js and .css files)
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Setup Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Import your repository
4. Configure build settings

#### Deploy Client
```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
cd D:\BTECH_CSEcore\Projects\zoho\client
vercel
```

**Vercel Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "envPrefix": "VITE_"
}
```

**Environment Variables on Vercel:**
- No API keys needed (backend handles them)
- Only backend URL needed: `VITE_API_URL=https://your-server.com`

### Option 2: Render (Free Tier for Backend)

#### Deploy Server
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure environment

**Render Configuration:**
```
Build Command: npm install
Start Command: npm start
Environment Variables:
  - GEMINI_API_KEY: [your api key]
  - NODE_ENV: production
  - PORT: 10000 (Render assigns port)
```

### Option 3: Docker (Containerized)

#### Create Dockerfile (Client)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Create Dockerfile (Server)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server.js .
EXPOSE 5000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

#### Build and Push
```powershell
# Build images
docker build -t zoho-client:latest -f client/Dockerfile ./client
docker build -t zoho-server:latest -f server/Dockerfile ./server

# Tag for registry
docker tag zoho-client:latest your-registry/zoho-client:latest
docker tag zoho-server:latest your-registry/zoho-server:latest

# Push to Docker Hub or private registry
docker push your-registry/zoho-client:latest
docker push your-registry/zoho-server:latest
```

#### Run with Docker Compose
```yaml
version: '3.9'

services:
  client:
    image: zoho-client:latest
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:5000
    depends_on:
      - server

  server:
    image: zoho-server:latest
    ports:
      - "5000:5000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NODE_ENV=production
    restart: always
```

---

## Environment Setup (Production)

### Server .env (Production)
```env
# Production Configuration
GEMINI_API_KEY=your_production_key_here
NODE_ENV=production
PORT=5000
MAX_REQUESTS_PER_MINUTE=10
CACHE_TTL=300000

# Optional: For monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
```

### Security Considerations
1. **API Key Rotation:** Rotate Gemini API keys every 90 days
2. **CORS:** Restrict to your domain only
3. **Rate Limiting:** Adjust MAX_REQUESTS_PER_MINUTE based on users
4. **HTTPS:** Always use HTTPS in production
5. **Headers:** Enable security headers (HSTS, CSP)

---

## Monitoring & Logging

### Client-Side Monitoring
```javascript
// Add Google Analytics or similar
import { useEffect } from 'react';

useEffect(() => {
  // Track page views
  gtag('pageview');
}, []);
```

### Server-Side Logging
```javascript
// Add Winston or Pino logger
const logger = require('pino')();

app.post('/api/fix-text', (req, res) => {
  logger.info({
    endpoint: '/api/fix-text',
    timestamp: new Date(),
    requestSize: req.body.text.length,
  });
});
```

### Error Tracking
```javascript
// Integrate Sentry for error monitoring
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

---

## Performance Optimization (Production)

### Client Optimization
1. **Gzip Compression:** Enabled by default on most hosts
2. **Asset Optimization:** Already handled by Vite build
3. **Caching Headers:** Set max-age for static assets
4. **Code Splitting:** Done by Vite automatically

```nginx
# nginx.conf for production
gzip on;
gzip_types text/plain text/css text/javascript application/json application/javascript;
gzip_min_length 1000;

# Cache busting for assets
location ~* \.(?:js|css)$ {
  expires 30d;
  add_header Cache-Control "public, immutable";
}

# No cache for HTML
location ~* \.html$ {
  expires 0;
  add_header Cache-Control "public, must-revalidate";
}
```

### Server Optimization
1. **Connection Pooling:** For database (future)
2. **Request Queuing:** Handle spikes gracefully
3. **Caching Layer:** Already implemented
4. **Rate Limiting:** Already implemented

```javascript
// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

---

## Database Integration (Future)

### MongoDB Setup
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const MessageSchema = new mongoose.Schema({
  username: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  reactions: [String],
});

const Message = mongoose.model('Message', MessageSchema);
```

### PostgreSQL Setup
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Message storage
app.post('/api/messages', async (req, res) => {
  const { username, content } = req.body;
  const result = await pool.query(
    'INSERT INTO messages (username, content) VALUES ($1, $2) RETURNING *',
    [username, content]
  );
  res.json(result.rows[0]);
});
```

---

## Scaling Considerations

### Horizontal Scaling
```javascript
// Use Redis for session management across servers
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Store user sessions in Redis
app.use(session({
  store: new RedisStore({ client }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
```

### Load Balancing
Use NGINX to distribute traffic:
```nginx
upstream backend {
  server server1.example.com:5000;
  server server2.example.com:5000;
  server server3.example.com:5000;
}

server {
  location /api {
    proxy_pass http://backend;
  }
}
```

### Database Scaling
- Use read replicas for scaling read operations
- Implement database sharding for large datasets
- Use caching layers (Redis) for frequently accessed data

---

## Rollback Procedure

### If Deployment Fails
1. **Identify Issue:** Check logs and error messages
2. **Rollback Steps:**
   ```powershell
   # Vercel
   vercel rollback

   # Or manually redeploy previous version
   git checkout previous-commit
   npm run build
   vercel --prod
   ```

3. **Notify Users:** Post in status page if critical

### Data Backup Before Deployment
```powershell
# Export messages if stored in database
mongodump --out /backups/$(Get-Date -Format 'yyyyMMdd')
```

---

## Post-Deployment Verification

After deployment, verify:

### Smoke Tests
- [ ] Frontend loads without errors
- [ ] Can send a message successfully
- [ ] Correction suggestions appear
- [ ] Draft assistant opens
- [ ] Tab/Esc keys work in draft
- [ ] Multi-user sync works
- [ ] No 429 rate limit errors

### Performance Tests
- [ ] Page loads in < 3 seconds
- [ ] Suggestions appear in < 2 seconds
- [ ] Message send completes in < 1 second
- [ ] No memory leaks over 1 hour

### Security Tests
- [ ] API key not exposed in network requests
- [ ] CORS headers correctly set
- [ ] No sensitive data in logs
- [ ] SSL/TLS certificate valid

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd client && npm ci
          cd ../server && npm ci
      
      - name: Build client
        run: cd client && npm run build
      
      - name: Run tests
        run: cd server && npm test
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly: Check error logs
- [ ] Monthly: Review performance metrics
- [ ] Monthly: Update dependencies (npm update)
- [ ] Quarterly: Security audit
- [ ] Quarterly: API key rotation
- [ ] Annually: Full penetration test

### Monitoring Setup
1. **Uptime Monitoring:** https://uptimerobot.com
2. **Error Tracking:** https://sentry.io
3. **Performance:** https://newrelic.com
4. **Logs:** ELK Stack or CloudWatch

### Contact & Escalation
- **Frontend Issues:** Check Vercel dashboard
- **Backend Issues:** Check Render dashboard
- **Database Issues:** Check MongoDB Atlas
- **API Issues:** Check Google Cloud Console

---

**Deployment Document Version:** 1.0
**Last Updated:** [Current Date]
**Maintained By:** Development Team

