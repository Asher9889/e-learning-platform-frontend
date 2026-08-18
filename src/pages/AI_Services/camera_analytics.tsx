/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  Webcam,
  Video,
  Play,
  Pause,
  Radio,
  Loader2,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertCircle,
  Moon,
  Laptop,
  Camera,
} from "lucide-react";

interface StudentDetail {
  studentIndex: number;
  status: string;
  emotion?: string;
  headPoseAngle: number;
  yaw?: number;
  pitch?: number;
}

interface AnalyticsResult {
  totalStudentsDetected: number;
  attentiveStudentsCount: number;
  distractedStudentsCount: number;
  drowsyStudentsCount?: number;
  overallEngagementScore: number;
  engagementLevel: "HIGH" | "MEDIUM" | "LOW";
  studentsDetail: StudentDetail[];
  annotatedFrame?: string;
  alerts?: string[];
  error?: string;
}

export default function CameraAnalyticsPage() {
  // Input Engine Mode: "RTSP" or "WEBCAM"
  const [streamMode, setStreamMode] = useState<"RTSP" | "WEBCAM">("RTSP");

  // RTSP URL
  const [rtspUrl, setRtspUrl] = useState<string>(
    "rtsp://admin:Multi%40421@122.162.237.4:1030/mode=real&idc=1&ids=2"
  );

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResult | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamIntervalRef = useRef<any>(null);

  // 1. RTSP Stream Connect
  const startRtspStream = () => {
    if (!rtspUrl.trim()) return;

    setIsStreaming(true);
    setConnectionError(null);

    const ws = new WebSocket("ws://localhost:8000/api/v1/analytics/ws/rtsp-stream");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 RTSP CCTV WebSocket Connected!");
      ws.send(JSON.stringify({ rtspUrl }));
    };

    ws.onmessage = (event) => {
      const data: AnalyticsResult = JSON.parse(event.data);
      if (data.error && data.totalStudentsDetected === 0) {
        setConnectionError(data.error);
      } else {
        setConnectionError(null);
        setAnalyticsData(data);
      }
    };

    ws.onerror = (err) => {
      console.error("RTSP WebSocket Error:", err);
      setConnectionError("Failed to connect to RTSP Camera Stream. Check camera network.");
      setIsStreaming(false);
    };

    ws.onclose = () => {
      console.log("🔌 RTSP WebSocket Closed.");
      setIsStreaming(false);
    };
  };

  // 2. Laptop WebCam Stream Connect
  const startWebcamStream = async () => {
    setIsStreaming(true);
    setConnectionError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const ws = new WebSocket("ws://localhost:8000/api/v1/analytics/ws/live-attention");
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("🟢 WebCam WebSocket Connected!");
        webcamIntervalRef.current = setInterval(() => {
          if (videoRef.current && canvasRef.current && ws.readyState === WebSocket.OPEN) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              canvas.width = 640;
              canvas.height = 480;
              ctx.drawImage(videoRef.current, 0, 0, 640, 480);
              const base64Data = canvas.toDataURL("image/jpeg", 0.7);
              ws.send(base64Data);
            }
          }
        }, 500); // 2 FPS
      };

      ws.onmessage = (event) => {
        const data: AnalyticsResult = JSON.parse(event.data);
        setAnalyticsData(data);
      };

      ws.onerror = () => {
        setConnectionError("WebCam stream error.");
        stopStream();
      };
    } catch (err) {
        console.log(err)
      setConnectionError("Camera access denied or WebCam not found.");
      setIsStreaming(false);
    }
  };

  const stopStream = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (webcamIntervalRef.current) {
      clearInterval(webcamIntervalRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Webcam className="w-6 h-6 text-indigo-600" />
            AI Camera Student Attention Analytics Studio
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time RTSP CCTV & WebCam AI analysis for student engagement & drowsiness detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isStreaming ? (
            <button
              onClick={stopStream}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <Pause className="w-4 h-4" /> Stop Live Stream
            </button>
          ) : (
            <button
              onClick={streamMode === "RTSP" ? startRtspStream : startWebcamStream}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <Play className="w-4 h-4" /> Start {streamMode} AI Analysis
            </button>
          )}
        </div>
      </div>

      {/* INPUT ENGINE MODE SELECTOR BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
            Select Input Camera Source:
          </label>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => { stopStream(); setStreamMode("RTSP"); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                streamMode === "RTSP" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> RTSP CCTV Stream
            </button>

            <button
              onClick={() => { stopStream(); setStreamMode("WEBCAM"); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                streamMode === "WEBCAM" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Laptop WebCam
            </button>
          </div>
        </div>

        {streamMode === "RTSP" && (
          <input
            type="text"
            value={rtspUrl}
            onChange={(e) => setRtspUrl(e.target.value)}
            disabled={isStreaming}
            placeholder="rtsp://admin:password@ip:port/stream"
            className="w-full text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 font-mono focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-60"
          />
        )}
      </div>

      {connectionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong>Camera Connection Alert:</strong> {connectionError}
          </div>
        </div>
      )}

      {/* DUAL PANE WORKSPACE: LIVE FEED + REALTIME METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LIVE CAMERA FEED DISPLAY */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-3 border-4 border-slate-800 shadow-2xl flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 px-3 py-1 border-b border-slate-800 mb-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              LIVE {streamMode} FEED
            </span>
            <span className="font-mono text-[11px]">AI ATTENTION MODEL: ACTIVE</span>
          </div>

          <div className="flex-1 flex justify-center items-center relative rounded-xl overflow-hidden bg-slate-950">
            {/* Hidden Elements for WebCam */}
            <video ref={videoRef} className="hidden" />
            <canvas ref={canvasRef} className="hidden" />

            {!isStreaming ? (
              <div className="text-center space-y-2 p-8 text-slate-500">
                <Video className="w-12 h-12 mx-auto text-slate-700" />
                <p className="text-xs">Click 'Start AI Analysis' above to activate camera feed.</p>
              </div>
            ) : analyticsData?.annotatedFrame ? (
              <img
                src={analyticsData.annotatedFrame}
                alt="Live AI Camera Stream"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center space-y-2 text-indigo-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-xs">Processing AI Computer Vision Frames...</p>
              </div>
            )}
          </div>
        </div>

        {/* REAL-TIME ENGAGEMENT METER & STATS */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Classroom Engagement Score
            </p>

            <div className="relative inline-flex items-center justify-center">
              <div
                className={`text-4xl font-black ${
                  (analyticsData?.overallEngagementScore || 0) >= 75
                    ? "text-emerald-600"
                    : (analyticsData?.overallEngagementScore || 0) >= 45
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                {analyticsData?.overallEngagementScore || 0}%
              </div>
            </div>

            <div className="flex justify-center">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  analyticsData?.engagementLevel === "HIGH"
                    ? "bg-emerald-100 text-emerald-800"
                    : analyticsData?.engagementLevel === "MEDIUM"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                LEVEL: {analyticsData?.engagementLevel || "LOW"}
              </span>
            </div>
          </div>

          {/* Counts Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm text-center">
              <Users className="w-4 h-4 mx-auto text-gray-400 mb-1" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
              <p className="text-base font-extrabold text-gray-900">
                {analyticsData?.totalStudentsDetected || 0}
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm text-center">
              <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Attentive</p>
              <p className="text-base font-extrabold text-emerald-600">
                {analyticsData?.attentiveStudentsCount || 0}
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm text-center">
              <AlertCircle className="w-4 h-4 mx-auto text-rose-600 mb-1" />
              <p className="text-[10px] font-bold text-rose-600 uppercase">Distracted</p>
              <p className="text-base font-extrabold text-rose-600">
                {analyticsData?.distractedStudentsCount || 0}
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm text-center">
              <Moon className="w-4 h-4 mx-auto text-amber-600 mb-1" />
              <p className="text-[10px] font-bold text-amber-600 uppercase">Drowsy</p>
              <p className="text-base font-extrabold text-amber-600">
                {analyticsData?.drowsyStudentsCount || 0}
              </p>
            </div>
          </div>

          {/* Student Status List */}
          {analyticsData?.studentsDetail && analyticsData.studentsDetail.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2 max-h-48 overflow-y-auto">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Live Student Attention Status
              </p>
              <div className="space-y-1.5">
                {analyticsData.studentsDetail.map((student) => (
                  <div
                    key={student.studentIndex}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs"
                  >
                    <span className="font-semibold text-gray-800">
                      Student #{student.studentIndex}
                    </span>
                    <span
                      className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                        student.status === "Attentive"
                          ? "bg-emerald-100 text-emerald-800"
                          : student.status.includes("Drowsy")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
