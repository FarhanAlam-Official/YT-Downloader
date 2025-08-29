#!/usr/bin/env python3
"""
YouTube Downloader API - Main Backend Server

A FastAPI-based backend service for downloading YouTube videos with smart stream selection,
automatic video+audio merging using FFmpeg, and performance optimizations.

Features:
- Smart download with automatic quality selection
- Manual stream selection for advanced users
- FFmpeg integration for video/audio merging
- In-memory caching for performance optimization
- Parallel downloads for faster processing
- RESTful API with comprehensive error handling

Authors: AI Assistant
Version: 2.0.0 (Optimized)
License: MIT
"""

# Standard library imports
import asyncio
import logging
import os
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, List, Optional

# Third-party imports
import uvicorn
from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, HTMLResponse
import httpx
import re

# Local module imports
from app.config import settings
from app.models import (
    VideoURL, StreamInfo, VideoMetadata, DownloadRequest,
    SmartDownloadRequest, SmartDownloadInfo, SystemInfo,
    ContactRequest, ContactResponse
)
from app.exceptions import (
    VideoNotFoundError, InvalidURLError, StreamNotFoundError,
    DownloadError, FFmpegNotFoundError, MergeError
)
from services.youtube_service import youtube_service
from services.ffmpeg_service import ffmpeg_service
from services.smart_selection import smart_select_best_option
from utils.cache import get_video_analysis_cache, cleanup_all_caches
from utils.helpers import create_temp_directory, cleanup_temp_directory

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

# Load environment variables from .env if present
load_dotenv()

# Initialize FastAPI application with metadata
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure logging for debugging and monitoring
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format=settings.LOG_FORMAT
)
logger = logging.getLogger(__name__)

# Debug: Log environment variables for troubleshooting
logger.info(f"Environment check - HOST: {os.getenv('HOST', 'NOT_SET')}")
logger.info(f"Environment check - PORT: {os.getenv('PORT', 'NOT_SET')}")
logger.info(f"Environment check - ENVIRONMENT: {os.getenv('ENVIRONMENT', 'NOT_SET')}")

# Get cache instance
video_cache = get_video_analysis_cache()

# ============================================================================
# CORS CONFIGURATION
# ============================================================================

# Enable Cross-Origin Resource Sharing for frontend communication
# Allows the Next.js frontend (localhost:3000) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)
# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_fast_smart_selection(video_url: str, prefer_progressive: bool = False) -> Optional[Dict[str, Any]]:
    """Optimized smart selection with caching and lazy loading"""
    try:
        # Create YouTube object
        yt = youtube_service.create_youtube_object(video_url)
        video_id = yt.video_id
        
        # Check cache first
        cached_data = video_cache.get_analysis(video_id)
        if cached_data and 'smart_selection' in cached_data:
            return cached_data['smart_selection']
        
        # Use the smart selection service
        smart_selection = smart_select_best_option(yt, prefer_progressive)
        
        if smart_selection:
            # Cache the results
            video_cache.cache_smart_selection(video_id, smart_selection)
            logger.info(f"Fast analysis completed for {video_id}: {smart_selection.get('quality_description', 'No description')}")
        
        return smart_selection
        
    except Exception as e:
        logger.error(f"Fast analysis failed: {e}")
        return None
# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", response_class=HTMLResponse)
async def root():
    """Beautiful landing page matching the system design."""
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>YouTube Downloader API</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
            :root {{
                --youtube-red: #ff0000;
                --youtube-red-hover: #cc0000;
                --youtube-dark: #0f0f0f;
                --youtube-darker: #0a0a0a;
                --youtube-card: #1c1c1c;
                --youtube-card-hover: #272727;
                --youtube-text-primary: #ffffff;
                --youtube-text-secondary: #aaaaaa;
                --youtube-border: #303030;
                --gradient-primary: linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 50%, #272727 100%);
                --gradient-accent: linear-gradient(135deg, #ff0000 0%, #cc0000 50%, #990000 100%);
                --glass-bg: rgba(28, 28, 28, 0.8);
                --glass-border: rgba(255, 255, 255, 0.1);
            }}
            
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: var(--gradient-primary);
                min-height: 100vh;
                color: var(--youtube-text-primary);
                overflow-x: hidden;
                position: relative;
            }}
            
            /* Animated background particles */
            .bg-animation {{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background: 
                    radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 0, 0, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(255, 0, 0, 0.08) 0%, transparent 50%);
                animation: float 6s ease-in-out infinite;
            }}
            
            @keyframes float {{
                0%, 100% {{ transform: translateY(0px) rotate(0deg); }}
                50% {{ transform: translateY(-20px) rotate(2deg); }}
            }}
            
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                justify-content: center;
            }}
            
            .main-card {{
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 24px;
                padding: 50px;
                text-align: center;
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                width: 100%;
                max-width: 800px;
                position: relative;
            }}
            
            .logo-section {{
                margin-bottom: 40px;
            }}
            
            .logo {{
                font-size: 3.5rem;
                font-weight: 800;
                margin-bottom: 15px;
                background: var(--gradient-accent);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
                letter-spacing: -0.02em;
            }}
            
            .version-badge {{
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: var(--gradient-accent);
                color: white;
                padding: 8px 20px;
                border-radius: 50px;
                font-size: 0.9rem;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
                animation: pulse-glow 3s infinite;
            }}
            
            @keyframes pulse-glow {{
                0%, 100% {{ box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3); }}
                50% {{ box-shadow: 0 4px 25px rgba(255, 0, 0, 0.5); }}
            }}
            
            .status-indicator {{
                display: inline-flex;
                align-items: center;
                gap: 12px;
                background: var(--youtube-card);
                border: 1px solid var(--youtube-border);
                padding: 15px 25px;
                border-radius: 15px;
                margin: 30px 0;
                font-weight: 500;
            }}
            
            .status-dot {{
                width: 12px;
                height: 12px;
                background: #00ff88;
                border-radius: 50%;
                box-shadow: 0 0 10px #00ff88;
                animation: pulse 2s infinite;
            }}
            
            @keyframes pulse {{
                0%, 100% {{ transform: scale(1); opacity: 1; }}
                50% {{ transform: scale(1.2); opacity: 0.8; }}
            }}
            
            .description {{
                font-size: 1.2rem;
                color: var(--youtube-text-secondary);
                line-height: 1.6;
                margin: 30px 0;
                max-width: 600px;
            }}
            
            .features-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 20px;
                margin: 40px 0;
                width: 100%;
            }}
            
            .feature-card {{
                background: var(--youtube-card);
                border: 1px solid var(--youtube-border);
                border-radius: 16px;
                padding: 25px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }}
            
            .feature-card::before {{
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 2px;
                background: var(--gradient-accent);
                transition: left 0.3s ease;
            }}
            
            .feature-card:hover {{
                background: var(--youtube-card-hover);
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(255, 0, 0, 0.2);
            }}
            
            .feature-card:hover::before {{
                left: 0;
            }}
            
            .feature-icon {{
                font-size: 2.5rem;
                margin-bottom: 15px;
                display: block;
            }}
            
            .feature-title {{
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 10px;
                color: var(--youtube-text-primary);
            }}
            
            .feature-desc {{
                color: var(--youtube-text-secondary);
                font-size: 0.9rem;
                line-height: 1.4;
            }}
            
            .api-links {{
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                justify-content: center;
                margin: 40px 0;
            }}
            
            .api-link {{
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: var(--youtube-card);
                border: 1px solid var(--youtube-border);
                color: var(--youtube-text-primary);
                text-decoration: none;
                padding: 12px 20px;
                border-radius: 12px;
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }}
            
            .api-link:hover {{
                background: var(--gradient-accent);
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(255, 0, 0, 0.3);
                border-color: transparent;
            }}
            
            .footer-info {{
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid var(--youtube-border);
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                width: 100%;
            }}
            
            .info-item {{
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.9rem;
                color: var(--youtube-text-secondary);
            }}
            
            .status-success {{ color: #00ff88; }}
            .status-warning {{ color: #ffaa00; }}
            .status-error {{ color: #ff4444; }}
            
            .copyright {{
                margin-top: 30px;
                text-align: center;
                font-size: 0.8rem;
                color: var(--youtube-text-secondary);
                opacity: 0.7;
            }}
            
            /* Responsive design */
            @media (max-width: 768px) {{
                .main-card {{
                    padding: 30px 25px;
                    margin: 20px;
                }}
                
                .logo {{
                    font-size: 2.5rem;
                }}
                
                .features-grid {{
                    grid-template-columns: 1fr;
                }}
                
                .api-links {{
                    gap: 10px;
                }}
                
                .footer-info {{
                    grid-template-columns: 1fr;
                    text-align: center;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="bg-animation"></div>
        
        <div class="container">
            <div class="main-card">
                <div class="logo-section">
                    <div class="logo">🎬 YouTube Downloader</div>
                    <div class="version-badge">
                        <span>⚡</span>
                        <span>v{settings.VERSION}</span>
                    </div>
                </div>
                
                <div class="status-indicator">
                    <div class="status-dot"></div>
                    <span>🚀 API Server Running</span>
                </div>
                
                <p class="description">
                    Professional-grade YouTube video downloading service featuring intelligent quality selection, 
                    seamless FFmpeg integration, and lightning-fast performance optimization.
                </p>
                
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🎯</div>
                        <div class="feature-title">Smart Download</div>
                        <div class="feature-desc">AI-powered quality selection with automatic video+audio merging for optimal results</div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">⚡</div>
                        <div class="feature-title">High Performance</div>
                        <div class="feature-desc">Parallel processing with intelligent caching and optimized streaming</div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🛠️</div>
                        <div class="feature-title">FFmpeg Integration</div>
                        <div class="feature-desc">Professional video/audio processing with advanced codec support</div>
                    </div>
                </div>
                
                <div class="api-links">
                    <a href="/docs" class="api-link">
                        <span>📚</span>
                        <span>API Documentation</span>
                    </a>
                    <a href="/health" class="api-link">
                        <span>💚</span>
                        <span>Health Dashboard</span>
                    </a>
                    <a href="/api/system-info" class="api-link">
                        <span>ℹ️</span>
                        <span>System Information</span>
                    </a>
                    <a href="/redoc" class="api-link">
                        <span>📋</span>
                        <span>ReDoc</span>
                    </a>
                </div>
                
                <div class="footer-info">
                    <div class="info-item">
                        <span>🔧</span>
                        <span>FFmpeg:</span>
                        <span class="{'status-success' if ffmpeg_service.is_available() else 'status-warning'}">
                            {('✅ Available' if ffmpeg_service.is_available() else '⚠️ Not Available')}
                        </span>
                    </div>
                    <div class="info-item">
                        <span>🚀</span>
                        <span>Smart Downloads:</span>
                        <span class="{'status-success' if ffmpeg_service.is_available() else 'status-warning'}">
                            {('✅ Supported' if ffmpeg_service.is_available() else '⚠️ Limited')}
                        </span>
                    </div>
                    <div class="info-item">
                        <span>⚡</span>
                        <span>Performance:</span>
                        <span class="status-success">✅ Optimized</span>
                    </div>
                </div>
                
                <div class="copyright">
                    Built with FastAPI • Professional Architecture • Production Ready<br>
                    <small style="opacity: 0.6;">📚 Documentation available in <code>documentation/</code> folder</small>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/status")
async def api_status():
    """JSON API status endpoint for programmatic access."""
    return {
        "message": "YouTube Downloader API is running - ORGANIZED VERSION",
        "version": settings.VERSION,
        "status": "active",
        "features": {
            "smart_download": True,
            "ffmpeg_integration": ffmpeg_service.is_available(),
            "parallel_processing": True,
            "caching": True
        },
        "endpoints": {
            "documentation": "/docs",
            "health": "/health",
            "system_info": "/api/system-info",
            "video_info": "/api/video-info",
            "download": "/api/download",
            "smart_download": "/api/smart-download"
        }
    }

@app.get("/health", response_class=HTMLResponse)
async def health_check():
    """Beautiful health check dashboard matching system design."""
    ffmpeg_status = ffmpeg_service.is_available()
    cache_stats = video_cache.get_stats()
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Health Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            :root {{
                --youtube-red: #ff0000;
                --youtube-dark: #0f0f0f;
                --youtube-card: #1c1c1c;
                --youtube-card-hover: #272727;
                --youtube-text-primary: #ffffff;
                --youtube-text-secondary: #aaaaaa;
                --youtube-border: #303030;
                --status-success: #00ff88;
                --status-warning: #ffaa00;
                --status-error: #ff4444;
                --gradient-primary: linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 50%, #272727 100%);
                --gradient-accent: linear-gradient(135deg, #ff0000 0%, #cc0000 50%, #990000 100%);
                --glass-bg: rgba(28, 28, 28, 0.8);
                --glass-border: rgba(255, 255, 255, 0.1);
            }}
            
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: var(--gradient-primary);
                min-height: 100vh;
                color: var(--youtube-text-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }}
            
            .health-container {{
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 24px;
                padding: 40px;
                text-align: center;
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                max-width: 600px;
                width: 100%;
            }}
            
            .health-icon {{
                font-size: 4rem;
                margin-bottom: 20px;
                animation: heartbeat 2s infinite;
            }}
            
            @keyframes heartbeat {{
                0%, 50%, 100% {{ transform: scale(1); }}
                25%, 75% {{ transform: scale(1.1); }}
            }}
            
            .health-title {{
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 10px;
                background: var(--gradient-accent);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }}
            
            .health-subtitle {{
                color: var(--youtube-text-secondary);
                font-size: 1.1rem;
                margin-bottom: 40px;
            }}
            
            .status-grid {{
                display: grid;
                gap: 15px;
                margin: 30px 0;
            }}
            
            .status-item {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--youtube-card);
                border: 1px solid var(--youtube-border);
                padding: 20px;
                border-radius: 12px;
                transition: all 0.3s ease;
            }}
            
            .status-item:hover {{
                background: var(--youtube-card-hover);
                transform: translateY(-2px);
            }}
            
            .status-label {{
                font-weight: 500;
                color: var(--youtube-text-primary);
            }}
            
            .status-value {{
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }}
            
            .status-success {{ color: var(--status-success); }}
            .status-warning {{ color: var(--status-warning); }}
            .status-error {{ color: var(--status-error); }}
            
            .metric-card {{
                background: var(--youtube-card);
                border: 1px solid var(--youtube-border);
                border-radius: 12px;
                padding: 20px;
                margin: 15px 0;
                text-align: left;
            }}
            
            .metric-title {{
                font-size: 0.9rem;
                color: var(--youtube-text-secondary);
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }}
            
            .metric-value {{
                font-size: 1.8rem;
                font-weight: 700;
                color: var(--status-success);
            }}
            
            .actions {{
                margin-top: 40px;
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }}
            
            .action-btn {{
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: var(--youtube-card);
                border: 1px solid var(--youtube-border);
                color: var(--youtube-text-primary);
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 500;
                transition: all 0.3s ease;
            }}
            
            .action-btn:hover {{
                background: var(--gradient-accent);
                border-color: transparent;
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(255, 0, 0, 0.3);
            }}
            
            .action-btn.primary {{
                background: var(--gradient-accent);
                border-color: transparent;
            }}
            
            .action-btn.primary:hover {{
                box-shadow: 0 8px 20px rgba(255, 0, 0, 0.4);
            }}
            
            @media (max-width: 768px) {{
                .health-container {{
                    padding: 30px 20px;
                    margin: 10px;
                }}
                
                .health-title {{
                    font-size: 2rem;
                }}
                
                .actions {{
                    flex-direction: column;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="health-container">
            <div class="health-icon">💚</div>
            <h1 class="health-title">System Health</h1>
            <p class="health-subtitle">All systems operational and running smoothly</p>
            
            <div class="status-grid">
                <div class="status-item">
                    <span class="status-label">🌐 API Server</span>
                    <span class="status-value status-success">
                        <span>✅</span>
                        <span>Running</span>
                    </span>
                </div>
                
                <div class="status-item">
                    <span class="status-label">🔧 FFmpeg Engine</span>
                    <span class="status-value {'status-success' if ffmpeg_status else 'status-warning'}">
                        <span>{'✅' if ffmpeg_status else '⚠️'}</span>
                        <span>{('Available' if ffmpeg_status else 'Not Available')}</span>
                    </span>
                </div>
                
                <div class="status-item">
                    <span class="status-label">💾 Cache System</span>
                    <span class="status-value status-success">
                        <span>✅</span>
                        <span>Active ({cache_stats['size']} entries)</span>
                    </span>
                </div>
                
                <div class="status-item">
                    <span class="status-label">⚡ Performance</span>
                    <span class="status-value status-success">
                        <span>✅</span>
                        <span>{cache_stats['hit_rate']:.1%} hit rate</span>
                    </span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 30px 0;">
                <div class="metric-card">
                    <div class="metric-title">Cache Hits</div>
                    <div class="metric-value">{cache_stats['hits']:,}</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-title">Cache Size</div>
                    <div class="metric-value">{cache_stats['size']}</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-title">Hit Rate</div>
                    <div class="metric-value">{cache_stats['hit_rate']:.1%}</div>
                </div>
            </div>
            
            <div class="actions">
                <a href="/" class="action-btn primary">
                    <span>🏠</span>
                    <span>Back to Home</span>
                </a>
                <a href="/api/system-info" class="action-btn">
                    <span>ℹ️</span>
                    <span>System Info</span>
                </a>
                <a href="/docs" class="action-btn">
                    <span>📚</span>
                    <span>API Docs</span>
                </a>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/api/video-info", response_model=VideoMetadata)
async def get_video_info(video_data: VideoURL):
    """
    Extract video metadata and available streams from YouTube URL.
    """
    try:
        logger.info(f"Processing video URL: {video_data.url}")
        
        # Create YouTube object using service
        yt = youtube_service.create_youtube_object(str(video_data.url))
        
        # Get metadata and streams using services
        metadata = youtube_service.get_video_metadata(yt)
        streams = youtube_service.get_stream_info(yt)
        
        # Convert to StreamInfo models
        stream_models = [
            StreamInfo(**stream_data) for stream_data in streams
        ]
        
        logger.info(f"Successfully processed video: {metadata['title']} with {len(stream_models)} streams")
        
        return VideoMetadata(
            title=metadata['title'],
            duration=metadata['duration'],
            thumbnail=metadata['thumbnail'],
            uploader=metadata['uploader'],
            view_count=metadata['view_count'],
            streams=stream_models
        )
        
    except VideoNotFoundError as e:
        logger.error(f"Video not found: {e.message}")
        raise HTTPException(status_code=404, detail=e.message)
    except InvalidURLError as e:
        logger.error(f"Invalid URL: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Generic error occurred")

@app.post("/api/download")
async def download_video(download_request: DownloadRequest):
    """
    Download video stream and return as streaming response.
    """
    temp_dir = None
    
    try:
        logger.info(f"Starting download for URL: {download_request.video_url}, Stream ID: {download_request.stream_id}")
        
        # Create YouTube object using service
        yt = youtube_service.create_youtube_object(str(download_request.video_url))
        
        # Get the requested stream
        stream = youtube_service.get_stream_by_itag(yt, download_request.stream_id)
        
        # Create temporary directory
        temp_dir = create_temp_directory()
        
        # Create safe filename
        safe_title = youtube_service.create_safe_filename(yt.title or "download", download_request.stream_id)
        
        # Determine file extension
        extension = 'mp4' if stream.includes_video_track else 'mp3'
        filename = f"{safe_title}.{extension}"
        
        # Download the stream
        output_path = youtube_service.download_stream(stream, temp_dir, filename)
        
        # Determine media type
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
                        chunk = file_like.read(settings.CHUNK_SIZE)
                        if not chunk:
                            break
                        yield chunk
            finally:
                # Clean up temp file and directory after streaming
                cleanup_temp_directory(temp_dir)
        
        return StreamingResponse(
            iterfile(output_path),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except StreamNotFoundError as e:
        logger.error(f"Stream not found: {e.message}")
        if temp_dir:
            cleanup_temp_directory(temp_dir)
        raise HTTPException(status_code=404, detail=e.message)
    except DownloadError as e:
        logger.error(f"Download failed: {e.message}")
        if temp_dir:
            cleanup_temp_directory(temp_dir)
        raise HTTPException(status_code=500, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error in download: {e}")
        if temp_dir:
            cleanup_temp_directory(temp_dir)

@app.get("/api/system-info", response_model=SystemInfo)
async def get_system_info():
    """Get system information including FFmpeg availability."""
    ffmpeg_available = ffmpeg_service.is_available()
    ffmpeg_version = ffmpeg_service.get_version_info()
    
    return SystemInfo(
        ffmpeg_available=ffmpeg_available,
        ffmpeg_version=ffmpeg_version,
        smart_download_supported=ffmpeg_available
    )

@app.post("/api/smart-download-info", response_model=SmartDownloadInfo)
async def get_smart_download_info_endpoint(request: SmartDownloadRequest):
    """Get information about the recommended smart download option."""
    try:
        logger.info(f"Getting smart download info for: {request.video_url}")
        start_time = time.time()
        
        # Cleanup expired cache entries periodically
        video_cache.cleanup()
        
        # Use fast cached analysis
        smart_option = get_fast_smart_selection(str(request.video_url), prefer_progressive=request.prefer_progressive)
        
        if not smart_option:
            raise HTTPException(status_code=404, detail="No suitable streams found for smart download")
        
        # Get metadata for title and duration
        yt = youtube_service.create_youtube_object(str(request.video_url))
        metadata = youtube_service.get_video_metadata(yt)
        
        elapsed_time = time.time() - start_time
        logger.info(f"Smart download info completed in {elapsed_time:.2f} seconds")
        
        return SmartDownloadInfo(
            video_title=metadata['title'],
            video_duration=metadata['duration'],
            recommended_quality=smart_option.get('quality_description', 'Unknown'),
            estimated_size_mb=smart_option.get('estimated_size_mb', 0.0),
            merge_required=smart_option.get('merge_required', False),
            download_type=smart_option.get('type', 'unknown'),
            ffmpeg_available=ffmpeg_service.is_available()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting smart download info: {e}")

@app.post("/api/smart-download")
async def smart_download(request: SmartDownloadRequest):
    """Download video using smart selection with automatic merging."""
    temp_dir = None
    
    try:
        logger.info(f"Starting smart download for: {request.video_url}")
        start_time = time.time()
        
        # Get smart selection
        smart_option = get_fast_smart_selection(str(request.video_url), prefer_progressive=request.prefer_progressive)
        
        if not smart_option:
            raise HTTPException(status_code=404, detail="No suitable streams found for smart download")
        
        # Create YouTube object and metadata
        yt = youtube_service.create_youtube_object(str(request.video_url))
        safe_title = youtube_service.create_safe_filename(yt.title or "smart_download")
        
        # Create temporary directory
        temp_dir = ffmpeg_service.create_temp_merge_dir()
        
        if smart_option['type'] == 'progressive':
            # Simple progressive download
            logger.info("Downloading progressive stream")
            
            video_stream = smart_option['video_stream']
            filename = f"{safe_title}_Smart.mp4"
            output_path = youtube_service.download_stream(video_stream, temp_dir, filename)
            
        elif smart_option['type'] == 'merge':
            # Download and merge video + audio
            if not ffmpeg_service.is_available():
                raise HTTPException(status_code=500, detail="FFmpeg not available for merging")
                
            logger.info("Starting parallel video and audio download")
            
            video_stream = smart_option['video_stream']
            audio_stream = smart_option['audio_stream']
            
            # Prepare filenames
            video_filename = f"{safe_title}_video_temp.{video_stream.subtype}"
            audio_filename = f"{safe_title}_audio_temp.{audio_stream.subtype}"
            
            # Download both streams in parallel
            def download_video():
                return youtube_service.download_stream(video_stream, temp_dir, video_filename)
            
            def download_audio():
                return youtube_service.download_stream(audio_stream, temp_dir, audio_filename)
            
            # Execute downloads in parallel
            with ThreadPoolExecutor(max_workers=settings.MAX_CONCURRENT_DOWNLOADS) as executor:
                video_future = executor.submit(download_video)
                audio_future = executor.submit(download_audio)
                
                video_path = video_future.result()
                audio_path = audio_future.result()
            
            # Merge using FFmpeg
            output_filename = f"{safe_title}_Smart.mp4"
            output_path = os.path.join(temp_dir, output_filename)
            
            ffmpeg_service.merge_video_audio(
                video_path, audio_path, output_path, cleanup_temp=True
            )
        
        else:
            raise HTTPException(status_code=500, detail="Unknown smart download type")
        
        # Stream the result
        def iterfile():
            try:
                with open(output_path, mode="rb") as file_like:
                    while True:
                        chunk = file_like.read(settings.CHUNK_SIZE)
                        if not chunk:
                            break
                        yield chunk
            finally:
                # Cleanup after streaming
                ffmpeg_service.cleanup_merge_dir(temp_dir)
        
        elapsed_time = time.time() - start_time
        logger.info(f"Smart download completed in {elapsed_time:.2f} seconds")
        
        return StreamingResponse(
            iterfile(),
            media_type='video/mp4',
            headers={"Content-Disposition": f"attachment; filename={os.path.basename(output_path)}"}
        )
        
    except (FFmpegNotFoundError, MergeError) as e:
        logger.error(f"FFmpeg/Merge error: {e.message}")
        if temp_dir:
            ffmpeg_service.cleanup_merge_dir(temp_dir)
        raise HTTPException(status_code=500, detail=e.message)
    except DownloadError as e:
        logger.error(f"Download error: {e.message}")
        if temp_dir:
            ffmpeg_service.cleanup_merge_dir(temp_dir)
        raise HTTPException(status_code=500, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error in smart download: {e}")
        if temp_dir:
            ffmpeg_service.cleanup_merge_dir(temp_dir)
        raise HTTPException(status_code=500, detail=f"Smart download failed: {str(e)}")


EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_rate_limit_cache: Dict[str, List[float]] = {}

@app.post("/api/contact", response_model=ContactResponse)
async def contact_endpoint(request: Request, payload: ContactRequest, background: BackgroundTasks = None):
    """Receive contact submission and send via Brevo."""
    # Honeypot check
    if payload.honeypot:
        raise HTTPException(status_code=400, detail="Spam detected")

    # Basic validation
    if not payload.name.strip() or not payload.email.strip() or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Missing required fields")
    if not EMAIL_REGEX.match(payload.email):
        raise HTTPException(status_code=400, detail="Invalid email")
    if len(payload.message.strip()) < 10:
        raise HTTPException(status_code=400, detail="Message too short")

    # Timing anti-bot: require >= 2s from form start
    now = time.time()
    if payload.formStartTimestamp and (now - float(payload.formStartTimestamp) < 2):
        raise HTTPException(status_code=400, detail="Form submitted too quickly")

    # Simple in-memory rate limiting by IP
    client_ip = request.client.host if request.client else "unknown"
    window_seconds = 60
    max_requests = int(os.getenv("RATE_LIMIT_PER_MIN", "5"))
    timestamps = _rate_limit_cache.get(client_ip, [])
    timestamps = [ts for ts in timestamps if now - ts < window_seconds]
    if len(timestamps) >= max_requests:
        raise HTTPException(status_code=429, detail="Too many requests, please try later")
    timestamps.append(now)
    _rate_limit_cache[client_ip] = timestamps

    # Prepare Brevo payload
    brevo_api_key = os.getenv("BREVO_API_KEY")
    if not brevo_api_key:
        raise HTTPException(status_code=500, detail="Email service not configured")

    to_email = os.getenv("CONTACT_TO_EMAIL", "thefarhanalam01@gmail.com")
    from_email = os.getenv("CONTACT_FROM_EMAIL", to_email)
    from_name = os.getenv("CONTACT_FROM_NAME", "YTDownloader")

    email_subject = payload.subject or "General Inquiry"
    email_text = (
        f"New contact submission from YTDownloader\n\n"
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Subject: {email_subject}\n\n"
        f"Message:\n{payload.message}\n"
    )

    json_body = {
        "sender": {"name": from_name, "email": from_email},
        "to": [{"email": to_email}],
        "subject": f"[Contact] {email_subject}",
        "textContent": email_text,
    }

    async def send_email_async():
        try:
            async with httpx.AsyncClient(timeout=8) as client:
                resp = await client.post(
                    "https://api.brevo.com/v3/smtp/email",
                    headers={
                        "api-key": brevo_api_key,
                        "accept": "application/json",
                        "content-type": "application/json",
                    },
                    json=json_body,
                )
                if resp.status_code >= 300:
                    logger.error(f"Brevo error: {resp.status_code} {resp.text}")
        except Exception as e:
            logger.error(f"Brevo exception: {e}")

    # Schedule background send and return immediately
    if background is not None:
        background.add_task(send_email_async)
    else:
        # Fallback if BackgroundTasks not available
        await send_email_async()

    return ContactResponse(success=True, message="Queued")


# ============================================================================
# SERVER STARTUP
# ============================================================================

if __name__ == "__main__":
    logger.info("Starting YouTube Downloader API - Organized Version")
    logger.info(f"FFmpeg available: {ffmpeg_service.is_available()}")
    logger.info(f"Smart download supported: {ffmpeg_service.is_available()}")
    
    # Force host to 0.0.0.0 for Railway/deployment (more precise detection)
    is_railway = (
        os.getenv("ENVIRONMENT") == "production" or 
        os.getenv("RAILWAY_ENVIRONMENT") or 
        (os.getenv("PORT") and os.getenv("PORT") != "8000") or  # Railway sets non-standard PORT
        (os.getenv("HOSTNAME") and "railway" in os.getenv("HOSTNAME", "").lower())
    )
    
    # Use 127.0.0.1 for development, 0.0.0.0 for Railway/production
    host = "0.0.0.0" if is_railway else "127.0.0.1"
    port = int(os.getenv("PORT", settings.PORT))
    
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    logger.info(f"Railway detected: {is_railway}")
    logger.info(f"Starting server on {host}:{port}")
    
    # Use import string for reload functionality
    if settings.is_development() and settings.RELOAD:
        uvicorn.run(
            "main:app",  # Import string format for reload
            host=host,
            port=port,
            reload=True,
            log_level=settings.LOG_LEVEL.lower()
        )
    else:
        uvicorn.run(
            app,  # Direct app object for production
            host=host,
            port=port,
            reload=False,
            log_level=settings.LOG_LEVEL.lower()
        )