#!/usr/bin/env python3
"""
Test script for the YouTube Downloader API with pytube
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{API_BASE}/")
        print(f"✅ Health check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_video_info():
    """Test video info endpoint"""
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Rick Roll for testing
    
    try:
        response = requests.post(
            f"{API_BASE}/api/video-info",
            json={"url": test_url}
        )
        print(f"✅ Video info: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Title: {data['title']}")
            print(f"Duration: {data['duration']} seconds")
            print(f"Streams available: {len(data['streams'])}")
            
            for i, stream in enumerate(data['streams'][:5]):  # Show first 5 streams
                print(f"  {i+1}. {stream['type']} {stream['quality']} ({stream['format']}) - {stream['filesize']} [ID: {stream['id']}]")
            
            return data['streams'][0]['id'] if data['streams'] else None
        else:
            print(f"❌ Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Video info test failed: {e}")
        return None

def test_download(stream_id, video_url):
    """Test download endpoint"""
    try:
        response = requests.post(
            f"{API_BASE}/api/download",
            json={
                "video_url": video_url,
                "stream_id": stream_id
            },
            stream=True
        )
        
        print(f"Download test: {response.status_code}")
        
        if response.status_code == 200:
            # Get filename from headers
            content_disposition = response.headers.get('content-disposition', '')
            filename = 'test_download.mp4'
            if 'filename=' in content_disposition:
                filename = content_disposition.split('filename=')[-1].strip('"')
            
            # Save a small portion to test
            with open(f"test_{filename}", "wb") as f:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if downloaded > 1024 * 1024:  # Stop after 1MB for test
                            break
            
            print(f"✅ Download test successful: {downloaded} bytes saved as test_{filename}")
            return True
        else:
            print(f"❌ Download failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Download test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing YouTube Downloader API with pytube")
    print("=" * 50)
    
    # Test health endpoint
    if not test_health():
        print("❌ Health check failed - backend not running?")
        exit(1)
    
    print()
    
    # Test video info endpoint
    stream_id = test_video_info()
    if not stream_id:
        print("❌ Video info test failed")
        exit(1)
    
    print()
    
    # Test download
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    if test_download(stream_id, test_url):
        print("✅ All tests passed!")
    else:
        print("❌ Download test failed")
    
    print("\n🎉 API testing complete!")