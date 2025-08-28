# YouTube Downloader API Documentation

## Overview

The YouTube Downloader API is a high-performance FastAPI-based backend service
that provides intelligent video downloading capabilities with automatic quality
selection and FFmpeg-powered video/audio merging.

## Features

### 🎯 Core Functionality

- **Smart Download**: Automatic selection of highest quality video and audio streams
- **Manual Selection**: Advanced users can select specific streams
- **FFmpeg Integration**: Seamless video/audio merging for optimal quality
- **Performance Optimization**: In-memory caching and parallel downloads
- **RESTful API**: Clean, well-documented endpoints

### ⚡ Performance Features

- **5-minute caching** for stream analysis results
- **Parallel downloads** for video and audio streams
- **Lazy loading** of file sizes for faster initial response
- **Thread-safe operations** for concurrent requests
- **Automatic cache cleanup** to prevent memory bloat

### 🛡️ Reliability Features

- **Comprehensive error handling** with detailed error messages
- **Automatic fallbacks** when preferred options aren't available
- **Input validation** using Pydantic models
- **CORS support** for frontend integration

## API Endpoints

### Health & System Information

#### `GET /`

Basic health check endpoint with beautiful landing page.

**Response:**

```json
{
  "message": "YouTube Downloader API is running - OPTIMIZED VERSION"
}
```

#### `GET /api/health`

Detailed health check with dashboard UI.

**Response:**

```json
{
  "status": "healthy",
  "service": "YouTube Downloader API"
}
```

#### `GET /api/system-info`

Retrieve system capabilities and FFmpeg status.

**Response:**

```json
{
  "ffmpeg_available": true,
  "ffmpeg_version": "ffmpeg version 7.1-essentials_build-www.gyan.dev",
  "smart_download_supported": true
}
```

### Video Information

#### `POST /api/video-info`

Extract video metadata and available streams.

**Request Body:**

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**

```json
{
  "title": "Rick Astley - Never Gonna Give You Up",
  "duration": 212,
  "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "uploader": "Rick Astley",
  "view_count": 1000000000,
  "streams": [
    {
      "id": "22",
      "type": "video",
      "quality": "720p (with audio)",
      "format": "mp4",
      "filesize": "25.4 MB",
      "codec": "avc1.64001F, mp4a.40.2",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ]
}
```

### Smart Download

#### `POST /api/smart-download-info`

Get recommendations for optimal download quality.

**Request Body:**

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "prefer_progressive": false
}
```

**Response:**

```json
{
  "video_title": "Rick Astley - Never Gonna Give You Up",
  "video_duration": 212,
  "recommended_quality": "1080p + 128kbps",
  "estimated_size_mb": 45.2,
  "merge_required": true,
  "download_type": "merge",
  "ffmpeg_available": true
}
```

#### `POST /api/smart-download`

Execute smart download with automatic quality selection.

**Request Body:**

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "prefer_progressive": false
}
```

**Response:** Binary video file stream with headers:

- `Content-Type: video/mp4`
- `Content-Disposition: attachment; filename="video_title_Smart.mp4"`
- `Content-Length: [file_size]`

### Manual Download

#### `POST /api/download`

Download a specific stream by ID.

**Request Body:**

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "stream_id": "22"
}
```

**Response:** Binary video/audio file stream

### Contact

#### `POST /api/contact`

Send contact form submissions; forwards to email via Brevo.

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Support",
  "message": "I need help with...",
  "honeypot": "",
  "formStartTimestamp": 1710000000.0
}
```

Responses:

```json
// 200
{ "success": true, "message": "Sent" }

// 400/429/500
{ "detail": "Error message" }
```

Backend environment variables:

