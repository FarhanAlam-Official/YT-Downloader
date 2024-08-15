from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, HttpUrl
from pytubefix import YouTube
import asyncio
import json
import os
import tempfile
import logging
from typing import List, Dict, Any
import uvicorn

app = FastAPI(title="YouTube Downloader API", version="1.0.0")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoURL(BaseModel):
    url: HttpUrl

class StreamInfo(BaseModel):
    id: str
    type: str  # 'video' or 'audio'
    quality: str
    format: str
    filesize: str
    codec: str
    url: str

class VideoMetadata(BaseModel):
    title: str
    duration: int
    thumbnail: str
    uploader: str
    view_count: int
    streams: List[StreamInfo]

class DownloadRequest(BaseModel):
    video_url: HttpUrl
    stream_id: str

@app.get("/")
async def root():
    return {"message": "YouTube Downloader API is running"}

@app.post("/api/video-info", response_model=VideoMetadata)
async def get_video_info(video_data: VideoURL):
    """
    Extract video metadata and available streams from YouTube URL using pytube
    """
    try:
        logger.info(f"Processing video URL: {video_data.url}")
        
        # Create YouTube object with error handling
        try:
            yt = YouTube(str(video_data.url))
            
            # Force loading of video info
            _ = yt.title  # This triggers the video info loading
            
        except Exception as yt_error:
            logger.error(f"YouTube object creation failed: {str(yt_error)}")
            raise HTTPException(status_code=400, detail=f"Failed to access video: {str(yt_error)}")
        
        # Process available formats
        streams = []
        seen_formats = set()
        
        try:
            # Get progressive streams (video+audio) first
            progressive_streams = yt.streams.filter(progressive=True)
            logger.info(f"Found {len(progressive_streams)} progressive streams")
            
            for stream in progressive_streams:
                if not stream.resolution:
                    continue
                    
                quality = stream.resolution
                format_key = f"video_prog_{quality}_{stream.mime_type.split('/')[-1]}"
                
                if format_key not in seen_formats:
                    seen_formats.add(format_key)
                    
                    filesize = "Unknown"
                    if hasattr(stream, 'filesize') and stream.filesize:
                        size_mb = stream.filesize / (1024 * 1024)
                        filesize = f"{size_mb:.1f} MB"
                    
                    streams.append(StreamInfo(
                        id=str(stream.itag),
                        type="video",
                        quality=f"{quality} (with audio)",
                        format=stream.mime_type.split('/')[-1],
                        filesize=filesize,
                        codec=f"{stream.video_codec}, {stream.audio_codec}" if stream.audio_codec else stream.video_codec or "unknown",
                        url=str(video_data.url)
                    ))
            
            # Get adaptive video streams (higher quality, video only)
            adaptive_video = yt.streams.filter(adaptive=True, only_video=True)
            logger.info(f"Found {len(adaptive_video)} adaptive video streams")
            
            for stream in list(adaptive_video)[:5]:  # Limit to 5 best video streams
                if not stream.resolution:
                    continue
                    
                quality = stream.resolution
                format_key = f"video_adaptive_{quality}_{stream.mime_type.split('/')[-1]}"
                
                if format_key not in seen_formats:
                    seen_formats.add(format_key)
                    
                    filesize = "Unknown"
                    if hasattr(stream, 'filesize') and stream.filesize:
                        size_mb = stream.filesize / (1024 * 1024)
                        filesize = f"{size_mb:.1f} MB"
                    
                    streams.append(StreamInfo(
                        id=str(stream.itag),
                        type="video",
                        quality=f"{quality} (video only - no audio)",
                        format=stream.mime_type.split('/')[-1],
                        filesize=filesize,
                        codec=stream.video_codec or "unknown",
                        url=str(video_data.url)
                    ))
            
            # Get audio streams
            audio_streams = yt.streams.filter(only_audio=True)
            logger.info(f"Found {len(audio_streams)} audio streams")
            
            for stream in list(audio_streams)[:3]:  # Limit to 3 best audio streams
                quality = stream.abr if stream.abr else "unknown"
                format_key = f"audio_{quality}_{stream.mime_type.split('/')[-1]}"
                
                if format_key not in seen_formats:
                    seen_formats.add(format_key)
                    
                    filesize = "Unknown"
                    if hasattr(stream, 'filesize') and stream.filesize:
                        size_mb = stream.filesize / (1024 * 1024)
                        filesize = f"{size_mb:.1f} MB"
                    
                    streams.append(StreamInfo(
                        id=str(stream.itag),
                        type="audio",
                        quality=f"{quality} (audio only)",
                        format=stream.mime_type.split('/')[-1],
                        filesize=filesize,
                        codec=stream.audio_codec or "unknown",
                        url=str(video_data.url)
                    ))
            
        except Exception as stream_error:
            logger.error(f"Stream processing failed: {str(stream_error)}")
            # If we can't get streams but have basic info, return minimal data
            if not streams:
                # Add a basic fallback stream
                streams.append(StreamInfo(
                    id="22",  # Common format ID
                    type="video",
                    quality="720p",
                    format="mp4",
                    filesize="Unknown",
                    codec="unknown",
                    url=str(video_data.url)
                ))
        
        # Sort streams by quality (video with audio first, then video-only, then audio)
        # Priority: 1. Progressive streams (video+audio), 2. Higher quality, 3. Video-only, 4. Audio-only
        streams.sort(key=lambda x: (
            'video only' in x.quality,  # Progressive streams (with audio) first
            x.type != 'video',  # Video streams before audio streams
            'audio only' in x.quality,  # Audio-only streams last
            -int(x.quality.split('p')[0]) if x.quality.split('p')[0].replace('k', '').isdigit() else 0  # Higher quality first
        ))
        
        logger.info(f"Successfully processed {len(streams)} streams")
        
        metadata = VideoMetadata(
            title=yt.title or "Unknown Title",
            duration=yt.length or 0,
            thumbnail=yt.thumbnail_url or "",
            uploader=yt.author or "Unknown",
            view_count=yt.views or 0,
            streams=streams[:15]  # Limit to top 15 streams
        )
        
        return metadata
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_video_info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/download")
async def download_video(download_request: DownloadRequest):
    """
    Download video stream and return as streaming response using pytube
    """
    try:
        # Create YouTube object
        yt = YouTube(str(download_request.video_url))
        
        # Find the requested stream by itag
        stream = yt.streams.get_by_itag(int(download_request.stream_id))
        
        if not stream:
            raise HTTPException(status_code=404, detail="Stream not found")
        
        # Create temporary directory for download
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Download the stream with proper filename
            # Clean the title for filename
            safe_title = "".join(c for c in yt.title if c.isalnum() or c in (' ', '-', '_')).rstrip()
            safe_title = safe_title[:50]  # Limit length
            
            # Determine file extension based on stream
            if stream.includes_video_track:
                extension = 'mp4'
            else:
                extension = 'mp3' if stream.mime_type and 'audio' in stream.mime_type else 'mp4'
            
            # Custom filename
            filename = f"{safe_title}_{stream.itag}.{extension}"
            output_path = os.path.join(temp_dir, filename)
            
            # Download the stream
            stream.download(output_path=temp_dir, filename=filename)
            
            # Verify file exists and has content
            if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                raise HTTPException(status_code=500, detail="Download failed - file not created or empty")
            
            # Determine proper media type
            if stream.includes_video_track:
                media_type = 'video/mp4'
            elif stream.includes_audio_track:
                media_type = 'audio/mp4'
            else:
                media_type = 'application/octet-stream'
            
            # Stream the file back to client
            def iterfile(file_path: str):
                try:
                    with open(file_path, mode="rb") as file_like:
                        while True:
                            chunk = file_like.read(8192)  # 8KB chunks for better streaming
                            if not chunk:
                                break
                            yield chunk
                finally:
                    # Clean up temp file after streaming
                    try:
                        if os.path.exists(file_path):
                            os.remove(file_path)
                        if os.path.exists(temp_dir):
                            os.rmdir(temp_dir)
                    except:
                        pass
            
            return StreamingResponse(
                iterfile(output_path),
                media_type=media_type,
                headers={
                    "Content-Disposition": f"attachment; filename={filename}",
                    "Content-Length": str(os.path.getsize(output_path))
                }
            )
            
        except Exception as download_error:
            # Clean up temp directory on error
            try:
                if os.path.exists(temp_dir):
                    import shutil
                    shutil.rmtree(temp_dir)
            except:
                pass
            raise HTTPException(status_code=500, detail=f"Download error: {str(download_error)}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "YouTube Downloader API"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
