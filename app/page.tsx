"use client";

import { useState, useRef } from "react";
import ThreedObject from "@/components/ThreedObject";
import VideoRecorder from "@/components/VideoRecorder";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRecordingComplete = (blob: Blob) => {
    console.log("Received blob in main page, size:", blob.size);

    if (blob && blob.size > 0) {
      // Create download link for the recorded video
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `animation-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("Download initiated for animation");
    } else {
      console.error("Invalid blob received in main page");
    }
  };

  return (
    <main className="w-full h-screen relative">
      <ThreedObject canvasRef={canvasRef} />
      <VideoRecorder
        canvasRef={canvasRef}
        isRecording={isRecording}
        onRecordingComplete={handleRecordingComplete}
      />

      {/* Recording Controls */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-red-700 text-white"
          }`}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </main>
  );
}
