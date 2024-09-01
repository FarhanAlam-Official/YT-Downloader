#!/usr/bin/env python3
"""
Application Configuration

Configuration settings, constants, and environment variables for the application.
"""

import os
from typing import List


class Settings:
    """Application settings and configuration."""
    
    # Application Info
    APP_NAME = "YouTube Downloader API"
    VERSION = "2.0.0"
    DESCRIPTION = "High-performance YouTube video downloader with smart stream selection"
    
    # Server Configuration
    HOST = "127.0.0.1"
    PORT = 8000
    RELOAD = True  # Development only
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",   # Next.js development server
        "https://localhost:3000",  # HTTPS variant
        "http://127.0.0.1:3000",   # Alternative localhost format
    ]
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["*"]
    CORS_ALLOW_HEADERS = ["*"]
    
    # Cache Configuration
    CACHE_TTL = 300  # 5 minutes
    CACHE_MAX_SIZE = 1000  # Maximum number of cached items
    
    # Performance Configuration
    MAX_CONCURRENT_DOWNLOADS = 2  # Parallel download threads
    DOWNLOAD_TIMEOUT = 300  # 5 minutes
    CHUNK_SIZE = 8192  # 8KB chunks for streaming
    
    # File Configuration
    MAX_FILENAME_LENGTH = 50
    TEMP_DIR_PREFIX = "ytdl_merge_"
    
    # Logging Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # External Services
    YOUTUBE_API_TIMEOUT = 30  # seconds
    
    # Feature Flags
    ENABLE_CACHING = True
    ENABLE_PARALLEL_DOWNLOADS = True
    ENABLE_FFMPEG_MERGING = True
    
    @classmethod
    def get_cors_origins(cls) -> List[str]:
        """Get CORS origins from environment or default."""
        env_origins = os.getenv("CORS_ORIGINS")
        if env_origins:
            return [origin.strip() for origin in env_origins.split(",")]
        return cls.CORS_ORIGINS
    
    @classmethod
    def is_development(cls) -> bool:
        """Check if running in development mode."""
        return os.getenv("ENVIRONMENT", "development") == "development"
    
    @classmethod
    def is_production(cls) -> bool:
        """Check if running in production mode."""
        return os.getenv("ENVIRONMENT", "development") == "production"


# Global settings instance
settings = Settings()


# Quality scoring constants
class QualityScores:
    """Quality scoring constants for stream selection."""
    
    # Video quality scores
    VIDEO_SCORES = {
        2160: 1000,  # 4K
        1440: 800,   # 1440p
        1080: 600,   # 1080p
        720: 400,    # 720p
        480: 200,    # 480p
    }
    
    # Audio quality scores
    AUDIO_SCORES = {
        320: 300,    # 320kbps
        256: 250,    # 256kbps
        192: 200,    # 192kbps
        128: 150,    # 128kbps
        96: 100,     # 96kbps
    }
    
    # Codec bonuses
    VIDEO_CODEC_BONUS = {
        "av01": 30,  # AV1 (most efficient)
        "vp9": 20,   # VP9 (good efficiency)
        "h264": 10,  # H.264 (standard)
    }
    
    AUDIO_CODEC_BONUS = {
        "opus": 25,  # Opus (most efficient)
        "aac": 20,   # AAC (good quality)
        "mp3": 10,   # MP3 (compatible)
    }
    
    # FPS bonuses
    FPS_BONUS = {
        60: 50,      # 60fps
        30: 25,      # 30fps
    }


# File size estimation constants
class FileSizeEstimates:
    """File size estimation constants."""
    
    # Bitrate estimates by resolution (kbps)
    VIDEO_BITRATES = {
        2160: 3500,  # 4K
        1440: 2500,  # 1440p
        1080: 2000,  # 1080p
        720: 1500,   # 720p
        480: 800,    # 480p
        360: 500,    # 360p
        240: 300,    # 240p
    }
    
    # Default audio bitrate (kbps)
    DEFAULT_AUDIO_BITRATE = 128
    
    # Compression ratios
    PROGRESSIVE_COMPRESSION = 0.8  # Progressive streams are more compressed
    ADAPTIVE_COMPRESSION = 1.0     # Adaptive streams are less compressed