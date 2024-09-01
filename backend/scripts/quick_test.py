#!/usr/bin/env python3
import requests
import sys

def test_backend():
    try:
        response = requests.get("http://localhost:8000/")
        print(f"✅ Backend is running!")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_backend()