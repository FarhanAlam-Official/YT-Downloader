#!/usr/bin/env python3
"""
Direct test of pytubefix to diagnose YouTube access issues
"""

from pytubefix import YouTube
import traceback

def test_direct_access():
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    try:
        print(f"Testing direct access to: {test_url}")
        yt = YouTube(test_url)
        
        print(f"✅ YouTube object created successfully")
        print(f"Title: {yt.title}")
        print(f"Author: {yt.author}")
        print(f"Length: {yt.length} seconds")
        print(f"Views: {yt.views}")
        
        streams = yt.streams
        print(f"✅ Found {len(streams)} streams")
        
        for i, stream in enumerate(streams[:5]):
            print(f"  {i+1}. {stream.itag} - {stream.resolution or 'audio'} - {stream.mime_type}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print(f"Full traceback:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🧪 Testing pytubefix direct access")
    print("=" * 40)
    test_direct_access()