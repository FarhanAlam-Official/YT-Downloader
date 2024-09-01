#!/usr/bin/env python3
"""
Smart Stream Selection Algorithm

Intelligent video and audio stream analysis and selection for optimal quality downloads.
This module provides algorithms to automatically select the best combination of video
and audio streams based on quality scoring, resolution, bitrate, and codec efficiency.

Key Features:
- Quality-based scoring for video and audio streams
- Smart fallback mechanisms for different scenarios
- Progressive vs adaptive stream handling
- Detailed logging for debugging and optimization

Authors: AI Assistant
Version: 2.0.0
License: MIT
"""

# Standard library imports
import logging
import re
from typing import Any, Dict, List, Optional, Tuple

# Third-party imports
from pytubefix import YouTube

# Local imports
from app.config import QualityScores

# Configure module logger
logger = logging.getLogger(__name__)

# ============================================================================
# DATA MODELS AND CLASSES
# ============================================================================

class StreamAnalysis:
    """
    Container for analyzed stream information with quality scoring.
    
    This class encapsulates a YouTube stream along with calculated quality metrics,
    making it easier to compare and rank streams for optimal selection.
    
    Attributes:
        stream: The original pytubefix stream object
        stream_type: Type of stream ('progressive', 'video', 'audio')
        quality_score: Calculated quality score for ranking
        size_mb: File size in megabytes
        itag: Stream identifier as string
        
    Example:
        >>> analysis = StreamAnalysis(stream, 'video', 600, 25.4)
        >>> print(f"Quality: {analysis.quality_score}, Size: {analysis.size_mb}MB")
    """
    
    def __init__(self, stream, stream_type: str, quality_score: int, size_mb: float):
        """
        Initialize stream analysis container.
        
        Args:
            stream: pytubefix stream object
            stream_type: Stream category ('progressive', 'video', 'audio')
            quality_score: Calculated quality ranking score
            size_mb: File size in megabytes
        """
        self.stream = stream
        self.stream_type = stream_type
        self.quality_score = quality_score
        self.size_mb = size_mb
        self.itag = str(stream.itag)
        
    def __repr__(self) -> str:
        """String representation for debugging."""
        return f"StreamAnalysis({self.stream_type}, score={self.quality_score}, size={self.size_mb}MB)"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def extract_resolution_number(resolution_str: str) -> int:
    """
    Extract numeric resolution from resolution string.
    
    Converts resolution strings like '1080p', '720p60', '480' into numeric values
    for comparison and scoring purposes.
    
    Args:
        resolution_str: Resolution string from stream (e.g., '1080p', '720p60')
        
    Returns:
        Numeric resolution value (e.g., 1080, 720, 480)
        Returns 0 if no numeric value found
        
    Examples:
        >>> extract_resolution_number('1080p')
        1080
        >>> extract_resolution_number('720p60')
        720
        >>> extract_resolution_number('unknown')
        0
    """
    if not resolution_str:
        return 0
    match = re.search(r'(\d+)', str(resolution_str))
    return int(match.group(1)) if match else 0

def extract_audio_bitrate(abr_str: str) -> int:
    """
    Extract numeric bitrate from audio bitrate string.
    
    Converts audio bitrate strings like '128kbps', '320kbps' into numeric values
    for quality comparison and scoring.
    
    Args:
        abr_str: Audio bitrate string from stream (e.g., '128kbps', '320kbps')
        
    Returns:
        Numeric bitrate value in kbps (e.g., 128, 320)
        Returns 0 if no numeric value found
        
    Examples:
        >>> extract_audio_bitrate('128kbps')
        128
        >>> extract_audio_bitrate('320kbps')
        320
        >>> extract_audio_bitrate('unknown')
        0
    """
    if not abr_str:
        return 0
    match = re.search(r'(\d+)', str(abr_str))
    return int(match.group(1)) if match else 0

