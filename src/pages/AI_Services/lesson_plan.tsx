/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Search,
  BookOpen,
  Clock,
  Trash2,
  Book,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  FileText,
  User,
  Globe,
  Printer,
  Presentation,
  Brain,
  Users2,
  Lightbulb,
  Workflow,
  HelpCircle
} from "lucide-react";

// Central Interceptor-enabled API Imports from utils/url
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

const PEDAGOGY_MODELS = [
  { id: "5E Model", label: "5E Model (Engage, Explore, Explain, Elaborate, Evaluate)" },
  { id: "Bloom's Taxonomy", label: "Bloom's Taxonomy (Cognitive Levels Focus)" },
  { id: "NEP 2020 Experiential", label: "NEP 2020 Experiential & Toy-Based Pedagogy" },
  { id: "Traditional Hunter", label: "Direct Instruction (Madeline Hunter Model)" },
];

// Interfaces
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

interface TimelineStep {
  time: string;
  activity: string;
}

interface DifferentiatedInstruction {
  strugglingLearners?: string;
  giftedLearners?: string;
  specialNeedsOrVisual?: string;
}

interface LessonPlan {
  _id: string;
  programId: string;
  subjectId: string;
  teacherId: string;
  programName: string;
  subjectName: string;
  topic: string;
  subjectGradeCompatibility: string;
  boardCurriculumDetails: string;
  relevanceType: "DIRECT" | "INDIRECT" | "UNRELATED";
  interdisciplinaryNote?: string;
  curriculumContextNote?: string;
  durationMinutes: number;
  language: string;
  pedagogyFramework?: string;
  bloomsTaxonomyFocus?: string[];
  learningObjectives: string[];
  materialsNeeded: string[];
  differentiatedInstruction?: DifferentiatedInstruction;
  teachingStrategy: string;
  timeline: TimelineStep[];
  classActivities: string[];
  assessmentQuestions: string[];
  createdAt: string;
}

