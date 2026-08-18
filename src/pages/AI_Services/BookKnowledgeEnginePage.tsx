/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, Upload, Search, Trash2, Globe, Sparkles, Send, Loader2,
  ChevronRight, ChevronDown, AlertTriangle, Layers, MessageSquare, X,
  FolderUp, FileText, Volume2, HelpCircle, Languages
} from "lucide-react";
import api, { api1 } from "../../utils/url";

const BOARDS = ["CBSE", "UP Board", "ICSE", "State Board", "Cambridge / International"];

const PUBLISHERS = [
  "NCERT Reference",
  "RD Sharma",
  "RS Aggarwal",
  "HC Verma",
  "S. Chand / Lakhmir Singh",
  "Selina Publishers",
  "Pearson / Oxford",
  "General / Other"
];

const LANGUAGES = [
  { code: "English", label: "English", tts: "en-US" },
  { code: "Hindi", label: "Hindi (हिन्दी)", tts: "hi-IN" },
  { code: "Hinglish", label: "Hinglish (Hindi + English)", tts: "hi-IN" },
  { code: "Marathi", label: "Marathi (मराठी)", tts: "mr-IN" },
  { code: "Tamil", label: "Tamil (தமிழ்)", tts: "ta-IN" },
  { code: "Telugu", label: "Telugu (తెలుగు)", tts: "te-IN" },
  { code: "Bengali", label: "Bengali (বাংলা)", tts: "bn-IN" },
  { code: "Gujarati", label: "Gujarati (ગુજરાતી)", tts: "gu-IN" },
  { code: "Kannada", label: "Kannada (ಕನ್ನಡ)", tts: "kn-IN" },
  { code: "Malayalam", label: "Malayalam (മലയാളം)", tts: "ml-IN" },
  { code: "Spanish", label: "Spanish (Español)", tts: "es-ES" },
  { code: "French", label: "French (Français)", tts: "fr-FR" },
  { code: "German", label: "German (Deutsch)", tts: "de-DE" },
  { code: "Japanese", label: "Japanese (日本語)", tts: "ja-JP" }
];

