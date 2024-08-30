# 🛠️ Development Setup Guide

Comprehensive guide for setting up the YouTube Downloader development
environment.

## 📋 Prerequisites Checklist

### Required Software

- [ ] **Node.js 19+** - [Download](https://nodejs.org/)
- [ ] **Python 3.10+** - [Download](https://python.org/)
- [ ] **pnpm** - Package manager
- [ ] **Git** - Version control
- [ ] **FFmpeg** - Video processing (automatic via pip)

### Recommended Tools

- [ ] **VS Code** - Code editor with extensions:
  - [ ] Python extension
  - [ ] TypeScript extension
  - [ ] Tailwind CSS IntelliSense
  - [ ] Prettier - Code formatter
  - [ ] ESLint - JavaScript linter
- [ ] **Postman** - API testing
- [ ] **Browser DevTools** - Debugging

## 🚀 Quick Setup (5 minutes)

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd YT-Downloader

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**

```bash
pnpm dev
```

### 3. Verify Setup

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:8000>
- API Docs: <http://localhost:8000/docs>

✅ **Setup Complete!** Try downloading a video to test everything works.

## 🔧 Detailed Setup Instructions

### Frontend Setup (Next.js + TypeScript)

#### 1. Install Node.js Dependencies

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Install project dependencies
pnpm install

# Verify installation
pnpm list
```

#### 2. Configure Environment

```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3. Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Backend Setup (FastAPI + Python)

#### 1. Python Environment Setup

```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt
```

#### 2. FFmpeg Installation

#### Option A: Automatic (Recommended)

```bash
# FFmpeg included with imageio-ffmpeg
pip install imageio-ffmpeg

# Test installation
python test_ffmpeg.py
```

#### Option B: Manual Installation

- **Windows**: Download from <https://ffmpeg.org/download.html>
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

#### 3. Backend Development Commands

```bash
# Start development server
python main.py

# Start with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
python test_api.py
python test_ffmpeg.py

# Check system info
curl http://localhost:8000/api/system-info
```

## 🏗️ Development Workflow

### Daily Development Flow

1. **Start Development Servers**

   ```bash
   # Terminal 1
   cd backend && python main.py
   
   # Terminal 2
   pnpm dev
   ```

1. **Make Changes**
   - Frontend: Edit files in `components/`, `app/`, `lib/`
   - Backend: Edit files in `backend/`
   - Both servers auto-reload on changes

1. **Test Changes**
   - Frontend: Check <http://localhost:3000>
   - Backend: Use <http://localhost:8000/docs>
   - API: Test with Postman or curl

1. **Commit & Push**

   ```bash
   git add .
   git commit -m \"feat: description of changes\"
   git push
   ```

### Feature Development Process

#### 1. Planning

- [ ] Define feature requirements
- [ ] Plan API changes (if needed)
- [ ] Design UI/UX (if frontend changes)
- [ ] Estimate development time

#### 2. Backend Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make backend changes
# Edit backend/main.py or related files

# Test backend changes
python test_api.py
curl -X POST http://localhost:8000/api/your-endpoint
```

#### 3. Frontend Development

```bash
# Create new component (if needed)
touch components/your-component.tsx

# Edit existing components
# Update lib/api.ts for new API calls

# Test frontend changes
# Check browser for visual/functional changes
```

#### 4. Integration Testing

- [ ] Test frontend + backend integration
- [ ] Test error scenarios
- [ ] Test different video types
- [ ] Verify performance impact

#### 5. Code Review & Merge

- [ ] Self-review code changes
- [ ] Update documentation if needed
- [ ] Create pull request
- [ ] Merge after review

## 🧪 Testing Guide

### Backend Testing

#### Unit Tests

```bash
# Test FFmpeg functionality
python test_ffmpeg.py

# Test API endpoints
python test_api.py

# Test specific video types
python test_specific_video.py
```

#### Manual API Testing

```bash
# Health check
curl http://localhost:8000/

# System info
curl http://localhost:8000/api/system-info

# Video info
curl -X POST http://localhost:8000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Smart download info  
curl -X POST http://localhost:8000/api/smart-download-info \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
       "prefer_progressive": false}'

```

### Frontend Testing

#### Manual Testing Checklist

- [ ] URL input validation
- [ ] Video info display
- [ ] Smart download functionality
- [ ] Manual download options
- [ ] Progress tracking
- [ ] Error handling
- [ ] Responsive design
- [ ] Dark/light mode toggle

#### Browser Testing

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Edge (Windows)
- [ ] Mobile browsers

### Performance Testing

#### Cache Performance

```bash
# Test same video multiple times
# Check server logs for \"Cache HIT\" messages
# Measure response time improvement
```

#### Load Testing

```bash
# Test concurrent requests
# Monitor memory usage
# Check for memory leaks
```

## 🐛 Debugging Guide

### Backend Debugging

#### Enable Debug Logging

```python
# In main.py
logging.basicConfig(level=logging.DEBUG)
```

#### Common Debug Points

```python
# Add debug prints
logger.debug(f\"Processing video: {video_url}\")
logger.debug(f\"Cache status: {cache_hit}\")
logger.debug(f\"Selected streams: {smart_option}\")
```

#### Performance Monitoring

```python
# Time operations
start_time = time.time()
# ... operation ...
logger.info(f\"Operation took {time.time() - start_time:.2f} seconds\")
```

### Frontend Debugging

#### Browser DevTools

- **Network Tab**: Monitor API calls
- **Console**: Check for JavaScript errors
- **Elements**: Inspect DOM changes
- **Sources**: Set breakpoints in TypeScript

#### React DevTools

- Install React Developer Tools browser extension
- Inspect component state and props
- Profile component performance

#### Debug Logging

```typescript
// Add console logs for debugging
console.log('Smart download started:', videoUrl)
console.log('Progress update:', progressInfo)
console.error('Download failed:', error)
```

### Common Issues & Solutions

#### 1. FFmpeg Not Found

```bash
# Check installation
python -c \"import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())\"

# Reinstall if needed
pip uninstall imageio-ffmpeg
pip install imageio-ffmpeg
```

#### 2. CORS Errors

```python
# Add your domain to CORS origins in main.py
allow_origins=[
    \"http://localhost:3000\",
    \"http://127.0.0.1:3000\",  # Add this
    \"https://yourdomain.com\"   # Production domain
]
```

#### 3. Cache Issues

```python
# Clear cache by restarting server
# Or add cache clearing endpoint for development
```

#### 4. TypeScript Errors

```bash
# Check types
npx tsc --noEmit

# Update type definitions
pnpm add -D @types/node @types/react
```

## 📁 File Organization Best Practices

### Frontend File Structure

```text
components/
├── ui/              # Reusable UI components
├── feature/         # Feature-specific components
└── layout/          # Layout components

lib/
├── api.ts           # API client
├── utils.ts         # Utility functions
└── types.ts         # Type definitions

hooks/
├── use-api.ts       # API-related hooks
└── use-ui.ts        # UI-related hooks
```

### Backend File Structure

```text
backend/
├── main.py          # FastAPI app
├── models/          # Pydantic models
├── services/        # Business logic
├── utils/           # Utility functions
└── tests/           # Test files
```

### Naming Conventions

#### Frontend (TypeScript)

- **Components**: PascalCase (`SmartDownloadButton.tsx`)
- **Hooks**: camelCase with \"use\" prefix (`useDownload.ts`)
- **Utils**: camelCase (`formatFileSize.ts`)
- **Types**: PascalCase interfaces (`VideoMetadata`)

#### Backend (Python)

- **Files**: snake_case (`smart_selection.py`)
- **Functions**: snake_case (`get_smart_download_info`)
- **Classes**: PascalCase (`StreamAnalysis`)
- **Constants**: UPPER_SNAKE_CASE (`CACHE_TTL`)

## 🔧 IDE Configuration

### VS Code Settings

#### .vscode/settings.json

```json
{
  \"typescript.preferences.includePackageJsonAutoImports\": \"auto\",
  \"editor.formatOnSave\": true,
  \"editor.codeActionsOnSave\": {
    \"source.fixAll.eslint\": true
  },
  \"python.defaultInterpreterPath\": \"./venv/bin/python\",
  \"python.formatting.provider\": \"black\",
  \"python.linting.enabled\": true,
  \"python.linting.pylintEnabled\": true
}
```

#### .vscode/extensions.json

```json
{
  \"recommendations\": [
    \"ms-python.python\",
    \"ms-vscode.vscode-typescript-next\",
    \"bradlc.vscode-tailwindcss\",
    \"esbenp.prettier-vscode\",
    \"ms-vscode.vscode-eslint\"
  ]
}
```

### Git Configuration

#### .gitignore

```gitignore
# Dependencies
node_modules/
__pycache__/
venv/

# Build outputs
.next/
dist/
build/

# Environment files
.env.local
.env.production

# IDE files
.vscode/settings.json
.idea/

# OS files
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.log
```

#### .gitattributes

```gitattributes
* text=auto
*.js text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.py text eol=lf
*.md text eol=lf
*.json text eol=lf
```

## 📊 Performance Optimization

### Frontend Optimization

#### Bundle Analysis

```bash
# Analyze bundle size
pnpm build
npx @next/bundle-analyzer
```

#### API Performance Monitoring

```typescript
// Monitor API call performance
const startTime = performance.now()
const result = await apiCall()
const duration = performance.now() - startTime
console.log(`API call took ${duration}ms`)
```

### Backend Optimization

#### Profiling

```python
# Profile function performance
import cProfile
import pstats

def profile_function():
    pr = cProfile.Profile()
    pr.enable()
    # ... your function ...
    pr.disable()
    stats = pstats.Stats(pr)
    stats.sort_stats('cumulative')
    stats.print_stats()
```

#### Memory Monitoring

```python
# Monitor memory usage
import psutil
import os

def get_memory_usage():
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024  # MB
```

## 🚀 Deployment Preparation

### Production Build

#### Frontend

```bash
# Create production build
pnpm build

# Test production build locally
pnpm start

# Export static files (if needed)
pnpm export
```

#### Backend

```bash
# Install production dependencies only
pip install --no-dev -r requirements.txt

# Test production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Environment Configuration

#### Production Environment Variables

```bash
# Backend
ENVIRONMENT=production
CORS_ORIGINS=https://yourdomain.com
CACHE_TTL=600
LOG_LEVEL=INFO

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENVIRONMENT=production
```

## 📚 Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Learning Resources

- [Next.js Tutorial](https://nextjs.org/learn)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

### Community & Support

- [Next.js GitHub](https://github.com/vercel/next.js)
- [FastAPI GitHub](https://github.com/tiangolo/fastapi)
- [React Community](https://react.dev/community)
- [Stack Overflow](https://stackoverflow.com/)

---

## ✅ Development Checklist

### Initial Setup

- [ ] Clone repository
- [ ] Install Node.js dependencies
- [ ] Install Python dependencies
- [ ] Install FFmpeg
- [ ] Test both servers
- [ ] Verify API communication

### Before Making Changes

- [ ] Create feature branch
- [ ] Understand existing code
- [ ] Plan your changes
- [ ] Set up debugging

### Before Committing

- [ ] Test all functionality
- [ ] Check for console errors
- [ ] Verify performance impact
- [ ] Update documentation
- [ ] Run type checking
- [ ] Test edge cases

### Before Deployment

- [ ] Create production build
- [ ] Test production environment
- [ ] Update environment variables
- [ ] Performance testing
- [ ] Security review
- [ ] Backup current version

---

## Happy coding! 🎉