def calculate_video_quality_score(stream) -> int:
    """Calculate quality score for video stream based on resolution, fps, and codec"""
    score = 0
    
    # Resolution score (most important factor)
    if hasattr(stream, 'resolution') and stream.resolution:
        res_num = extract_resolution_number(stream.resolution)
        # Use quality scores from config
        if res_num >= 2160:      # 4K
            score += QualityScores.VIDEO_SCORES.get(2160, 1000)
        elif res_num >= 1440:    # 1440p
            score += QualityScores.VIDEO_SCORES.get(1440, 800)
        elif res_num >= 1080:    # 1080p  
            score += QualityScores.VIDEO_SCORES.get(1080, 600)
        elif res_num >= 720:     # 720p
            score += QualityScores.VIDEO_SCORES.get(720, 400)
        elif res_num >= 480:     # 480p
            score += QualityScores.VIDEO_SCORES.get(480, 200)
        else:                    # Lower resolutions
            score += res_num // 10
            
    # FPS bonus (if available)
    if hasattr(stream, 'fps') and stream.fps:
        if stream.fps >= 60:
            score += QualityScores.FPS_BONUS.get(60, 50)
        elif stream.fps >= 30:
            score += QualityScores.FPS_BONUS.get(30, 25)
            
    # Codec quality bonus
    if hasattr(stream, 'video_codec') and stream.video_codec:
        codec = stream.video_codec.lower()
        if 'av01' in codec:      # AV1 (most efficient)
            score += QualityScores.VIDEO_CODEC_BONUS.get('av01', 30)
        elif 'vp9' in codec:     # VP9 (good efficiency)
            score += QualityScores.VIDEO_CODEC_BONUS.get('vp9', 20)
        elif 'h264' in codec:    # H.264 (standard)
            score += QualityScores.VIDEO_CODEC_BONUS.get('h264', 10)
            
    return score

def calculate_audio_quality_score(stream) -> int:
    """Calculate quality score for audio stream based on bitrate and codec"""
    score = 0
    
    # Bitrate score (most important for audio)
    if hasattr(stream, 'abr') and stream.abr:
        bitrate = extract_audio_bitrate(stream.abr)
        if bitrate >= 320:       # Very high quality
            score += QualityScores.AUDIO_SCORES.get(320, 300)
        elif bitrate >= 256:     # High quality
            score += QualityScores.AUDIO_SCORES.get(256, 250)
        elif bitrate >= 192:     # Good quality
            score += QualityScores.AUDIO_SCORES.get(192, 200)
        elif bitrate >= 128:     # Standard quality
            score += QualityScores.AUDIO_SCORES.get(128, 150)
        elif bitrate >= 96:      # Acceptable quality
            score += QualityScores.AUDIO_SCORES.get(96, 100)
        else:                    # Lower quality
            score += bitrate
            
    # Codec quality bonus
    if hasattr(stream, 'audio_codec') and stream.audio_codec:
        codec = stream.audio_codec.lower()
        if 'opus' in codec:      # Opus (most efficient)
            score += QualityScores.AUDIO_CODEC_BONUS.get('opus', 25)
        elif 'aac' in codec:     # AAC (good quality)
            score += QualityScores.AUDIO_CODEC_BONUS.get('aac', 20)
        elif 'mp3' in codec:     # MP3 (compatible)
            score += QualityScores.AUDIO_CODEC_BONUS.get('mp3', 10)
            
    return score

def get_file_size_mb(stream) -> float:
    """Get file size in MB for a stream"""
    if hasattr(stream, 'filesize') and stream.filesize:
        return stream.filesize / (1024 * 1024)
    return 0.0

def analyze_streams(yt: YouTube) -> Tuple[List[StreamAnalysis], List[StreamAnalysis], List[StreamAnalysis]]:
    """Analyze all streams and categorize them with quality scores"""
    progressive_streams = []
    video_streams = []
    audio_streams = []
    
    try:
        # Analyze progressive streams (video + audio)
        for stream in yt.streams.filter(progressive=True):
            if stream.resolution:  # Only include streams with resolution
                quality_score = calculate_video_quality_score(stream)
                size_mb = get_file_size_mb(stream)
                analysis = StreamAnalysis(stream, 'progressive', quality_score, size_mb)
                progressive_streams.append(analysis)
                
        # Analyze video-only streams
        for stream in yt.streams.filter(adaptive=True, only_video=True):
            if stream.resolution:
                quality_score = calculate_video_quality_score(stream)
                size_mb = get_file_size_mb(stream)
                analysis = StreamAnalysis(stream, 'video', quality_score, size_mb)
                video_streams.append(analysis)
                
        # Analyze audio-only streams  
        for stream in yt.streams.filter(only_audio=True):
            quality_score = calculate_audio_quality_score(stream)
            size_mb = get_file_size_mb(stream)
            analysis = StreamAnalysis(stream, 'audio', quality_score, size_mb)
            audio_streams.append(analysis)
            
        # Sort by quality score (descending)
        progressive_streams.sort(key=lambda x: x.quality_score, reverse=True)
        video_streams.sort(key=lambda x: x.quality_score, reverse=True)
        audio_streams.sort(key=lambda x: x.quality_score, reverse=True)
        
        logger.info(f"Analyzed streams: {len(progressive_streams)} progressive, {len(video_streams)} video, {len(audio_streams)} audio")
        
    except Exception as e:
        logger.error(f"Error analyzing streams: {e}")
        
    return progressive_streams, video_streams, audio_streams

