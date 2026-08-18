/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  Sparkles,
  Loader2,
  X,
  
  Globe,
 
} from "lucide-react";

// API Import from utils/url (Uses Python AI Backend api instance)
import api from "../../utils/url";

// Languages List
const LANGUAGES_LIST = [
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
  { code: "Spanish", label: "Spanish (Español)" },
  { code: "French", label: "French (Français)" },
];

// Preset Educational Chips for Fast Translation
const PRESET_CHIPS = [
  "Photosynthesis is the process used by plants to convert sunlight into energy.",
  "Newton's First Law states an object at rest stays at rest unless acted upon by force.",
  "Please complete questions 1 to 5 for homework before tomorrow's class session.",
];

export default function MultilingualTranslationPage() {
  const [sourceLanguage, setSourceLanguage] = useState<string>("English");
  const [targetLanguage, setTargetLanguage] = useState<string>("Hindi");
  const [sourceText, setSourceText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // 1. Handle Language Swap (Swaps Languages AND Text!)
  const handleSwapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);

    if (translatedText) {
      const tempText = sourceText;
      setSourceText(translatedText);
      setTranslatedText(tempText);
    }
  };

  // 2. Handle AI Translation Submit
  const handleTranslateSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sourceText.trim()) return;

    setIsTranslating(true);

    try {
      const res: any = await api.post("/translation/translate", {
        text: sourceText,
        targetLanguage,
        sourceLanguage,
      });

      const result = res?.data || res;
      if (result && result.translatedText) {
        setTranslatedText(result.translatedText);
      }
    } catch (err: any) {
      console.error("Translation Error:", err);
      alert(err.message || "Failed to translate text.");
    } finally {
      setIsTranslating(false);
    }
  };

  // 3. Text-to-Speech (Audio Voice Speaker)
  const handleSpeakText = (textToSpeak: string, lang: string) => {
    if (!("speechSynthesis" in window) || !textToSpeak) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (lang === "Hindi") utterance.lang = "hi-IN";
    else if (lang === "Marathi") utterance.lang = "mr-IN";
    else if (lang === "Tamil") utterance.lang = "ta-IN";
    else if (lang === "Telugu") utterance.lang = "te-IN";
    else utterance.lang = "en-US";

    window.speechSynthesis.speak(utterance);
  };

  // 4. Copy to Clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 5. Clear Workspace
  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Languages className="w-6 h-6 text-indigo-600" />
            Multilingual Educational Translator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Translate educational content into Indian regional scripts with technical term preservation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700">
          <Globe className="w-4 h-4" />
          14+ Indian & Global Languages Supported
        </div>
      </div>

      {/* ── LANGUAGE TOOLBAR & SWAP BAR ─────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Source Language Select */}
        <div className="w-full sm:w-1/3">
          <label className="text-xs font-semibold text-gray-500 block mb-1">From Language</label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {LANGUAGES_LIST.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        {/* SWAP BUTTON */}
        <button
          onClick={handleSwapLanguages}
          className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all shadow-sm group"
          title="Swap Languages"
        >
          <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
        </button>

        {/* Target Language Select */}
        <div className="w-full sm:w-1/3">
          <label className="text-xs font-semibold text-gray-500 block mb-1">To Language</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full text-sm bg-indigo-50/50 border border-indigo-200 rounded-lg p-2.5 text-indigo-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {LANGUAGES_LIST.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── PRESET CHIPS BAR ─────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Quick Prompts:</span>
        {PRESET_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setSourceText(chip)}
            className="text-xs bg-white border border-gray-200 hover:border-indigo-400 text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-full transition-all shadow-sm line-clamp-1 max-w-xs"
          >
            + {chip}
          </button>
        ))}
      </div>

      {/* ── DUAL PANE TRANSLATION STUDIO ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INPUT PANE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Input Text ({sourceLanguage})
              </span>
              {sourceText && (
                <button
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg text-xs flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            <textarea
              rows={9}
              placeholder="Enter or paste any educational text, lesson plan, or questions here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
            <span>{sourceText.length} Characters</span>

            <div className="flex items-center gap-2">
              {sourceText && (
                <button
                  onClick={() => handleSpeakText(sourceText, sourceLanguage)}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Listen Text"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => handleTranslateSubmit()}
                disabled={!sourceText.trim() || isTranslating}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Translate Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* OUTPUT PANE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Translated Result ({targetLanguage})
              </span>

              {translatedText && (
                <button
                  onClick={() => handleCopy(translatedText)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Translation"}
                </button>
              )}
            </div>

            {!translatedText ? (
              <div className="h-52 flex flex-col items-center justify-center text-center p-8 text-gray-300 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 space-y-2">
                <Languages className="w-8 h-8 text-gray-300" />
                <p className="text-xs text-gray-400">
                  Translation will appear here instantly after clicking 'Translate Now'.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-indigo-50/30 rounded-xl border border-indigo-100/50 text-sm text-gray-800 leading-relaxed font-medium min-h-[210px] whitespace-pre-line">
                {translatedText}
              </div>
            )}
          </div>

          {translatedText && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Technical Terms Preserved
              </span>

              <button
                onClick={() => handleSpeakText(translatedText, targetLanguage)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                title="Listen Translation"
              >
                <Volume2 className="w-4 h-4" />
                Listen Audio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
