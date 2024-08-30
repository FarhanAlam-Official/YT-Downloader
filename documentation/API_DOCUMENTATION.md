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

Basic health check endpoint.

**Response:**

```json
{
  \"message\": \"YouTube Downloader API is running - OPTIMIZED VERSION\"
}
```

#### `GET /api/health`

Detailed health check.

**Response:**

```json
{
  \"status\": \"healthy\",
  \"service\": \"YouTube Downloader API\"
}
```

#### `GET /api/system-info`

Retrieve system capabilities and FFmpeg status.

**Response:**

```json
{
  \"ffmpeg_available\": true,
  \"ffmpeg_version\": \"ffmpeg version 7.1-essentials_build-www.gyan.dev\",
  \"smart_download_supported\": true
}
```

### Video Information

#### `POST /api/video-info`

Extract video metadata and available streams.

**Request Body:**

```json
{
  \"url\": \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\"
}
```

**Response:**

```json
{
  \"title\": \"Rick Astley - Never Gonna Give You Up\",
  \"duration\": 212,
  \"thumbnail\": \"https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg\",
  \"uploader\": \"Rick Astley\",
  \"view_count\": 1000000000,
  \"streams\": [
    {
      \"id\": \"22\",
      \"type\": \"video\",
      \"quality\": \"720p (with audio)\",
      \"format\": \"mp4\",
      \"filesize\": \"25.4 MB\",
      \"codec\": \"avc1.64001F, mp4a.40.2\",
      \"url\": \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\"
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
  \"video_url\": \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\",
  \"prefer_progressive\": false
}
```

**Response:**

```json
{
  \"video_title\": \"Rick Astley - Never Gonna Give You Up\",
  \"video_duration\": 212,
  \"recommended_quality\": \"1080p + 128kbps\",
  \"estimated_size_mb\": 45.2,
  \"merge_required\": true,
  \"download_type\": \"merge\",
  \"ffmpeg_available\": true
}
```

#### `POST /api/smart-download`

Execute smart download with automatic quality selection.

**Request Body:**

```json
{
  \"video_url\": \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\",
  \"prefer_progressive\": false
}
```

**Response:** Binary video file stream with headers:

- `Content-Type: video/mp4`
- `Content-Disposition: attachment; filename=\"video_title_Smart.mp4\"`
- `Content-Length: [file_size]`

### Manual Download

#### `POST /api/download`

Download a specific stream by ID.

**Request Body:**

```json
{
  \"video_url\": \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\",
  \"stream_id\": \"22\"
}
```

**Response:** Binary video/audio file stream

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

**Video Streams:**

- 4K (2160p): 1000 points
- 1440p: 800 points  
- 1080p: 600 points
- 720p: 400 points
- 480p: 200 points
- Lower: Resolution/10 points

**Audio Streams:**

- 320kbps+: 300 points
- 256kbps: 250 points
- 192kbps: 200 points
- 128kbps: 150 points
- 96kbps: 100 points
- Lower: Bitrate value

## Performance Optimizations

### Caching System

- **Cache Duration**: 5 minutes per video
- **Cache Key**: YouTube video ID
- **Thread Safety**: Mutex-protected operations
- **Auto Cleanup**: Expired entries removed automatically
- **Memory Efficient**: Only stores analysis results, not video data

### Parallel Processing

- **Concurrent Downloads**: Video and audio streams downloaded simultaneously
- **ThreadPoolExecutor**: Maximum 2 worker threads for downloads
- **Progress Tracking**: Real-time status updates
- **Error Isolation**: Individual stream failures don't affect others

### File Size Estimation

- **Lazy Loading**: File sizes calculated only when needed
- **Smart Estimation**: Based on resolution, bitrate, and duration
- **Fallback Calculation**: When exact sizes unavailable

## Error Handling

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (invalid URL, parameters)
- `404`: Not Found (video unavailable, no streams)
- `500`: Internal Server Error (FFmpeg failure, download error)

### Error Response Format

```json
{
  \"detail\": \"Descriptive error message\"
}
```

### Common Error Scenarios

1. **Invalid YouTube URL**
   - Status: 400
   - Message: \"Failed to access video: [details]\"

2. **Video Unavailable**
   - Status: 404  
   - Message: \"No suitable streams found\"

3. **FFmpeg Not Available**
   - Status: 500
   - Message: \"FFmpeg not available for merging\"

4. **Download Failure**
   - Status: 500
   - Message: \"Video/audio download failed\"

## Installation & Setup

### Prerequisites

- Python 3.10+
- FFmpeg (for video/audio merging)
- pip package manager

### Dependencies

