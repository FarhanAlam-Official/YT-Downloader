#!/usr/bin/env python3
"""
Test script for the YouTube Downloader API
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{API_BASE}/api/health")
        print(f"Health check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_video_info():
    """Test video info endpoint"""
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Rick Roll for testing
    
    try:
        response = requests.post(
            f"{API_BASE}/api/video-info",
            json={"url": test_url}
        )
        print(f"Video info: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Title: {data['title']}")
            print(f"Duration: {data['duration']} seconds")
            print(f"Streams available: {len(data['streams'])}")
            
            for stream in data['streams'][:3]:  # Show first 3 streams
                print(f"  - {stream['type']} {stream['quality']} ({stream['format']}) - {stream['filesize']}")
        else:
            print(f"Error: {response.text}")
            
        return response.status_code == 200
        
    except Exception as e:
        print(f"Video info test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing YouTube Downloader API")
    print("=" * 40)
    
    # Test health endpoint
    if test_health():
        print("✅ Health check passed")
    else:
        print("❌ Health check failed")
        exit(1)
    
    print()
    
    # Test video info endpoint
    if test_video_info():
        print("✅ Video info test passed")
    else:
        print("❌ Video info test failed")
    
    print("\n🎉 API testing complete!")
