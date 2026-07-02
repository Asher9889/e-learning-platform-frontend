// import { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Eraser, Pencil } from "lucide-react";
// import type { IWhiteboardElement } from "../hooks/use-livekit-room";

// const COLORS = ["#1e293b", "#dc2626", "#16a34a", "#2563eb", "#d97706"];

// interface WhiteboardCanvasProps {
//   onLocalChange: (elements: IWhiteboardElement[]) => void;
//   incomingElements: IWhiteboardElement[] | null;
// }

// export function WhiteboardCanvas({ onLocalChange, incomingElements }: WhiteboardCanvasProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
//   const elementsRef = useRef<IWhiteboardElement[]>([]);
//   const drawingRef = useRef(false);
//   const currentPathRef = useRef<IWhiteboardElement | null>(null);
//   const [color, setColor] = useState(COLORS[0]);

//   const redraw = () => {
//     const canvas = canvasRef.current;
//     const ctx = ctxRef.current;
//     if (!canvas || !ctx) return;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     for (const el of elementsRef.current) {
//       if (el.type === "path" && el.points?.length) {
//         ctx.beginPath();
//         ctx.strokeStyle = el.color;
//         ctx.lineWidth = el.strokeWidth;
//         ctx.lineCap = "round";
//         ctx.lineJoin = "round";
//         el.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
//         ctx.stroke();
//       }
//     }
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const resize = () => {
//       const rect = canvas.parentElement?.getBoundingClientRect();
//       if (!rect) return;
//       canvas.width = rect.width;
//       canvas.height = rect.height;
//       redraw();
//     };
//     resize();
//     ctxRef.current = canvas.getContext("2d");
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // apply elements received from other participants
//   useEffect(() => {
//     if (!incomingElements) return;
//     if (incomingElements.length === 1 && incomingElements[0].type === "clear") {
//       elementsRef.current = [];
//     } else {
//       elementsRef.current = incomingElements;
//     }
//     redraw();
//   }, [incomingElements]);

//   const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
//     const rect = canvasRef.current!.getBoundingClientRect();
//     return { x: e.clientX - rect.left, y: e.clientY - rect.top };
//   };

//   const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
//     drawingRef.current = true;
//     const point = getPos(e);
//     currentPathRef.current = {
//       id: crypto.randomUUID(),
//       type: "path",
//       points: [point],
//       color,
//       strokeWidth: 2.5,
//     };
//   };

//   const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
//     if (!drawingRef.current || !currentPathRef.current) return;
//     const point = getPos(e);
//     currentPathRef.current.points!.push(point);
//     redraw();
//     const ctx = ctxRef.current;
//     if (ctx && currentPathRef.current.points!.length > 1) {
//       const pts = currentPathRef.current.points!;
//       ctx.beginPath();
//       ctx.strokeStyle = currentPathRef.current.color;
//       ctx.lineWidth = currentPathRef.current.strokeWidth;
//       ctx.lineCap = "round";
//       pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
//       ctx.stroke();
//     }
//   };

//   const handlePointerUp = () => {
//     if (!drawingRef.current || !currentPathRef.current) return;
//     drawingRef.current = false;
//     elementsRef.current = [...elementsRef.current, currentPathRef.current];
//     onLocalChange(elementsRef.current);
//     currentPathRef.current = null;
//   };

//   const handleClear = () => {
//     elementsRef.current = [];
//     redraw();
//     onLocalChange([{ id: crypto.randomUUID(), type: "clear", color, strokeWidth: 0 }]);
//   };

//   return (
//     <div className="flex h-full flex-col gap-2">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-1.5">
//           <Pencil className="h-4 w-4 text-muted-foreground" />
//           {COLORS.map((c) => (
//             <button
//               key={c}
//               onClick={() => setColor(c)}
//               className="h-5 w-5 rounded-full border"
//               style={{ backgroundColor: c, borderColor: color === c ? c : "transparent" }}
//               aria-label={`color-${c}`}
//             />
//           ))}
//         </div>
//         <Button variant="outline" size="sm" onClick={handleClear}>
//           <Eraser className="mr-1.5 h-3.5 w-3.5" />
//           Clear
//         </Button>
//       </div>

//       <div className="relative flex-1 overflow-hidden rounded-md border bg-white">
//         <canvas
//           ref={canvasRef}
//           className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
//           onPointerDown={handlePointerDown}
//           onPointerMove={handlePointerMove}
//           onPointerUp={handlePointerUp}
//           onPointerLeave={handlePointerUp}
//         />
//       </div>
//     </div>
//   );
// }
