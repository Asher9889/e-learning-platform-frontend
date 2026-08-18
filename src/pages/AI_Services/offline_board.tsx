/* eslint-disable no-useless-assignment */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PenTool,
  Sparkles,
  Sigma,
  FlaskConical,
  Eraser,
  Check,
  Copy,
  FileText,
  Shapes,
  Loader2,
  CheckCircle2,
  Volume2,
  VolumeX,
  Camera,
  LineChart,
  BookOpenCheck,
  Presentation,
  Play,
  Atom,
  RotateCcw,
  RotateCw,
  Grid,
  Search,
  Activity,
  X
} from "lucide-react";

// API Import from utils/url
import api from "../../utils/url";

// Interfaces
interface Point2D { x: number; y: number; }

interface ShapeResponse {
  detectedShape: string;
  confidence: number;
  center?: Point2D;
  radius?: number;
  width?: number;
  height?: number;
  vertices?: Point2D[];
}

interface AtomCount {
  element: string;
  reactantsCount: number;
  productsCount: number;
  isBalanced: boolean;
}

interface ChemResponse {
  unbalancedEquation: string;
  balancedEquation: string;
  stepByStepExplanation: string[];
  reactants: Record<string, number>;
  products: Record<string, number>;
  atomInventory?: AtomCount[];
}

interface PlotPoint { x: number; y: number; }

interface MathResponse {
  rawFormula: string;
  latexFormula: string;
  finalAnswer: string;
  stepByStepSolution: string[];
  graphPoints?: PlotPoint[];
}

interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
  group: number;
  period: number;
  shells: number[];
  electronegativity?: number;
  funFact: string;
}

