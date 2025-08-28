#!/usr/bin/env python3
"""
Pydantic Data Models

Data models for request/response validation and API documentation.
All models include comprehensive examples and validation rules.
"""

from typing import List, Optional
from pydantic import BaseModel, HttpUrl


class VideoURL(BaseModel):
    """
    Request model for video URL input.
    
    Attributes:
        url: Valid HTTP/HTTPS YouTube URL
    """
    url: HttpUrl
    
    class Config:
        json_schema_extra = {
            "example": {
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            }
        }


class StreamInfo(BaseModel):
    """
    Model representing a single video/audio stream.
    
    Attributes:
        id: Unique stream identifier (itag)
        type: Stream type ('video' or 'audio')
        quality: Quality description (e.g., '1080p', '128kbps')
        format: File format (e.g., 'mp4', 'webm')
        filesize: Human-readable file size
        codec: Audio/video codec information
        url: Source video URL
    """
    id: str
    type: str  # 'video' or 'audio'
    quality: str
    format: str
    filesize: str
    codec: str
    url: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "22",
                "type": "video",
                "quality": "720p (with audio)",
                "format": "mp4",
                "filesize": "25.4 MB",
                "codec": "avc1.64001F, mp4a.40.2",
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            }
        }


class VideoMetadata(BaseModel):
    """
    Complete video information including available streams.
    
    Attributes:
        title: Video title
        duration: Duration in seconds
        thumbnail: Thumbnail image URL
        uploader: Channel name
        view_count: Number of views
        streams: List of available streams
    """
    title: str
    duration: int
    thumbnail: str
    uploader: str
    view_count: int
    streams: List[StreamInfo]
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Rick Astley - Never Gonna Give You Up",
                "duration": 212,
                "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                "uploader": "Rick Astley",
                "view_count": 1000000000,
                "streams": []
            }
        }


class DownloadRequest(BaseModel):
    """
    Request model for manual stream download.
    
    Attributes:
        video_url: YouTube video URL
        stream_id: Specific stream ID to download
    """
    video_url: HttpUrl
    stream_id: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "stream_id": "22"
            }
        }


class SmartDownloadRequest(BaseModel):
    """
    Request model for smart download with automatic quality selection.
    
    Attributes:
        video_url: YouTube video URL
        prefer_progressive: Whether to prefer progressive streams over merging
                          (False = prioritize highest quality with merging)
    """
    video_url: HttpUrl
    prefer_progressive: bool = False  # Default to highest quality merging
    
    class Config:
        json_schema_extra = {
            "example": {
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "prefer_progressive": False
            }
        }


class SmartDownloadInfo(BaseModel):
    """
    Response model containing smart download recommendations.
    
    Attributes:
        video_title: Video title
        video_duration: Duration in seconds
        recommended_quality: Human-readable quality description
        estimated_size_mb: Estimated file size in megabytes
        merge_required: Whether video+audio merging is needed
        download_type: Type of download ('progressive' or 'merge')
        ffmpeg_available: Whether FFmpeg is available for merging
    """
    video_title: str
    video_duration: int
    recommended_quality: str
    estimated_size_mb: float
    merge_required: bool
    download_type: str  # 'progressive' or 'merge'
    ffmpeg_available: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "video_title": "Rick Astley - Never Gonna Give You Up",
                "video_duration": 212,
                "recommended_quality": "1080p + 128kbps",
                "estimated_size_mb": 45.2,
                "merge_required": True,
                "download_type": "merge",
                "ffmpeg_available": True
            }
        }


class SystemInfo(BaseModel):
    """
    System information and capabilities.
    
    Attributes:
        ffmpeg_available: Whether FFmpeg is installed and accessible
        ffmpeg_version: FFmpeg version string if available
        smart_download_supported: Whether smart download features are available
    """
    ffmpeg_available: bool
    ffmpeg_version: Optional[str]
    smart_download_supported: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "ffmpeg_available": True,
                "ffmpeg_version": "ffmpeg version 7.1-essentials_build",
                "smart_download_supported": True
            }
        }


class ContactRequest(BaseModel):
    """
    Request model for contact form submissions.
    """
    name: str
    email: str
    subject: Optional[str] = "General Inquiry"
    message: str
    honeypot: Optional[str] = None
    formStartTimestamp: Optional[float] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "subject": "Support",
                "message": "I need help with...",
                "honeypot": "",
                "formStartTimestamp": 1710000000.0
            }
        }


class ContactResponse(BaseModel):
    success: bool
    message: str