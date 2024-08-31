# Smart Download Setup Instructions

## Prerequisites

### For Frontend Development

- Node.js v19+
- pnpm package manager
- Git

### For Backend (Smart Download)

- Python 3.10
- pip (Python package manager)
- FFmpeg (required for video/audio merging)

## Setup Steps

### 1. Install Frontend Dependencies

```bash
# Navigate to project root
cd YT-Downloader

# Install Node.js dependencies
pnpm install
```

### 2. Install Python Backend Dependencies

```bash
# Navigate to scripts directory
cd scripts

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Install FFmpeg (Required for Smart Download)

#### Windows

1. Download FFmpeg from [https://ffmpeg.org/download.html#build-windows](https://ffmpeg.org/download.html#build-windows)
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to your system PATH
4. Verify installation: `ffmpeg -version`

#### macOS

```bash
# Using Homebrew
brew install ffmpeg

# Verify installation
ffmpeg -version
```

#### Linux (Ubuntu/Debian)

```bash
# Install FFmpeg
sudo apt update
sudo apt install ffmpeg

# Verify installation
ffmpeg -version
```

## Running the Application

### 1. Start the Backend (Terminal 1)

```bash
cd backend
python main.py
```

The backend will start at: [http://localhost:8000](http://localhost:8000)

### 2. Start the Frontend (Terminal 2)

```bash
cd ..  # Back to project root
pnpm dev
```

The frontend will start at: [http://localhost:3000](http://localhost:3000)

## Features

### Smart Download Mode ✨

- **One-Click Download**: Automatically selects best video+audio quality
- **Intelligent Merging**: Uses FFmpeg to combine video and audio streams
- **Progress Tracking**: Real-time download and merge progress
- **Fallback Handling**: Gracefully handles FFmpeg unavailability

### Manual Selection Mode 🔧

- **Full Control**: Choose specific video and audio streams
- **All Original Features**: Complete backward compatibility
- **Enhanced UI**: Improved visual design and organization

## Troubleshooting

### FFmpeg Not Found

If you see "FFmpeg not available" warnings:

1. Ensure FFmpeg is properly installed
2. Verify it's in your system PATH
3. Restart the backend after installation

### Backend Connection Issues

If frontend can't connect to backend:

1. Ensure backend is running on [http://localhost:8000](http://localhost:8000)
2. Check for port conflicts
3. Verify CORS settings in main.py

### 'Download Issues

If downloads fail:

1. Check internet connection
2. Verify YouTube URL is valid and accessible
3. Try manual selection if smart download fails
4. Check backend logs for detailed error messages

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/system-info` - FFmpeg availability status
- `POST /api/video-info` - Get video metadata and streams
- `POST /api/smart-download-info` - Get smart download recommendation
- `POST /api/smart-download` - Download with automatic merging
- `POST /api/download` - Manual stream download

## Development Notes

- Frontend uses Next.js 15 with TypeScript
- Backend uses FastAPI with Python
- Video processing handled by pytubefix
- Merging powered by FFmpeg
- UI built with shadcn/ui components
