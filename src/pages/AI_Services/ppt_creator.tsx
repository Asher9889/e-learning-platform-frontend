/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Search,
  Presentation,
  Download,
  Trash2,
  Book,
  Layers,
  AlertTriangle,
  X,
  Loader2,
  User,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Maximize2,
  Palette,
  Image as ImageIcon,
  Edit3,
  BookOpenCheck,
  Globe,
  Check,
} from "lucide-react";

// API Imports from utils/url
import api, { api1 } from "../../utils/url";

// Supported Languages Array
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

const PPT_THEMES = [
  { id: "Indigo Modern", label: "Indigo Modern (Clean & Professional)" },
  { id: "Emerald Academic", label: "Emerald Academic (Science & Nature Focus)" },
  { id: "Midnight Dark", label: "Midnight Dark (Cyber & Tech Look)" },
  { id: "Crimson Corporate", label: "Crimson Corporate (Bold & Vibrant)" },
];

// Types
interface Program {
  id: string;
  name: string;
  fullName: string;
}

interface Subject {
  id: string;
  name: string;
  program: {
    id: string;
    name: string;
  };
}

interface Teacher {
  id: string;
  email: string;
  personalInfo: {
    name: string;
    profileImage?: string;
  };
}

interface SlideContent {
  slideNumber: number;
  slideType?: string;
  title: string;
  bullets: string[];
  visualPrompt?: string;
  speakerNotes?: string;
}

interface PPTPresentation {
  _id: string;
  programId: string;
  subjectId: string;
  teacherId: string;
  programName: string;
  subjectName: string;
  topic: string;
  theme?: string;
  subjectGradeCompatibility: string;
  boardCurriculumDetails: string;
  relevanceType: "DIRECT" | "INDIRECT" | "UNRELATED";
  interdisciplinaryNote?: string;
  totalSlides: number;
  downloadUrl: string;
  slides: SlideContent[];
  createdAt: string;
}

