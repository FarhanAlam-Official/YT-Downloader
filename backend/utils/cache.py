#!/usr/bin/env python3
"""
Cache Utilities

Caching system for performance optimization including video stream analysis caching,
thread-safe operations, and cache management utilities.
"""

import logging
import threading
import time
from typing import Any, Dict, Optional

from app.exceptions import CacheError

# Configure module logger
logger = logging.getLogger(__name__)


class CacheManager:
    """Thread-safe cache manager for video analysis results."""
    
    def __init__(self, ttl: int = 300, max_size: int = 1000):
        """
        Initialize the cache manager.
        
        Args:
            ttl: Time-to-live for cache entries in seconds (default: 5 minutes)
            max_size: Maximum number of cache entries (default: 1000)
        """
        self.ttl = ttl
        self.max_size = max_size
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()
        self._stats = {
            'hits': 0,
            'misses': 0,
            'stores': 0,
            'cleanups': 0,
            'evictions': 0
        }
    
    def get(self, key: str) -> Optional[Any]:
        """
        Retrieve cached data if still valid.
        
        Args:
            key: Cache key
            
        Returns:
            Cached data if valid, None if expired or not found
        """
        with self._lock:
            if key in self._cache:
                cache_entry = self._cache[key]
                if time.time() - cache_entry['timestamp'] < self.ttl:
                    self._stats['hits'] += 1
                    age = time.time() - cache_entry['timestamp']
                    logger.debug(f"Cache HIT for key {key} (age: {age:.1f}s)")
                    return cache_entry['data']
                else:
                    # Clean expired entry
                    del self._cache[key]
                    logger.debug(f"Cache EXPIRED for key {key}")
            
            self._stats['misses'] += 1
            logger.debug(f"Cache MISS for key {key}")
            return None
    
    def set(self, key: str, data: Any) -> None:
        """
        Store data in cache.
        
        Args:
            key: Cache key
            data: Data to cache
        """
        with self._lock:
            # Check if cache is full and evict oldest entries if needed
            if len(self._cache) >= self.max_size:
                self._evict_oldest()
            
            self._cache[key] = {
                'timestamp': time.time(),
                'data': data
            }
            self._stats['stores'] += 1
            logger.debug(f"Cache STORED for key {key} (total cached: {len(self._cache)})")
    
    def delete(self, key: str) -> bool:
        """
        Delete a specific cache entry.
        
        Args:
            key: Cache key to delete
            
        Returns:
            True if key was found and deleted, False otherwise
        """
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                logger.debug(f"Cache DELETED key {key}")
                return True
            return False
    
    def clear(self) -> None:
        """Clear all cache entries."""
        with self._lock:
            cache_size = len(self._cache)
            self._cache.clear()
            logger.info(f"Cache CLEARED - removed {cache_size} entries")
    
    def cleanup_expired(self) -> int:
        """
        Remove expired cache entries.
        
        Returns:
            Number of expired entries removed
        """
        with self._lock:
            current_time = time.time()
            expired_keys = [
                k for k, v in self._cache.items()
                if current_time - v['timestamp'] > self.ttl
            ]
            
            for key in expired_keys:
                del self._cache[key]
            
            if expired_keys:
                self._stats['cleanups'] += 1
                logger.debug(f"Cache CLEANUP - removed {len(expired_keys)} expired entries (remaining: {len(self._cache)})")
            
            return len(expired_keys)
    
    def _evict_oldest(self) -> None:
        """Evict oldest cache entries when cache is full."""
        if not self._cache:
            return
        
        # Find and remove the oldest entry
        oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k]['timestamp'])
        del self._cache[oldest_key]
        self._stats['evictions'] += 1
        logger.debug(f"Cache EVICTED oldest entry: {oldest_key}")
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics.
        
        Returns:
            Dictionary containing cache statistics
        """
        with self._lock:
            hit_rate = 0.0
            total_requests = self._stats['hits'] + self._stats['misses']
            if total_requests > 0:
                hit_rate = self._stats['hits'] / total_requests
            
            return {
                **self._stats.copy(),
                'size': len(self._cache),
                'max_size': self.max_size,
                'ttl': self.ttl,
                'hit_rate': hit_rate
            }
    
    def get_info(self) -> Dict[str, Any]:
        """
        Get detailed cache information.
        
        Returns:
            Dictionary with cache configuration and current state
        """
        with self._lock:
            current_time = time.time()
            
            # Calculate age distribution
            ages = [current_time - entry['timestamp'] for entry in self._cache.values()]
            
            info = {
                'configuration': {
                    'ttl': self.ttl,
                    'max_size': self.max_size
                },
                'current_state': {
                    'size': len(self._cache),
                    'oldest_entry_age': max(ages) if ages else 0,
                    'newest_entry_age': min(ages) if ages else 0,
                    'average_age': sum(ages) / len(ages) if ages else 0
                },
                'statistics': self.get_stats()
            }
            
            return info


class VideoAnalysisCache:
    """Specialized cache for video analysis results."""
    
    def __init__(self, ttl: int = 300):
        """
        Initialize video analysis cache.
        
        Args:
            ttl: Time-to-live for cache entries in seconds
        """
        self.cache_manager = CacheManager(ttl=ttl, max_size=500)  # Smaller cache for video analysis
    
    def get_analysis(self, video_id: str) -> Optional[Dict]:
        """
        Get cached video analysis.
        
        Args:
            video_id: YouTube video ID
            
        Returns:
            Cached analysis data or None
        """
        return self.cache_manager.get(f"analysis:{video_id}")
    
    def cache_analysis(self, video_id: str, analysis_data: Dict) -> None:
        """
        Cache video analysis data.
        
        Args:
            video_id: YouTube video ID
            analysis_data: Analysis data to cache
        """
        self.cache_manager.set(f"analysis:{video_id}", analysis_data)
    
    def get_smart_selection(self, video_id: str) -> Optional[Dict]:
        """
        Get cached smart selection result.
        
        Args:
            video_id: YouTube video ID
            
        Returns:
            Cached smart selection data or None
        """
        analysis = self.get_analysis(video_id)
        return analysis.get('smart_selection') if analysis else None
    
    def cache_smart_selection(self, video_id: str, smart_selection_data: Dict) -> None:
        """
        Cache smart selection data.
        
        Args:
            video_id: YouTube video ID
            smart_selection_data: Smart selection data to cache
        """
        # Get existing analysis or create new one
        analysis = self.get_analysis(video_id) or {}
        analysis['smart_selection'] = smart_selection_data
        self.cache_analysis(video_id, analysis)
    
    def cleanup(self) -> None:
        """Clean up expired video analysis cache entries."""
        self.cache_manager.cleanup_expired()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get video analysis cache statistics."""
        return self.cache_manager.get_stats()