// 🔴 COMPLETE 118 PERIODIC TABLE DATASET
const RAW_118_NAMES: [string, string, number, string, number, number, number[], number, string][] = [
  ["H", "Hydrogen", 1.008, "nonmetal", 1, 1, [1], 2.2, "Most abundant chemical element in the universe."],
  ["He", "Helium", 4.0026, "noble-gas", 18, 1, [2], 0, "Second lightest element; glows purple in gas discharge."],
  ["Li", "Lithium", 6.94, "alkali-metal", 1, 2, [2, 1], 0.98, "Lightest metal; powers modern EV batteries."],
  ["Be", "Beryllium", 9.0122, "alkaline-earth", 2, 2, [2, 2], 1.57, "Used in James Webb Space Telescope mirrors."],
  ["B", "Boron", 10.81, "metalloid", 13, 2, [2, 3], 2.04, "Forms extremely hard boron carbide armor."],
  ["C", "Carbon", 12.011, "nonmetal", 14, 2, [2, 4], 2.55, "Basis of all known organic life on Earth."],
  ["N", "Nitrogen", 14.007, "nonmetal", 15, 2, [2, 5], 3.04, "Makes up 78% of Earth's atmosphere."],
  ["O", "Oxygen", 15.999, "nonmetal", 16, 2, [2, 6], 3.44, "Essential for respiration and combustion."],
  ["F", "Fluorine", 18.998, "halogen", 17, 2, [2, 7], 3.98, "Most reactive and electronegative element."],
  ["Ne", "Neon", 20.18, "noble-gas", 18, 2, [2, 8], 0, "Glows reddish-orange in high-voltage sign tube."],
  ["Na", "Sodium", 22.99, "alkali-metal", 1, 3, [2, 8, 1], 0.93, "Explodes violently when dropped in water."],
  ["Mg", "Magnesium", 24.305, "alkaline-earth", 2, 3, [2, 8, 2], 1.31, "Burns with brilliant blinding white light."],
  ["Al", "Aluminium", 26.982, "post-transition", 13, 3, [2, 8, 3], 1.61, "Most abundant metal in Earth's crust."],
  ["Si", "Silicon", 28.085, "metalloid", 14, 3, [2, 8, 4], 1.9, "Foundation of computer chips and Silicon Valley."],
  ["P", "Phosphorus", 30.974, "nonmetal", 15, 3, [2, 8, 5], 2.19, "Glows in dark; crucial for DNA backbone."],
  ["S", "Sulfur", 32.06, "nonmetal", 16, 3, [2, 8, 6], 2.58, "Bright yellow solid known historically as brimstone."],
  ["Cl", "Chlorine", 35.45, "halogen", 17, 3, [2, 8, 7], 3.16, "Used in swimming pools to kill bacteria."],
  ["Ar", "Argon", 39.948, "noble-gas", 18, 3, [2, 8, 8], 0, "Third most abundant gas in Earth's atmosphere."],
  ["K", "Potassium", 39.098, "alkali-metal", 1, 4, [2, 8, 8, 1], 0.82, "Essential electrolyte for nerve impulses."],
  ["Ca", "Calcium", 40.078, "alkaline-earth", 2, 4, [2, 8, 8, 2], 1.0, "Forms structural basis of human bones and teeth."],
  ["Sc", "Scandium", 44.956, "transition-metal", 3, 4, [2, 8, 9, 2], 1.36, "Used in high-performance aerospace alloys."],
  ["Ti", "Titanium", 47.867, "transition-metal", 4, 4, [2, 8, 10, 2], 1.54, "As strong as steel but 45% lighter."],
  ["V", "Vanadium", 50.942, "transition-metal", 5, 4, [2, 8, 11, 2], 1.63, "Added to steel to make ultra-strong tools."],
  ["Cr", "Chromium", 51.996, "transition-metal", 6, 4, [2, 8, 13, 1], 1.66, "Gives stainless steel its corrosion resistance."],
  ["Mn", "Manganese", 54.938, "transition-metal", 7, 4, [2, 8, 13, 2], 1.55, "Essential in steelmaking to improve strength."],
  ["Fe", "Iron", 55.845, "transition-metal", 8, 4, [2, 8, 14, 2], 1.83, "Forms Earth's inner core & carries oxygen in blood."],
  ["Co", "Cobalt", 58.933, "transition-metal", 9, 4, [2, 8, 15, 2], 1.88, "Key component in lithium-ion battery cathodes."],
  ["Ni", "Nickel", 58.693, "transition-metal", 10, 4, [2, 8, 16, 2], 1.91, "Resists corrosion; used in coins and plating."],
  ["Cu", "Copper", 63.546, "transition-metal", 11, 4, [2, 8, 18, 1], 1.9, "First metal worked by human civilizations."],
  ["Zn", "Zinc", 65.38, "transition-metal", 12, 4, [2, 8, 18, 2], 1.65, "Used to galvanize steel to prevent rust."],
  ["Ga", "Gallium", 69.723, "post-transition", 13, 4, [2, 8, 18, 3], 1.81, "Melts in human hand at 29.76°C."],
  ["Ge", "Germanium", 72.63, "metalloid", 14, 4, [2, 8, 18, 4], 2.01, "Important semiconductor in fiber optics."],
  ["As", "Arsenic", 74.922, "metalloid", 15, 4, [2, 8, 18, 5], 2.18, "Historically famous metalloid poison."],
  ["Se", "Selenium", 78.971, "nonmetal", 16, 4, [2, 8, 18, 6], 2.55, "Photoconductive element used in solar cells."],
  ["Br", "Bromine", 79.904, "halogen", 17, 4, [2, 8, 18, 7], 2.96, "Only nonmetallic element liquid at room temp."],
  ["Kr", "Krypton", 83.798, "noble-gas", 18, 4, [2, 8, 18, 8], 3.0, "Used in high-speed photographic flashes."],
  ["Rb", "Rubidium", 85.468, "alkali-metal", 1, 5, [2, 8, 18, 8, 1], 0.82, "Highly reactive alkali metal; glows red in flame."],
  ["Sr", "Strontium", 87.62, "alkaline-earth", 2, 5, [2, 8, 18, 8, 2], 0.95, "Gives brilliant crimson-red color to fireworks."],
  ["Y", "Yttrium", 88.906, "transition-metal", 3, 5, [2, 8, 18, 9, 2], 1.22, "Used in high-temperature superconductors."],
  ["Zr", "Zirconium", 91.224, "transition-metal", 4, 5, [2, 8, 18, 10, 2], 1.33, "Resists corrosion from nuclear reactors."],
  ["Nb", "Niobium", 92.906, "transition-metal", 5, 5, [2, 8, 18, 12, 1], 1.6, "Used in superconducting magnets for MRI."],
  ["Mo", "Molybdenum", 95.95, "transition-metal", 6, 5, [2, 8, 18, 13, 1], 2.16, "Withstands extreme heat in furnace parts."],
  ["Tc", "Technetium", 98, "transition-metal", 7, 5, [2, 8, 18, 13, 2], 1.9, "First artificially produced element in 1937."],
  ["Ru", "Ruthenium", 101.07, "transition-metal", 8, 5, [2, 8, 18, 15, 1], 2.2, "Hardens platinum & palladium electrical contacts."],
  ["Rh", "Rhodium", 102.91, "transition-metal", 9, 5, [2, 8, 18, 16, 1], 2.28, "Extremely rare; used in catalytic converters."],
  ["Pd", "Palladium", 106.42, "transition-metal", 10, 5, [2, 8, 18, 18], 2.2, "Absorbs up to 900 times its volume of hydrogen gas."],
  ["Ag", "Silver", 107.87, "transition-metal", 11, 5, [2, 8, 18, 18, 1], 1.93, "Has highest electrical conductivity of any metal."],
  ["Cd", "Cadmium", 112.41, "transition-metal", 12, 5, [2, 8, 18, 18, 2], 1.69, "Used in Ni-Cd rechargeable batteries."],
  ["In", "Indium", 114.82, "post-transition", 13, 5, [2, 8, 18, 18, 3], 1.78, "Essential for touchscreens as Indium Tin Oxide."],
  ["Sn", "Tin", 118.71, "post-transition", 14, 5, [2, 8, 18, 18, 4], 1.96, "Alloyed with copper to make bronze."],
  ["Sb", "Antimony", 121.76, "metalloid", 15, 5, [2, 8, 18, 18, 5], 2.05, "Used in flame retardants and lead-acid batteries."],
  ["Te", "Tellurium", 127.6, "metalloid", 16, 5, [2, 8, 18, 18, 6], 2.1, "Rare metalloid used in solar panel semiconductors."],
  ["I", "Iodine", 126.9, "halogen", 17, 5, [2, 8, 18, 18, 7], 2.66, "Essential trace element for thyroid gland health."],
  ["Xe", "Xenon", 131.29, "noble-gas", 18, 5, [2, 8, 18, 18, 8], 2.6, "Heavy gas used in ion thrusters for spacecraft."],
  ["Cs", "Caesium", 132.91, "alkali-metal", 1, 6, [2, 8, 18, 18, 8, 1], 0.79, "Used to define the international second in atomic clocks."],
  ["Ba", "Barium", 137.33, "alkaline-earth", 2, 6, [2, 8, 18, 18, 8, 2], 0.89, "Used as medical contrast medium for GI X-rays."],
  ["La", "Lanthanum", 138.91, "lanthanide", 3, 6, [2, 8, 18, 18, 9, 2], 1.1, "First element in the lanthanide series."],
  ["Ce", "Cerium", 140.12, "lanthanide", 3, 6, [2, 8, 18, 19, 9, 2], 1.12, "Used in lighter flints and catalytic converters."],
  ["Pr", "Praseodymium", 140.91, "lanthanide", 3, 6, [2, 8, 18, 21, 8, 2], 1.13, "Gives yellow-green color to glass studio goggles."],
  ["Nd", "Neodymium", 144.24, "lanthanide", 3, 6, [2, 8, 18, 22, 8, 2], 1.14, "Powers world's strongest permanent magnets."],
  ["Pm", "Promethium", 145, "lanthanide", 3, 6, [2, 8, 18, 23, 8, 2], 1.13, "Radioactive lanthanide used in atomic batteries."],
  ["Sm", "Samarium", 150.36, "lanthanide", 3, 6, [2, 8, 18, 25, 8, 2], 1.17, "Used in high-temperature SmCo permanent magnets."],
  ["Eu", "Europium", 151.96, "lanthanide", 3, 6, [2, 8, 18, 25, 9, 2], 1.2, "Red phosphor used in TV screens and Euro banknotes."],
  ["Gd", "Gadolinium", 157.25, "lanthanide", 3, 6, [2, 8, 18, 25, 9, 2], 1.2, "Contrast agent for medical MRI body scans."],
  ["Tb", "Terbium", 158.93, "lanthanide", 3, 6, [2, 8, 18, 27, 8, 2], 1.2, "Green phosphor used in low-energy light bulbs."],
  ["Dy", "Dysprosium", 162.5, "lanthanide", 3, 6, [2, 8, 18, 28, 8, 2], 1.22, "Used in electric vehicle motor permanent magnets."],
  ["Ho", "Holmium", 164.93, "lanthanide", 3, 6, [2, 8, 18, 29, 8, 2], 1.23, "Has highest magnetic strength of any element."],
  ["Er", "Erbium", 167.26, "lanthanide", 3, 6, [2, 8, 18, 30, 8, 2], 1.24, "Doped in optical fibers for laser amplifiers."],
  ["Tm", "Thulium", 168.93, "lanthanide", 3, 6, [2, 8, 18, 31, 8, 2], 1.25, "Rare lanthanide used in portable X-ray devices."],
  ["Yb", "Ytterbium", 173.05, "lanthanide", 3, 6, [2, 8, 18, 32, 8, 2], 1.1, "Used in ultra-precise atomic optical clocks."],
  ["Lu", "Lutetium", 174.97, "lanthanide", 3, 6, [2, 8, 18, 32, 9, 2], 1.27, "Last element in lanthanide series; dense metal."],
  ["Hf", "Hafnium", 178.49, "transition-metal", 4, 6, [2, 8, 18, 32, 10, 2], 1.3, "Used in nuclear control rods due to neutron absorption."],
  ["Ta", "Tantalum", 180.95, "transition-metal", 5, 6, [2, 8, 18, 32, 11, 2], 1.5, "Used in micro-capacitors for smartphones."],
  ["W", "Tungsten", 183.84, "transition-metal", 6, 6, [2, 8, 18, 32, 12, 2], 2.36, "Has highest melting point of all metals (3422°C)."],
  ["Re", "Rhenium", 186.21, "transition-metal", 7, 6, [2, 8, 18, 32, 13, 2], 1.9, "Used in jet engine turbine blade superalloys."],
  ["Os", "Osmium", 190.23, "transition-metal", 8, 6, [2, 8, 18, 32, 14, 2], 2.2, "Densest naturally occurring chemical element."],
  ["Ir", "Iridium", 192.22, "transition-metal", 9, 6, [2, 8, 18, 32, 15, 2], 2.2, "Most corrosion-resistant metal known."],
  ["Pt", "Platinum", 195.08, "transition-metal", 10, 6, [2, 8, 18, 32, 16, 2], 2.28, "Precious noble metal used in jewelry & chemistry."],
  ["Au", "Gold", 196.97, "transition-metal", 11, 6, [2, 8, 18, 32, 18, 1], 2.54, "Does not tarnish; extremely malleable noble metal."],
  ["Hg", "Mercury", 200.59, "transition-metal", 12, 6, [2, 8, 18, 32, 18, 2], 2.0, "Only metallic element liquid at room temperature."],
  ["Tl", "Thallium", 204.38, "post-transition", 13, 6, [2, 8, 18, 32, 18, 3], 1.62, "Toxic metal historically used in rodenticides."],
  ["Pb", "Lead", 207.2, "post-transition", 14, 6, [2, 8, 18, 32, 18, 4], 1.87, "Heavy dense metal used for radiation shielding."],
  ["Bi", "Bismuth", 208.98, "post-transition", 15, 6, [2, 8, 18, 32, 18, 5], 2.02, "Forms colorful iridescent oxide crystals."],
  ["Po", "Polonium", 209, "post-transition", 16, 6, [2, 8, 18, 32, 18, 6], 2.0, "Highly radioactive element discovered by Marie Curie."],
  ["At", "Astatine", 210, "halogen", 17, 6, [2, 8, 18, 32, 18, 7], 2.2, "Rarest naturally occurring element in Earth's crust."],
  ["Rn", "Radon", 222, "noble-gas", 18, 6, [2, 8, 18, 32, 18, 8], 2.2, "Radioactive gas formed by radium decay."],
  ["Fr", "Francium", 223, "alkali-metal", 1, 7, [2, 8, 18, 32, 18, 8, 1], 0.7, "Second rarest element in Earth's crust."],
  ["Ra", "Radium", 226, "alkaline-earth", 2, 7, [2, 8, 18, 32, 18, 8, 2], 0.9, "Glows faint blue in dark due to intense radiation."],
  ["Ac", "Actinium", 227, "actinide", 3, 7, [2, 8, 18, 32, 18, 9, 2], 1.1, "First element in actinide series; radio-luminescent."],
  ["Th", "Thorium", 232.04, "actinide", 3, 7, [2, 8, 18, 32, 18, 10, 2], 1.3, "Potential nuclear fuel source for cleaner reactors."],
  ["Pa", "Protactinium", 231.04, "actinide", 3, 7, [2, 8, 18, 32, 20, 9, 2], 1.5, "Rare radioactive actinide metal."],
  ["U", "Uranium", 238.03, "actinide", 3, 7, [2, 8, 18, 32, 21, 9, 2], 1.38, "Primary fuel source for nuclear power plants."],
  ["Np", "Neptunium", 237, "actinide", 3, 7, [2, 8, 18, 32, 22, 9, 2], 1.36, "First transuranic element synthesized."],
  ["Pu", "Plutonium", 244, "actinide", 3, 7, [2, 8, 18, 32, 24, 8, 2], 1.28, "Fissile material used in nuclear reactors."],
  ["Am", "Americium", 243, "actinide", 3, 7, [2, 8, 18, 32, 25, 8, 2], 1.3, "Used inside household ionizing smoke detectors."],
  ["Cm", "Curium", 247, "actinide", 3, 7, [2, 8, 18, 32, 25, 9, 2], 1.3, "Named after Marie and Pierre Curie."],
  ["Bk", "Berkelium", 247, "actinide", 3, 7, [2, 8, 18, 32, 27, 8, 2], 1.3, "Synthetic radioactive actinide element."],
  ["Cf", "Californium", 251, "actinide", 3, 7, [2, 8, 18, 32, 28, 8, 2], 1.3, "Strong neutron emitter used in moisture gauges."],
  ["Es", "Einsteinium", 252, "actinide", 3, 7, [2, 8, 18, 32, 29, 8, 2], 1.3, "Named in honor of Albert Einstein."],
  ["Fm", "Fermium", 257, "actinide", 3, 7, [2, 8, 18, 32, 30, 8, 2], 1.3, "Named after nuclear physicist Enrico Fermi."],
  ["Md", "Mendelevium", 258, "actinide", 3, 7, [2, 8, 18, 32, 31, 8, 2], 1.3, "Named after Dmitri Mendeleev, creator of periodic table."],
  ["No", "Nobelium", 259, "actinide", 3, 7, [2, 8, 18, 32, 32, 8, 2], 1.3, "Named in honor of Alfred Nobel."],
  ["Lr", "Lawrencium", 266, "actinide", 3, 7, [2, 8, 18, 32, 32, 9, 2], 1.3, "Last element in the actinide series."],
  ["Rf", "Rutherfordium", 267, "transition-metal", 4, 7, [2, 8, 18, 32, 32, 10, 2], 1.3, "Named after physicist Ernest Rutherford."],
  ["Db", "Dubnium", 268, "transition-metal", 5, 7, [2, 8, 18, 32, 32, 11, 2], 1.3, "Named after Russian research city Dubna."],
  ["Sg", "Seaborgium", 269, "transition-metal", 6, 7, [2, 8, 18, 32, 32, 12, 2], 1.3, "Named after nuclear chemist Glenn Seaborg."],
  ["Bh", "Bohrium", 270, "transition-metal", 7, 7, [2, 8, 18, 32, 32, 13, 2], 1.3, "Named after quantum physicist Niels Bohr."],
  ["Hs", "Hassium", 277, "transition-metal", 8, 7, [2, 8, 18, 32, 32, 14, 2], 1.3, "Named after German state of Hesse."],
  ["Mt", "Meitnerium", 278, "transition-metal", 9, 7, [2, 8, 18, 32, 32, 15, 2], 1.3, "Named after nuclear physicist Lise Meitner."],
  ["Ds", "Darmstadtium", 281, "transition-metal", 10, 7, [2, 8, 18, 32, 32, 16, 2], 1.3, "Synthesized at GSI Helmholtzzentrum in Darmstadt."],
  ["Rg", "Roentgenium", 282, "transition-metal", 11, 7, [2, 8, 18, 32, 32, 17, 2], 1.3, "Named after Wilhelm Röntgen, discoverer of X-rays."],
  ["Cn", "Copernicium", 285, "transition-metal", 12, 7, [2, 8, 18, 32, 32, 18, 2], 1.3, "Named in honor of astronomer Nicolaus Copernicus."],
  ["Nh", "Nihonium", 286, "post-transition", 13, 7, [2, 8, 18, 32, 32, 18, 3], 1.3, "First element discovered in Asia (Japan/Nihon)."],
  ["Fl", "Flerovium", 289, "post-transition", 14, 7, [2, 8, 18, 32, 32, 18, 4], 1.3, "Superheavy element named after Flerov Laboratory."],
  ["Mc", "Moscovium", 290, "post-transition", 15, 7, [2, 8, 18, 32, 32, 18, 5], 1.3, "Superheavy element named after Moscow region."],
  ["Lv", "Livermorium", 293, "post-transition", 16, 7, [2, 8, 18, 32, 32, 18, 6], 1.3, "Named after Lawrence Livermore National Laboratory."],
  ["Ts", "Tennessine", 294, "halogen", 17, 7, [2, 8, 18, 32, 32, 18, 7], 1.3, "Second heaviest element; named after Tennessee."],
  ["Og", "Oganesson", 294, "noble-gas", 18, 7, [2, 8, 18, 32, 32, 18, 8], 1.3, "Element 118; heaviest known element in periodic table."]
];