export default function PPTCreatorPage() {
  const navigate = useNavigate();

  // Data States
  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [presentations, setPresentations] = useState<PPTPresentation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI Filter States
  const [selectedFilterProgram, setSelectedFilterProgram] = useState<string>("ALL");
  const [selectedFilterSubject, setSelectedFilterSubject] = useState<string>("ALL");
  const [selectedFilterTeacher, setSelectedFilterTeacher] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal & Presentation States
  const [isCreateModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPPTForView, setSelectedPPTForView] = useState<PPTPresentation | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isFullscreenPresent, setIsFullscreenPresent] = useState<boolean>(false);
  const [isEditingSlide, setIsEditingSlide] = useState<boolean>(false);

  // Form Generate States
  const [formProgramId, setFormProgramId] = useState<string>("");
  const [formSubjectId, setFormSubjectId] = useState<string>("");
  const [formTeacherId, setFormTeacherId] = useState<string>("");
  const [formTopic, setFormTopic] = useState<string>("");
  const [formNumSlides, setFormNumSlides] = useState<number>(5);
  const [formTheme, setFormTheme] = useState<string>("Indigo Modern");
  const [formLanguage, setFormLanguage] = useState<string>("English");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Load Metadata
  useEffect(() => {
    const fetchMetadataAndPPTs = async () => {
      setLoading(true);
      try {
        const progRes: any = await api1.get("/v1/programs").catch(() => api1.get("/programs"));
        const progList = progRes?.data?.programs || progRes?.programs || [];
        setPrograms(progList);

        const subjRes: any = await api1.get("/v1/subjects").catch(() => api1.get("/subjects"));
        const subjList = subjRes?.data?.subjects || subjRes?.subjects || [];
        setSubjects(subjList);
        setFilteredSubjects(subjList);

        const teacherRes: any = await api1.get("/v1/users/teachers").catch(() => api1.get("/users/teachers"));
        const teacherList = teacherRes?.data?.teachers || teacherRes?.teachers || [];
        setTeachers(teacherList);
        if (teacherList.length > 0) {
          setFormTeacherId(teacherList[0].id);
        }

        await fetchSavedPresentations();
      } catch (err: any) {
        console.error("Error loading metadata:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadataAndPPTs();
  }, []);

  // 2. Fetch Saved Presentations
  const fetchSavedPresentations = async () => {
    try {
      const res: any = await api.get("/ppt/list");
      const ppts = res?.presentations || res?.data?.presentations || [];
      setPresentations(ppts);
    } catch (err: any) {
      console.error("Error fetching AI Presentations:", err?.message || err);
    }
  };

  // 3. Filter Form Subjects based on selected Form Program
  useEffect(() => {
    if (formProgramId) {
      const filtered = subjects.filter((s) => s.program?.id === formProgramId);
      setFilteredSubjects(filtered);
      if (filtered.length > 0) {
        setFormSubjectId(filtered[0].id);
      } else {
        setFormSubjectId("");
      }
    } else {
      setFilteredSubjects(subjects);
    }
  }, [formProgramId, subjects]);

  // Keyboard navigation for Fullscreen Presenter Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPPTForView || !isFullscreenPresent) return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        setActiveSlideIndex((prev) =>
          Math.min(selectedPPTForView.slides.length - 1, prev + 1)
        );
      } else if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Escape") {
        setIsFullscreenPresent(false);
      }
    };

    if (isFullscreenPresent) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenPresent, selectedPPTForView]);

  // 4. Handle Form Submit -> Generate AI PPT
  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProgramId || !formSubjectId || !formTeacherId || !formTopic) {
      setErrorMessage("Please select Program, Subject, Teacher, and enter a Topic.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const payload = {
        programId: formProgramId,
        subjectId: formSubjectId,
        teacherId: formTeacherId,
        topic: formTopic,
        numSlides: Number(formNumSlides),
        theme: formTheme,
        language: formLanguage,
      };

      const res: any = await api.post("/ppt/generate", payload);
      const newPPT = res?.data || res;

      if (newPPT) {
        await fetchSavedPresentations();
        setIsModalOpen(false);
        setFormTopic("");
        setSelectedPPTForView(newPPT);
        setActiveSlideIndex(0);
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setErrorMessage(err.message || "Failed to generate presentation slides. Check topic relevance.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. Delete Presentation
  const handleDeletePPT = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this AI Presentation and its .pptx file?")) return;

    try {
      await api.delete(`/ppt/${id}`);
      setPresentations((prev) => prev.filter((p) => p._id !== id));
      if (selectedPPTForView?._id === id) setSelectedPPTForView(null);
    } catch (err: any) {
      console.error("Error deleting presentation:", err?.message || err);
      alert(err.message || "Failed to delete presentation.");
    }
  };

  const getTeacherName = (tId: string) => {
    const found = teachers.find((t) => t.id === tId);
    return found ? found.personalInfo.name : "Teacher";
  };

  // In-Browser Slide Content Update Handler
  const handleSlideContentChange = (field: string, value: any, bulletIndex?: number) => {
    if (!selectedPPTForView) return;

    const updatedSlides = [...selectedPPTForView.slides];
    const currentSlide = { ...updatedSlides[activeSlideIndex] };

    if (field === "title") {
      currentSlide.title = value;
    } else if (field === "speakerNotes") {
      currentSlide.speakerNotes = value;
    } else if (field === "bullet" && bulletIndex !== undefined) {
      const updatedBullets = [...currentSlide.bullets];
      updatedBullets[bulletIndex] = value;
      currentSlide.bullets = updatedBullets;
    }

    updatedSlides[activeSlideIndex] = currentSlide;
    setSelectedPPTForView({
      ...selectedPPTForView,
      slides: updatedSlides,
    });
  };

  // Filtered List
  const displayedPPTs = presentations.filter((ppt) => {
    const matchesProgram =
      selectedFilterProgram === "ALL" || ppt.programId === selectedFilterProgram;
    const matchesSubject =
      selectedFilterSubject === "ALL" || ppt.subjectId === selectedFilterSubject;
    const matchesTeacher =
      selectedFilterTeacher === "ALL" || ppt.teacherId === selectedFilterTeacher;
    const matchesSearch =
      ppt.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ppt.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesSubject && matchesTeacher && matchesSearch;
  });

  // Stats
  const totalPPTs = presentations.length;
  const totalSlidesGenerated = presentations.reduce((acc, curr) => acc + (curr.totalSlides || 0), 0);
  const interdisciplinaryCount = presentations.filter((p) => p.relevanceType === "INDIRECT").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Presentation className="w-6 h-6 text-indigo-600" />
            AI Slide / PPT Creator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Automatically generate, customize, present, and download PowerPoint presentations with AI.
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setErrorMessage(null);
            if (programs.length > 0) setFormProgramId(programs[0].id);
            if (teachers.length > 0) setFormTeacherId(teachers[0].id);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Presentation
        </button>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Decks</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalPPTs}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Presentation className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Slides Created</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{totalSlidesGenerated}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Interdisciplinary</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{interdisciplinaryCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Output File</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">.PPTX Deck</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Program Filter */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Program</label>
            <select
              value={selectedFilterProgram}
              onChange={(e) => setSelectedFilterProgram(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Programs</option>
              {programs.map((prog) => (
                <option key={prog.id} value={prog.id}>{prog.name}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Subject</label>
            <select
              value={selectedFilterSubject}
              onChange={(e) => setSelectedFilterSubject(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>{subj.name}</option>
              ))}
            </select>
          </div>

          {/* Teacher Filter */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Teacher</label>
            <select
              value={selectedFilterTeacher}
              onChange={(e) => setSelectedFilterTeacher(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Teachers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.personalInfo.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search presentation topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ── PRESENTATION CARDS GRID ─────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : displayedPPTs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center space-y-3">
          <Presentation className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800">No Presentations Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Get started by creating your first AI-generated PowerPoint presentation deck.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPPTs.map((ppt) => (
            <div
              key={ppt._id}
              onClick={() => {
                setSelectedPPTForView(ppt);
                setActiveSlideIndex(0);
                setIsEditingSlide(false);
              }}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
            >
              <div className="space-y-3">
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    {ppt.programName}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {ppt.totalSlides} Slides
                  </span>
                </div>

                {/* Topic & Subject */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {ppt.topic}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                    <Book className="w-3.5 h-3.5 text-gray-400" />
                    {ppt.subjectName}
                  </p>
                </div>

                {/* Theme Badge */}
                {ppt.theme && (
                  <div className="flex items-center gap-1.5 text-[11px] text-purple-700 font-medium bg-purple-50 px-2.5 py-1 rounded-md w-fit">
                    <Palette className="w-3 h-3 text-purple-600" />
                    {ppt.theme}
                  </div>
                )}

                {/* First Slide Preview Snippet */}
                <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100 space-y-1">
                  <span className="font-bold text-gray-800 block line-clamp-1">
                    Slide 1: {ppt.slides?.[0]?.title || "Intro"}
                  </span>
                  <p className="text-[11px] text-gray-500 line-clamp-2">
                    {ppt.slides?.[0]?.bullets?.join(" • ")}
                  </p>
                </div>
              </div>

              {/* Footer Bar */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  by {getTeacherName(ppt.teacherId)}
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {/* Direct Download Link */}
                  <a
                    href={ppt.downloadUrl}
                    download
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Download PPTX"
                  >
                    <Download className="w-4 h-4" />
                    PPTX
                  </a>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeletePPT(ppt._id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Presentation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE PPT MODAL ─────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Presentation className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create AI Presentation</h2>
                <p className="text-xs text-gray-500">Generate custom themes, visual prompts, & speaker notes.</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleGenerateSubmit} className="space-y-4">
              {/* Select Teacher */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Select Teacher *</label>
                <select
                  value={formTeacherId}
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.personalInfo.name} ({t.email})</option>
                  ))}
                </select>
              </div>

              {/* Select Program */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Select Program *</label>
                <select
                  value={formProgramId}
                  onChange={(e) => setFormProgramId(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.fullName})</option>
                  ))}
                </select>
              </div>

              {/* Select Subject */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Select Subject *</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  required
                  disabled={filteredSubjects.length === 0}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                >
                  {filteredSubjects.length === 0 ? (
                    <option value="">No subjects found for this program</option>
                  ) : (
                    filteredSubjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Topic Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Presentation Topic *</label>
                <input
                  type="text"
                  placeholder="e.g. Working Principle of Electric Motors, Photosynthesis"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  Select Visual Color Theme *
                </label>
                <select
                  value={formTheme}
                  onChange={(e) => setFormTheme(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                >
                  {PPT_THEMES.map((theme) => (
                    <option key={theme.id} value={theme.id}>{theme.label}</option>
                  ))}
                </select>
              </div>

              {/* Number of Slides & Language */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Number of Slides</label>
                  <select
                    value={formNumSlides}
                    onChange={(e) => setFormNumSlides(Number(e.target.value))}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value={3}>3 Slides (Quick Deck)</option>
                    <option value={5}>5 Slides (Standard)</option>
                    <option value={7}>7 Slides (Detailed)</option>
                    <option value={10}>10 Slides (Comprehensive)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    Output Language
                  </label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Designing PowerPoint Deck...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create PowerPoint Presentation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DETAILED SLIDE-BY-SLIDE CAROUSEL PREVIEW MODAL ────────────────── */}
      {selectedPPTForView && !isFullscreenPresent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedPPTForView(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Details */}
            <div className="border-b border-gray-100 pb-4 pr-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {selectedPPTForView.programName}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {selectedPPTForView.subjectName}
                  </span>
                  {selectedPPTForView.theme && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      {selectedPPTForView.theme}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-gray-900">{selectedPPTForView.topic}</h2>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsFullscreenPresent(true)}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow transition-all"
                >
                  <Maximize2 className="w-4 h-4" />
                  Present Fullscreen
                </button>

                <a
                  href={selectedPPTForView.downloadUrl}
                  download
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download .PPTX
                </a>
              </div>
            </div>

            {/* Interdisciplinary & Board Notes */}
            {selectedPPTForView.interdisciplinaryNote && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <strong>📌 Interdisciplinary Connection:</strong> {selectedPPTForView.interdisciplinaryNote}
              </div>
            )}

            {/* SLIDE CAROUSEL VIEW */}
            {selectedPPTForView.slides && selectedPPTForView.slides.length > 0 && (
              <div className="space-y-4">
                {/* Carousel Navigation Bar */}
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-xl">
                  <button
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="p-2 bg-white rounded-lg text-gray-700 shadow-sm disabled:opacity-30 hover:bg-gray-50 transition-all flex items-center gap-1 text-xs font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <span className="text-xs font-bold text-gray-600">
                    Slide {activeSlideIndex + 1} of {selectedPPTForView.slides.length}
                  </span>

                  <button
                    disabled={activeSlideIndex === selectedPPTForView.slides.length - 1}
                    onClick={() =>
                      setActiveSlideIndex((prev) =>
                        Math.min(selectedPPTForView.slides.length - 1, prev + 1)
                      )
                    }
                    className="p-2 bg-white rounded-lg text-gray-700 shadow-sm disabled:opacity-30 hover:bg-gray-50 transition-all flex items-center gap-1 text-xs font-semibold"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Active Slide Canvas Preview */}
                <div className="bg-slate-900 text-white rounded-2xl p-8 min-h-[320px] shadow-inner flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                        Slide {selectedPPTForView.slides[activeSlideIndex].slideNumber} ({selectedPPTForView.slides[activeSlideIndex].slideType || "BULLET"})
                      </span>

                      <button
                        onClick={() => setIsEditingSlide(!isEditingSlide)}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
                      >
                        {isEditingSlide ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Save Slide
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-3.5 h-3.5" /> Edit Slide Text
                          </>
                        )}
                      </button>
                    </div>

                    {/* Editable Slide Title */}
                    {isEditingSlide ? (
                      <input
                        type="text"
                        value={selectedPPTForView.slides[activeSlideIndex].title}
                        onChange={(e) => handleSlideContentChange("title", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-white">
                        {selectedPPTForView.slides[activeSlideIndex].title}
                      </h3>
                    )}

                    {/* Editable Bullets */}
                    <ul className="space-y-2 pt-2">
                      {selectedPPTForView.slides[activeSlideIndex].bullets?.map((bullet, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-indigo-400 font-bold">•</span>
                          {isEditingSlide ? (
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) =>
                                handleSlideContentChange("bullet", e.target.value, idx)
                              }
                              className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          ) : (
                            <span>{bullet}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Visual Diagram Suggestion */}
                  {selectedPPTForView.slides[activeSlideIndex].visualPrompt && (
                    <div className="mt-6 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-indigo-300">
                      <ImageIcon className="w-4 h-4 shrink-0" />
                      <span>
                        <strong>Visual Suggestion:</strong> {selectedPPTForView.slides[activeSlideIndex].visualPrompt}
                      </span>
                    </div>
                  )}
                </div>

                {/* Speaker Notes Box */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    🗣️ Teacher Speaker Notes
                  </h5>
                  {isEditingSlide ? (
                    <textarea
                      value={selectedPPTForView.slides[activeSlideIndex].speakerNotes || ""}
                      onChange={(e) => handleSlideContentChange("speakerNotes", e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                    />
                  ) : (
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      "{selectedPPTForView.slides[activeSlideIndex].speakerNotes || "No specific speaker notes for this slide."}"
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── INTER-MODULE ECOSYSTEM ACTION FOOTER ── */}
            <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-gray-500">
                Connected AI Teaching Tools:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    navigate("/ai-tools/lesson-plan", {
                      state: { topic: selectedPPTForView.topic },
                    })
                  }
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  Generate Lesson Plan
                </button>

                <button
                  onClick={() =>
                    navigate("/assessments/create", {
                      state: { topic: selectedPPTForView.topic },
                    })
                  }
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Assessment Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FULLSCREEN CLASSROOM PRESENTER MODE MODAL ── */}
      {selectedPPTForView && isFullscreenPresent && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-8 select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded bg-indigo-600 text-white">
                {selectedPPTForView.topic}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Slide {activeSlideIndex + 1} / {selectedPPTForView.slides.length}
              </span>
            </div>

            <button
              onClick={() => setIsFullscreenPresent(false)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Exit Fullscreen (Esc)
            </button>
          </div>

          {/* Main Slide Content Canvas */}
          <div className="max-w-5xl mx-auto w-full my-auto space-y-6">
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest block">
              Slide {selectedPPTForView.slides[activeSlideIndex].slideNumber}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {selectedPPTForView.slides[activeSlideIndex].title}
            </h1>
            <ul className="space-y-4 pt-4">
              {selectedPPTForView.slides[activeSlideIndex].bullets?.map((b, idx) => (
                <li key={idx} className="text-xl md:text-2xl text-slate-200 flex items-start gap-3 leading-relaxed">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Presenter Controls Bar */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="text-xs text-slate-500">
              Use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">←</kbd> and <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">→</kbd> arrow keys to navigate slides.
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                disabled={activeSlideIndex === selectedPPTForView.slides.length - 1}
                onClick={() =>
                  setActiveSlideIndex((prev) =>
                    Math.min(selectedPPTForView.slides.length - 1, prev + 1)
                  )
                }
                className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
