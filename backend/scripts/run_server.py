#!/usr/bin/env python3
"""
Script to run the FastAPI server
Usage: python run_server.py
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False
    return True

def run_server():
    """Run the FastAPI server"""
    print("Starting FastAPI server...")
    try:
        # Import and run the server
        import uvicorn
        from main import app
        
        print("🚀 Server starting at http://localhost:8000")
        print("📖 API docs available at http://localhost:8000/docs")
        print("Press Ctrl+C to stop the server")
        
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
        
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Install requirements and run server
    if install_requirements():
        run_server()
    else:
        print("Failed to start server due to dependency issues")