export default function BookKnowledgeEnginePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterBoard, setSelectedFilterBoard] = useState("ALL");
  const [selectedFilterPublisher, setSelectedFilterPublisher] = useState("ALL");

  // Upload States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Form Metadata States
  const [board, setBoard] = useState("");
  const [publisherRef, setPublisherRef] = useState("");
  const [programId, setProgramId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);

  const folderInputRef = useRef<HTMLInputElement>(null);

  // Selected Book Viewer State
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [selectedLang, setSelectedLang] = useState("English");
  const [expandedChapter, setExpandedChapter] = useState<number | null>(0);
  const [enrichingChapterNum, setEnrichingChapterNum] = useState<number | null>(null);

  // Chapter-Level Translation State (Fast 1-Click Translation)
  const [translatingChapterNum, setTranslatingChapterNum] = useState<number | null>(null);
  const [chapterTranslations, setChapterTranslations] = useState<Record<string, any>>({});

  // Tabs & Interactive Assessment State
  const [activeTab, setActiveTab] = useState<"CHAPTERS" | "CHAT" | "QUIZ">("CHAPTERS");
  const [quizData, setQuizData] = useState<any | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    fetchMetadataAndBooks();
  }, []);

  const fetchMetadataAndBooks = async () => {
    setLoading(true);
    try {
      const bRes: any = await api.get("/book/list");
      setBooks(bRes.books || []);

      const pRes: any = await api1.get("/v1/programs").catch(() => api1.get("/programs"));
      setPrograms(pRes?.programs || pRes?.data?.programs || []);

      const sRes: any = await api1.get("/v1/subjects").catch(() => api1.get("/subjects"));
      const sList = sRes?.subjects || sRes?.data?.subjects || [];
      setSubjects(sList);
      setFilteredSubjects(sList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programId) setFilteredSubjects(subjects.filter((s) => s.program?.id === programId));
    else setFilteredSubjects(subjects);
  }, [programId, subjects]);

  // Handle Chapter Expansion & On-Demand Deep AI Enrichment
  const handleChapterClick = async (chapterIdx: number, chNumber: number) => {
    if (expandedChapter === chapterIdx) {
      setExpandedChapter(null);
      return;
    }

    setExpandedChapter(chapterIdx);

    if (!selectedBook) return;
    const currentChapter = selectedBook.chapters?.[chapterIdx];

    if (currentChapter && (!currentChapter.isEnriched || currentChapter.topics?.length <= 1)) {
      setEnrichingChapterNum(chNumber);
      try {
        const enriched: any = await api.post("/book/enrich-chapter", {
          bookId: selectedBook._id,
          chapterNumber: chNumber
        });

        setSelectedBook((prevBook: any) => {
          if (!prevBook) return prevBook;
          const updatedChapters = [...prevBook.chapters];
          updatedChapters[chapterIdx] = enriched;
          return { ...prevBook, chapters: updatedChapters };
        });
      } catch (err) {
        console.error(err);
      } finally {
        setEnrichingChapterNum(null);
      }
    }
  };

  // 1-Click Whole Chapter Translation Handler
  const handleTranslateEntireChapter = async (chNumber: number, targetLang: string) => {
    const cacheKey = `${selectedBook._id}-${chNumber}-${targetLang}`;
    if (targetLang === "English") {
      setChapterTranslations((prev) => ({ ...prev, [cacheKey]: null }));
      return;
    }

    setTranslatingChapterNum(chNumber);
    try {
      const res: any = await api.post("/book/translate-chapter", {
        bookId: selectedBook._id,
        chapterNumber: chNumber,
        targetLanguage: targetLang
      });
      setChapterTranslations((prev) => ({ ...prev, [cacheKey]: res.topics }));
    } catch (e) {
      console.error("Chapter translation error:", e);
    } finally {
      setTranslatingChapterNum(null);
    }
  };

  // True Multilingual Audio Speech (TTS)
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const matchedLang = LANGUAGES.find((l) => l.code === selectedLang);
      utterance.lang = matchedLang ? matchedLang.tts : "en-US";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Interactive Chapter Quiz Handler
  const handleStartQuiz = async (chNumber: number) => {
    setActiveTab("QUIZ");
    setQuizLoading(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    try {
      const res: any = await api.post("/book/generate-quiz", {
        bookId: selectedBook._id,
        chapterNumber: chNumber
      });
      setQuizData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setQuizLoading(false);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.name.endsWith(".pdf") || f.name.endsWith(".zip")
      );
      if (droppedFiles.length === 0) {
        setErrorMessage("Only .pdf or .zip files are allowed.");
      } else {
        setSelectedFiles((prev) => [...prev, ...droppedFiles]);
        setErrorMessage(null);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).filter(
        (f) => f.name.endsWith(".pdf") || f.name.endsWith(".zip")
      );
      setSelectedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMessage("Please select at least one PDF or Zip file.");
      return;
    }

    setUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      if (board) formData.append("board", board);
      if (publisherRef) formData.append("publisherRef", publisherRef);
      if (programId) formData.append("programId", programId);
      if (subjectId) formData.append("subjectId", subjectId);

      const res: any = await api.post("/book/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000
      });

      await fetchMetadataAndBooks();
      setIsUploadOpen(false);
      setSelectedFiles([]);
      setSelectedBook(res);

      if (res && res.chapters?.length > 0) {
        handleChapterClick(0, res.chapters[0].chapterNumber);
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Failed to process files.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBook = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/book/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      if (selectedBook?._id === id) setSelectedBook(null);
    } catch (e: any) {
      alert(e.message || "Failed to delete book.");
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedBook || isChatting) return;

    const userQ = chatInput.trim();
    setChatInput("");
    setChatMessages((p) => [...p, { role: "user", text: userQ }]);
    setIsChatting(true);

    try {
      const res: any = await api.post("/book/chat", {
        bookId: selectedBook._id,
        userQuestion: userQ,
        language: selectedLang
      });
      setChatMessages((p) => [...p, { role: "ai", text: res.answer || "No answer found." }]);
    } catch (e) {
      console.log(e);
      setChatMessages((p) => [...p, { role: "ai", text: "Error searching textbook context." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const displayedBooks = books.filter((b) => {
    const matchBoard = selectedFilterBoard === "ALL" || b.board === selectedFilterBoard;
    const matchPub = selectedFilterPublisher === "ALL" || b.publisherRef === selectedFilterPublisher;
    const matchQuery = b.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       b.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBoard && matchPub && matchQuery;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Universal AI Book & Syllabus Knowledge Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hybrid Dense Vector RAG • 1-Click Chapter Translation • Multilingual Audio Speech
          </p>
        </div>

        <button
          onClick={() => {
            setIsUploadOpen(true);
            setSelectedFiles([]);
            setErrorMessage(null);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-md transition-all shrink-0"
        >
          <Upload className="w-5 h-5" /> Upload Book / ZIP / Folder
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Board</label>
            <select
              value={selectedFilterBoard}
              onChange={(e) => setSelectedFilterBoard(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
            >
              <option value="ALL">All Boards</option>
              {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Publisher / Ref</label>
            <select
              value={selectedFilterPublisher}
              onChange={(e) => setSelectedFilterPublisher(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
            >
              <option value="ALL">All Publishers</option>
              {PUBLISHERS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search title, board, publisher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* BOOKS GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : displayedBooks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Books Indexed</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload chapter PDFs, ZIP folders, or NCERT book packages to build vector search indexes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBooks.map((b) => (
            <div
              key={b._id}
              onClick={() => {
                setSelectedBook(b);
                setActiveTab("CHAPTERS");
                setChatMessages([{ role: "ai", text: `Hello! I have indexed **${b.bookTitle}**. Ask me any question!` }]);
                if (b.chapters?.length > 0) {
                  handleChapterClick(0, b.chapters[0].chapterNumber);
                }
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 uppercase">
                    {b.board}
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700">
                    Ref: {b.publisherRef}
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                    {b.totalPageCount} Pages
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {b.bookTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {b.programName} • {b.subjectName}
                  </p>
                </div>

                <p className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                  📚 {b.chapters?.length || 0} Academic Chapters Indexed
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
                <span className="line-clamp-1 max-w-[200px]">{b.validationNote}</span>
                <button
                  onClick={(e) => handleDeleteBook(b._id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD & DRAG DROP MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsUploadOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Batch Upload Books, Folders & ZIP</h3>
                <p className="text-xs text-slate-500">Drag & Drop multiple PDFs or ZIP packages</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* DRAG AND DROP ZONE */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                isDragOver ? "border-indigo-600 bg-indigo-50/50 scale-[1.01]" : "border-slate-300 bg-slate-50 hover:bg-slate-100/50"
              }`}
            >
              <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-bold text-slate-800">Drag & Drop Multiple PDFs or .ZIP File Here</p>
              <p className="text-[11px] text-slate-400 mt-1">Preserves chemical equations, tables, formulas & definitions</p>

              <div className="flex justify-center gap-2 mt-4">
                <label className="cursor-pointer px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Choose File(s)
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.zip"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                <label className="cursor-pointer px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5">
                  <FolderUp className="w-4 h-4" /> Choose Folder
                  <input
                    type="file"
                    multiple
                    // @ts-ignore
                    webkitdirectory=""
                    onChange={handleFileSelect}
                    className="hidden"
                    ref={folderInputRef}
                  />
                </label>
              </div>
            </div>

            {/* QUEUED FILES LIST PREVIEW */}
            {selectedFiles.length > 0 && (
              <div className="p-3 bg-slate-100 rounded-xl max-h-36 overflow-y-auto space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Selected Files ({selectedFiles.length}):</span>
                  <button onClick={() => setSelectedFiles([])} className="text-red-500 hover:underline">Clear All</button>
                </div>
                {selectedFiles.map((f, idx) => (
                  <div key={idx} className="text-xs bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="font-medium text-slate-800 truncate max-w-[300px]">{f.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Exam Board (Optional)</label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                  >
                    <option value="">✨ Auto-Detect Board</option>
                    {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Book Ref / Publisher (Optional)</label>
                  <select
                    value={publisherRef}
                    onChange={(e) => setPublisherRef(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                  >
                    <option value="">✨ Auto-Detect Publisher</option>
                    {PUBLISHERS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Program (Optional)</label>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                  >
                    <option value="">✨ Auto-Detect Grade Level</option>
                    {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject (Optional)</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                  >
                    <option value="">✨ Auto-Detect Subject</option>
                    {filteredSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Parsing PyMuPDF & Vector Indexing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze & Index All Selected Files ({selectedFiles.length})
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SELECTED BOOK VIEW MODAL */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full bg-slate-100 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 border-b bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pr-16">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedBook.board}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Publisher: {selectedBook.publisherRef}
                  </span>
                </div>
                <h2 className="text-xl font-black">{selectedBook.bookTitle}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedBook.programName} | {selectedBook.subjectName}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Output Language:</span>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="text-slate-900">{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b bg-slate-50 px-6 pt-3 gap-3">
              <button
                onClick={() => setActiveTab("CHAPTERS")}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "CHAPTERS" ? "bg-white text-indigo-600 shadow-sm border-t-2 border-indigo-600" : "text-slate-500"
                }`}
              >
                <Layers className="w-4 h-4" /> Chapters & Topics Breakdown
              </button>

              <button
                onClick={() => setActiveTab("CHAT")}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "CHAT" ? "bg-white text-purple-600 shadow-sm border-t-2 border-purple-600" : "text-slate-500"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Ask Book Anything (Vector RAG)
              </button>

              <button
                onClick={() => handleStartQuiz(selectedBook.chapters[expandedChapter || 0]?.chapterNumber || 1)}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "QUIZ" ? "bg-white text-emerald-600 shadow-sm border-t-2 border-emerald-600" : "text-slate-500"
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Chapter Assessment Test
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white space-y-4">
              {activeTab === "CHAPTERS" && (
                <div className="space-y-4">
                  {selectedBook.chapters?.map((ch: any, idx: number) => {
                    const isOpen = expandedChapter === idx;
                    const isEnriching = enrichingChapterNum === ch.chapterNumber;
                    const isTranslating = translatingChapterNum === ch.chapterNumber;

                    const cacheKey = `${selectedBook._id}-${ch.chapterNumber}-${selectedLang}`;
                    const translatedTopics = chapterTranslations[cacheKey];
                    const activeTopics = (selectedLang !== "English" && translatedTopics) ? translatedTopics : ch.topics;

                    return (
                      <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-slate-50 hover:bg-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <button
                            onClick={() => handleChapterClick(idx, ch.chapterNumber)}
                            className="flex-1 text-left"
                          >
                            <span className="text-xs font-black text-indigo-600 uppercase">Chapter {ch.chapterNumber}</span>
                            <h4 className="font-bold text-slate-900 text-sm">{ch.chapterName}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ch.chapterSummary}</p>
                          </button>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* ⚡ 1-CLICK WHOLE CHAPTER TRANSLATE BUTTON */}
                            {selectedLang !== "English" && (
                              <button
                                onClick={() => handleTranslateEntireChapter(ch.chapterNumber, selectedLang)}
                                disabled={isTranslating}
                                className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl shadow-sm transition-all disabled:opacity-50"
                              >
                                {isTranslating ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Translating Chapter...
                                  </>
                                ) : (
                                  <>
                                    <Languages className="w-3.5 h-3.5" /> Translate Chapter to {selectedLang}
                                  </>
                                )}
                              </button>
                            )}

                            <button onClick={() => handleChapterClick(idx, ch.chapterNumber)} className="p-1 text-slate-400">
                              {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="p-5 space-y-5 bg-white border-t border-slate-100">
                            {isEnriching ? (
                              <div className="p-8 text-center bg-indigo-50/50 rounded-2xl">
                                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
                                <p className="text-xs font-bold text-indigo-900">✨ AI Extracting Full Chapter Syllabus & Balanced Reactions...</p>
                              </div>
                            ) : (
                              activeTopics?.map((top: any, tIdx: number) => (
                                <div key={tIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-indigo-600" /> {top.topicName}
                                    </h5>

                                    {/* ⚡ MULTILINGUAL VOICE SPEAKER (TTS) */}
                                    <button
                                      onClick={() => speakText(`${top.topicName}. ${top.easyExplanation}`)}
                                      className="p-1.5 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg border border-slate-200 shadow-sm transition-all"
                                      title={`Listen in ${selectedLang}`}
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
                                    {top.easyExplanation}
                                  </div>

                                  {top.realLifeExamples?.length > 0 && (
                                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-1">
                                      <span className="text-[10px] font-black text-emerald-800 uppercase block mb-1">
                                        💡 Practical Real Life Examples & Analogies:
                                      </span>
                                      {top.realLifeExamples.map((ex: string, i: number) => (
                                        <p key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                                          <span className="text-emerald-500 font-bold">•</span>
                                          <span>{ex}</span>
                                        </p>
                                      ))}
                                    </div>
                                  )}

                                  {top.keyFormulasOrDefinitions?.length > 0 && (
                                    <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 space-y-1">
                                      <span className="text-[10px] font-black text-purple-800 uppercase block mb-1">
                                        📐 Core Formulas, Chemical Equations & Definitions:
                                      </span>
                                      {top.keyFormulasOrDefinitions.map((f: string, i: number) => (
                                        <p key={i} className="text-xs font-mono font-semibold text-purple-950 flex items-center gap-1.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                                          <span>{f}</span>
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "QUIZ" && (
                <div className="space-y-4">
                  {quizLoading ? (
                    <div className="p-12 text-center space-y-2">
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">Generating Interactive AI Assessment from Chapter Context...</p>
                    </div>
                  ) : quizData ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <span className="text-xs font-black text-emerald-900">Quiz: {quizData.chapterTitle}</span>
                        {quizSubmitted && (
                          <span className="text-xs font-bold px-3 py-1 bg-emerald-600 text-white rounded-lg">
                            Score: {Object.keys(selectedAnswers).filter((k: any) => selectedAnswers[k] === quizData.questions[k].correctAnswer).length} / {quizData.questions.length}
                          </span>
                        )}
                      </div>

                      {quizData.questions?.map((q: any, qIdx: number) => (
                        <div key={qIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <p className="text-xs font-bold text-slate-900">{qIdx + 1}. {q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt: string, optIdx: number) => {
                              const isSelected = selectedAnswers[qIdx] === optIdx;
                              const isCorrect = q.correctAnswer === optIdx;

                              let btnStyle = "bg-white border-slate-200 hover:bg-slate-100";
                              if (quizSubmitted) {
                                if (isCorrect) btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold";
                                else if (isSelected) btnStyle = "bg-red-100 border-red-500 text-red-900 font-bold";
                              } else if (isSelected) {
                                btnStyle = "bg-indigo-600 text-white font-bold";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={quizSubmitted}
                                  onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                                  className={`p-3 text-xs text-left rounded-xl border transition-all ${btnStyle}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <p className="text-[11px] text-slate-500 italic bg-white p-2.5 rounded-lg border border-slate-100">
                              💡 Explanation: {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}

                      {!quizSubmitted && (
                        <button
                          onClick={() => setQuizSubmitted(true)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs transition-all"
                        >
                          Submit Assessment & Reveal Score
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === "CHAT" && (
                <div className="h-[440px] flex flex-col justify-between">
                  <div className="bg-slate-900 p-4 rounded-2xl flex-1 overflow-y-auto space-y-3 border border-slate-800">
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                          m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-200 border border-slate-700 font-mono"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isChatting && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800 text-indigo-400 p-3 rounded-2xl text-xs flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Searching textbook vector context...
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendChat} className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder={`Ask any specific question in ${selectedLang}...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 text-xs p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={isChatting || !chatInput.trim()}
                      className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