const PERIODIC_DATASET: ElementData[] = RAW_118_NAMES.map((item, idx) => ({
  number: idx + 1,
  symbol: item[0],
  name: item[1],
  mass: item[2],
  category: item[3],
  group: item[4],
  period: item[5],
  shells: item[6],
  electronegativity: item[7],
  funFact: item[8]
}));

// 🟢 THREE.JS REAL-TIME 3D BOHR ATOM MODEL VISUALIZER
const Live3DBohrAtomRenderer: React.FC<{ element: ElementData }> = ({ element }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const initThree = async () => {
      if (!(window as any).THREE) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((res) => { script.onload = res; });
      }

      const THREE = (window as any).THREE;
      if (!THREE || !mountRef.current) return;

      const container = mountRef.current;
      container.innerHTML = "";

      const width = container.clientWidth || 320;
      const height = 280;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x090d16);

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, 9);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      // 1. Protons & Neutrons Glowing Nucleus Clump
      const nucleusGroup = new THREE.Group();
      const numParticles = Math.min(element.number, 24);
      for (let i = 0; i < numParticles; i++) {
        const pGeo = new THREE.SphereGeometry(0.22, 16, 16);
        const isProton = i % 2 === 0;
        const pMat = new THREE.MeshStandardMaterial({
          color: isProton ? 0xef4444 : 0x38bdf8,
          emissive: isProton ? 0x991b1b : 0x0284c7,
          emissiveIntensity: 0.5
        });
        const sphere = new THREE.Mesh(pGeo, pMat);
        sphere.position.set((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6);
        nucleusGroup.add(sphere);
      }
      scene.add(nucleusGroup);

      // 2. Concentric Orbit Rings & Revolving Electrons
      const orbitsGroup = new THREE.Group();
      const electronMeshes: { mesh: any; radius: number; angle: number; speed: number }[] = [];

      element.shells.forEach((electronCount, shellIdx) => {
        const radius = 1.2 + shellIdx * 0.8;

        // Orbit Ring
        const ringGeo = new THREE.TorusGeometry(radius, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.5 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3 + shellIdx * 0.2;
        orbitsGroup.add(ring);

        // Orbiting Electron Particles
        for (let e = 0; e < electronCount; e++) {
          const eGeo = new THREE.SphereGeometry(0.08, 16, 16);
          const eMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.8 });
          const electron = new THREE.Mesh(eGeo, eMat);
          const baseAngle = (e / electronCount) * Math.PI * 2;

          orbitsGroup.add(electron);
          electronMeshes.push({
            mesh: electron,
            radius,
            angle: baseAngle,
            speed: 0.02 + (4 - shellIdx) * 0.005
          });
        }
      });

      scene.add(orbitsGroup);

      // Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        nucleusGroup.rotation.y += 0.01;

        electronMeshes.forEach((item) => {
          item.angle += item.speed;
          item.mesh.position.x = item.radius * Math.cos(item.angle);
          item.mesh.position.y = item.radius * Math.sin(item.angle) * Math.cos(Math.PI / 3);
          item.mesh.position.z = item.radius * Math.sin(item.angle) * Math.sin(Math.PI / 3);
        });

        renderer.render(scene, camera);
      };

      animate();
    };

    initThree();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [element]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <div ref={mountRef} className="w-full h-[280px]" />
      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
        Atom Bohr Model: {element.name} ({element.shells.join("-")} shells)
      </div>
    </div>
  );
};

