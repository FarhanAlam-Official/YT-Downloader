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

## 📦 Dependencies

### Frontend Dependencies

The frontend uses Next.js 15 with React 19 and the following key dependencies:

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library
- **React Hot Toast** - Notification system
- **Zod** - Schema validation

For a complete list, see `package.json`.

### Backend Dependencies

The backend uses FastAPI with the following key dependencies:

- **FastAPI 0.115.6** - High-performance Python web framework
- **uvicorn 0.34.0** - ASGI server
- **pytubefix 9.5.0** - YouTube video extraction
- **pydantic 2.10.4** - Data validation and settings management
- **ffmpeg-python 0.2.0** - FFmpeg wrapper
- **imageio-ffmpeg 0.6.0** - FFmpeg binary management

For a complete list, see `backend/requirements.txt`.

## 🏗️ Development Workflow

### Daily Development Flow

1. **Start Development Servers**

   ```bash
   # Terminal 1
   cd backend && python main.py
   
   # Terminal 2
   pnpm dev
   ```

2. **Make Changes**
   - Frontend: Edit files in `components/`, `app/`, `lib/`
   - Backend: Edit files in `backend/`
   - Both servers auto-reload on changes

3. **Test Changes**
   - Frontend: Check <http://localhost:3000>
   - Backend: Use <http://localhost:8000/docs>
   - API: Test with Postman or curl

4. **Commit & Push**

   ```bash
   git add .
   git commit -m "feat: description of changes"
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
# Check server logs for "Cache HIT" messages
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
logger.debug(f"Processing video: {video_url}")
logger.debug(f"Cache status: {cache_hit}")
logger.debug(f"Selected streams: {smart_option}")
```

#### Performance Monitoring

```python
# Time operations
start_time = time.time()
# ... operation ...
logger.info(f"Operation took {time.time() - start_time:.2f} seconds")
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
python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"

# Reinstall if needed
pip uninstall imageio-ffmpeg
pip install imageio-ffmpeg
```

#### 2. CORS Errors

```python
# Add your domain to CORS origins in main.py
allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",  # Add this
    "https://yourdomain.com"   # Production domain
]
```

#### 3. Cache Issues

```bash
# Restart backend server to clear cache
# Or wait for automatic cache cleanup (5 minutes)
```

#### 4. Video Download Failures

```bash
# Test with different video URLs
# Check YouTube video availability
# Verify network connectivity
```

## 📚 Documentation Updates

When making changes to the codebase, ensure documentation is updated accordingly:

1. **API Changes**: Update `documentation/API_DOCUMENTATION.md`
2. **Component Changes**: Update `documentation/COMPONENT_DESIGN_SYSTEM.md`
3. **Architecture Changes**: Update `documentation/CODE_ORGANIZATION.md`
4. **Setup Changes**: Update `documentation/DEVELOPMENT_SETUP.md`

## 🔄 Version Control Best Practices

### Commit Message Format

Follow conventional commit format:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: code formatting
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

### Branch Naming

```
feature/new-feature-name
fix/bug-description
docs/documentation-update
```

## 🔒 Security Considerations

### Environment Variables

Never commit sensitive information:

- API keys
- Database credentials
- Secret tokens

Use `.env.local` for local development and environment variables for production.

### Input Validation

All user inputs are validated:

- URL validation using Pydantic
- Stream ID validation
- File path sanitization

### CORS Configuration

Proper CORS configuration prevents unauthorized access:

```python
allow_origins=["http://localhost:3000"]  # Restrict to known domains
```

## 🎯 Performance Optimization

### Caching Strategy

- 5-minute in-memory cache for video analysis
- Automatic cache cleanup
- Cache hit/miss monitoring

### Parallel Processing

- Concurrent video/audio downloads
- Thread-safe operations
- Efficient resource utilization

### Lazy Loading

- File size estimation instead of fetching
- On-demand data loading
- Reduced initial response time

## 🧰 Useful Development Tools

### VS Code Extensions

- **Python**: Official Python extension
- **ES7+ React/Redux/React-Native snippets**: Speed up React development
- **Prettier**: Code formatting
- **ESLint**: JavaScript/TypeScript linting
- **Tailwind CSS IntelliSense**: Tailwind CSS autocomplete

### Browser Extensions

- **React Developer Tools**: Inspect React component tree
- **Redux DevTools**: State management debugging
- **Lighthouse**: Performance auditing

### Command Line Tools

- **httpie**: User-friendly HTTP client
- **jq**: JSON processor
- **watch**: Execute commands repeatedly

## 📈 Monitoring & Logging

### Backend Logging

Structured logging for monitoring:

```python
logger.info("Smart download completed in 2.5 seconds")
logger.error("Failed to download stream: Connection timeout")
```

### Performance Metrics

Monitor key metrics:

- Response times
- Cache hit rates
- Memory usage
- Error rates

### Health Checks

Regular health checks ensure system stability:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/system-info
```