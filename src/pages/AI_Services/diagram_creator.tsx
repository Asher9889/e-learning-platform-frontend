/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Workflow,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  Book,
  AlertTriangle,
  X,
  Loader2,
  User,
  GitBranch,
  Network,

  Code,
  Layout,
  Sparkles,
  Box,

  Printer,
  BookOpenCheck,
  Presentation,
 
} from "lucide-react";

// API Imports from utils/url
import api, { api1 } from "../../utils/url";

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

interface Diagram {
  _id: string;
  programId: string;
  subjectId: string;
  teacherId: string;
  programName: string;
  subjectName: string;
  topic: string;
  diagramType: string;
  title: string;
  mermaidCode: string;
  scene3DData?: any;
  explanation: string[];
  subjectGradeCompatibility: string;
  boardCurriculumDetails: string;
  relevanceType: "DIRECT" | "INDIRECT" | "UNRELATED";
  interdisciplinaryNote?: string;
  curriculumContextNote?: string;
  language: string;
  createdAt: string;
}

// 🟢 LIVE MERMAID VISUAL SVG RENDERER COMPONENT
const LiveMermaidRenderer: React.FC<{ code: string }> = ({ code }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [renderError, setRenderError] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const renderGraph = async () => {
      setIsRendering(true);
      setRenderError(false);

      try {
        if (!(window as any).mermaid) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
          script.async = true;
          document.body.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        const mermaid = (window as any).mermaid;
        if (mermaid) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            securityLevel: "loose",
            mindmap: { padding: 15 },
          });

          const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
          const cleanCode = code.replace(/%%.*$/gm, "").trim();

          const { svg } = await mermaid.render(uniqueId, cleanCode);
          if (isMounted) {
            setSvgContent(svg);
            setIsRendering(false);
          }
        }
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setRenderError(true);
          setIsRendering(false);
        }
      }
    };

    if (code) {
      renderGraph();
    }

    return () => {
      isMounted = false;
    };
  }, [code]);

  if (isRendering) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border border-gray-200">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
        <span className="text-xs text-gray-500 font-medium">Rendering Visual 2D Diagram...</span>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>Visual Rendering Note:</strong> Custom syntax detected. View directly on{" "}
          <a href="https://mermaid.live" target="_blank" rel="noreferrer" className="underline font-bold text-amber-900">
            Mermaid Live Editor
          </a>.
        </div>
      </div>
    );
  }

  return (
    <div
      id="mermaid-canvas-container"
      className="p-6 bg-white border border-gray-200 rounded-xl overflow-x-auto flex justify-center items-center min-h-[320px] shadow-inner"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

// 🔵 THREE.JS 3D CINEMATIC INTERACTIVE CANVAS COMPONENT
const Live3DCanvasRenderer: React.FC<{ sceneData: any }> = ({ sceneData }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);

  useEffect(() => {
    let animationFrameId: number;

    const initThree = async () => {
      setIsRendering(true);

      // Load Three.js from CDN dynamically if not present
      if (!(window as any).THREE) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const THREE = (window as any).THREE;
      if (!THREE || !mountRef.current) return;

      const container = mountRef.current;
      container.innerHTML = ""; // Clear previous canvas

      const width = container.clientWidth || 700;
      const height = 400;

      // 1. Scene, Camera, Renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a); // Dark Slate BG

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 0, 10);

      const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // 2. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x6366f1, 2, 50);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      // 3. Render 3D Nodes & Connections
      const nodeMap = new Map();
      const nodes = sceneData?.nodes || [
        { id: "1", label: "Core Concept", position: [0, 0, 0], color: "#6366f1", size: 1.2 },
        { id: "2", label: "Process A", position: [-3, 2, -1], color: "#06b6d4", size: 0.8 },
        { id: "3", label: "Process B", position: [3, -2, 1], color: "#10b981", size: 0.8 }
      ];

      nodes.forEach((n: any) => {
        const geometry = new THREE.SphereGeometry(n.size || 0.8, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(n.color || "#6366f1"),
          emissive: new THREE.Color(n.color || "#6366f1"),
          emissiveIntensity: 0.3,
          shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(n.position[0], n.position[1], n.position[2]);
        scene.add(mesh);
        nodeMap.set(n.id, mesh.position);
      });

      // Connections Lines
      const connections = sceneData?.connections || [
        { from: "1", to: "2" },
        { from: "1", to: "3" }
      ];

      connections.forEach((conn: any) => {
        const p1 = nodeMap.get(conn.from || conn.from_node);
        const p2 = nodeMap.get(conn.to || conn.to_node);
        if (p1 && p2) {
          const points = [p1, p2];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const lineMat = new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 });
          const line = new THREE.Line(lineGeo, lineMat);
          scene.add(line);
        }
      });

      setIsRendering(false);

      // 4. Animation Loop (Slow Cinematic Camera Rotation)
      let angle = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        angle += 0.005;
        camera.position.x = 10 * Math.sin(angle);
        camera.position.z = 10 * Math.cos(angle);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();
    };

    initThree();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [sceneData]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {isRendering && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-xs text-indigo-400 gap-2 z-10">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading 3D WebGL Engine...
        </div>
      )}
      <div ref={mountRef} className="w-full h-[400px] bg-slate-950 cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg text-[11px] text-slate-300 border border-slate-700 flex items-center gap-2">
        <Box className="w-3.5 h-3.5 text-indigo-400" />
        <span>Interactive 3D WebGL Canvas (360° Cinematic Auto-Orbit)</span>
      </div>
    </div>
  );
};