```bash
pip install -r requirements.txt
```

**Key Dependencies:**

- `fastapi==0.115.6`: Web framework
- `pytubefix==9.5.0`: YouTube video processing
- `uvicorn[standard]==0.34.0`: ASGI server
- `ffmpeg-python==0.2.0`: FFmpeg Python bindings
- `imageio-ffmpeg==0.6.0`: FFmpeg binaries

### Running the Server

```bash
# Development mode
cd backend
python main.py

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Configuration

**Environment Variables:**

- `CORS_ORIGINS`: Allowed CORS origins (default: localhost:3000)
- `CACHE_TTL`: Cache duration in seconds (default: 300)
- `LOG_LEVEL`: Logging level (default: INFO)

## Frontend Integration

### TypeScript/JavaScript Example

```typescript
const API_BASE = \"http://localhost:8000\"

// Get smart download info
const response = await fetch(`${API_BASE}/api/smart-download-info`, {
  method: \"POST\",
  headers: { \"Content-Type\": \"application/json\" },
  body: JSON.stringify({
    video_url: \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\",
    prefer_progressive: false
  })
})

const info = await response.json()
console.log(`Recommended: ${info.recommended_quality}`)

// Execute smart download
const downloadResponse = await fetch(`${API_BASE}/api/smart-download`, {
  method: \"POST\",
  headers: { \"Content-Type\": \"application/json\" },
  body: JSON.stringify({
    video_url: \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\",
    prefer_progressive: false
  })
})

const blob = await downloadResponse.blob()
// Handle file download...
```

## Performance Benchmarks

### Typical Response Times

| Operation | Without Cache | With Cache | Improvement |
|-----------|---------------|------------|-----------|
| Stream Analysis | 3-5 seconds | 0.1-0.5 seconds | 10x faster |
| Smart Download Info | 2-4 seconds | 0.1 seconds | 20x faster |
| Download Start | 1-2 seconds | 0.2 seconds | 5x faster |

### Memory Usage

- **Base Memory**: ~50MB
- **Per Cached Video**: ~2KB
- **Maximum Cache**: ~1MB (300 videos @ 5min TTL)
- **Peak Memory**: Depends on video file sizes during processing

## Security Considerations

### Input Validation

- All URLs validated using Pydantic HttpUrl
- Stream IDs sanitized to prevent injection
- File paths properly escaped and sandboxed

### Rate Limiting

- Consider implementing rate limiting for production use
- Cache helps reduce YouTube API pressure
- Concurrent download limits prevent resource exhaustion

### CORS Configuration

- Restricted to specific origins (localhost by default)
- Credentials allowed for authentication
- All methods and headers permitted for development

## Troubleshooting

### Common Issues

1. **FFmpeg Not Found**

   ```bash
   Solution: Install FFmpeg and ensure it's in PATH
   pip install imageio-ffmpeg  # Includes binaries
   ```

2. **Video Download Fails**

   ```text
   Check: Video availability, network connection
   Logs: Check server logs for detailed error messages
   ```

3. **Cache Issues**

   ```text
   Solution: Cache automatically expires after 5 minutes
   Manual: Restart server to clear cache
   ```

4. **CORS Errors**

   ```text
   Solution: Add frontend URL to allow_origins list
   Development: Use http://localhost:3000
   ```

### Debug Mode

Enable detailed logging:

```python
logging.basicConfig(level=logging.DEBUG)
```

### Health Checks

```bash
# Basic health
curl http://localhost:8000/

# System info
curl http://localhost:8000/api/system-info

# Cache statistics
# Check server logs for cache hit/miss ratios
```

## Contributing

### Code Style

- Follow PEP 8 Python style guidelines
- Use type hints for all function parameters and returns
- Add comprehensive docstrings for all functions
- Include example usage in docstrings

### Testing

```bash
# Run basic API tests
python test_api.py

# Test specific functionality
python test_ffmpeg.py
```

### Performance Testing

```bash
# Benchmark cache performance
# Use same video URL multiple times
# Monitor logs for cache hits

# Test parallel downloads
# Monitor system resources during large file downloads
```

## Changelog

### Version 2.0.0 (Current)

- Added comprehensive caching system
- Implemented parallel downloads
- Enhanced error handling and logging
- Improved smart selection algorithm
- Added performance optimizations
- Comprehensive documentation

### Version 1.0.0

- Basic smart download functionality
- FFmpeg integration
- Manual stream selection
- RESTful API endpoints

## License

MIT License - See LICENSE file for details.

## Support

For issues and questions:

1. Check this documentation
2. Review server logs for error details
3. Test with different video URLs
4. Verify FFmpeg installation
