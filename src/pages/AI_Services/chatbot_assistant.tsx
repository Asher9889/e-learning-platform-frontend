/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  Trash2,
  MessageSquare,
  Loader2,
  Lightbulb,
  Gamepad2,
  Copy,
  Check,
  RefreshCw,
  History,
  Trash,
  Mic,
  MicOff,
  Printer,
  BookOpenCheck,
  Presentation,
} from "lucide-react";

// API Imports from utils/url
import api, { api1 } from "../../utils/url";

interface Teacher {
  id: string;
  email: string;
  personalInfo: {
    name: string;
  };
}

interface ChatMessage {
  id: string;
  userMessage: string;
  botResponse: string;
  realLifeExamples?: string[];
  suggestedClassroomActivities?: string[];
  createdAt: string;
}

interface ChatThread {
  sessionId: string;
  lastMessage: string;
  createdAt: string;
}

const QUICK_TEACHER_PROMPTS = [
  { label: "💡 Explain Gravity with Analogies", message: "Give me a simple real-life analogy to explain Gravity to Class 8 students.", mode: "EXPLAINER_ANALOGIES" },
  { label: "🏫 Distracted Student Discipline", message: "How do I handle a student who is constantly distracted during 10th Grade Math class?", mode: "CLASSROOM_MANAGEMENT" },
  { label: "🎮 5-Min Monday Warm-up Game", message: "Suggest 2 quick 5-minute interactive warm-up games for a Science class.", mode: "ICEBREAKER_GAMES" },
  { label: "📝 Homework Assignment Rubric", message: "Create a 10-mark grading rubric for a Computer Science coding assignment.", mode: "WORKSHEET_RUBRIC" },
];

