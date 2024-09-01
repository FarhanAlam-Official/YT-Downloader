#!/usr/bin/env python3
"""
Custom Exception Classes

Custom exceptions for the YouTube Downloader API with proper error handling
and user-friendly error messages.
"""

from typing import Optional


class YouTubeDownloaderError(Exception):
    """Base exception class for all YouTube Downloader errors."""
    
    def __init__(self, message: str, error_code: str = None):
        self.message = message
        self.error_code = error_code or "GENERIC_ERROR"
        super().__init__(self.message)


class VideoNotFoundError(YouTubeDownloaderError):
    """Raised when a YouTube video cannot be found or accessed."""
    
    def __init__(self, url: str, message: str = None):
        self.url = url
        message = message or f"Video not found or unavailable: {url}"
        super().__init__(message, "VIDEO_NOT_FOUND")


class InvalidURLError(YouTubeDownloaderError):
    """Raised when an invalid URL is provided."""
    
    def __init__(self, url: str, message: str = None):
        self.url = url
        message = message or f"Invalid YouTube URL: {url}"
        super().__init__(message, "INVALID_URL")


class StreamNotFoundError(YouTubeDownloaderError):
    """Raised when a requested stream is not available."""
    
    def __init__(self, stream_id: str, message: str = None):
        self.stream_id = stream_id
        message = message or f"Stream not found: {stream_id}"
        super().__init__(message, "STREAM_NOT_FOUND")


class FFmpegError(YouTubeDownloaderError):
    """Raised when FFmpeg operations fail."""
    
    def __init__(self, message: str = None, command: str = None):
        self.command = command
        message = message or "FFmpeg operation failed"
        super().__init__(message, "FFMPEG_ERROR")


class FFmpegNotFoundError(YouTubeDownloaderError):
    """Raised when FFmpeg is not available on the system."""
    
    def __init__(self, message: str = None):
        message = message or "FFmpeg is not installed or not found in PATH"
        super().__init__(message, "FFMPEG_NOT_FOUND")


class DownloadError(YouTubeDownloaderError):
    """Raised when video download fails."""
    
    def __init__(self, message: str = None, url: str = None):
        self.url = url
        message = message or "Download failed"
        super().__init__(message, "DOWNLOAD_ERROR")


class MergeError(YouTubeDownloaderError):
    """Raised when video/audio merging fails."""
    
    def __init__(self, message: str = None, video_file: str = None, audio_file: str = None):
        self.video_file = video_file
        self.audio_file = audio_file
        message = message or "Failed to merge video and audio"
        super().__init__(message, "MERGE_ERROR")


class CacheError(YouTubeDownloaderError):
    """Raised when cache operations fail."""
    
    def __init__(self, message: str = None, operation: str = None):
        self.operation = operation
        message = message or "Cache operation failed"
        super().__init__(message, "CACHE_ERROR")


class ConfigurationError(YouTubeDownloaderError):
    """Raised when configuration is invalid or missing."""
    
    def __init__(self, message: str = None, config_key: str = None):
        self.config_key = config_key
        message = message or "Configuration error"
        super().__init__(message, "CONFIGURATION_ERROR")


class ServiceUnavailableError(YouTubeDownloaderError):
    """Raised when an external service is unavailable."""
    
    def __init__(self, service: str, message: str = None):
        self.service = service
        message = message or f"Service unavailable: {service}"
        super().__init__(message, "SERVICE_UNAVAILABLE")


class TimeoutError(YouTubeDownloaderError):
    """Raised when operations timeout."""
    
    def __init__(self, operation: str, timeout: int, message: str = None):
        self.operation = operation
        self.timeout = timeout
        message = message or f"Operation '{operation}' timed out after {timeout} seconds"
        super().__init__(message, "TIMEOUT_ERROR")


class ValidationError(YouTubeDownloaderError):
    """Raised when input validation fails."""
    
    def __init__(self, field: str, value: str = None, message: str = None):
        self.field = field
        self.value = value
        message = message or f"Validation failed for field: {field}"
        super().__init__(message, "VALIDATION_ERROR")