export default function DiagramCreatorPage() {
  const navigate = useNavigate();

  // Data States
  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI Filter States
  const [selectedFilterProgram, setSelectedFilterProgram] = useState<string>("ALL");
  const [selectedFilterSubject, setSelectedFilterSubject] = useState<string>("ALL");
  const [selectedFilterTeacher, setSelectedFilterTeacher] = useState<string>("ALL");
  const [selectedFilterType, setSelectedFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal & View Mode States
  const [isCreateModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDiagramForView, setSelectedDiagramForView] = useState<Diagram | null>(null);
  const [activeTab, setActiveTab] = useState<"VISUAL_2D" | "VISUAL_3D" | "CODE">("VISUAL_2D");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [liveMermaidCode, setLiveMermaidCode] = useState<string>("");

  // Form Generate States
  const [formProgramId, setFormProgramId] = useState<string>("");
  const [formSubjectId, setFormSubjectId] = useState<string>("");
  const [formTeacherId, setFormTeacherId] = useState<string>("");
  const [formTopic, setFormTopic] = useState<string>("");
  const [formDiagramType, setFormDiagramType] = useState<string>("mindmap");
  const [formLanguage, setFormLanguage] = useState<string>("English");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Load Metadata
  useEffect(() => {
    const fetchMetadataAndDiagrams = async () => {
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

        await fetchSavedDiagrams();
      } catch (err: any) {
        console.error("Error loading metadata:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadataAndDiagrams();
  }, []);

  // 2. Fetch Saved Diagrams
  const fetchSavedDiagrams = async () => {
    try {
      const res: any = await api.get("/diagram/list");
      const list = res?.diagrams || res?.data?.diagrams || [];
      setDiagrams(list);
    } catch (err: any) {
      console.error("Error fetching AI Diagrams:", err?.message || err);
    }
  };

  // 3. Filter Form Subjects
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

  // Sync Live Editor code when opening view modal
  useEffect(() => {
    if (selectedDiagramForView) {
      setLiveMermaidCode(selectedDiagramForView.mermaidCode);
    }
  }, [selectedDiagramForView]);

  // 4. Handle Form Submit -> Generate AI Diagram
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
        diagramType: formDiagramType,
        language: formLanguage,
      };

      const res: any = await api.post("/diagram/generate", payload);
      const newDiagram = res?.data || res;

      if (newDiagram) {
        await fetchSavedDiagrams();
        setIsModalOpen(false);
        setFormTopic("");
        setSelectedDiagramForView(newDiagram);
        setActiveTab("VISUAL_2D");
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setErrorMessage(err.message || "Failed to generate diagram. Check topic relevance.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. Delete Diagram
  const handleDeleteDiagram = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this AI Diagram?")) return;

    try {
      await api.delete(`/diagram/${id}`);
      setDiagrams((prev) => prev.filter((d) => d._id !== id));
      if (selectedDiagramForView?._id === id) setSelectedDiagramForView(null);
    } catch (err: any) {
      console.error("Error deleting diagram:", err?.message || err);
      alert(err.message || "Failed to delete diagram.");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getTeacherName = (tId: string) => {
    const found = teachers.find((t) => t.id === tId);
    return found ? found.personalInfo.name : "Teacher";
  };

  // Filtered List
  const displayedDiagrams = diagrams.filter((diag) => {
    const matchesProgram =
      selectedFilterProgram === "ALL" || diag.programId === selectedFilterProgram;
    const matchesSubject =
      selectedFilterSubject === "ALL" || diag.subjectId === selectedFilterSubject;
    const matchesTeacher =
      selectedFilterTeacher === "ALL" || diag.teacherId === selectedFilterTeacher;
    const matchesType =
      selectedFilterType === "ALL" || diag.diagramType === selectedFilterType;
    const matchesSearch =
      diag.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diag.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesSubject && matchesTeacher && matchesType && matchesSearch;
  });

  // Stats
  const totalDiagrams = diagrams.length;
  const flowchartsCount = diagrams.filter((d) => d.diagramType === "flowchart").length;
  const mindmapsCount = diagrams.filter((d) => d.diagramType === "mindmap").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Workflow className="w-6 h-6 text-indigo-600" />
            AI Diagram & Flowchart Creator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate 2D Flowcharts, Mindmaps, and 3D WebGL Interactive Diagrams with AI.
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
          Create Diagram
        </button>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Diagrams</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalDiagrams}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Workflow className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Flowcharts</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{flowchartsCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <GitBranch className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mindmaps</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{mindmapsCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Network className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">3D WebGL Engine</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">Three.js</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Box className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Diagram Style</label>
            <select
              value={selectedFilterType}
              onChange={(e) => setSelectedFilterType(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Styles</option>
              <option value="flowchart">Flowchart</option>
              <option value="mindmap">Mindmap</option>
              <option value="sequence">Sequence Diagram</option>
              <option value="3d_mindmap">3D WebGL Mindmap</option>
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search topic or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ── DIAGRAM CARDS GRID ─────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : displayedDiagrams.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center space-y-3">
          <Workflow className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800">No Diagrams Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Get started by creating your first AI-generated 2D flowchart or 3D WebGL mindmap.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDiagrams.map((diag) => (
            <div
              key={diag._id}
              onClick={() => {
                setSelectedDiagramForView(diag);
                setActiveTab("VISUAL_2D");
              }}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    {diag.programName}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 uppercase flex items-center gap-1">
                    {diag.diagramType.includes("3d") && <Box className="w-3 h-3 text-purple-600" />}
                    {diag.diagramType}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {diag.title || diag.topic}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                    <Book className="w-3.5 h-3.5 text-gray-400" />
                    {diag.subjectName}
                  </p>
                </div>

                <div className="p-3 bg-slate-900 text-slate-300 rounded-lg text-[11px] font-mono line-clamp-3 leading-relaxed">
                  {diag.mermaidCode}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  by {getTeacherName(diag.teacherId)}
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleCopyCode(diag.mermaidCode)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Copy Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Code
                  </button>

                  <button
                    onClick={(e) => handleDeleteDiagram(diag._id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Diagram"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE DIAGRAM MODAL ─────────────────────── */}
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
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create AI Diagram</h2>
                <p className="text-xs text-gray-500">2D Mermaid Graphs & 3D Interactive WebGL Models.</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleGenerateSubmit} className="space-y-4">
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

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Diagram Topic *</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanism of Drug Absorption, Electric Motor Circuit"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Diagram Engine & Style</label>
                  <select
                    value={formDiagramType}
                    onChange={(e) => setFormDiagramType(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  >
                    <option value="mindmap">2D Mindmap (Tree Graph)</option>
                    <option value="flowchart">2D Flowchart (Step Process)</option>
                    <option value="sequence">2D Sequence Diagram</option>
                    <option value="3d_mindmap">🌌 3D WebGL Mindmap (Three.js)</option>
                    <option value="3d_flow_network">🌌 3D WebGL Flow Network (Three.js)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Hinglish">Hinglish</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Rendering AI Diagram & 3D Scene...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate AI Diagram
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DETAILED DIAGRAM VIEW MODAL (2D GRAPH, 3D WEBGL & LIVE EDITOR) ────────────────── */}
      {selectedDiagramForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-6 print:p-0 print:shadow-none">
            <button
              onClick={() => setSelectedDiagramForView(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Details */}
            <div className="border-b border-gray-100 pb-4 pr-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {selectedDiagramForView.programName}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {selectedDiagramForView.subjectName}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 uppercase flex items-center gap-1">
                    <Box className="w-3 h-3 text-purple-600" />
                    {selectedDiagramForView.diagramType}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-gray-900">{selectedDiagramForView.title || selectedDiagramForView.topic}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Teacher: <strong>{getTeacherName(selectedDiagramForView.teacherId)}</strong>
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Sheet
                </button>

                <button
                  onClick={() => handleCopyCode(liveMermaidCode)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow transition-all"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>

            {/* Interdisciplinary Note */}
            {selectedDiagramForView.interdisciplinaryNote && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <strong>📌 Interdisciplinary Connection:</strong> {selectedDiagramForView.interdisciplinaryNote}
              </div>
            )}

            {/* TOGGLE TABS: 2D MERMAID GRAPH, 3D WEBGL, LIVE EDITOR */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 print:hidden">
              <button
                onClick={() => setActiveTab("VISUAL_2D")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "VISUAL_2D"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Layout className="w-4 h-4" />
                2D Visual Graph
              </button>

              <button
                onClick={() => setActiveTab("VISUAL_3D")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "VISUAL_3D"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Box className="w-4 h-4" />
                3D Interactive WebGL Scene
              </button>

              <button
                onClick={() => setActiveTab("CODE")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "CODE"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Code className="w-4 h-4" />
                Live Code Editor
              </button>
            </div>

            {/* TAB CONTENT 1: 2D MERMAID GRAPH */}
            {activeTab === "VISUAL_2D" && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  2D Interactive SVG Graph
                </h4>
                <LiveMermaidRenderer code={liveMermaidCode} />
              </div>
            )}

            {/* TAB CONTENT 2: 3D THREE.JS WEBGL CANVAS */}
            {activeTab === "VISUAL_3D" && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  3D Cinematic Animated WebGL Scene
                </h4>
                <Live3DCanvasRenderer sceneData={selectedDiagramForView.scene3DData} />
              </div>
            )}

            {/* TAB CONTENT 3: LIVE MERMAID CODE EDITOR */}
            {activeTab === "CODE" && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Live Mermaid.js Code Editor</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">⚡ Hot-reloads 2D graph instantly</span>
                </h4>
                <textarea
                  value={liveMermaidCode}
                  onChange={(e) => setLiveMermaidCode(e.target.value)}
                  className="w-full h-48 p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-800 leading-relaxed"
                />
              </div>
            )}

            {/* STEP-BY-STEP EXPLANATION */}
            {selectedDiagramForView.explanation && selectedDiagramForView.explanation.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Step-by-Step Diagram Explanation</h4>
                <div className="space-y-2">
                  {selectedDiagramForView.explanation.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-xs border border-gray-100">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
                        Step {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── INTER-MODULE ECOSYSTEM ACTION FOOTER ── */}
            <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <span className="text-xs font-semibold text-gray-500">Connected AI Modules:</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    navigate("/ai-tools/lesson-plan", {
                      state: { topic: selectedDiagramForView.topic },
                    })
                  }
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  Generate Lesson Plan
                </button>

                <button
                  onClick={() =>
                    navigate("/ai-tools/ppt-creator", {
                      state: { topic: selectedDiagramForView.topic },
                    })
                  }
                  className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors"
                >
                  <Presentation className="w-4 h-4" />
                  Create Presentation PPT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
