/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSearch,
  Upload,
  Search,
  Trash2,
  Book,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  FileText,
  User,
  Globe,
  HelpCircle,
  Sparkles,
  GraduationCap,
  BookOpen,
  Printer,
  MessageSquare,
  Layers,
  Send,
  RotateCw,
} from "lucide-react";

// API Imports from utils/url
import api, { api1 } from "../../utils/url";

// Multiple Supported Languages Array
const SUPPORTED_LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Hindi", label: "Hindi (हिन्दी)" },
  { code: "Hinglish", label: "Hinglish (Hindi + English Mix)" },
  { code: "Marathi", label: "Marathi (मराठी)" },
  { code: "Tamil", label: "Tamil (தமிழ்)" },
  { code: "Telugu", label: "Telugu (తెలుగు)" },
  { code: "Bengali", label: "Bengali (বাংলা)" },
  { code: "Gujarati", label: "Gujarati (ગુજરાતી)" },
  { code: "Kannada", label: "Kannada (ಕನ್ನಡ)" },
  { code: "Malayalam", label: "Malayalam (മലയാളം)" },
  { code: "Punjabi", label: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "Urdu", label: "Urdu (اردو)" },
];

interface Program { id: string; name: string; fullName: string; }
interface Subject { id: string; name: string; program: { id: string; name: string }; }
interface Teacher { id: string; email: string; personalInfo: { name: string } }

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface Flashcard {
  front: string;
  back: string;
}

interface PDFSummary {
  _id: string;
  fileName: string;
  totalPageCount: number;
  programId?: string;
  subjectId?: string;
  teacherId?: string;
  programName?: string;
  subjectName?: string;
  language: string;
  relevanceType: "DIRECT" | "INDIRECT" | "UNRELATED";
  interdisciplinaryNote?: string;
  summary: string;
  keyIdeas: string[];
  keyFormulas?: string[];
  generatedQuestions: QuizQuestion[];
  flashcards?: Flashcard[];
  createdAt: string;
}