export default function LessonPlanGeneratorPage() {
  const navigate = useNavigate();

  // Data States
  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI Filter States
  const [selectedFilterProgram, setSelectedFilterProgram] = useState<string>("ALL");
  const [selectedFilterSubject, setSelectedFilterSubject] = useState<string>("ALL");
  const [selectedFilterTeacher, setSelectedFilterTeacher] = useState<string>("ALL");
  const [selectedFilterLanguage, setSelectedFilterLanguage] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal States
  const [isCreateModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPlanForView, setSelectedPlanForView] = useState<LessonPlan | null>(null);

  // Form Generate States
  const [formProgramId, setFormProgramId] = useState<string>("");
  const [formSubjectId, setFormSubjectId] = useState<string>("");
  const [formTeacherId, setFormTeacherId] = useState<string>("");
  const [formTopic, setFormTopic] = useState<string>("");
  const [formDuration, setFormDuration] = useState<number>(40);
  const [formLanguage, setFormLanguage] = useState<string>("English");
  const [formPedagogy, setFormPedagogy] = useState<string>("5E Model");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Load Metadata
  useEffect(() => {
    const fetchMetadataAndPlans = async () => {
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

        await fetchSavedLessonPlans();
      } catch (err: any) {
        console.error("Error loading metadata:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadataAndPlans();
  }, []);

  // 2. Fetch Lesson Plans
  const fetchSavedLessonPlans = async () => {
    try {
      const res: any = await api.get("/lesson-plan/list");
      const plans = res?.lessonPlans || res?.data?.lessonPlans || [];
      setLessonPlans(plans);
    } catch (err: any) {
      console.error("Error fetching AI Lesson Plans:", err?.message || err);
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

  // 4. Handle Form Submit -> Generate AI Lesson Plan
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
        duration: Number(formDuration),
        language: formLanguage,
        pedagogyFramework: formPedagogy,
      };

      const newPlan: any = await api.post("/lesson-plan/generate", payload);

      if (newPlan) {
        await fetchSavedLessonPlans();
        setIsModalOpen(false);
        setFormTopic("");
        setSelectedPlanForView(newPlan);
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setErrorMessage(err.message || "Failed to generate lesson plan. Check topic relevance.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. Delete Lesson Plan
  const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this AI Lesson Plan?")) return;

    try {
      await api.delete(`/lesson-plan/${id}`);
      setLessonPlans((prev) => prev.filter((plan) => plan._id !== id));
      if (selectedPlanForView?._id === id) setSelectedPlanForView(null);
    } catch (err: any) {
      console.error("Error deleting plan:", err?.message || err);
      alert(err.message || "Failed to delete lesson plan.");
    }
  };

  const getTeacherName = (tId: string) => {
    const found = teachers.find((t) => t.id === tId);
    return found ? found.personalInfo.name : "Teacher";
  };

  // Print Window Trigger
  const handlePrintPlan = () => {
    window.print();
  };

  // Displayed Filtered Plans
  const displayedPlans = lessonPlans.filter((plan) => {
    const matchesProgram =
      selectedFilterProgram === "ALL" || plan.programId === selectedFilterProgram;
    const matchesSubject =
      selectedFilterSubject === "ALL" || plan.subjectId === selectedFilterSubject;
    const matchesTeacher =
      selectedFilterTeacher === "ALL" || plan.teacherId === selectedFilterTeacher;
    const matchesLanguage =
      selectedFilterLanguage === "ALL" || plan.language === selectedFilterLanguage;
    const matchesSearch =
      plan.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesSubject && matchesTeacher && matchesLanguage && matchesSearch;
  });

  const totalPlans = lessonPlans.length;
  const directPlansCount = lessonPlans.filter((p) => p.relevanceType === "DIRECT").length;
  const indirectPlansCount = lessonPlans.filter((p) => p.relevanceType === "INDIRECT").length;
  const totalMinutes = lessonPlans.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            AI Lesson Plan Generator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate pedagogical, inclusive, and curriculum-aligned lesson plans with AI.
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
          Generate Lesson Plan
        </button>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Lesson Plans</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalPlans}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Standard Plans</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{directPlansCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Interdisciplinary</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{indirectPlansCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Teaching Time</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalMinutes} Mins</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-6 h-6" />
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

          {/* Language Filter */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Language</label>
            <select
              value={selectedFilterLanguage}
              onChange={(e) => setSelectedFilterLanguage(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Languages</option>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search topic or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ── LESSON PLAN CARDS GRID ─────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : displayedPlans.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800">No Lesson Plans Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Get started by creating your first AI-generated lesson plan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPlans.map((plan) => (
            <div
              key={plan._id}
              onClick={() => setSelectedPlanForView(plan)}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
            >
              <div className="space-y-3">
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    {plan.programName}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      plan.relevanceType === "INDIRECT"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {plan.relevanceType === "INDIRECT" ? "Interdisciplinary" : "Standard"}
                  </span>
                </div>

                {/* Topic & Subject */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {plan.topic}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                    <Book className="w-3.5 h-3.5 text-gray-400" />
                    {plan.subjectName}
                  </p>
                </div>

                {/* Pedagogy Badge */}
                {plan.pedagogyFramework && (
                  <div className="flex items-center gap-1.5 text-[11px] text-purple-700 font-medium bg-purple-50 px-2.5 py-1 rounded-md w-fit">
                    <Workflow className="w-3 h-3 text-purple-600" />
                    {plan.pedagogyFramework}
                  </div>
                )}

                {/* Strategy Summary */}
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {plan.teachingStrategy}
                </p>
              </div>

              {/* Footer Bar */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  by {getTeacherName(plan.teacherId)}
                </span>
                <span className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                  <Globe className="w-3 h-3" />
                  {plan.language}
                </span>
                <button
                  onClick={(e) => handleDeletePlan(plan._id, e)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GENERATE LESSON PLAN MODAL ─────────────────────── */}
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
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Generate AI Lesson Plan</h2>
                <p className="text-xs text-gray-500">Tailored with pedagogy frameworks & inclusion strategies.</p>
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
                <label className="text-xs font-semibold text-gray-700 block mb-1">Topic Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Newton's Laws of Motion, Photosynthesis, Ohm's Law"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Pedagogical Model Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <Workflow className="w-3.5 h-3.5 text-indigo-600" />
                  Pedagogy Framework *
                </label>
                <select
                  value={formPedagogy}
                  onChange={(e) => setFormPedagogy(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                >
                  {PEDAGOGY_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>{model.label}</option>
                  ))}
                </select>
              </div>

              {/* Select Language Dropdown */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  Select Output Language *
                </label>
                <select
                  value={formLanguage}
                  onChange={(e) => setFormLanguage(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
              </div>

              {/* Duration Mins */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={formDuration}
                  onChange={(e) => setFormDuration(Number(e.target.value))}
                  min={10}
                  max={180}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
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
                      Generating AI Lesson Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate AI Lesson Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DETAILED LESSON PLAN VIEW MODAL ────────────────── */}
      {selectedPlanForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-6 print:p-0 print:shadow-none print:max-h-none print:static">
            <button
              onClick={() => setSelectedPlanForView(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Details */}
            <div className="border-b border-gray-100 pb-4 pr-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {selectedPlanForView.programName}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {selectedPlanForView.subjectName}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 flex items-center gap-1">
                  <Workflow className="w-3 h-3" />
                  {selectedPlanForView.pedagogyFramework || "5E Model"}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                  🌐 {selectedPlanForView.language}
                </span>
              </div>
              <h2 className="text-2xl font-black text-gray-900">{selectedPlanForView.topic}</h2>
              <p className="text-xs text-gray-500 mt-1">
                Teacher: <strong>{getTeacherName(selectedPlanForView.teacherId)}</strong> | Duration: <strong>{selectedPlanForView.durationMinutes} Mins</strong>
              </p>
            </div>

            {/* Bloom's Taxonomy Focus Badges */}
            {selectedPlanForView.bloomsTaxonomyFocus && selectedPlanForView.bloomsTaxonomyFocus.length > 0 && (
              <div className="flex items-center gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                <Brain className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-xs font-semibold text-purple-900">Bloom's Cognitive Focus:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlanForView.bloomsTaxonomyFocus.map((bloom, idx) => (
                    <span key={idx} className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {bloom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interdisciplinary & Board Notes */}
            {selectedPlanForView.interdisciplinaryNote && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <strong>📌 Interdisciplinary Connection:</strong> {selectedPlanForView.interdisciplinaryNote}
              </div>
            )}

            {selectedPlanForView.curriculumContextNote && (
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800">
                <strong>💡 Board & Stream Context:</strong> {selectedPlanForView.curriculumContextNote}
              </div>
            )}

            {/* Teaching Strategy */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-1">Teaching Strategy</h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                {selectedPlanForView.teachingStrategy}
              </p>
            </div>

            {/* Learning Objectives */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-2">Learning Objectives</h4>
              <ul className="space-y-1.5">
                {selectedPlanForView.learningObjectives.map((obj, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Differentiated Instruction (IEP & Inclusive Education) */}
            {selectedPlanForView.differentiatedInstruction && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users2 className="w-4 h-4 text-slate-600" />
                  Differentiated Instruction (Inclusive Learning)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-semibold text-amber-700 mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Struggling Learners
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedPlanForView.differentiatedInstruction.strugglingLearners || "Provide guided hints and scaffolding."}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Gifted Learners
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedPlanForView.differentiatedInstruction.giftedLearners || "Assign extension challenges and research."}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> Special Needs / Visual
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedPlanForView.differentiatedInstruction.specialNeedsOrVisual || "Use tactile zero-cost models and visual diagrams."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Breakdown */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-2">Classroom Timeline Breakdown</h4>
              <div className="space-y-2">
                {selectedPlanForView.timeline.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg text-xs border border-gray-100">
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded shrink-0">
                      {step.time}
                    </span>
                    <span className="text-gray-700">{step.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Activities */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-2">Classroom Activities</h4>
              <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                {selectedPlanForView.classActivities.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            {/* Assessment Questions */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-2">Assessment Questions</h4>
              <ol className="list-decimal pl-5 text-xs text-gray-700 space-y-1 font-medium">
                {selectedPlanForView.assessmentQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>

            {/* ── ACTION FOOTER BAR (Print + Inter-Module Navigation) ── */}
            <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <button
                onClick={handlePrintPlan}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print / Export PDF
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    navigate("/ai-tools/ppt-creator", {
                      state: {
                        topic: selectedPlanForView.topic,
                        lessonPlanId: selectedPlanForView._id,
                      },
                    })
                  }
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors"
                >
                  <Presentation className="w-4 h-4" />
                  Create PPT from Plan
                </button>

                <button
                  onClick={() =>
                    navigate("/assessments/create", {
                      state: {
                        topic: selectedPlanForView.topic,
                        questions: selectedPlanForView.assessmentQuestions,
                      },
                    })
                  }
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Assessment Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