# Global cache instances
video_cache = VideoAnalysisCache()
general_cache = CacheManager()


def get_video_analysis_cache() -> VideoAnalysisCache:
    """Get the global video analysis cache instance."""
    return video_cache


def get_general_cache() -> CacheManager:
    """Get the general cache manager instance."""
    return general_cache


def cleanup_all_caches() -> Dict[str, int]:
    """
    Cleanup all cache instances and return cleanup statistics.
    
    Returns:
        Dictionary with cleanup statistics for each cache
    """
    results = {}
    
    try:
        results['video_cache'] = video_cache.cleanup()
    except Exception as e:
        logger.error(f"Error cleaning video cache: {e}")
        results['video_cache'] = 0
    
    try:
        results['general_cache'] = general_cache.cleanup_expired()
    except Exception as e:
        logger.error(f"Error cleaning general cache: {e}")
        results['general_cache'] = 0
    
    total_cleaned = sum(results.values())
    if total_cleaned > 0:
        logger.info(f"Cache cleanup completed - total entries removed: {total_cleaned}")
    
    return results


def get_all_cache_stats() -> Dict[str, Dict[str, Any]]:
    """
    Get statistics for all cache instances.
    
    Returns:
        Dictionary with statistics for each cache
    """
    return {
        'video_cache': video_cache.get_stats(),
        'general_cache': general_cache.get_stats()
    }