const renderFormattedMarkdown = (text: string) => {
  if (!text) return null;
  const paragraphs = text.split("\n\n");

  return paragraphs.map((para, pIdx) => {
    const parts = para.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={pIdx} className="mb-2 leading-relaxed text-xs sm:text-sm text-gray-800">
        {parts.map((part, idx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={idx} className="font-bold text-gray-900 block mt-2 mb-1">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </p>
    );
  });
};

export default function ChatbotAssistantPage() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [pastSessions, setPastSessions] = useState<ChatThread[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Input & Mode States
  const [inputMessage, setInputMessage] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<string>("GENERAL");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice Dictation State
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isSending]);

  // Voice Dictation Setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceDictation = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // 1. Fetch Teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res: any = await api1.get("/v1/users/teachers").catch(() => api1.get("/users/teachers"));
        const tList = res?.data?.teachers || res?.teachers || [];
        setTeachers(tList);
        if (tList.length > 0) setSelectedTeacherId(tList[0].id);
      } catch (err) {
        console.error("Error loading teachers:", err);
      }
    };

    fetchTeachers();
  }, []);

  // 2. Fetch Past Sessions List
  useEffect(() => {
    if (selectedTeacherId) {
      fetchTeacherPastSessions(selectedTeacherId);
    }
  }, [selectedTeacherId]);

  const fetchTeacherPastSessions = async (tId: string) => {
    try {
      const res: any = await api.get(`/chatbot/sessions-list/${tId}`);
      const sessions = res?.sessions || res?.data?.sessions || [];
      setPastSessions(sessions);
    } catch (err) {
      console.error("Error fetching sessions list:", err);
    }
  };

  // 3. Fetch Chat History
  useEffect(() => {
    if (activeSessionId) {
      loadChatThreadHistory(activeSessionId);
    } else {
      setChatHistory([]);
    }
  }, [activeSessionId]);

  const loadChatThreadHistory = async (sessionId: string) => {
    setLoadingHistory(true);
    try {
      const res: any = await api.get(`/chatbot/history/${sessionId}`);
      const messages = res?.messages || res?.data?.messages || [];
      setChatHistory(messages);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 4. Send Message Handler
  const handleSendMessage = async (e?: React.FormEvent, customMsg?: string, customMode?: string) => {
    if (e) e.preventDefault();
    const msgToSend = customMsg || inputMessage;
    const modeToSend = customMode || selectedMode;

    if (!msgToSend.trim() || !selectedTeacherId) return;

    setIsSending(true);
    setInputMessage("");

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      userMessage: msgToSend,
      botResponse: "",
      createdAt: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, tempUserMsg]);

    try {
      const payload = {
        teacherId: selectedTeacherId,
        sessionId: activeSessionId || undefined,
        message: msgToSend,
        mode: modeToSend,
        language: selectedLanguage,
      };

      const res: any = await api.post("/chatbot/chat", payload);
      const data = res?.data || res;

      if (data) {
        if (!activeSessionId) {
          setActiveSessionId(data.sessionId);
        }
        await fetchTeacherPastSessions(selectedTeacherId);

        setChatHistory((prev) =>
          prev.map((m) => (m.id === tempUserMsg.id ? data : m))
        );
      }
    } catch (err: any) {
      console.error("Chatbot Error:", err);
      alert(err.message || "Failed to get AI response.");
      setChatHistory((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  // 5. Delete Particular Session Thread
  const handleDeleteSessionThread = async (sId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat thread?")) return;

    try {
      await api.delete(`/chatbot/session/${sId}`);
      setPastSessions((prev) => prev.filter((s) => s.sessionId !== sId));
      if (activeSessionId === sId) {
        setActiveSessionId("");
        setChatHistory([]);
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete chat session.");
    }
  };

  // 6. Clear All Chat History
  const handleClearAllHistory = async () => {
    if (!selectedTeacherId) return;
    if (!window.confirm("Are you sure you want to clear ALL chat history?")) return;

    try {
      await api.delete(`/chatbot/clear-all/${selectedTeacherId}`);
      setPastSessions([]);
      setActiveSessionId("");
      setChatHistory([]);
    } catch (err: any) {
      alert(err.message || "Failed to clear chat history.");
    }
  };

  const handleNewChat = () => {
    setActiveSessionId("");
    setChatHistory([]);
    setInputMessage("");
    setSelectedMode("GENERAL");
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50/50 min-h-screen space-y-4 print:p-0 print:bg-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              24x7 AI Teaching Assistant Studio
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                Online
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Pedagogy co-pilot for analogies, classroom discipline, rubrics, & voice dictation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <label className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase">Teacher</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-semibold outline-none w-full"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.personalInfo.name}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase">Output Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-semibold outline-none w-full"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Hinglish">Hinglish</option>
              <option value="Marathi">Marathi (मराठी)</option>
            </select>
          </div>
        </div>
      </div>

      {/* WORKSPACE CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[550px]">
        {/* LEFT SIDEBAR: SESSIONS & QUICK PROMPTS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between hidden lg:flex space-y-4 overflow-y-auto print:hidden">
          <div className="space-y-4">
            <button
              onClick={handleNewChat}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Chat Thread
            </button>

            {/* RECENT PAST SESSIONS */}
            {pastSessions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> Recent Threads
                  </p>
                  
                  <button
                    onClick={handleClearAllHistory}
                    className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Trash className="w-3 h-3" /> Clear All
                  </button>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {pastSessions.map((thread) => (
                    <div
                      key={thread.sessionId}
                      onClick={() => setActiveSessionId(thread.sessionId)}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer group ${
                        activeSessionId === thread.sessionId
                          ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="line-clamp-1 flex-1 pr-1">{thread.lastMessage || thread.sessionId}</span>
                      
                      <button
                        onClick={(e) => handleDeleteSessionThread(thread.sessionId, e)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Prompt Chips */}
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                ⚡ Quick Prompts
              </p>
              <div className="space-y-2">
                {QUICK_TEACHER_PROMPTS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMode(chip.mode);
                      handleSendMessage(undefined, chip.message, chip.mode);
                    }}
                    className="w-full text-left p-2.5 bg-gray-50 hover:bg-indigo-50/60 border border-gray-100 hover:border-indigo-200 rounded-xl text-xs text-gray-700 hover:text-indigo-700 transition-all font-medium leading-relaxed block"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/50 rounded-xl text-[11px] text-indigo-800 border border-indigo-100/60 leading-relaxed">
            💡 <strong>Voice Dictation:</strong> Click mic icon to speak your questions naturally!
          </div>
        </div>

        {/* RIGHT MAIN CANVAS */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden print:border-none print:shadow-none">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 print:hidden">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-gray-700">
                {activeSessionId ? `Session Thread: ${activeSessionId}` : "New Chat Session"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 font-semibold px-2.5 py-1 rounded bg-gray-100"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>

              <button
                onClick={handleNewChat}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Thread
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {loadingHistory ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 space-y-3">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-800">Welcome to AI Teaching Assistant!</h3>
                <p className="text-xs text-gray-500 max-w-md">
                  Ask any question about explaining complex topics, handling classroom discipline, or designing 5-minute energizer games.
                </p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={msg.id || idx} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] sm:max-w-[75%] text-xs sm:text-sm shadow-sm leading-relaxed">
                      {msg.userMessage}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 mt-1 print:hidden">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="bg-gray-50 border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none p-4 max-w-[90%] sm:max-w-[85%] space-y-3 shadow-sm relative group">
                      <div className="absolute top-3 right-3 flex items-center gap-1 print:hidden">
                        <button
                          onClick={() => handleCopyText(msg.botResponse, msg.id)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 bg-white border border-gray-200 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy Response"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {!msg.botResponse && isSending ? (
                        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold py-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          AI Assistant is thinking...
                        </div>
                      ) : (
                        <div>{renderFormattedMarkdown(msg.botResponse)}</div>
                      )}

                      {msg.realLifeExamples && msg.realLifeExamples.length > 0 && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1 mt-2">
                          <p className="font-bold text-amber-800 flex items-center gap-1 text-[11px] uppercase">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Real-Life Analogies:
                          </p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {msg.realLifeExamples.map((ex, i) => (
                              <li key={i}>{ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.suggestedClassroomActivities && msg.suggestedClassroomActivities.length > 0 && (
                        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1 mt-2">
                          <p className="font-bold text-indigo-800 flex items-center gap-1 text-[11px] uppercase">
                            <Gamepad2 className="w-3.5 h-3.5 text-indigo-600" /> Interactive Class Activities:
                          </p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {msg.suggestedClassroomActivities.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Ecosystem Redirection Action Bar */}
                      {msg.botResponse && (
                        <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center gap-2 print:hidden">
                          <button
                            onClick={() =>
                              navigate("/ai-tools/lesson-plan", {
                                state: { topic: msg.userMessage },
                              })
                            }
                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <BookOpenCheck className="w-3.5 h-3.5" />
                            Create Lesson Plan
                          </button>

                          <button
                            onClick={() =>
                              navigate("/ai-tools/ppt-creator", {
                                state: { topic: msg.userMessage },
                              })
                            }
                            className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Presentation className="w-3.5 h-3.5" />
                            Create PPT Deck
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Mode Selector & Input Bar */}
          <div className="space-y-2 pt-2 border-t border-gray-100 print:hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedMode("GENERAL")}
                className={`px-3 py-1.5 rounded-xl transition-all text-nowrap ${
                  selectedMode === "GENERAL" ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🎓 General Assistant
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("EXPLAINER_ANALOGIES")}
                className={`px-3 py-1.5 rounded-xl transition-all text-nowrap ${
                  selectedMode === "EXPLAINER_ANALOGIES" ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                💡 Explainer Analogies
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("CLASSROOM_MANAGEMENT")}
                className={`px-3 py-1.5 rounded-xl transition-all text-nowrap ${
                  selectedMode === "CLASSROOM_MANAGEMENT" ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🏫 Classroom Discipline
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("ICEBREAKER_GAMES")}
                className={`px-3 py-1.5 rounded-xl transition-all text-nowrap ${
                  selectedMode === "ICEBREAKER_GAMES" ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🎮 5-Min Warmup Games
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              {/* Voice Dictation Microphone Button */}
              <button
                type="button"
                onClick={toggleVoiceDictation}
                className={`p-3 rounded-2xl transition-all border shrink-0 ${
                  isListening
                    ? "bg-red-500 text-white border-red-600 animate-pulse"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
                }`}
                title={isListening ? "Listening... Click to stop" : "Speak to AI (Voice Dictation)"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                placeholder={isListening ? "Listening to your voice..." : "Ask teacher assistant anything..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSending}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md transition-all disabled:opacity-40 shrink-0"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
