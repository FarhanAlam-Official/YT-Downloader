"""
FFmpeg utilities for video and audio processing
"""

import os
import subprocess
import tempfile
import shutil
from pathlib import Path
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class FFmpegError(Exception):
    """Exception raised when FFmpeg operations fail"""
    pass

def check_ffmpeg_available() -> bool:
    """Check if FFmpeg is available on the system"""
    # First check if ffmpeg is in the project directory
    local_ffmpeg = os.path.join(os.path.dirname(__file__), '..', 'ffmpeg', 'ffmpeg.exe')
    if os.path.exists(local_ffmpeg):
        return True
    
    # Check if imageio-ffmpeg is available (pip install imageio-ffmpeg)
    try:
        import imageio_ffmpeg as ffmpeg
        ffmpeg_exe = ffmpeg.get_ffmpeg_exe()
        if os.path.exists(ffmpeg_exe):
            return True
    except ImportError:
        pass
    
    # Then check system PATH
    try:
        result = subprocess.run(
            ['ffmpeg', '-version'], 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError, subprocess.SubprocessError):
        return False

def get_ffmpeg_info() -> Optional[str]:
    """Get FFmpeg version information"""
    # Check imageio-ffmpeg first
    try:
        import imageio_ffmpeg as ffmpeg
        ffmpeg_exe = ffmpeg.get_ffmpeg_exe()
        if os.path.exists(ffmpeg_exe):
            result = subprocess.run(
                [ffmpeg_exe, '-version'], 
                capture_output=True, 
                text=True, 
                timeout=10
            )
            if result.returncode == 0:
                lines = result.stdout.split('\n')
                for line in lines:
                    if line.startswith('ffmpeg version'):
                        return line.strip() + " (via imageio-ffmpeg)"
    except (ImportError, subprocess.TimeoutExpired, FileNotFoundError, subprocess.SubprocessError):
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
            # Extract just the version line
            lines = result.stdout.split('\n')
            for line in lines:
                if line.startswith('ffmpeg version'):
                    return line.strip()
        return None
    except (subprocess.TimeoutExpired, FileNotFoundError, subprocess.SubprocessError):
        return None

def merge_video_audio(
    video_path: str, 
    audio_path: str, 
    output_path: str,
    cleanup_temp: bool = True
) -> bool:
    """Merge video and audio files using FFmpeg"""
    if not check_ffmpeg_available():
        raise FFmpegError("FFmpeg is not available on this system")
        
    if not os.path.exists(video_path):
        raise FFmpegError(f"Video file not found: {video_path}")
        
    if not os.path.exists(audio_path):
        raise FFmpegError(f"Audio file not found: {audio_path}")
    
    # Determine which FFmpeg executable to use
    ffmpeg_cmd = 'ffmpeg'  # Default to system PATH
    
    # Check if imageio-ffmpeg is available
    try:
        import imageio_ffmpeg as ffmpeg
        ffmpeg_exe = ffmpeg.get_ffmpeg_exe()
        if os.path.exists(ffmpeg_exe):
            ffmpeg_cmd = ffmpeg_exe
    except ImportError:
        pass
    
    # Check local project installation
    local_ffmpeg = os.path.join(os.path.dirname(__file__), '..', 'ffmpeg', 'ffmpeg.exe')
    if os.path.exists(local_ffmpeg):
        ffmpeg_cmd = local_ffmpeg
    
    try:
        # FFmpeg command to merge video and audio
        cmd = [
            ffmpeg_cmd,
            '-i', video_path,  # Input video
            '-i', audio_path,  # Input audio
            '-c:v', 'copy',    # Copy video codec (no re-encoding)
            '-c:a', 'aac',     # Encode audio to AAC (widely compatible)
            '-shortest',       # Match shortest stream duration
            '-y',              # Overwrite output file if exists
            output_path        # Output file
        ]
        
        logger.info(f"Starting FFmpeg merge: {video_path} + {audio_path} -> {output_path}")
        logger.info(f"Using FFmpeg executable: {ffmpeg_cmd}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout for large files
        )
        
        if result.returncode != 0:
            logger.error(f"FFmpeg merge failed: {result.stderr}")
            raise FFmpegError(f"FFmpeg merge failed: {result.stderr}")
            
        # Verify output file was created and has content
        if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
            raise FFmpegError("Output file was not created or is empty")
            
        logger.info(f"FFmpeg merge successful: {output_path}")
        
        # Cleanup temporary files if requested
        if cleanup_temp:
            try:
                if os.path.exists(video_path):
                    os.remove(video_path)
                    logger.debug(f"Cleaned up temporary video file: {video_path}")
                if os.path.exists(audio_path):
                    os.remove(audio_path)
                    logger.debug(f"Cleaned up temporary audio file: {audio_path}")
            except Exception as e:
                logger.warning(f"Failed to cleanup temporary files: {e}")
                
        return True
        
    except subprocess.TimeoutExpired:
        raise FFmpegError("FFmpeg merge timed out (file too large?)")
    except Exception as e:
        logger.error(f"Unexpected error during FFmpeg merge: {e}")
        raise FFmpegError(f"Merge failed: {str(e)}")

def create_temp_merge_dir() -> str:
    """Create a temporary directory for merge operations"""
    temp_dir = tempfile.mkdtemp(prefix="ytdl_merge_")
    logger.debug(f"Created temporary merge directory: {temp_dir}")
    return temp_dir

def cleanup_merge_dir(temp_dir: str) -> None:
    """Cleanup temporary merge directory and all contents"""
    try:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
            logger.debug(f"Cleaned up merge directory: {temp_dir}")
    except Exception as e:
        logger.warning(f"Failed to cleanup merge directory {temp_dir}: {e}")