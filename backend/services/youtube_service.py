#!/usr/bin/env python3
"""
YouTube Service

Service layer for YouTube video processing, stream analysis, and metadata extraction.
Handles all interactions with the PyTubeFix library and YouTube-specific operations.
"""

import logging
import os
import re
import tempfile
import time
from typing import Any, Dict, List, Optional

from pytubefix import YouTube

from app.exceptions import (
    VideoNotFoundError,
    InvalidURLError,
    StreamNotFoundError,
    DownloadError,
    ServiceUnavailableError,
    TimeoutError
)

# Configure module logger
logger = logging.getLogger(__name__)


class YouTubeService:
    """Service class for YouTube video operations."""
    
    def __init__(self):
        """Initialize the YouTube service."""
        self.timeout = 30  # Default timeout for YouTube operations
    
    def extract_video_id(self, url: str) -> Optional[str]:
        """
        Extract YouTube video ID from URL for cache key generation.
        
        Args:
            url: YouTube video URL (any format)
            
        Returns:
            Video ID string if successful, None if extraction fails
            
        Example:
            >>> extract_video_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            'dQw4w9WgXcQ'
        """
        try:
            yt = YouTube(str(url))
            return yt.video_id
        except Exception as e:
            logger.warning(f"Failed to extract video ID from {url}: {e}")
            return None
    
    def create_youtube_object(self, url: str) -> YouTube:
        """
        Create a YouTube object with proper error handling.
        
        Args:
            url: YouTube video URL
            
        Returns:
            YouTube object
            
        Raises:
            VideoNotFoundError: If video cannot be found or accessed
            InvalidURLError: If URL format is invalid
            ServiceUnavailableError: If YouTube service is unavailable
        """
        try:
            yt = YouTube(str(url))
            # Force loading of video info to validate
            _ = yt.title
            return yt
        except Exception as e:
            error_msg = str(e).lower()
            
            if "not found" in error_msg or "unavailable" in error_msg:
                raise VideoNotFoundError(url, str(e))
            elif "invalid" in error_msg or "malformed" in error_msg:
                raise InvalidURLError(url, str(e))
            elif "timeout" in error_msg:
                raise TimeoutError("YouTube access", self.timeout, str(e))
            else:
                raise ServiceUnavailableError("YouTube", str(e))
    
    def get_video_metadata(self, yt: YouTube) -> Dict[str, Any]:
        """
        Extract comprehensive video metadata.
        
        Args:
            yt: YouTube object
            
        Returns:
            Dictionary containing video metadata
        """
        try:
            return {
                'title': yt.title or "Unknown Title",
                'duration': yt.length or 0,
                'thumbnail': yt.thumbnail_url or "",
                'uploader': yt.author or "Unknown",
                'view_count': yt.views or 0,
                'video_id': yt.video_id,
                'description': getattr(yt, 'description', '')[:500] if hasattr(yt, 'description') else "",
                'publish_date': str(getattr(yt, 'publish_date', '')) if hasattr(yt, 'publish_date') else ""
            }
        except Exception as e:
            logger.error(f"Error extracting video metadata: {e}")
            return {
                'title': "Unknown Title",
                'duration': 0,
                'thumbnail': "",
                'uploader': "Unknown",
                'view_count': 0,
                'video_id': yt.video_id if hasattr(yt, 'video_id') else "",
                'description': "",
                'publish_date': ""
            }
    
    def get_stream_info(self, yt: YouTube) -> List[Dict[str, Any]]:
        """
        Extract detailed information about all available streams.
        
        Args:
            yt: YouTube object
            
        Returns:
            List of stream information dictionaries
        """
        streams = []
        seen_formats = set()
        
        try:
            # Progressive streams (video+audio)
            progressive_streams = yt.streams.filter(progressive=True)
            logger.info(f"Found {len(progressive_streams)} progressive streams")
            
            for stream in progressive_streams:
                if not stream.resolution:
                    continue
                    
                quality = stream.resolution
                format_key = f"video_prog_{quality}_{stream.mime_type.split('/')[-1]}"
                
                if format_key not in seen_formats:
                    seen_formats.add(format_key)
                    
                    # Calculate file size
                    filesize_str = self._get_filesize_str(stream)
                    
                    streams.append({
                        "id": str(stream.itag),
                        "type": "video",
                        "quality": f"{quality} (with audio)",
                        "format": stream.mime_type.split('/')[-1] if stream.mime_type else "mp4",
                        "filesize": filesize_str,
                        "codec": f"{stream.video_codec}, {stream.audio_codec}" if stream.video_codec and stream.audio_codec else "Unknown",
                        "url": str(yt.watch_url)
                    })
            
            # Video-only streams
            video_streams = yt.streams.filter(adaptive=True, only_video=True)
            logger.info(f"Found {len(video_streams)} video-only streams")
            
            for stream in video_streams:
                if not stream.resolution:
                    continue
                    
                quality = stream.resolution
                format_key = f"video_only_{quality}_{stream.mime_type.split('/')[-1]}"
                
                if format_key not in seen_formats:
                    seen_formats.add(format_key)
                    
                    filesize_str = self._get_filesize_str(stream)
                    
                    streams.append({
                        "id": str(stream.itag),
                        "type": "video",
                        "quality": f"{quality} (video only)",
                        "format": stream.mime_type.split('/')[-1] if stream.mime_type else "mp4",
                        "filesize": filesize_str,
                        "codec": stream.video_codec or "Unknown",
                        "url": str(yt.watch_url)
                    })
            
            # Audio-only streams
            audio_streams = yt.streams.filter(only_audio=True)
            logger.info(f"Found {len(audio_streams)} audio-only streams")
            
            for stream in audio_streams:
                if not stream.abr:
                    continue
                    
                quality = stream.abr
                format_key = f"audio_{quality}_{stream.mime_type.split('/')[-1]}"
                
                if format_key not in seen_formats:
                    seen_formats.add(format_key)
                    
                    filesize_str = self._get_filesize_str(stream)
                    
                    streams.append({
                        "id": str(stream.itag),
                        "type": "audio",
                        "quality": quality,
                        "format": stream.mime_type.split('/')[-1] if stream.mime_type else "mp4",
                        "filesize": filesize_str,
                        "codec": stream.audio_codec or "Unknown",
                        "url": str(yt.watch_url)
                    })
            
            logger.info(f"Total streams processed: {len(streams)}")
            return streams
            
        except Exception as e:
            logger.error(f"Error processing streams: {e}")
            return []
    
    def get_stream_by_itag(self, yt: YouTube, stream_id: str):
        """
        Get a specific stream by its itag.
        
        Args:
            yt: YouTube object
            stream_id: Stream itag identifier
            
        Returns:
            Stream object if found
            
        Raises:
            StreamNotFoundError: If stream is not found
        """
        try:
            stream = yt.streams.get_by_itag(int(stream_id))
            if not stream:
                raise StreamNotFoundError(stream_id)
            return stream
        except ValueError:
            raise StreamNotFoundError(stream_id, f"Invalid stream ID format: {stream_id}")
        except Exception as e:
            raise StreamNotFoundError(stream_id, str(e))
    
    def download_stream(self, stream, output_dir: str, filename: str) -> str:
        """
        Download a stream to the specified directory.
        
        Args:
            stream: PyTubeFix stream object
            output_dir: Output directory path
            filename: Output filename
            
        Returns:
            Path to downloaded file
            
        Raises:
            DownloadError: If download fails
        """
        try:
            output_path = os.path.join(output_dir, filename)
            stream.download(output_path=output_dir, filename=filename)
            
            # Verify download
            if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                raise DownloadError(f"Download failed - file not created or empty: {filename}")
            
            return output_path
        except Exception as e:
            raise DownloadError(f"Failed to download stream: {str(e)}")
    
    def create_safe_filename(self, title: str, stream_id: str = None, max_length: int = 50) -> str:
        """
        Create a safe filename from video title.
        
        Args:
            title: Video title
            stream_id: Optional stream ID to append
            max_length: Maximum filename length
            
        Returns:
            Safe filename string
        """
        # Clean the title for filename
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_title = safe_title[:max_length]  # Limit length
        
        if stream_id:
            safe_title += f"_{stream_id}"
        
        return safe_title
    
    def estimate_file_size(self, stream, duration_seconds: int) -> float:
        """
        Estimate file size in MB based on stream properties.
        
        Args:
            stream: PyTubeFix stream object
            duration_seconds: Video duration in seconds
            
        Returns:
            Estimated file size in MB
        """
        if hasattr(stream, 'filesize') and stream.filesize:
            return stream.filesize / (1024 * 1024)
        
        # Estimation based on bitrate and duration
        estimated_bitrate = 1000  # Default 1000 kbps
        
        if hasattr(stream, 'abr') and stream.abr:
            # Audio stream
            bitrate_match = re.search(r'(\d+)', stream.abr)
            if bitrate_match:
                estimated_bitrate = int(bitrate_match.group(1))
        elif hasattr(stream, 'resolution') and stream.resolution:
            # Video stream - estimate based on resolution
            res_num = self._extract_resolution_number(stream.resolution)
            if res_num >= 1080:
                estimated_bitrate = 2500  # 2.5 Mbps for 1080p
            elif res_num >= 720:
                estimated_bitrate = 1500   # 1.5 Mbps for 720p
            elif res_num >= 480:
                estimated_bitrate = 800    # 800 kbps for 480p
            else:
                estimated_bitrate = 500    # 500 kbps for lower
        
        # Convert to MB: (bitrate in kbps * duration in seconds) / (8 * 1024)
        estimated_mb = (estimated_bitrate * duration_seconds) / (8 * 1024)
        return estimated_mb
    
    def _get_filesize_str(self, stream) -> str:
        """
        Get human-readable file size string.
        
        Args:
            stream: PyTubeFix stream object
            
        Returns:
            File size string (e.g., "25.4 MB")
        """
        try:
            if hasattr(stream, 'filesize') and stream.filesize:
                size_mb = stream.filesize / (1024 * 1024)
                return f"{size_mb:.1f} MB"
            else:
                return "Size unknown"
        except Exception:
            return "Size unknown"
    
    def _extract_resolution_number(self, resolution_str: str) -> int:
        """
        Extract numeric resolution from resolution string.
        
        Args:
            resolution_str: Resolution string (e.g., "1080p")
            
        Returns:
            Numeric resolution value
        """
        if not resolution_str:
            return 0
        match = re.search(r'(\d+)', str(resolution_str))
        return int(match.group(1)) if match else 0


# Global service instance
youtube_service = YouTubeService()