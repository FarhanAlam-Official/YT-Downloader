#!/usr/bin/env python3
"""
Test script for specific video to check stream improvements
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_specific_video():
    """Test video info for the specific video with improved streams"""
    test_url = "https://www.youtube.com/watch?v=GFTDR8_q63M"
    
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
            print("\nAvailable streams:")
            
            for i, stream in enumerate(data['streams']):
                audio_indicator = "🔊" if "with audio" in stream['quality'] else "🔇" if "video only" in stream['quality'] else "🎵"
                print(f"  {i+1}. {audio_indicator} {stream['type']} {stream['quality']} ({stream['format']}) - {stream['filesize']} [ID: {stream['id']}]")
            
            return data['streams']
        else:
            print(f"❌ Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Video info test failed: {e}")
        return None

if __name__ == "__main__":
    print("🧪 Testing specific video with improved stream handling")
    print("=" * 60)
    test_specific_video()