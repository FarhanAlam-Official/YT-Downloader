#!/usr/bin/env python3
"""
Helper Utilities

General utility functions for the YouTube Downloader API including file operations,
string manipulation, validation, and other common operations.
"""

import logging
import os
import re
import tempfile
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse, parse_qs

# Configure module logger
logger = logging.getLogger(__name__)


class FileHelper:
    """Helper class for file operations."""
    
    @staticmethod
    def create_safe_filename(title: str, stream_id: str = None, max_length: int = 50) -> str:
        """
        Create a safe filename from video title.
        
        Args:
            title: Video title
            stream_id: Optional stream ID to append
            max_length: Maximum filename length
            
        Returns:
            Safe filename string
        """
        # Remove problematic characters and clean the title
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_title = safe_title[:max_length]  # Limit length
        
        # Remove extra whitespace
        safe_title = ' '.join(safe_title.split())
        
        if stream_id:
            safe_title += f"_{stream_id}"
        
        return safe_title or "download"  # Fallback if title is empty
    
    @staticmethod
    def get_file_extension(stream_type: str, mime_type: str = None, includes_video: bool = False) -> str:
        """
        Determine appropriate file extension based on stream properties.
        
        Args:
            stream_type: Type of stream ('video', 'audio', 'progressive')
            mime_type: MIME type of the stream
            includes_video: Whether stream includes video track
            
        Returns:
            File extension string (without dot)
        """
        if mime_type:
            if 'mp4' in mime_type.lower():
                return 'mp4'
            elif 'webm' in mime_type.lower():
                return 'webm'
            elif 'mp3' in mime_type.lower():
                return 'mp3'
            elif 'aac' in mime_type.lower():
                return 'aac'
        
        # Fallback based on stream type
        if stream_type == 'audio' and not includes_video:
            return 'mp3'
        else:
            return 'mp4'
    
    @staticmethod
    def ensure_directory_exists(directory_path: str) -> bool:
        """
        Ensure a directory exists, create if it doesn't.
        
        Args:
            directory_path: Path to directory
            
        Returns:
            True if directory exists or was created successfully
        """
        try:
            os.makedirs(directory_path, exist_ok=True)
            return True
        except Exception as e:
            logger.error(f"Failed to create directory {directory_path}: {e}")
            return False
    
    @staticmethod
    def cleanup_file(file_path: str) -> bool:
        """
        Safely cleanup a file.
        
        Args:
            file_path: Path to file to cleanup
            
        Returns:
            True if file was cleaned up successfully
        """
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.debug(f"Cleaned up file: {file_path}")
                return True
            return False
        except Exception as e:
            logger.warning(f"Failed to cleanup file {file_path}: {e}")
            return False
    
    @staticmethod
    def get_file_size_str(file_path: str) -> str:
        """
        Get human-readable file size string.
        
        Args:
            file_path: Path to file
            
        Returns:
            File size string (e.g., "25.4 MB")
        """
        try:
            if os.path.exists(file_path):
                size_bytes = os.path.getsize(file_path)
                size_mb = size_bytes / (1024 * 1024)
                
                if size_mb >= 1024:
                    size_gb = size_mb / 1024
                    return f"{size_gb:.1f} GB"
                elif size_mb >= 1:
                    return f"{size_mb:.1f} MB"
                else:
                    size_kb = size_bytes / 1024
                    return f"{size_kb:.1f} KB"
            return "Unknown size"
        except Exception:
            return "Unknown size"