// 🟢 REAL-TIME VISUAL SVG FUNCTION GRAPH PLOTTER COMPONENT
const InteractiveFunctionGraph: React.FC<{ points: PlotPoint[] }> = ({ points }) => {
  const [hoveredPoint, setHoveredPoint] = useState<PlotPoint | null>(null);

  if (!points || points.length === 0) return null;

  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 30;

  const minX = -10;
  const maxX = 10;
  
  const yValues = points.map((p) => p.y);
  let minY = Math.min(...yValues);
  let maxY = Math.max(...yValues);

  if (minY === maxY) {
    minY -= 2;
    maxY += 2;
  }

  const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX)) * (svgWidth - 2 * padding);
  const scaleY = (y: number) => svgHeight - padding - ((y - minY) / (maxY - minY)) * (svgHeight - 2 * padding);

  const originX = scaleX(0);
  const originY = scaleY(0);

  const pathD = points.reduce((acc, pt, idx) => {
    const cx = scaleX(pt.x);
    const cy = scaleY(pt.y);
    return idx === 0 ? `M ${cx} ${cy}` : `${acc} L ${cx} ${cy}`;
  }, "");

  return (
    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 relative shadow-inner overflow-hidden">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
          <LineChart className="w-4 h-4" /> Visual Function Curve Plot ($y = f(x)$)
        </p>

        {hoveredPoint && (
          <span className="text-xs font-mono font-bold bg-indigo-900 text-indigo-200 px-2.5 py-0.5 rounded border border-indigo-700">
            X: {hoveredPoint.x}, Y: {hoveredPoint.y}
          </span>
        )}
      </div>

      <div className="w-full overflow-x-auto flex justify-center">
        <svg width={svgWidth} height={svgHeight} className="overflow-visible">
          {[-8, -4, 0, 4, 8].map((xVal) => (
            <line
              key={`grid-x-${xVal}`}
              x1={scaleX(xVal)}
              y1={padding}
              x2={scaleX(xVal)}
              y2={svgHeight - padding}
              stroke="#1e293b"
              strokeDasharray="3 3"
            />
          ))}

          <line x1={padding} y1={originY} x2={svgWidth - padding} y2={originY} stroke="#64748b" strokeWidth="1.5" />
          <line x1={originX} y1={padding} x2={originX} y2={svgHeight - padding} stroke="#64748b" strokeWidth="1.5" />

          <text x={svgWidth - padding + 5} y={originY + 4} fill="#94a3b8" fontSize="10" fontWeight="bold">X</text>
          <text x={originX - 4} y={padding - 8} fill="#94a3b8" fontSize="10" fontWeight="bold">Y</text>

          <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((pt, idx) => {
            const cx = scaleX(pt.x);
            const cy = scaleY(pt.y);
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={hoveredPoint?.x === pt.x ? 6 : 3}
                fill={hoveredPoint?.x === pt.x ? "#38bdf8" : "#818cf8"}
                className="transition-all cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900 pt-1">
        <span>Domain: -10 to +10</span>
        <span>Range: {minY.toFixed(1)} to {maxY.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default function OfflineSmartboardToolsPage() {
  const navigate = useNavigate();

  // Active Tool Mode Tab
  const [activeTab, setActiveTab] = useState<"PERIODIC_3D" | "CANVAS" | "SIMPLIFY" | "MATH" | "CHEMISTRY">("PERIODIC_3D");

  // 0. Periodic Table 3D States (All 118 Elements)
  const [selectedElement, setSelectedElement] = useState<ElementData>(PERIODIC_DATASET[0]);
  const [periodicFilterCategory, setPeriodicFilterCategory] = useState<string>("ALL");
  const [elementSearchQuery, setElementSearchQuery] = useState<string>("");

  // 1. Text Simplifier States
  const [complexText, setComplexText] = useState<string>("");
  const [simplifyLanguage, setSimplifyLanguage] = useState<string>("English");
  const [simplifiedResult, setSimplifiedResult] = useState<any | null>(null);
  const [isSimplifying, setIsSimplifying] = useState<boolean>(false);
  const [isBionicMode, setIsBionicMode] = useState<boolean>(false);
  const [isSpeakingText, setIsSpeakingText] = useState<boolean>(false);

  // 2. Math Formula States
  const [rawFormula, setRawFormula] = useState<string>("");
  const [mathResult, setMathResult] = useState<MathResponse | null>(null);
  const [isFormattingMath, setIsFormattingMath] = useState<boolean>(false);

  // 3. Smartboard Canvas States (Touch + Mouse + Undo/Redo)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [brushMode, setBrushMode] = useState<"PEN" | "ERASER">("PEN");
  const [brushColor, setStrokeColor] = useState<string>("#4F46E5");
  const [brushWidth, setBrushWidth] = useState<number>(4);
  const [strokePoints, setStrokePoints] = useState<Point2D[]>([]);
  const [recognizedShape, setRecognizedShape] = useState<ShapeResponse | null>(null);
  const [isRecognizingShape, setIsRecognizingShape] = useState<boolean>(false);

  // History Stack for Undo/Redo
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // 4. Chemical Balancer States
  const [unbalancedChem, setUnbalancedChem] = useState<string>("");
  const [chemResult, setChemResult] = useState<ChemResponse | null>(null);
  const [isBalancingChem, setIsBalancingChem] = useState<boolean>(false);

  // Copy State
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Push Canvas Snapshot to History
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    setCanvasHistory([...newHistory, imageData]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.putImageData(canvasHistory[newIdx], 0, 0);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.putImageData(canvasHistory[newIdx], 0, 0);
      }
    }
  };

  // Canvas Coordinates Helper (Mouse & Touch Native Support)
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point2D => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoordinates(e);
    setIsDrawing(true);
    setStrokePoints([{ x, y }]);
    setRecognizedShape(null);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = brushMode === "ERASER" ? "#ffffff" : brushColor;
      ctx.lineWidth = brushMode === "ERASER" ? brushWidth * 4 : brushWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoordinates(e);
    setStrokePoints((prev) => [...prev, { x, y }]);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStrokePoints([]);
    setRecognizedShape(null);
    saveCanvasState();
  };

  // Recognize & Perfect Vector Shape
  const handleRecognizeShape = async () => {
    if (strokePoints.length < 3) return;
    setIsRecognizingShape(true);

    try {
      const res: any = await api.post("/offline-tools/recognize-shape", {
        points: strokePoints,
      });

      const data: ShapeResponse = res?.data || res;
      setRecognizedShape(data);

      const canvas = canvasRef.current;
      if (canvas && data) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.strokeStyle = "#059669";
          ctx.lineWidth = 5;

          if (data.detectedShape === "triangle" && data.vertices && data.vertices.length >= 3) {
            const [v1, v2, v3] = data.vertices;
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.lineTo(v3.x, v3.y);
            ctx.closePath();
          } else if (data.detectedShape === "circle" && data.center && data.radius) {
            ctx.arc(data.center.x, data.center.y, data.radius, 0, 2 * Math.PI);
          } else if (
            (data.detectedShape === "rectangle" || data.detectedShape === "square") &&
            data.center &&
            data.width &&
            data.height
          ) {
            ctx.strokeRect(
              data.center.x - data.width / 2,
              data.center.y - data.height / 2,
              data.width,
              data.height
            );
          } else {
            if (strokePoints.length >= 2) {
              const start = strokePoints[0];
              const end = strokePoints[strokePoints.length - 1];
              ctx.moveTo(start.x, start.y);
              ctx.lineTo(end.x, end.y);
            }
          }
          ctx.stroke();
          saveCanvasState();
        }
      }
    } catch (err) {
      console.error("Shape recognition error:", err);
    } finally {
      setIsRecognizingShape(false);
    }
  };

  // Text-To-Speech Read Aloud Handler
  const toggleTextToSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isSpeakingText) {
      window.speechSynthesis.cancel();
      setIsSpeakingText(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeakingText(false);
      utterance.onerror = () => setIsSpeakingText(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeakingText(true);
    }
  };

  const handleSimplifyText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complexText.trim()) return;
    setIsSimplifying(true);

    try {
      const res: any = await api.post("/offline-tools/simplify-text", {
        complexText,
        targetLanguage: simplifyLanguage,
      });
      setSimplifiedResult(res?.data || res);
    } catch (err: any) {
      console.error("Text simplification error:", err);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleFormatMath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawFormula.trim()) return;
    setIsFormattingMath(true);

    try {
      const res: any = await api.post("/offline-tools/format-formula", {
        rawFormula,
      });
      setMathResult(res?.data || res);
    } catch (err: any) {
      console.error("Math formula error:", err);
    } finally {
      setIsFormattingMath(false);
    }
  };

  const handleBalanceChem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unbalancedChem.trim()) return;
    setIsBalancingChem(true);

    try {
      const res: any = await api.post("/offline-tools/balance-chemical-equation", {
        unbalancedEquation: unbalancedChem,
      });
      setChemResult(res?.data || res);
    } catch (err: any) {
      alert("Failed to balance equation. Check formula syntax.");
    } finally {
      setIsBalancingChem(false);
    }
  };

  const filteredElements = PERIODIC_DATASET.filter((el) => {
    const matchesCategory = periodicFilterCategory === "ALL" || el.category === periodicFilterCategory;
    const matchesSearch = el.name.toLowerCase().includes(elementSearchQuery.toLowerCase()) || el.symbol.toLowerCase().includes(elementSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-900 min-h-screen text-slate-100 rounded-3xl my-2 shadow-2xl">
      {/* STUDIO HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <PenTool className="w-7 h-7 text-indigo-400" />
            AI Smartboard Interactive Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete 118 Elements 3D Periodic Table, Touch Canvas, Math Plotter, & Chemistry Balancer.
          </p>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-800 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab("PERIODIC_3D")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PERIODIC_3D" ? "bg-purple-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <Atom className="w-4 h-4 text-cyan-300" /> 118 3D Periodic Table
          </button>

          <button
            onClick={() => setActiveTab("CANVAS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "CANVAS" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <Shapes className="w-4 h-4" /> Touch Canvas
          </button>

          <button
            onClick={() => setActiveTab("SIMPLIFY")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "SIMPLIFY" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" /> Text Simplifier
          </button>

          <button
            onClick={() => setActiveTab("MATH")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "MATH" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <Sigma className="w-4 h-4" /> Math Solver
          </button>

          <button
            onClick={() => setActiveTab("CHEMISTRY")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "CHEMISTRY" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <FlaskConical className="w-4 h-4" /> Chem Balancer
          </button>
        </div>
      </div>

      {/* WORKSPACE 0: INTERACTIVE 3D PERIODIC TABLE & BOHR ATOM MODEL */}
      {activeTab === "PERIODIC_3D" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Left Column: 118 Elements Interactive Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700/60 gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={periodicFilterCategory}
                  onChange={(e) => setPeriodicFilterCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none font-medium"
                >
                  <option value="ALL">All 118 Elements Categories</option>
                  <option value="alkali-metal">Alkali Metals</option>
                  <option value="alkaline-earth">Alkaline Earth</option>
                  <option value="transition-metal">Transition Metals</option>
                  <option value="post-transition">Post-Transition Metals</option>
                  <option value="lanthanide">Lanthanides</option>
                  <option value="actinide">Actinides</option>
                  <option value="nonmetal">Non-metals</option>
                  <option value="halogen">Halogens</option>
                  <option value="noble-gas">Noble Gases</option>
                </select>
              </div>

              <div className="relative w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search symbol or name..."
                  value={elementSearchQuery}
                  onChange={(e) => setElementSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Elements Interactive Grid (118 Elements) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 bg-slate-950 p-4 rounded-3xl border border-slate-800 max-h-[520px] overflow-y-auto">
              {filteredElements.map((el) => {
                const isSelected = selectedElement.number === el.number;
                return (
                  <div
                    key={el.number}
                    onClick={() => setSelectedElement(el)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
                      isSelected
                        ? "bg-purple-600 border-purple-400 scale-105 shadow-xl ring-2 ring-purple-300"
                        : "bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-400">{el.number}</span>
                    <span className="text-base font-black text-white">{el.symbol}</span>
                    <span className="text-[9px] font-bold text-slate-300 line-clamp-1">{el.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Bohr Atomic Visualizer & Element Inspector */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                <div>
                  <span className="text-2xl font-black text-white">{selectedElement.name}</span>
                  <span className="text-xs font-bold text-purple-400 ml-2">({selectedElement.symbol})</span>
                </div>
                <button
                  onClick={() => toggleTextToSpeech(`${selectedElement.name}. Atomic number ${selectedElement.number}. ${selectedElement.funFact}`)}
                  className="p-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 font-semibold"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" /> Read
                </button>
              </div>

              {/* THREE.JS REAL-TIME 3D BOHR ATOM MODEL */}
              <Live3DBohrAtomRenderer element={selectedElement} />

              <div className="space-y-2 mt-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase block">Atomic Mass</span>
                    <span className="font-bold text-white">{selectedElement.mass} u</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase block">Category</span>
                    <span className="font-bold text-emerald-400 capitalize">{selectedElement.category}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  <strong className="text-cyan-400 block mb-1">💡 Fun Scientific Fact:</strong>
                  {selectedElement.funFact}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE 1: SMART TOUCH CANVAS */}
      {activeTab === "CANVAS" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700/60 gap-3">
            {/* Tool Mode, Color Palette & Brush Thickness Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setBrushMode("PEN")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    brushMode === "PEN" ? "bg-indigo-600 text-white" : "text-slate-400"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" /> Pen
                </button>
                <button
                  onClick={() => setBrushMode("ERASER")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    brushMode === "ERASER" ? "bg-rose-600 text-white" : "text-slate-400"
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" /> Eraser
                </button>
              </div>

              {brushMode === "PEN" && (
                <div className="flex items-center gap-2">
                  {["#4F46E5", "#059669", "#DC2626", "#D97706", "#000000"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setStrokeColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        brushColor === color ? "border-white scale-110 shadow" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* BRUSH THICKNESS CONTROLLER */}
              <div className="flex items-center gap-1 ml-2">
                <span className="text-xs font-bold text-slate-300 mr-1">Thickness:</span>
                {[2, 4, 8, 12].map((w) => (
                  <button
                    key={w}
                    onClick={() => setBrushWidth(w)}
                    className={`px-2 py-1 text-xs rounded-md font-bold transition-all ${
                      brushWidth === w ? "bg-indigo-600 text-white shadow" : "bg-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>

            {/* Undo/Redo & Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-xl"
                title="Undo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleRedo}
                disabled={historyIndex >= canvasHistory.length - 1}
                className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-xl"
                title="Redo"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl"
              >
                <Eraser className="w-4 h-4 text-rose-400" /> Clear
              </button>

              <button
                onClick={handleRecognizeShape}
                disabled={strokePoints.length < 3 || isRecognizingShape}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md"
              >
                {isRecognizingShape ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Perfect Shape
              </button>
            </div>
          </div>

          <div className="relative flex justify-center items-center bg-white rounded-3xl p-2 border-4 border-slate-800 shadow-2xl overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              width={1000}
              height={450}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair bg-slate-50 rounded-2xl w-full touch-none"
            />

            {recognizedShape && (
              <div className="absolute top-6 right-6 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl shadow-xl backdrop-blur-md space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Detected Vector Shape:</p>
                <p className="text-xl font-black capitalize text-white">{recognizedShape.detectedShape} ✨</p>
                <p className="text-[11px] text-emerald-400/80">Confidence: {Math.round(recognizedShape.confidence * 100)}%</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WORKSPACE 2: TEXT SIMPLIFIER */}
      {activeTab === "SIMPLIFY" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" /> Complex Input Text
            </h3>

            <form onSubmit={handleSimplifyText} className="space-y-4">
              <textarea
                rows={8}
                placeholder="Paste any complex textbook paragraph or scientific definition here..."
                value={complexText}
                onChange={(e) => setComplexText(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />

              <div className="flex items-center justify-between gap-4">
                <select
                  value={simplifyLanguage}
                  onChange={(e) => setSimplifyLanguage(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2.5 outline-none font-medium"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Hinglish">Hinglish</option>
                </select>

                <button
                  type="submit"
                  disabled={isSimplifying}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isSimplifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Simplify Text Now
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Simplified Explanation
                </h3>

                {simplifiedResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTextToSpeech(simplifiedResult.simplifiedText)}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-medium ${
                        isSpeakingText ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-300 hover:text-white"
                      }`}
                    >
                      {isSpeakingText ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      {isSpeakingText ? "Stop" : "Read Aloud"}
                    </button>

                    <button
                      onClick={() => setIsBionicMode(!isBionicMode)}
                      className={`p-1.5 rounded-lg text-xs font-medium ${
                        isBionicMode ? "bg-purple-600 text-white" : "bg-slate-900 text-slate-300"
                      }`}
                    >
                      Bionic Reading
                    </button>
                  </div>
                )}
              </div>

              {!simplifiedResult ? (
                <div className="p-12 text-center text-slate-500 text-xs italic bg-slate-900/50 rounded-2xl border border-slate-800">
                  Enter complex text on left to simplify.
                </div>
              ) : (
                <div className="space-y-4">
                  {isBionicMode ? (
                    <div
                      className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-4 rounded-2xl border border-slate-700/60 whitespace-pre-line font-mono"
                      dangerouslySetInnerHTML={{ __html: simplifiedResult.bionicText || simplifiedResult.simplifiedText }}
                    />
                  ) : (
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-4 rounded-2xl border border-slate-700/60 whitespace-pre-line">
                      {simplifiedResult.simplifiedText}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE 3: MATH SOLVER & PLOTTER */}
      {activeTab === "MATH" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Sigma className="w-4 h-4" /> Raw Math Input & Equations
            </h3>

            <form onSubmit={handleFormatMath} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. y = cos(x) + sin(x)"
                value={rawFormula}
                onChange={(e) => setRawFormula(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={isFormattingMath}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isFormattingMath ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Solve Math & Plot Function Curve
              </button>
            </form>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Formatted Result & Visual Plot
            </h3>

            {!mathResult ? (
              <div className="p-12 text-center text-slate-500 text-xs italic bg-slate-900/50 rounded-2xl border border-slate-800">
                Enter math formula on left to solve and view curve plot.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-300 font-mono text-sm font-bold">
                  <strong>Final Answer:</strong> {mathResult.finalAnswer}
                </div>

                {mathResult.graphPoints && mathResult.graphPoints.length > 0 && (
                  <InteractiveFunctionGraph points={mathResult.graphPoints} />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* WORKSPACE 4: CHEMISTRY BALANCER */}
      {activeTab === "CHEMISTRY" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4" /> Unbalanced Chemical Equation
            </h3>

            <form onSubmit={handleBalanceChem} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. Fe + O2 -> Fe2O3"
                value={unbalancedChem}
                onChange={(e) => setUnbalancedChem(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm font-mono text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={isBalancingChem}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isBalancingChem ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Balance Equation & Calculate Atom Inventory
              </button>
            </form>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Balanced Result & Proof
            </h3>

            {!chemResult ? (
              <div className="p-12 text-center text-slate-500 text-xs italic bg-slate-900/50 rounded-2xl border border-slate-800">
                Enter chemical formula on left to balance.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 bg-emerald-950/80 rounded-2xl border border-emerald-500/40 text-emerald-300 font-mono text-lg font-bold text-center tracking-wide">
                  {chemResult.balancedEquation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
