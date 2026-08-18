/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  FileText,
  User,
  Box,
  Sparkles,
  GraduationCap,
  Download,
  ExternalLink,
  BookOpen,
  Globe,
  Clock,
  Brain,
  BookOpenCheck,
  Presentation,
  HelpCircle,
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

const BOARDS_LIST = ["CBSE", "NCERT", "UP Board", "ICSE", "State Board"];

interface Program { id: string; name: string; fullName: string; }
interface Subject { id: string; name: string; program: { id: string; name: string }; }
interface Teacher { id: string; email: string; personalInfo: { name: string } }

interface WorksheetQuestion {
  question: string;
  difficulty: string;
  marks: number;
}

interface CurriculumMapping {
  _id: string;
  board: string;
  programId: string;
  subjectId: string;
  teacherId: string;
  programName: string;
  subjectName: string;
  topic: string;
  curriculumChapterName: string;
  learningOutcomeCode?: string;
  bloomsTaxonomyFocus?: string[];
  estimatedPeriods?: string;
  prerequisites?: string[];
  commonMisconceptions?: string[];
  learningOutcomes: string[];
  recommended3DModels: string[];
  suggestedActivities: string[];
  worksheetQuestions: WorksheetQuestion[];
  downloadPdfUrl?: string;
  boardCurriculumDetails?: string;
  interdisciplinaryNote?: string;
  createdAt: string;
}