- `BREVO_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
- `CONTACT_FROM_NAME` (optional)
- `RATE_LIMIT_PER_MIN` (optional)

## Smart Selection Algorithm

### Priority Order

1. **Highest Quality Merge** (Default)
   - Selects best video stream (up to 4K) + best audio stream
   - Uses FFmpeg to merge into single file
   - Prioritized when `prefer_progressive = false`

2. **High-Quality Progressive**
   - Single file with video+audio (720p+)
   - Only used when specifically requested and quality ≥ 720p

3. **Fallback Merge**
   - Best available video+audio combination
   - Used when no high-quality progressive available

4. **Last Resort Progressive**
   - Any available progressive stream
   - Used when merging fails or no streams available

### Quality Scoring

#### Video Streams

The algorithm scores video streams based on resolution:

```python
VIDEO_QUALITY_SCORES = {
    '4320p': 1200,  # 8K
    '2160p': 1000,  # 4K
    '1440p': 800,   # 1440p
    '1080p': 600,   # 1080p
    '720p': 400,    # 720p
    '480p': 200,    # 480p
    '360p': 100,    # 360p
    '240p': 50,     # 240p
    '144p': 25      # 144p
}
```

#### Audio Streams

Audio streams are scored based on bitrate:

```python
AUDIO_QUALITY_SCORES = {
    '320kbps+': 300,
    '256kbps': 250,
    '192kbps': 200,
    '128kbps': 150,
    '96kbps': 100,
    '48kbps': 50
}
```

## Data Models

### VideoURL

Request model for video URL input.

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### StreamInfo

Model representing a single video/audio stream.

```json
{
  "id": "22",
  "type": "video",
  "quality": "720p (with audio)",
  "format": "mp4",
  "filesize": "25.4 MB",
  "codec": "avc1.64001F, mp4a.40.2",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### VideoMetadata

Complete video information including available streams.

```json
{
  "title": "Rick Astley - Never Gonna Give You Up",
  "duration": 212,
  "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "uploader": "Rick Astley",
  "view_count": 1000000000,
  "streams": []
}
```

### DownloadRequest

Request model for manual stream download.

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "stream_id": "22"
}
```

### SmartDownloadRequest

Request model for smart download with automatic quality selection.

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "prefer_progressive": false
}
```

### SmartDownloadInfo

Response model containing smart download recommendations.

```json
{
  "video_title": "Rick Astley - Never Gonna Give You Up",
  "video_duration": 212,
  "recommended_quality": "1080p + 128kbps",
  "estimated_size_mb": 45.2,
  "merge_required": true,
  "download_type": "merge",
  "ffmpeg_available": true
}
```

### SystemInfo

System information and capabilities.

```json
{
  "ffmpeg_available": true,
  "ffmpeg_version": "ffmpeg version 7.1-essentials_build",
  "smart_download_supported": true
}
```

## Performance Optimization

### Caching Strategy

The API implements an intelligent caching system to optimize performance:

- **5-minute TTL**: Stream analysis results are cached for 5 minutes
- **Thread-safe**: Cache operations are thread-safe for concurrent requests
- **Automatic cleanup**: Expired cache entries are automatically removed
- **Statistics tracking**: Cache hit/miss rates are monitored for optimization

### Parallel Processing

For merged downloads, the API uses parallel processing:

- **Concurrent downloads**: Video and audio streams are downloaded simultaneously
- **ThreadPoolExecutor**: Uses Python's concurrent.futures for efficient parallelism
- **Resource management**: Proper cleanup of temporary files and directories

## Error Handling

The API provides comprehensive error handling with appropriate HTTP status codes:

- **400 Bad Request**: Invalid input parameters
- **404 Not Found**: Video or stream not found
- **500 Internal Server Error**: Server-side errors
- **503 Service Unavailable**: Temporary service issues

All errors include descriptive messages to help with debugging.

## Security Considerations

### Input Validation

All API inputs are validated using Pydantic models:

- **URL validation**: Ensures valid YouTube URLs
- **Stream ID validation**: Validates stream identifiers
- **Parameter sanitization**: Prevents injection attacks

### CORS Configuration

The API includes proper CORS configuration for secure frontend integration:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## Rate Limiting

While not explicitly implemented in the current version, the API is designed to support rate limiting through:

- **Request throttling**: Can be added at the reverse proxy level
- **Connection pooling**: Efficient resource utilization
- **Caching**: Reduces load on YouTube's servers

## Monitoring and Logging

The API includes comprehensive logging for monitoring and debugging:

- **Request logging**: All API requests are logged
- **Performance metrics**: Response times and cache statistics
- **Error tracking**: Detailed error logging for debugging
- **System health**: FFmpeg availability and system status

## Integration with Frontend

The API is designed to work seamlessly with the Next.js frontend:

- **CORS support**: Allows cross-origin requests from the frontend
- **Streaming responses**: Efficient file streaming for downloads
- **Consistent data models**: TypeScript interfaces match Pydantic models
- **Error handling**: Consistent error messages between frontend and backend