export default function PDFInterpreterPage() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [pdfSummaries, setPdfSummaries] = useState<PDFSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedFilterProgram, setSelectedFilterProgram] = useState<string>("ALL");
  const [selectedFilterSubject, setSelectedFilterSubject] = useState<string>("ALL");
  const [selectedFilterTeacher, setSelectedFilterTeacher] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal & Tab States
  const [isUploadModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSummaryForView, setSelectedSummaryForView] = useState<PDFSummary | null>(null);
  const [activeTab, setActiveTab] = useState<"NOTES" | "QUIZ" | "FLASHCARDS" | "CHAT">("NOTES");

  // Interactive Quiz States
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Interactive Flashcards State
  const [flippedCardIndices, setFlippedCardIndices] = useState<Record<number, boolean>>({});

  // Chat with PDF States
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Upload Form
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formProgramId, setFormProgramId] = useState<string>("");
  const [formSubjectId, setFormSubjectId] = useState<string>("");
  const [formTeacherId, setFormTeacherId] = useState<string>("");
  const [formLanguage, setFormLanguage] = useState<string>("English");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Load Metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const pRes: any = await api1.get("/v1/programs").catch(() => api1.get("/programs"));
        const pList = pRes?.data?.programs || pRes?.programs || [];
        setPrograms(pList);

        const sRes: any = await api1.get("/v1/subjects").catch(() => api1.get("/subjects"));
        const sList = sRes?.data?.subjects || sRes?.subjects || [];
        setSubjects(sList);
        setFilteredSubjects(sList);

        const tRes: any = await api1.get("/v1/users/teachers").catch(() => api1.get("/users/teachers"));
        const tList = tRes?.data?.teachers || tRes?.teachers || [];
        setTeachers(tList);
        if (tList.length > 0) setFormTeacherId(tList[0].id);

        await fetchSavedSummaries();
      } catch (err) {
        console.error("Error loading metadata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  // 2. Fetch Saved Summaries
  const fetchSavedSummaries = async () => {
    try {
      const res: any = await api.get("/pdf/list");
      const list = res?.pdfSummaries || res?.data?.pdfSummaries || [];
      setPdfSummaries(list);
    } catch (err) {
      console.error("Error fetching PDF Summaries:", err);
    }
  };

  // 3. Filter Subjects based on selected Program
  useEffect(() => {
    if (formProgramId) {
      const filtered = subjects.filter((s) => s.program?.id === formProgramId);
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(subjects);
    }
  }, [formProgramId, subjects]);

  // Reset Modal Tab States on View
  useEffect(() => {
    if (selectedSummaryForView) {
      setActiveTab("NOTES");
      setUserQuizAnswers({});
      setQuizScore(null);
      setFlippedCardIndices({});
      setChatMessages([
        {
          role: "ai",
          text: `Hello! I have read **${selectedSummaryForView.fileName}**. Ask me any specific question about this document!`,
        },
      ]);
    }
  }, [selectedSummaryForView]);

  // 4. Upload Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a PDF file.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (formProgramId) formData.append("programId", formProgramId);
      if (formSubjectId) formData.append("subjectId", formSubjectId);
      if (formTeacherId) formData.append("teacherId", formTeacherId);
      formData.append("language", formLanguage);

      const res: any = await api.post("/pdf/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newSummary = res?.data || res;
      if (newSummary) {
        await fetchSavedSummaries();
        setIsModalOpen(false);
        setSelectedFile(null);
        setSelectedSummaryForView(newSummary);
      }
    } catch (err: any) {
      console.error("PDF Processing Error:", err);
      setErrorMessage(err.message || "Failed to process PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Delete PDF Summary
  const handleDeleteSummary = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this PDF Summary?")) return;

    try {
      await api.delete(`/pdf/${id}`);
      setPdfSummaries((prev) => prev.filter((p) => p._id !== id));
      if (selectedSummaryForView?._id === id) setSelectedSummaryForView(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete PDF summary.");
    }
  };

  // 6. Handle PDF Live Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedSummaryForView || isSendingChat) return;

    const userQ = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userQ }]);
    setIsSendingChat(true);

    try {
      const res: any = await api.post("/pdf/chat", {
        summaryId: selectedSummaryForView._id,
        userQuestion: userQ,
        language: selectedSummaryForView.language || "English",
      });

      const aiAnswer = res?.answer || res?.data?.answer || "I could not find an answer in the document.";
      setChatMessages((prev) => [...prev, { role: "ai", text: aiAnswer }]);
    } catch (err: any) {
      console.log(err)
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error fetching answer from PDF context." },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Interactive Quiz Score Calculation
  const handleOptionSelect = (qIdx: number, option: string) => {
    setUserQuizAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleCalculateScore = () => {
    if (!selectedSummaryForView) return;
    let score = 0;
    selectedSummaryForView.generatedQuestions.forEach((q, i) => {
      if (userQuizAnswers[i] === q.answer) score++;
    });
    setQuizScore(score);
  };

  const getTeacherName = (tId?: string) => {
    if (!tId) return "Teacher";
    const found = teachers.find((t) => t.id === tId);
    return found ? found.personalInfo.name : "Teacher";
  };

  // Filtered Summaries
  const displayedSummaries = pdfSummaries.filter((sum) => {
    const matchesProgram = selectedFilterProgram === "ALL" || sum.programId === selectedFilterProgram;
    const matchesSubject = selectedFilterSubject === "ALL" || sum.subjectId === selectedFilterSubject;
    const matchesTeacher = selectedFilterTeacher === "ALL" || sum.teacherId === selectedFilterTeacher;
    const matchesSearch = sum.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sum.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesSubject && matchesTeacher && matchesSearch;
  });

  const totalPDFs = pdfSummaries.length;
  const totalPages = pdfSummaries.reduce((acc, curr) => acc + (curr.totalPageCount || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-indigo-600" />
            AI PDF Interpreter & Learning Co-Pilot
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Analyze textbook PDFs, attempt interactive quizzes, flashcards, & chat live with documents.
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setErrorMessage(null);
            setFormProgramId("");
            setFormSubjectId("");
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Upload className="w-5 h-5" />
          Upload & Analyze PDF
        </button>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total PDFs Analyzed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalPDFs}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages Processed</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{totalPages}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Document Chat</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">Active RAG</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Max Size</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">25 MB</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Upload className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Program</label>
            <select
              value={selectedFilterProgram}
              onChange={(e) => setSelectedFilterProgram(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none"
            >
              <option value="ALL">All Programs</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Subject</label>
            <select
              value={selectedFilterSubject}
              onChange={(e) => setSelectedFilterSubject(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Teacher</label>
            <select
              value={selectedFilterTeacher}
              onChange={(e) => setSelectedFilterTeacher(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none"
            >
              <option value="ALL">All Teachers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.personalInfo.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search PDF file or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none"
          />
        </div>
      </div>

      {/* CARDS GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : displayedSummaries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center space-y-3">
          <FileSearch className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800">No PDF Summaries Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Upload your first textbook or chapter PDF to generate AI notes, quizzes, and live chat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSummaries.map((sum) => (
            <div
              key={sum._id}
              onClick={() => setSelectedSummaryForView(sum)}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    {sum.programName || "General"}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {sum.totalPageCount} Pages
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {sum.fileName}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                    <Book className="w-3.5 h-3.5 text-gray-400" />
                    {sum.subjectName || "Subject"}
                  </p>
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {sum.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  by {getTeacherName(sum.teacherId)}
                </span>

                <button
                  onClick={(e) => handleDeleteSummary(sum._id, e)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD PDF MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upload & Analyze PDF</h2>
                <p className="text-xs text-gray-500">Program & Subject are optional. Defaults to Auto-Detect!</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Select PDF File *</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Select Teacher *</label>
                <select
                  value={formTeacherId}
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.personalInfo.name} ({t.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Program (Optional)</label>
                  <select
                    value={formProgramId}
                    onChange={(e) => setFormProgramId(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 font-medium"
                  >
                    <option value="">✨ Auto-Detect from PDF</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Subject (Optional)</label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 font-medium"
                  >
                    <option value="">✨ Auto-Detect from PDF</option>
                    {filteredSubjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  Output Language *
                </label>
                <select
                  value={formLanguage}
                  onChange={(e) => setFormLanguage(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 font-medium"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing PDF & Generating Package...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze & Save PDF Learning Package
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED VIEW MODAL WITH 4 INTERACTIVE TABS */}
      {selectedSummaryForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-6 print:p-0 print:shadow-none">
            <button
              onClick={() => setSelectedSummaryForView(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg bg-gray-100 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Details */}
            <div className="border-b border-gray-100 pb-4 pr-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {selectedSummaryForView.programName || "General"}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 flex items-center gap-1">
                    <Book className="w-3.5 h-3.5" />
                    {selectedSummaryForView.subjectName || "General"}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                    🌐 {selectedSummaryForView.language}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {selectedSummaryForView.totalPageCount} Pages
                  </span>
                </div>
                <h2 className="text-2xl font-black text-gray-900">{selectedSummaryForView.fileName}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Teacher: <strong>{getTeacherName(selectedSummaryForView.teacherId)}</strong>
                </p>
              </div>

              {/* Header Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 print:hidden shrink-0">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Handout
                </button>

                <button
                  onClick={() =>
                    navigate("/assessments/create", {
                      state: {
                        topic: selectedSummaryForView.fileName,
                        questions: selectedSummaryForView.generatedQuestions,
                      },
                    })
                  }
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Convert Quiz to Test
                </button>
              </div>
            </div>

            {/* TAB NAVIGATION BAR */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2 print:hidden">
              <button
                onClick={() => setActiveTab("NOTES")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "NOTES"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                Summary & Key Notes
              </button>

              <button
                onClick={() => setActiveTab("QUIZ")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "QUIZ"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Interactive Quiz
              </button>

              <button
                onClick={() => setActiveTab("FLASHCARDS")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "FLASHCARDS"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                Revision Flashcards
              </button>

              <button
                onClick={() => setActiveTab("CHAT")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "CHAT"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Chat with PDF (RAG Co-Pilot)
              </button>
            </div>

            {/* TAB 1: SUMMARY & NOTES */}
            {activeTab === "NOTES" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-1">Easy Language Summary</h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                    {selectedSummaryForView.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Key Ideas & Main Points</h4>
                  <ul className="space-y-1.5">
                    {selectedSummaryForView.keyIdeas?.map((idea, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedSummaryForView.keyFormulas && selectedSummaryForView.keyFormulas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Key Formulas & Definitions</h4>
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1.5">
                      {selectedSummaryForView.keyFormulas.map((f, i) => (
                        <p key={i} className="text-xs font-semibold text-indigo-900 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                          <span>{f}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INTERACTIVE QUIZ MODE */}
            {activeTab === "QUIZ" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900">Interactive Assessment Quiz</h4>
                    <p className="text-xs text-indigo-700">Select answers and submit to view instant score!</p>
                  </div>

                  <button
                    onClick={handleCalculateScore}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow"
                  >
                    Calculate Score
                  </button>
                </div>

                {quizScore !== null && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <p className="text-lg font-black text-emerald-800">
                      🎯 Score: {quizScore} / {selectedSummaryForView.generatedQuestions.length} Correct!
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {selectedSummaryForView.generatedQuestions?.map((q, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                      <p className="font-bold text-gray-900">{i + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options?.map((opt, optIdx) => {
                          const isSelected = userQuizAnswers[i] === opt;
                          const isCorrect = opt === q.answer;
                          let btnClass = "bg-white text-gray-700 border-gray-200 hover:bg-gray-100";

                          if (quizScore !== null) {
                            if (isCorrect) btnClass = "bg-emerald-100 text-emerald-900 border-emerald-400 font-bold";
                            else if (isSelected && !isCorrect) btnClass = "bg-red-100 text-red-900 border-red-400";
                          } else if (isSelected) {
                            btnClass = "bg-indigo-100 text-indigo-900 border-indigo-400 font-bold";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleOptionSelect(i, opt)}
                              className={`p-2.5 rounded-lg text-left text-xs transition-all border ${btnClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: REVISION FLASHCARDS */}
            {activeTab === "FLASHCARDS" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500">Click any card to flip and view explanation!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedSummaryForView.flashcards && selectedSummaryForView.flashcards.length > 0 ? (
                    selectedSummaryForView.flashcards.map((card, idx) => {
                      const isFlipped = !!flippedCardIndices[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => setFlippedCardIndices((prev) => ({ ...prev, [idx]: !isFlipped }))}
                          className={`p-6 rounded-2xl border min-h-[160px] cursor-pointer transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                            isFlipped
                              ? "bg-indigo-900 text-white border-indigo-800"
                              : "bg-white text-gray-900 border-gray-200"
                          }`}
                        >
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block">
                              {isFlipped ? "Answer / Explanation" : `Flashcard #${idx + 1}`}
                            </span>
                            <p className="text-sm font-bold leading-relaxed">
                              {isFlipped ? card.back : card.front}
                            </p>
                          </div>
                          <div className="flex items-center justify-end text-xs text-indigo-400 font-semibold gap-1 pt-2">
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Click to Flip</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-8 text-xs text-gray-400">
                      No flashcards generated for this PDF.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: LIVE CHAT WITH PDF (RAG CO-PILOT) */}
            {activeTab === "CHAT" && (
              <div className="space-y-4 flex flex-col h-[400px] justify-between">
                {/* Chat Message Window */}
                <div className="p-4 bg-slate-900 rounded-2xl overflow-y-auto space-y-3 flex-1 border border-slate-800">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isSendingChat && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 text-indigo-400 p-3 rounded-2xl text-xs flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Searching PDF context...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendChat} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask specific questions about this PDF document..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isSendingChat || !chatInput.trim()}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
