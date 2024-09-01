#!/usr/bin/env python3
"""
FFmpeg Service

Service layer for FFmpeg operations including video/audio merging, format conversion,
and media processing capabilities.
"""

import logging
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Dict, Optional, Tuple

from app.exceptions import (
    FFmpegError,
    FFmpegNotFoundError,
    MergeError,
    ConfigurationError
)

# Configure module logger
logger = logging.getLogger(__name__)


class FFmpegService:
    """Service class for FFmpeg operations."""
    
    def __init__(self):
        """Initialize the FFmpeg service."""
        self.timeout = 300  # 5 minutes default timeout for merge operations
        self._ffmpeg_executable = None
        self._check_and_set_executable()
    
    def _check_and_set_executable(self) -> None:
        """Check for FFmpeg availability and set the executable path."""
        # Priority order: local project installation, imageio-ffmpeg, system PATH
        
        # Check local project installation first
        local_ffmpeg = os.path.join(os.path.dirname(__file__), '..', 'ffmpeg', 'ffmpeg.exe')
        if os.path.exists(local_ffmpeg):
            self._ffmpeg_executable = local_ffmpeg
            logger.info("Using local project FFmpeg installation")
            return
        
        # Check imageio-ffmpeg
        try:
            import imageio_ffmpeg as ffmpeg
            ffmpeg_exe = ffmpeg.get_ffmpeg_exe()
            if os.path.exists(ffmpeg_exe):
                self._ffmpeg_executable = ffmpeg_exe
                logger.info("Using imageio-ffmpeg installation")
                return
        except ImportError:
            pass
        
        # Check system PATH
        try:
            result = subprocess.run(
                ['ffmpeg', '-version'], 
                capture_output=True, 
                text=True, 
                timeout=10
            )
            if result.returncode == 0:
                self._ffmpeg_executable = 'ffmpeg'
                logger.info("Using system PATH FFmpeg")
                return
        except (subprocess.TimeoutExpired, FileNotFoundError, subprocess.SubprocessError):
            pass
        
        # FFmpeg not found
        self._ffmpeg_executable = None
        logger.warning("FFmpeg not found in any location")
    
    def is_available(self) -> bool:
        """
        Check if FFmpeg is available on the system.
        
        Returns:
            True if FFmpeg is available, False otherwise
        """
        return self._ffmpeg_executable is not None
    
    def get_version_info(self) -> Optional[str]:
        """
        Get FFmpeg version information.
        
        Returns:
            Version string if available, None otherwise
        """
        if not self.is_available():
            return None
        
        try:
            result = subprocess.run(
                [self._ffmpeg_executable, '-version'], 
                capture_output=True, 
                text=True, 
                timeout=10
            )
            if result.returncode == 0:
                # Extract just the version line
                lines = result.stdout.split('\n')
                for line in lines:
                    if line.startswith('ffmpeg version'):
                        if 'imageio-ffmpeg' in self._ffmpeg_executable:
                            return line.strip() + " (via imageio-ffmpeg)"
                        return line.strip()
            return None
        except (subprocess.TimeoutExpired, FileNotFoundError, subprocess.SubprocessError) as e:
            logger.error(f"Error getting FFmpeg version: {e}")
            return None
    
    def get_capabilities(self) -> Dict[str, bool]:
        """
        Get FFmpeg capabilities and features.
        
        Returns:
            Dictionary of capability flags
        """
        capabilities = {
            'available': self.is_available(),
            'video_merge': False,
            'audio_conversion': False,
            'format_conversion': False
        }
        
        if self.is_available():
            capabilities.update({
                'video_merge': True,
                'audio_conversion': True,
                'format_conversion': True
            })
        
        return capabilities
    
    def merge_video_audio(
        self, 
        video_path: str, 
        audio_path: str, 
        output_path: str,
        cleanup_temp: bool = True,
        video_codec: str = 'copy',
        audio_codec: str = 'aac'
    ) -> str:
        """
        Merge video and audio files using FFmpeg.
        
        Args:
            video_path: Path to video file
            audio_path: Path to audio file
            output_path: Path for output file
            cleanup_temp: Whether to cleanup temporary files after merge
            video_codec: Video codec to use ('copy' for no re-encoding)
            audio_codec: Audio codec to use ('aac' recommended)
            
        Returns:
            Path to merged output file
            
        Raises:
            FFmpegNotFoundError: If FFmpeg is not available
            MergeError: If merge operation fails
        """
        if not self.is_available():
            raise FFmpegNotFoundError()
        
        # Validate input files
        if not os.path.exists(video_path):
            raise MergeError(f"Video file not found: {video_path}", video_path)
        
        if not os.path.exists(audio_path):
            raise MergeError(f"Audio file not found: {audio_path}", audio_file=audio_path)
        
        try:
            # Build FFmpeg command
            cmd = [
                self._ffmpeg_executable,
                '-i', video_path,      # Input video
                '-i', audio_path,      # Input audio
                '-c:v', video_codec,   # Video codec
                '-c:a', audio_codec,   # Audio codec
                '-shortest',           # Match shortest stream duration
                '-y',                  # Overwrite output file if exists
                output_path            # Output file
            ]
            
            logger.info(f"Starting FFmpeg merge: {video_path} + {audio_path} -> {output_path}")
            logger.info(f"Using FFmpeg: {self._ffmpeg_executable}")
            logger.debug(f"FFmpeg command: {' '.join(cmd)}")
            
            # Execute FFmpeg command
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            if result.returncode != 0:
                error_msg = f"FFmpeg merge failed: {result.stderr}"
                logger.error(error_msg)
                raise MergeError(error_msg, video_path, audio_path)
            
            # Verify output file was created and has content
            if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                raise MergeError("Output file was not created or is empty", video_path, audio_path)
            
            logger.info(f"FFmpeg merge successful: {output_path}")
            
            # Cleanup temporary files if requested
            if cleanup_temp:
                self._cleanup_files([video_path, audio_path])
            
            return output_path
            
        except subprocess.TimeoutExpired:
            raise MergeError(f"FFmpeg merge timed out after {self.timeout} seconds", video_path, audio_path)
        except Exception as e:
            logger.error(f"Unexpected error during FFmpeg merge: {e}")
            raise MergeError(f"Merge failed: {str(e)}", video_path, audio_path)
    
    def convert_audio_format(
        self, 
        input_path: str, 
        output_path: str, 
        format: str = 'mp3',
        bitrate: str = '128k'
    ) -> str:
        """
        Convert audio to different format.
        
        Args:
            input_path: Path to input audio file
            output_path: Path for output audio file
            format: Target audio format ('mp3', 'aac', 'ogg')
            bitrate: Target bitrate ('128k', '192k', '320k')
            
        Returns:
            Path to converted audio file
            
        Raises:
            FFmpegNotFoundError: If FFmpeg is not available
            FFmpegError: If conversion fails
        """
        if not self.is_available():
            raise FFmpegNotFoundError()
        
        if not os.path.exists(input_path):
            raise FFmpegError(f"Input audio file not found: {input_path}")
        
        try:
            cmd = [
                self._ffmpeg_executable,
                '-i', input_path,
                '-acodec', 'libmp3lame' if format == 'mp3' else 'aac',
                '-ab', bitrate,
                '-y',
                output_path
            ]
            
            logger.info(f"Converting audio: {input_path} -> {output_path} ({format}, {bitrate})")
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            if result.returncode != 0:
                raise FFmpegError(f"Audio conversion failed: {result.stderr}")
            
            if not os.path.exists(output_path):
                raise FFmpegError("Audio conversion output file not created")
            
            logger.info(f"Audio conversion successful: {output_path}")
            return output_path
            
        except subprocess.TimeoutExpired:
            raise FFmpegError(f"Audio conversion timed out after {self.timeout} seconds")
        except Exception as e:
            raise FFmpegError(f"Audio conversion failed: {str(e)}")
    
    def create_temp_merge_dir(self, prefix: str = "ytdl_merge_") -> str:
        """
        Create a temporary directory for merge operations.
        
        Args:
            prefix: Prefix for temporary directory name
            
        Returns:
            Path to created temporary directory
        """
        temp_dir = tempfile.mkdtemp(prefix=prefix)
        logger.debug(f"Created temporary merge directory: {temp_dir}")
        return temp_dir
    
    def cleanup_merge_dir(self, temp_dir: str) -> None:
        """
        Cleanup temporary merge directory and all contents.
        
        Args:
            temp_dir: Path to temporary directory to cleanup
        """
        try:
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
                logger.debug(f"Cleaned up merge directory: {temp_dir}")
        except Exception as e:
            logger.warning(f"Failed to cleanup merge directory {temp_dir}: {e}")
    
    def _cleanup_files(self, file_paths: list) -> None:
        """
        Cleanup a list of files.
        
        Args:
            file_paths: List of file paths to cleanup
        """
        for file_path in file_paths:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.debug(f"Cleaned up temporary file: {file_path}")
            except Exception as e:
                logger.warning(f"Failed to cleanup file {file_path}: {e}")
    
    def get_media_info(self, file_path: str) -> Optional[Dict]:
        """
        Get media file information using FFprobe (if available).
        
        Args:
            file_path: Path to media file
            
        Returns:
            Dictionary with media information or None if unavailable
        """
        if not self.is_available() or not os.path.exists(file_path):
            return None
        
        try:
            # Try to use ffprobe if available
            ffprobe_cmd = self._ffmpeg_executable.replace('ffmpeg', 'ffprobe')
            
            cmd = [
                ffprobe_cmd,
                '-v', 'quiet',
                '-print_format', 'json',
                '-show_format',
                '-show_streams',
                file_path
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                import json
                return json.loads(result.stdout)
            
        except Exception as e:
            logger.debug(f"Could not get media info for {file_path}: {e}")
        
        return None


# Global service instance
ffmpeg_service = FFmpegService()