export default function CurriculumMappingPage() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [mappings, setMappings] = useState<CurriculumMapping[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedFilterBoard, setSelectedFilterBoard] = useState<string>("ALL");
  const [selectedFilterProgram, setSelectedFilterProgram] = useState<string>("ALL");
  const [selectedFilterSubject, setSelectedFilterSubject] = useState<string>("ALL");
  const [selectedFilterTeacher, setSelectedFilterTeacher] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal
  const [isMapModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMappingForView, setSelectedMappingForView] = useState<CurriculumMapping | null>(null);

  // Form States
  const [formBoard, setFormBoard] = useState<string>("CBSE");
  const [formProgramId, setFormProgramId] = useState<string>("");
  const [formSubjectId, setFormSubjectId] = useState<string>("");
  const [formTeacherId, setFormTeacherId] = useState<string>("");
  const [formTopic, setFormTopic] = useState<string>("");
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

        await fetchSavedMappings();
      } catch (err) {
        console.error("Error loading metadata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  // 2. Fetch Saved Mappings
  const fetchSavedMappings = async () => {
    try {
      const res: any = await api.get("/curriculum/list");
      const list = res?.curriculumMappings || res?.data?.curriculumMappings || [];
      setMappings(list);
    } catch (err) {
      console.error("Error fetching Curriculum Mappings:", err);
    }
  };

  // 3. Filter Form Subjects based on selected Program
  useEffect(() => {
    if (formProgramId) {
      const filtered = subjects.filter((s) => s.program?.id === formProgramId);
      setFilteredSubjects(filtered);
      if (filtered.length > 0) setFormSubjectId(filtered[0].id);
    } else {
      setFilteredSubjects(subjects);
    }
  }, [formProgramId, subjects]);

  // 4. Handle Form Submit with Error Alert Support
  const handleMapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProgramId || !formSubjectId || !formTeacherId || !formTopic) {
      setErrorMessage("Please select Board, Program, Subject, Teacher, and enter a Topic.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const payload = {
        board: formBoard,
        programId: formProgramId,
        subjectId: formSubjectId,
        teacherId: formTeacherId,
        topic: formTopic,
        language: formLanguage,
      };

      const res: any = await api.post("/curriculum/map-topic", payload);
      const newMapping = res?.data || res;

      if (newMapping) {
        await fetchSavedMappings();
        setIsModalOpen(false);
        setFormTopic("");
        setSelectedMappingForView(newMapping);
      }
    } catch (err: any) {
      console.error("Curriculum Mapping Error:", err);
      setErrorMessage(err.message || "Failed to map topic. Check topic-subject domain relevance.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Delete Curriculum Mapping
  const handleDeleteMapping = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this Curriculum Mapping & PDF Report?")) return;

    try {
      await api.delete(`/curriculum/${id}`);
      setMappings((prev) => prev.filter((m) => m._id !== id));
      if (selectedMappingForView?._id === id) setSelectedMappingForView(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete curriculum mapping.");
    }
  };

  const handleLaunch3DSimulation = (modelName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${modelName} interactive 3D simulation phet`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };

  const getTeacherName = (tId?: string) => {
    if (!tId) return "Teacher";
    const found = teachers.find((t) => t.id === tId);
    return found ? found.personalInfo.name : "Teacher";
  };

  // Filtered List
  const displayedMappings = mappings.filter((m) => {
    const matchesBoard = selectedFilterBoard === "ALL" || m.board === selectedFilterBoard;
    const matchesProgram = selectedFilterProgram === "ALL" || m.programId === selectedFilterProgram;
    const matchesSubject = selectedFilterSubject === "ALL" || m.subjectId === selectedFilterSubject;
    const matchesTeacher = selectedFilterTeacher === "ALL" || m.teacherId === selectedFilterTeacher;
    const matchesSearch =
      m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.curriculumChapterName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBoard && matchesProgram && matchesSubject && matchesTeacher && matchesSearch;
  });

  const totalMappings = mappings.length;
  const cbseCount = mappings.filter((m) => m.board === "CBSE" || m.board === "NCERT").length;
  const modelsCount = mappings.reduce((acc, curr) => acc + (curr.recommended3DModels?.length || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600" />
            Smart Curriculum & Syllabus Mapping Engine
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Map topics to NCERT/CBSE LO Codes, pacing periods, Bloom's focus, & 3D models.
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
          Map New Topic
        </button>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Mappings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalMappings}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">CBSE / NCERT Mappings</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{cbseCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">3D Models Suggested</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{modelsCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Box className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Competency Codes</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">NEP 2020</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Board</label>
            <select
              value={selectedFilterBoard}
              onChange={(e) => setSelectedFilterBoard(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none font-medium"
            >
              <option value="ALL">All Boards</option>
              {BOARDS_LIST.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

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
            placeholder="Search topic or chapter..."
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
      ) : displayedMappings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center space-y-3">
          <Compass className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800">No Curriculum Mappings Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Get started by mapping your first topic against official board curriculum standards.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMappings.map((m) => (
            <div
              key={m._id}
              onClick={() => setSelectedMappingForView(m)}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-600 text-white">
                    {m.board}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {m.learningOutcomeCode || "LO-STANDARD"}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {m.topic}
                  </h3>
                  <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5 mt-1 line-clamp-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Chapter: {m.curriculumChapterName}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {m.estimatedPeriods || "3-4 Periods"}
                  </span>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    📝 {m.worksheetQuestions?.length || 0} Worksheet Qs
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  by {getTeacherName(m.teacherId)}
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {m.downloadPdfUrl && (
                    <a
                      href={m.downloadPdfUrl}
                      download
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 text-xs font-bold"
                    >
                      <Download className="w-4 h-4" /> Report
                    </a>
                  )}

                  <button
                    onClick={(e) => handleDeleteMapping(m._id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MAP NEW TOPIC MODAL */}
      {isMapModalOpen && (
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
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Map Curriculum Topic</h2>
                <p className="text-xs text-gray-500">LO Codes, Bloom's focus, pacing periods, & 3D models.</p>
              </div>
            </div>

            {/* DOMAIN VALIDATION ERROR ALERT */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleMapSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Select Education Board *</label>
                <select
                  value={formBoard}
                  onChange={(e) => setFormBoard(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 font-bold"
                >
                  {BOARDS_LIST.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
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
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Program *</label>
                  <select
                    value={formProgramId}
                    onChange={(e) => setFormProgramId(e.target.value)}
                    required
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800"
                  >
                    <option value="">Select Program</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Subject *</label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    required
                    disabled={filteredSubjects.length === 0}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 disabled:opacity-50"
                  >
                    {filteredSubjects.length === 0 ? (
                      <option value="">No subjects found</option>
                    ) : (
                      filteredSubjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Topic Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Light Reflection and Refraction"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800"
                />
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
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking Domain & LO Codes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Map Topic & Generate Package
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED VIEW MODAL */}
      {selectedMappingForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedMappingForView(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Details */}
            <div className="border-b border-gray-100 pb-4 pr-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-600 text-white">
                    {selectedMappingForView.board} Board
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    LO: {selectedMappingForView.learningOutcomeCode || "LO-STANDARD"}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {selectedMappingForView.programName} ({selectedMappingForView.subjectName})
                  </span>
                </div>
                <h2 className="text-2xl font-black text-gray-900">{selectedMappingForView.topic}</h2>
                <p className="text-sm font-semibold text-indigo-600 mt-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Mapped Chapter: {selectedMappingForView.curriculumChapterName}
                </p>
              </div>

              {selectedMappingForView.downloadPdfUrl && (
                <a
                  href={selectedMappingForView.downloadPdfUrl}
                  download
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download Report PDF
                </a>
              )}
            </div>

            {/* Bloom's Focus & Pacing Estimator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs">
                <p className="font-bold text-purple-900 flex items-center gap-1 mb-1">
                  <Brain className="w-4 h-4 text-purple-600" /> Bloom's Cognitive Focus:
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedMappingForView.bloomsTaxonomyFocus?.map((b, i) => (
                    <span key={i} className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs">
                <p className="font-bold text-indigo-900 flex items-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-indigo-600" /> Class Pacing Estimator:
                </p>
                <p className="text-indigo-800 font-semibold">{selectedMappingForView.estimatedPeriods || "4 Periods Total"}</p>
              </div>
            </div>

            {/* Prerequisites */}
            {selectedMappingForView.prerequisites && selectedMappingForView.prerequisites.length > 0 && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <strong>📌 Required Prerequisite Knowledge:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  {selectedMappingForView.prerequisites.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended 3D Interactive Models */}
            {selectedMappingForView.recommended3DModels && selectedMappingForView.recommended3DModels.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-amber-600" />
                  Recommended 3D Models & Interactive Visual Simulations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedMappingForView.recommended3DModels.map((model, i) => (
                    <div
                      key={i}
                      className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{model}</span>
                      </div>

                      <button
                        onClick={(e) => handleLaunch3DSimulation(model, e)}
                        className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0"
                      >
                        Launch <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Outcomes */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-2">Official Learning Outcomes</h4>
              <ul className="space-y-1.5">
                {selectedMappingForView.learningOutcomes?.map((outcome, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Worksheet Questions */}
            {selectedMappingForView.worksheetQuestions && (
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Board Exam Pattern Worksheet Questions
                </h4>
                <div className="space-y-2">
                  {selectedMappingForView.worksheetQuestions.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-gray-800">{i + 1}. {q.question}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] font-bold">
                          {q.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[10px] font-bold">
                          {q.marks} Marks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ecosystem Action Shortcuts Footer */}
            <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-gray-500">Connected AI Tools:</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    navigate("/ai-tools/lesson-plan", {
                      state: { topic: selectedMappingForView.topic },
                    })
                  }
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                >
                  <BookOpenCheck className="w-4 h-4" /> Lesson Plan
                </button>

                <button
                  onClick={() =>
                    navigate("/ai-tools/ppt-creator", {
                      state: { topic: selectedMappingForView.topic },
                    })
                  }
                  className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                >
                  <Presentation className="w-4 h-4" /> Create PPT
                </button>

                <button
                  onClick={() =>
                    navigate("/assessments/create", {
                      state: { topic: selectedMappingForView.topic },
                    })
                  }
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                >
                  <HelpCircle className="w-4 h-4" /> Test Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
