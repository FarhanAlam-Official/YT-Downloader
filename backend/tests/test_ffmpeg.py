#!/usr/bin/env python3

import os
import subprocess

def test_ffmpeg():
    print("=== FFmpeg Detection Test ===")
    
    # Check local project installation
    local_ffmpeg = os.path.join(os.path.dirname(__file__), '..', 'ffmpeg', 'ffmpeg.exe')
    local_path = os.path.abspath(local_ffmpeg)
    print(f"Checking local FFmpeg: {local_path}")
    
    if os.path.exists(local_ffmpeg):
        print("✅ Local FFmpeg found!")
        return True
    else:
        print("❌ Local FFmpeg not found")
    
    # Check imageio-ffmpeg (pip install imageio-ffmpeg)
    print("Checking imageio-ffmpeg...")
    try:
        import imageio_ffmpeg as ffmpeg
        ffmpeg_exe = ffmpeg.get_ffmpeg_exe()
        if os.path.exists(ffmpeg_exe):
            print("✅ imageio-ffmpeg found!")
            print(f"📍 Location: {ffmpeg_exe}")
            
            # Test version
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
                        print(f"📋 Version: {line.strip()}")
                        break
            return True
        else:
            print("❌ imageio-ffmpeg executable not found")
    except ImportError:
        print("❌ imageio-ffmpeg not installed")
    except Exception as e:
        print(f"❌ Error checking imageio-ffmpeg: {e}")
    
    # Check system PATH
    print("Checking system PATH for FFmpeg...")
    try:
        result = subprocess.run(
            ['ffmpeg', '-version'], 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        if result.returncode == 0:
            print("✅ System FFmpeg found!")
            lines = result.stdout.split('\n')
            for line in lines:
                if line.startswith('ffmpeg version'):
                    print(f"📋 Version: {line.strip()}")
                    return True
        else:
            print("❌ System FFmpeg not working")
    except (subprocess.TimeoutExpired, FileNotFoundError, subprocess.SubprocessError) as e:
        print(f"❌ System FFmpeg not found: {e}")
    
    print("\n💡 FFmpeg Installation Options:")
    print("1. ✅ RECOMMENDED: pip install imageio-ffmpeg (includes binaries)")
    print("2. Download from https://ffmpeg.org/download.html")
    print("3. Extract to: c:\\Users\\istaq\\Downloads\\YT-Downloader\\ffmpeg\\ffmpeg.exe")
    print("4. Or install system-wide and add to PATH")
    
    return False

if __name__ == "__main__":
    success = test_ffmpeg()
    if success:
        print("\n🎉 FFmpeg is ready for video merging!")
    else:
        print("\n⚠️  FFmpeg needs to be installed for smart download functionality.")