"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    CCapture: any;
  }
}

interface VideoRecorderProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isRecording: boolean;
  onRecordingComplete: (blob: Blob) => void;
}

export default function VideoRecorder({
  canvasRef,
  isRecording,
  onRecordingComplete
}: VideoRecorderProps) {
  const capturerRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordingFormat, setRecordingFormat] = useState("webm-mediarecorder");
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const [ccaptureLoaded, setCcaptureLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/lib/CCapture.all.min.js";
    script.onload = () => {
      console.log("✅ CCapture.js loaded");
      setCcaptureLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load CCapture.js");
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && !recording && canvasRef.current && ccaptureLoaded) {
      startRecording();
    } else if (!isRecording && recording) {
      stopRecording();
    }
  }, [isRecording, recording, canvasRef, ccaptureLoaded]);

  const startRecording = () => {
    if (!canvasRef.current || !window.CCapture) {
      console.error("Canvas or CCapture not available");
      return;
    }

    try {
      const config = {
        format: recordingFormat,
        framerate: 24,
        quality: 0.7,
        verbose: true
      };

      capturerRef.current = new window.CCapture(config);
      capturerRef.current.start();

      setRecording(true);
      setTimer(0);

      if (timerInterval.current) clearInterval(timerInterval.current);
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      console.log("▶️ Recording started");
    } catch (err) {
      console.error("❌ Failed to start recording", err);
    }
  };

  const stopRecording = () => {
    if (!capturerRef.current) {
      console.warn("❌ capturerRef is null on stop");
      return;
    }

    try {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }

      capturerRef.current.stop();

      setTimeout(() => {
        try {
          console.log("💾 Saving recording...");
          capturerRef.current.save((blob: Blob) => {
            if (blob && blob.size > 0) {
              console.log("✅ Blob saved, size:", blob.size);
              setRecording(false);
              onRecordingComplete(blob);
            } else {
              console.error("❌ Empty or invalid blob");
              alert("Recording failed: Empty video captured");
            }
          });
        } catch (saveErr) {
          console.error("❌ Error saving recording:", saveErr);
          alert("Recording save failed. Try again.");
          setRecording(false);
        }
      }, 500);
    } catch (err) {
      console.error("❌ Error stopping recording:", err);
      setRecording(false);
    }
  };

  const captureFrame = () => {
    if (recording && canvasRef.current && capturerRef.current) {
      try {
        capturerRef.current.capture(canvasRef.current);
      } catch (err) {
        console.error("❌ Frame capture error", err);
      }
    }
  };

  useEffect(() => {
    (window as any).captureFrame = captureFrame;
    return () => {
      delete (window as any).captureFrame;
    };
  }, [recording]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg min-w-[200px]">
      {recording && (
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-mono text-lg">
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