def smart_select_best_option(yt: YouTube, prefer_progressive: bool = False) -> Optional[Dict[str, Any]]:
    """Intelligently select the best download option - prioritizes highest quality by default"""
    try:
        progressive_streams, video_streams, audio_streams = analyze_streams(yt)
        
        # Debug logging
        logger.info(f"Smart selection analysis:")
        logger.info(f"  Progressive streams: {len(progressive_streams)}")
        if progressive_streams:
            logger.info(f"  Best progressive: {progressive_streams[0].stream.resolution} (score: {progressive_streams[0].quality_score})")
        logger.info(f"  Video streams: {len(video_streams)}")
        if video_streams:
            logger.info(f"  Best video: {video_streams[0].stream.resolution} (score: {video_streams[0].quality_score})")
        logger.info(f"  Audio streams: {len(audio_streams)}")
        if audio_streams:
            logger.info(f"  Best audio: {audio_streams[0].stream.abr} (score: {audio_streams[0].quality_score})")
        logger.info(f"  Prefer progressive: {prefer_progressive}")
        
        # Option 1: Find best video + audio combination (PRIORITIZED for highest quality)
        if video_streams and audio_streams:
            best_video = video_streams[0]
            best_audio = audio_streams[0]
            
            # Calculate combined size
            combined_size = best_video.size_mb + best_audio.size_mb
            
            # Check if this is significantly better than progressive option
            best_progressive_quality = 0
            if progressive_streams:
                best_progressive_quality = extract_resolution_number(progressive_streams[0].stream.resolution)
            
            best_video_quality = extract_resolution_number(best_video.stream.resolution)
            
            logger.info(f"Quality comparison: Merge option {best_video_quality}p vs Progressive {best_progressive_quality}p")
            
            # If merge option is significantly better quality OR no good progressive available
            if (best_video_quality > best_progressive_quality * 1.5) or (best_progressive_quality < 720):
                logger.info(f"Selecting MERGE option: {best_video.stream.resolution} + {best_audio.stream.abr}")
                return {
                    'type': 'merge',
                    'video_stream': best_video.stream,
                    'audio_stream': best_audio.stream,
                    'video_itag': best_video.itag,
                    'audio_itag': best_audio.itag,
                    'estimated_size_mb': combined_size,
                    'quality_description': f"{best_video.stream.resolution} + {best_audio.stream.abr or 'High Quality Audio'}",
                    'merge_required': True
                }
            
        # Option 2: Use progressive stream only if specifically preferred AND high quality
        if prefer_progressive and progressive_streams:
            best_progressive = progressive_streams[0]
            progressive_quality = extract_resolution_number(best_progressive.stream.resolution)
            
            # Only use progressive if it's at least 720p
            if progressive_quality >= 720:
                logger.info(f"Selecting PROGRESSIVE option: {best_progressive.stream.resolution}")
                return {
                    'type': 'progressive',
                    'video_stream': best_progressive.stream,
                    'audio_stream': None,
                    'video_itag': best_progressive.itag,
                    'audio_itag': None,
                    'estimated_size_mb': best_progressive.size_mb,
                    'quality_description': f"{best_progressive.stream.resolution} (Progressive)",
                    'merge_required': False
                }
            
        # Option 3: Fallback to best merge option if available
        if video_streams and audio_streams:
            best_video = video_streams[0]
            best_audio = audio_streams[0]
            combined_size = best_video.size_mb + best_audio.size_mb
            
            logger.info(f"Selecting MERGE fallback: {best_video.stream.resolution} + {best_audio.stream.abr}")
            return {
                'type': 'merge',
                'video_stream': best_video.stream,
                'audio_stream': best_audio.stream,
                'video_itag': best_video.itag,
                'audio_itag': best_audio.itag,
                'estimated_size_mb': combined_size,
                'quality_description': f"{best_video.stream.resolution} + {best_audio.stream.abr or 'Audio'}",
                'merge_required': True
            }
            
        # Option 4: Last resort - any progressive stream
        if progressive_streams:
            best_progressive = progressive_streams[0]
            logger.info(f"Selecting PROGRESSIVE fallback: {best_progressive.stream.resolution}")
            return {
                'type': 'progressive',
                'video_stream': best_progressive.stream,
                'audio_stream': None,
                'video_itag': best_progressive.itag,
                'audio_itag': None,
                'estimated_size_mb': best_progressive.size_mb,
                'quality_description': f"{best_progressive.stream.resolution} (Progressive - Fallback)",
                'merge_required': False
            }
            
        # No suitable streams found
        logger.warning("No suitable streams found for smart selection")
        return None
        
    except Exception as e:
        logger.error(f"Error in smart selection: {e}")
        return None