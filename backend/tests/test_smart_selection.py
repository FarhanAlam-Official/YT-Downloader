#!/usr/bin/env python3
"""
Test Smart Selection Algorithm

Unit tests for the smart stream selection functionality including quality scoring,
stream analysis, and recommendation logic.
"""

import unittest
import sys
import os
from unittest.mock import Mock, patch

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.smart_selection import (
    smart_select_best_option,
    analyze_streams,
    calculate_video_quality_score,
    calculate_audio_quality_score,
    extract_resolution_number,
    extract_audio_bitrate,
    StreamAnalysis
)


class TestSmartSelection(unittest.TestCase):
    """Test cases for smart selection functionality."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_yt = Mock()
        self.mock_yt.video_id = "test_video_123"
        self.mock_yt.title = "Test Video"
        self.mock_yt.length = 300  # 5 minutes
        
    def test_extract_resolution_number(self):
        """Test resolution number extraction."""
        test_cases = [
            ("1080p", 1080),
            ("720p", 720),
            ("480p", 480),
            ("2160p", 2160),
            ("unknown", 0),
            (None, 0),
            ("", 0)
        ]
        
        for resolution_str, expected in test_cases:
            with self.subTest(resolution=resolution_str):
                result = extract_resolution_number(resolution_str)
                self.assertEqual(result, expected)
    
    def test_extract_audio_bitrate(self):
        """Test audio bitrate extraction."""
        test_cases = [
            ("128kbps", 128),
            ("320kbps", 320),
            ("96kbps", 96),
            ("256kbps", 256),
            ("unknown", 0),
            (None, 0),
            ("", 0)
        ]
        
        for abr_str, expected in test_cases:
            with self.subTest(bitrate=abr_str):
                result = extract_audio_bitrate(abr_str)
                self.assertEqual(result, expected)
    
    def test_calculate_video_quality_score(self):
        """Test video quality scoring."""
        # Mock stream for 1080p video
        mock_stream_1080p = Mock()
        mock_stream_1080p.resolution = "1080p"
        mock_stream_1080p.fps = 30
        mock_stream_1080p.video_codec = "avc1.64001F"
        
        score = calculate_video_quality_score(mock_stream_1080p)
        self.assertGreater(score, 0)
        self.assertIsInstance(score, int)
        
        # Mock stream for 4K video (should have higher score)
        mock_stream_4k = Mock()
        mock_stream_4k.resolution = "2160p"
        mock_stream_4k.fps = 60
        mock_stream_4k.video_codec = "av01.0.08M.08"
        
        score_4k = calculate_video_quality_score(mock_stream_4k)
        self.assertGreater(score_4k, score)
    
    def test_calculate_audio_quality_score(self):
        """Test audio quality scoring."""
        # Mock stream for 128kbps audio
        mock_stream_128 = Mock()
        mock_stream_128.abr = "128kbps"
        mock_stream_128.audio_codec = "mp4a.40.2"
        
        score_128 = calculate_audio_quality_score(mock_stream_128)
        self.assertGreater(score_128, 0)
        
        # Mock stream for 320kbps audio (should have higher score)
        mock_stream_320 = Mock()
        mock_stream_320.abr = "320kbps"
        mock_stream_320.audio_codec = "opus"
        
        score_320 = calculate_audio_quality_score(mock_stream_320)
        self.assertGreater(score_320, score_128)
    
    def test_stream_analysis_creation(self):
        """Test StreamAnalysis object creation."""
        mock_stream = Mock()
        mock_stream.resolution = "1080p"
        mock_stream.itag = 22
        
        analysis = StreamAnalysis(
            stream=mock_stream,
            stream_type="progressive",
            quality_score=600,
            size_mb=50.0
        )
        
        self.assertEqual(analysis.stream, mock_stream)
        self.assertEqual(analysis.stream_type, "progressive")
        self.assertEqual(analysis.quality_score, 600)
        self.assertEqual(analysis.size_mb, 50.0)
    
    @patch('services.smart_selection.logger')
    def test_analyze_streams_empty_result(self, mock_logger):
        """Test analyze_streams with no streams available."""
        # Mock YouTube object with no streams
        self.mock_yt.streams.filter.return_value = []
        
        progressive, video, audio = analyze_streams(self.mock_yt)
        
        self.assertEqual(len(progressive), 0)
        self.assertEqual(len(video), 0)
        self.assertEqual(len(audio), 0)
    
    @patch('services.smart_selection.analyze_streams')
    def test_smart_select_best_option_prefer_progressive(self, mock_analyze):
        """Test smart selection with progressive preference."""
        # Mock progressive stream
        mock_prog_stream = Mock()
        mock_prog_stream.resolution = "720p"
        mock_prog_stream.itag = 22
        mock_prog_analysis = StreamAnalysis(mock_prog_stream, "progressive", 400, 30.0)
        
        # Mock video and audio streams
        mock_video_stream = Mock()
        mock_video_stream.resolution = "1080p"
        mock_video_analysis = StreamAnalysis(mock_video_stream, "video", 600, 25.0)
        
        mock_audio_stream = Mock()
        mock_audio_stream.abr = "128kbps"
        mock_audio_analysis = StreamAnalysis(mock_audio_stream, "audio", 150, 5.0)
        
        # Set up mock return value
        mock_analyze.return_value = ([mock_prog_analysis], [mock_video_analysis], [mock_audio_analysis])
        
        result = smart_select_best_option(self.mock_yt, prefer_progressive=True)
        
        self.assertIsNotNone(result)
        self.assertEqual(result['type'], 'progressive')
        self.assertEqual(result['video_stream'], mock_prog_stream)
    
    @patch('services.smart_selection.analyze_streams')
    def test_smart_select_best_option_prefer_quality(self, mock_analyze):
        """Test smart selection preferring highest quality."""
        # Mock progressive stream (lower quality)
        mock_prog_stream = Mock()
        mock_prog_stream.resolution = "720p"
        mock_prog_analysis = StreamAnalysis(mock_prog_stream, "progressive", 400, 30.0)
        
        # Mock high-quality video and audio streams
        mock_video_stream = Mock()
        mock_video_stream.resolution = "1080p"
        mock_video_analysis = StreamAnalysis(mock_video_stream, "video", 600, 25.0)
        
        mock_audio_stream = Mock()
        mock_audio_stream.abr = "128kbps"
        mock_audio_analysis = StreamAnalysis(mock_audio_stream, "audio", 150, 5.0)
        
        mock_analyze.return_value = ([mock_prog_analysis], [mock_video_analysis], [mock_audio_analysis])
        
        result = smart_select_best_option(self.mock_yt, prefer_progressive=False)
        
        self.assertIsNotNone(result)
        # Should prefer merge for higher quality
        self.assertEqual(result['type'], 'merge')
        self.assertEqual(result['video_stream'], mock_video_stream)
        self.assertEqual(result['audio_stream'], mock_audio_stream)
    
    def test_smart_select_no_streams_available(self):
        """Test smart selection when no streams are available."""
        # Mock empty streams
        self.mock_yt.streams.filter.return_value = []
        
        result = smart_select_best_option(self.mock_yt)
        
        self.assertIsNone(result)


class TestQualityScoring(unittest.TestCase):
    """Test cases for quality scoring algorithms."""
    
    def test_video_quality_scoring_resolution_hierarchy(self):
        """Test that higher resolutions get higher scores."""
        resolutions = ["480p", "720p", "1080p", "1440p", "2160p"]
        scores = []
        
        for resolution in resolutions:
            mock_stream = Mock()
            mock_stream.resolution = resolution
            mock_stream.fps = 30
            mock_stream.video_codec = "avc1"
            
            score = calculate_video_quality_score(mock_stream)
            scores.append(score)
        
        # Verify scores are in ascending order
        for i in range(1, len(scores)):
            self.assertGreater(scores[i], scores[i-1], 
                             f"Score for {resolutions[i]} should be higher than {resolutions[i-1]}")
    
    def test_audio_quality_scoring_bitrate_hierarchy(self):
        """Test that higher bitrates get higher scores."""
        bitrates = ["96kbps", "128kbps", "192kbps", "256kbps", "320kbps"]
        scores = []
        
        for bitrate in bitrates:
            mock_stream = Mock()
            mock_stream.abr = bitrate
            mock_stream.audio_codec = "aac"
            
            score = calculate_audio_quality_score(mock_stream)
            scores.append(score)
        
        # Verify scores are in ascending order
        for i in range(1, len(scores)):
            self.assertGreater(scores[i], scores[i-1],
                             f"Score for {bitrates[i]} should be higher than {bitrates[i-1]}")


if __name__ == '__main__':
    # Run the tests
    unittest.main(verbosity=2)