class URLHelper:
    """Helper class for URL operations."""
    
    @staticmethod
    def extract_youtube_video_id(url: str) -> Optional[str]:
        """
        Extract YouTube video ID from various URL formats.
        
        Args:
            url: YouTube URL
            
        Returns:
            Video ID if found, None otherwise
        """
        # Common YouTube URL patterns
        patterns = [
            r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',  # Standard watch URLs
            r'(?:embed\/)([0-9A-Za-z_-]{11})',   # Embed URLs
            r'(?:youtu\.be\/)([0-9A-Za-z_-]{11})', # Short URLs
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        return None
    
    @staticmethod
    def is_valid_youtube_url(url: str) -> bool:
        """
        Validate if URL is a valid YouTube URL.
        
        Args:
            url: URL to validate
            
        Returns:
            True if valid YouTube URL
        """
        try:
            parsed = urlparse(url)
            
            # Check domain
            valid_domains = ['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be']
            if parsed.netloc.lower() not in valid_domains:
                return False
            
            # Check if we can extract video ID
            video_id = URLHelper.extract_youtube_video_id(url)
            return video_id is not None
            
        except Exception:
            return False
    
    @staticmethod
    def normalize_youtube_url(url: str) -> str:
        """
        Normalize YouTube URL to standard format.
        
        Args:
            url: YouTube URL
            
        Returns:
            Normalized YouTube URL
        """
        video_id = URLHelper.extract_youtube_video_id(url)
        if video_id:
            return f"https://www.youtube.com/watch?v={video_id}"
        return url


class QualityHelper:
    """Helper class for quality scoring and comparison."""
    
    @staticmethod
    def extract_resolution_number(resolution_str: str) -> int:
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
    
    @staticmethod
    def extract_audio_bitrate(abr_str: str) -> int:
        """
        Extract numeric bitrate from audio bitrate string.
        
        Args:
            abr_str: Audio bitrate string (e.g., "128kbps")
            
        Returns:
            Numeric bitrate value in kbps
        """
        if not abr_str:
            return 0
        match = re.search(r'(\d+)', str(abr_str))
        return int(match.group(1)) if match else 0
    
    @staticmethod
    def calculate_quick_video_score(resolution_str: str, fps: int = 30) -> int:
        """
        Quick video quality scoring for performance.
        
        Args:
            resolution_str: Resolution string
            fps: Frames per second
            
        Returns:
            Quality score
        """
        score = 0
        res_num = QualityHelper.extract_resolution_number(resolution_str)
        
        # Base resolution score
        if res_num >= 2160:
            score += 1000  # 4K
        elif res_num >= 1440:
            score += 800   # 1440p
        elif res_num >= 1080:
            score += 600   # 1080p
        elif res_num >= 720:
            score += 400   # 720p
        elif res_num >= 480:
            score += 200   # 480p
        else:
            score += res_num // 10
        
        # FPS bonus
        if fps >= 60:
            score += 50
        elif fps >= 30:
            score += 25
        
        return score
    
    @staticmethod
    def calculate_quick_audio_score(abr_str: str) -> int:
        """
        Quick audio quality scoring for performance.
        
        Args:
            abr_str: Audio bitrate string
            
        Returns:
            Quality score
        """
        score = 0
        bitrate = QualityHelper.extract_audio_bitrate(abr_str)
        
        if bitrate >= 320:
            score += 300
        elif bitrate >= 256:
            score += 250
        elif bitrate >= 192:
            score += 200
        elif bitrate >= 128:
            score += 150
        else:
            score += bitrate
        
        return score
    
    @staticmethod
    def estimate_file_size_mb(bitrate_kbps: int, duration_seconds: int) -> float:
        """
        Estimate file size based on bitrate and duration.
        
        Args:
            bitrate_kbps: Bitrate in kilobits per second
            duration_seconds: Duration in seconds
            
        Returns:
            Estimated file size in MB
        """
        # Convert: (bitrate in kbps * duration in seconds) / (8 * 1024)
        estimated_mb = (bitrate_kbps * duration_seconds) / (8 * 1024)
        return estimated_mb


class ValidationHelper:
    """Helper class for input validation."""
    
    @staticmethod
    def is_valid_stream_id(stream_id: str) -> bool:
        """
        Validate stream ID format.
        
        Args:
            stream_id: Stream ID to validate
            
        Returns:
            True if valid stream ID format
        """
        try:
            # Stream IDs should be numeric
            int(stream_id)
            return True
        except ValueError:
            return False
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """
        Sanitize filename by removing invalid characters.
        
        Args:
            filename: Original filename
            
        Returns:
            Sanitized filename
        """
        # Remove or replace invalid characters
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        
        # Remove control characters
        filename = ''.join(char for char in filename if ord(char) >= 32)
        
        # Limit length and trim whitespace
        filename = filename.strip()[:100]
        
        return filename or "download"
    
    @staticmethod
    def validate_file_path(file_path: str) -> bool:
        """
        Validate if file path is safe and accessible.
        
        Args:
            file_path: File path to validate
            
        Returns:
            True if path is valid
        """
        try:
            # Check if path is absolute and exists
            if not os.path.isabs(file_path):
                return False
            
            # Check if parent directory exists or can be created
            parent_dir = os.path.dirname(file_path)
            return os.path.exists(parent_dir) or FileHelper.ensure_directory_exists(parent_dir)
            
        except Exception:
            return False


class ResponseHelper:
    """Helper class for API response formatting."""
    
    @staticmethod
    def format_error_response(error_code: str, message: str, details: Dict = None) -> Dict[str, Any]:
        """
        Format standardized error response.
        
        Args:
            error_code: Error code identifier
            message: Error message
            details: Optional additional details
            
        Returns:
            Formatted error response dictionary
        """
        response = {
            'error': True,
            'error_code': error_code,
            'message': message,
            'timestamp': int(time.time())
        }
        
        if details:
            response['details'] = details
        
        return response
    
    @staticmethod
    def format_success_response(data: Any, message: str = None) -> Dict[str, Any]:
        """
        Format standardized success response.
        
        Args:
            data: Response data
            message: Optional success message
            
        Returns:
            Formatted success response dictionary
        """
        response = {
            'success': True,
            'data': data,
            'timestamp': int(time.time())
        }
        
        if message:
            response['message'] = message
        
        return response


# Convenience functions
def create_temp_directory(prefix: str = "ytdl_") -> str:
    """Create a temporary directory with given prefix."""
    return tempfile.mkdtemp(prefix=prefix)


def cleanup_temp_directory(temp_dir: str) -> bool:
    """Cleanup temporary directory and all contents."""
    import shutil
    try:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
            return True
        return False
    except Exception as e:
        logger.error(f"Failed to cleanup temp directory {temp_dir}: {e}")
        return False