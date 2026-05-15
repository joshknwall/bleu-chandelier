"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Maximize2,
  Columns,
  Plus,
  Trash2,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Download,
  X,
  RotateCcw,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

type ElementType =
  | "table-round"
  | "table-rect"
  | "table-head"
  | "stage"
  | "dance-floor"
  | "bar"
  | "dj-booth"
  | "catering"
  | "entrance"
  | "restrooms"
  | "custom";

interface FloorElement {
  id: string;
  type: ElementType;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  seats?: number;
}

interface DragState {
  elementId: string;
  offsetX: number;
  offsetY: number;
}

interface ResizeState {
  elementId: string;
  handle: ResizeHandle;
  startX: number;
  startY: number;
  origRect: { x: number; y: number; w: number; h: number };
}

type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

interface ContextMenu {
  x: number;
  y: number;
  elementId: string;
}

// ─── Constants ───────────────────────────────────────────────────────

const GRID_SIZE = 20;
const HANDLE_SIZE = 8;
const MIN_ELEMENT_SIZE = 30;
const MAX_UNDO = 20;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.15;

const TYPE_COLORS: Record<ElementType, string> = {
  "table-round": "#1e2d42",
  "table-rect": "#1e2d42",
  "table-head": "#1e2d42",
  stage: "#1a2940",
  "dance-floor": "#172438",
  bar: "#2a1f3a",
  catering: "#1a2a1a",
  "dj-booth": "#1a2030",
  entrance: "#1a2535",
  restrooms: "#1a2535",
  custom: "#1e2535",
};

const TYPE_LABELS: Record<ElementType, string> = {
  "table-round": "Round Table",
  "table-rect": "Rect Table",
  "table-head": "Head Table",
  stage: "Stage",
  "dance-floor": "Dance Floor",
  bar: "Bar",
  "dj-booth": "DJ Booth",
  catering: "Catering",
  entrance: "Entrance",
  restrooms: "Restrooms",
  custom: "Custom",
};

const TYPE_DEFAULTS: Record<ElementType, { w: number; h: number; seats?: number }> = {
  "table-round": { w: 60, h: 60, seats: 8 },
  "table-rect": { w: 80, h: 50, seats: 8 },
  "table-head": { w: 140, h: 40, seats: 12 },
  stage: { w: 160, h: 80 },
  "dance-floor": { w: 180, h: 140 },
  bar: { w: 120, h: 50 },
  "dj-booth": { w: 80, h: 50 },
  catering: { w: 120, h: 60 },
  entrance: { w: 60, h: 40 },
  restrooms: { w: 70, h: 50 },
  custom: { w: 80, h: 60 },
};

const INITIAL_ELEMENTS: FloorElement[] = [
  { id: "el-1", type: "stage", label: "Stage", x: 175, y: 20, w: 160, h: 80, color: "#1a2940" },
  { id: "el-2", type: "dance-floor", label: "Dance Floor", x: 155, y: 120, w: 200, h: 140, color: "#172438" },
  { id: "el-3", type: "table-rect", label: "Table 1", x: 20, y: 120, w: 80, h: 60, color: "#1e2d42", seats: 8 },
  { id: "el-4", type: "table-rect", label: "Table 2", x: 20, y: 200, w: 80, h: 60, color: "#1e2d42", seats: 8 },
  { id: "el-5", type: "table-rect", label: "Table 3", x: 20, y: 280, w: 80, h: 60, color: "#1e2d42", seats: 8 },
  { id: "el-6", type: "table-rect", label: "Table 4", x: 410, y: 120, w: 80, h: 60, color: "#1e2d42", seats: 8 },
  { id: "el-7", type: "table-rect", label: "Table 5", x: 410, y: 200, w: 80, h: 60, color: "#1e2d42", seats: 8 },
  { id: "el-8", type: "table-rect", label: "Table 6", x: 410, y: 280, w: 80, h: 60, color: "#1e2d42", seats: 8 },
  { id: "el-9", type: "bar", label: "Bar", x: 20, y: 380, w: 130, h: 70, color: "#2a1f3a" },
  { id: "el-10", type: "catering", label: "Catering", x: 185, y: 380, w: 130, h: 70, color: "#1a2a1a" },
  { id: "el-11", type: "dj-booth", label: "DJ Booth", x: 360, y: 380, w: 130, h: 70, color: "#1a2030" },
];

// ─── Helpers ─────────────────────────────────────────────────────────

let nextId = 100;
function generateId(): string {
  return `el-${Date.now()}-${nextId++}`;
}

function snap(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

function isTableType(type: ElementType): boolean {
  return type === "table-round" || type === "table-rect" || type === "table-head";
}

// ─── Component ───────────────────────────────────────────────────────

interface FloorPlanPanelProps {
  roomId?: string;
}

export default function FloorPlanPanel({ roomId }: FloorPlanPanelProps) {
  // ─── State ──────────────────────────────────────────────────────
  const [elements, setElements] = useState<FloorElement[]>(() => {
    if (roomId && typeof window !== "undefined") {
      const saved = localStorage.getItem(`floorplan-${roomId}`);
      if (saved) {
        try {
          return JSON.parse(saved) as FloorElement[];
        } catch {
          // fall through to default
        }
      }
    }
    return INITIAL_ELEMENTS;
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gridSnap, setGridSnap] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState("");

  // ─── Refs ────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const panRef = useRef<{ startX: number; startY: number; origPan: { x: number; y: number } } | null>(null);
  const undoStack = useRef<FloorElement[][]>([]);
  const redoStack = useRef<FloorElement[][]>([]);
  const labelInputRef = useRef<HTMLInputElement>(null);

  // ─── Persistence ─────────────────────────────────────────────────
  useEffect(() => {
    if (roomId && typeof window !== "undefined") {
      localStorage.setItem(`floorplan-${roomId}`, JSON.stringify(elements));
    }
  }, [elements, roomId]);

  // ─── Undo / Redo ────────────────────────────────────────────────
  const pushUndo = useCallback((prev: FloorElement[]) => {
    undoStack.current = [...undoStack.current.slice(-(MAX_UNDO - 1)), prev];
    redoStack.current = [];
  }, []);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current[undoStack.current.length - 1];
    undoStack.current = undoStack.current.slice(0, -1);
    redoStack.current = [...redoStack.current, elements];
    setElements(prev);
    setSelectedId(null);
  }, [elements]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current[redoStack.current.length - 1];
    redoStack.current = redoStack.current.slice(0, -1);
    undoStack.current = [...undoStack.current, elements];
    setElements(next);
    setSelectedId(null);
  }, [elements]);

  // ─── Canvas Coordinate Transform ────────────────────────────────
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const x = (screenX - rect.left - panOffset.x) / zoom;
      const y = (screenY - rect.top - panOffset.y) / zoom;
      return { x, y };
    },
    [zoom, panOffset]
  );

  // ─── Hit Testing ────────────────────────────────────────────────
  const hitTest = useCallback(
    (cx: number, cy: number): string | null => {
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (cx >= el.x && cx <= el.x + el.w && cy >= el.y && cy <= el.y + el.h) {
          return el.id;
        }
      }
      return null;
    },
    [elements]
  );

  const getResizeHandle = useCallback(
    (cx: number, cy: number, el: FloorElement): ResizeHandle | null => {
      const hs = HANDLE_SIZE / zoom;
      const handles: { handle: ResizeHandle; hx: number; hy: number }[] = [
        { handle: "nw", hx: el.x, hy: el.y },
        { handle: "ne", hx: el.x + el.w, hy: el.y },
        { handle: "sw", hx: el.x, hy: el.y + el.h },
        { handle: "se", hx: el.x + el.w, hy: el.y + el.h },
        { handle: "n", hx: el.x + el.w / 2, hy: el.y },
        { handle: "s", hx: el.x + el.w / 2, hy: el.y + el.h },
        { handle: "w", hx: el.x, hy: el.y + el.h / 2 },
        { handle: "e", hx: el.x + el.w, hy: el.y + el.h / 2 },
      ];
      for (const h of handles) {
        if (Math.abs(cx - h.hx) <= hs && Math.abs(cy - h.hy) <= hs) {
          return h.handle;
        }
      }
      return null;
    },
    [zoom]
  );

  // ─── Drawing ────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#0d1520";
    ctx.fillRect(0, 0, displayW, displayH);

    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Grid
    if (gridSnap) {
      ctx.strokeStyle = "rgba(189,212,228,0.05)";
      ctx.lineWidth = 1 / zoom;
      const startX = Math.floor(-panOffset.x / zoom / GRID_SIZE) * GRID_SIZE;
      const startY = Math.floor(-panOffset.y / zoom / GRID_SIZE) * GRID_SIZE;
      const endX = startX + displayW / zoom + GRID_SIZE;
      const endY = startY + displayH / zoom + GRID_SIZE;
      for (let gx = startX; gx < endX; gx += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(gx, startY);
        ctx.lineTo(gx, endY);
        ctx.stroke();
      }
      for (let gy = startY; gy < endY; gy += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(startX, gy);
        ctx.lineTo(endX, gy);
        ctx.stroke();
      }
    }

    // Elements
    for (const el of elements) {
      const isSelected = el.id === selectedId;

      // Fill
      ctx.fillStyle = el.color;
      if (el.type === "table-round") {
        ctx.beginPath();
        ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        const r = 4;
        ctx.roundRect(el.x, el.y, el.w, el.h, r);
        ctx.fill();
      }

      // Border
      ctx.strokeStyle = isSelected ? "#d4a853" : "rgba(189,212,228,0.15)";
      ctx.lineWidth = isSelected ? 2 / zoom : 1 / zoom;
      if (el.type === "table-round") {
        ctx.beginPath();
        ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.w, el.h, 4);
        ctx.stroke();
      }

      // Label
      const fontSize = Math.max(9, Math.min(12, el.w / 8));
      ctx.fillStyle = "rgba(189,212,228,0.8)";
      ctx.font = `700 ${fontSize}px Manrope, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const centerX = el.x + el.w / 2;
      const centerY = el.y + el.h / 2;

      if (el.seats !== undefined && isTableType(el.type)) {
        ctx.fillText(el.label, centerX, centerY - fontSize * 0.6);
        ctx.fillStyle = "rgba(189,212,228,0.5)";
        ctx.font = `600 ${fontSize * 0.8}px Manrope, sans-serif`;
        ctx.fillText(`${el.seats} seats`, centerX, centerY + fontSize * 0.6);
      } else {
        ctx.fillText(el.label, centerX, centerY);
      }

      // Selection handles
      if (isSelected) {
        const handles: { hx: number; hy: number }[] = [
          { hx: el.x, hy: el.y },
          { hx: el.x + el.w, hy: el.y },
          { hx: el.x, hy: el.y + el.h },
          { hx: el.x + el.w, hy: el.y + el.h },
          { hx: el.x + el.w / 2, hy: el.y },
          { hx: el.x + el.w / 2, hy: el.y + el.h },
          { hx: el.x, hy: el.y + el.h / 2 },
          { hx: el.x + el.w, hy: el.y + el.h / 2 },
        ];
        const hs = HANDLE_SIZE / zoom;
        for (const h of handles) {
          ctx.fillStyle = "#d4a853";
          ctx.fillRect(h.hx - hs / 2, h.hy - hs / 2, hs, hs);
          ctx.strokeStyle = "#0d1520";
          ctx.lineWidth = 1 / zoom;
          ctx.strokeRect(h.hx - hs / 2, h.hy - hs / 2, hs, hs);
        }
      }
    }

    ctx.restore();
  }, [elements, selectedId, zoom, panOffset, gridSnap]);

  // ─── Redraw on state change ──────────────────────────────────────
  useEffect(() => {
    draw();
  }, [draw]);

  // Also redraw on resize
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  // ─── Mouse Handlers ─────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button === 2) return; // right-click handled separately
      setContextMenu(null);
      setEditingLabelId(null);

      const { x: cx, y: cy } = screenToCanvas(e.clientX, e.clientY);

      // Check resize handles first (if something is selected)
      if (selectedId) {
        const selEl = elements.find((el) => el.id === selectedId);
        if (selEl) {
          const handle = getResizeHandle(cx, cy, selEl);
          if (handle) {
            resizeRef.current = {
              elementId: selectedId,
              handle,
              startX: cx,
              startY: cy,
              origRect: { x: selEl.x, y: selEl.y, w: selEl.w, h: selEl.h },
            };
            return;
          }
        }
      }

      // Hit test elements
      const hitId = hitTest(cx, cy);
      if (hitId) {
        setSelectedId(hitId);
        const el = elements.find((e) => e.id === hitId);
        if (el) {
          dragRef.current = {
            elementId: hitId,
            offsetX: cx - el.x,
            offsetY: cy - el.y,
          };
          pushUndo(elements);
        }
      } else {
        setSelectedId(null);
        // Start panning
        panRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          origPan: { ...panOffset },
        };
      }
    },
    [screenToCanvas, hitTest, selectedId, elements, getResizeHandle, panOffset, pushUndo]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x: cx, y: cy } = screenToCanvas(e.clientX, e.clientY);

      // Dragging
      if (dragRef.current) {
        const { elementId, offsetX, offsetY } = dragRef.current;
        let newX = cx - offsetX;
        let newY = cy - offsetY;
        if (gridSnap) {
          newX = snap(newX, GRID_SIZE);
          newY = snap(newY, GRID_SIZE);
        }
        setElements((prev) =>
          prev.map((el) => (el.id === elementId ? { ...el, x: newX, y: newY } : el))
        );
        return;
      }

      // Resizing
      if (resizeRef.current) {
        const { elementId, handle, startX, startY, origRect } = resizeRef.current;
        const dx = cx - startX;
        const dy = cy - startY;
        let { x, y, w, h } = origRect;

        if (handle.includes("e")) w = Math.max(MIN_ELEMENT_SIZE, origRect.w + dx);
        if (handle.includes("w")) {
          w = Math.max(MIN_ELEMENT_SIZE, origRect.w - dx);
          x = origRect.x + origRect.w - w;
        }
        if (handle.includes("s")) h = Math.max(MIN_ELEMENT_SIZE, origRect.h + dy);
        if (handle.includes("n")) {
          h = Math.max(MIN_ELEMENT_SIZE, origRect.h - dy);
          y = origRect.y + origRect.h - h;
        }

        if (gridSnap) {
          x = snap(x, GRID_SIZE);
          y = snap(y, GRID_SIZE);
          w = snap(w, GRID_SIZE);
          h = snap(h, GRID_SIZE);
          if (w < MIN_ELEMENT_SIZE) w = GRID_SIZE;
          if (h < MIN_ELEMENT_SIZE) h = GRID_SIZE;
        }

        setElements((prev) =>
          prev.map((el) => (el.id === elementId ? { ...el, x, y, w, h } : el))
        );
        return;
      }

      // Panning
      if (panRef.current) {
        const dx = e.clientX - panRef.current.startX;
        const dy = e.clientY - panRef.current.startY;
        setPanOffset({
          x: panRef.current.origPan.x + dx,
          y: panRef.current.origPan.y + dy,
        });
        return;
      }

      // Cursor style
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (selectedId) {
        const selEl = elements.find((el) => el.id === selectedId);
        if (selEl) {
          const handle = getResizeHandle(cx, cy, selEl);
          if (handle) {
            const cursors: Record<ResizeHandle, string> = {
              nw: "nwse-resize",
              se: "nwse-resize",
              ne: "nesw-resize",
              sw: "nesw-resize",
              n: "ns-resize",
              s: "ns-resize",
              e: "ew-resize",
              w: "ew-resize",
            };
            canvas.style.cursor = cursors[handle];
            return;
          }
        }
      }

      const hit = hitTest(cx, cy);
      canvas.style.cursor = hit ? "grab" : "default";
    },
    [screenToCanvas, gridSnap, selectedId, elements, hitTest, getResizeHandle]
  );

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) {
      dragRef.current = null;
    }
    if (resizeRef.current) {
      resizeRef.current = null;
    }
    if (panRef.current) {
      panRef.current = null;
    }
  }, []);

  // ─── Context Menu ───────────────────────────────────────────────
  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const { x: cx, y: cy } = screenToCanvas(e.clientX, e.clientY);
      const hitId = hitTest(cx, cy);
      if (hitId) {
        setSelectedId(hitId);
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          elementId: hitId,
        });
      }
    },
    [screenToCanvas, hitTest]
  );

  // ─── Double-Click (edit label) ──────────────────────────────────
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x: cx, y: cy } = screenToCanvas(e.clientX, e.clientY);
      const hitId = hitTest(cx, cy);
      if (hitId) {
        const el = elements.find((el) => el.id === hitId);
        if (el) {
          setEditingLabelId(hitId);
          setEditingLabelValue(el.label);
          setSelectedId(hitId);
        }
      }
    },
    [screenToCanvas, hitTest, elements]
  );

  // ─── Wheel Zoom ──────────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)));
    },
    []
  );

  // ─── Keyboard ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingLabelId) return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        pushUndo(elements);
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        setSelectedId(null);
      }

      if (e.key === "z" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if ((e.key === "z" && (e.metaKey || e.ctrlKey) && e.shiftKey) || (e.key === "y" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        redo();
      }

      if (e.key === "Escape") {
        setSelectedId(null);
        setContextMenu(null);
        setShowAddMenu(false);
        setEditingLabelId(null);
        if (isFullScreen) setIsFullScreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, editingLabelId, isFullScreen, pushUndo, undo, redo]);

  // ─── Add Element ────────────────────────────────────────────────
  const addElement = useCallback(
    (type: ElementType) => {
      const defaults = TYPE_DEFAULTS[type];
      const label =
        type === "custom"
          ? "Custom"
          : TYPE_LABELS[type] +
            (isTableType(type) ? ` ${elements.filter((e) => isTableType(e.type)).length + 1}` : "");

      const newEl: FloorElement = {
        id: generateId(),
        type,
        label,
        x: 100 - panOffset.x / zoom,
        y: 100 - panOffset.y / zoom,
        w: defaults.w,
        h: defaults.h,
        color: TYPE_COLORS[type],
        seats: defaults.seats,
      };

      pushUndo(elements);
      setElements((prev) => [...prev, newEl]);
      setSelectedId(newEl.id);
      setShowAddMenu(false);
    },
    [elements, panOffset, zoom, pushUndo]
  );

  // ─── Delete Selected ───────────────────────────────────────────
  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    pushUndo(elements);
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
    setContextMenu(null);
  }, [selectedId, elements, pushUndo]);

  // ─── Edit Seats ─────────────────────────────────────────────────
  const editSeats = useCallback(() => {
    if (!contextMenu) return;
    const el = elements.find((e) => e.id === contextMenu.elementId);
    if (!el || !isTableType(el.type)) return;
    const newSeats = prompt("Number of seats:", String(el.seats ?? 8));
    if (newSeats === null) return;
    const parsed = parseInt(newSeats, 10);
    if (isNaN(parsed) || parsed < 1) return;
    pushUndo(elements);
    setElements((prev) =>
      prev.map((e) => (e.id === contextMenu.elementId ? { ...e, seats: parsed } : e))
    );
    setContextMenu(null);
  }, [contextMenu, elements, pushUndo]);

  // ─── Export PNG ─────────────────────────────────────────────────
  const exportPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas for clean export (no selection handles)
    const tmpCanvas = document.createElement("canvas");
    const exportW = 1200;
    const exportH = 900;
    tmpCanvas.width = exportW;
    tmpCanvas.height = exportH;
    const ctx = tmpCanvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0d1520";
    ctx.fillRect(0, 0, exportW, exportH);

    // Grid
    ctx.strokeStyle = "rgba(189,212,228,0.05)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < exportW; gx += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, exportH);
      ctx.stroke();
    }
    for (let gy = 0; gy < exportH; gy += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(exportW, gy);
      ctx.stroke();
    }

    // Scale to fit all elements
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const el of elements) {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.w);
      maxY = Math.max(maxY, el.y + el.h);
    }
    const contentW = maxX - minX + 80;
    const contentH = maxY - minY + 80;
    const scale = Math.min(exportW / contentW, exportH / contentH, 1.5);
    const offsetX = (exportW - contentW * scale) / 2 - minX * scale + 40 * scale;
    const offsetY = (exportH - contentH * scale) / 2 - minY * scale + 40 * scale;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    for (const el of elements) {
      ctx.fillStyle = el.color;
      if (el.type === "table-round") {
        ctx.beginPath();
        ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.w, el.h, 4);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(189,212,228,0.15)";
      ctx.lineWidth = 1 / scale;
      if (el.type === "table-round") {
        ctx.beginPath();
        ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.w, el.h, 4);
        ctx.stroke();
      }

      const fontSize = Math.max(9, Math.min(14, el.w / 7));
      ctx.fillStyle = "rgba(189,212,228,0.8)";
      ctx.font = `700 ${fontSize}px Manrope, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const centerX = el.x + el.w / 2;
      const centerY = el.y + el.h / 2;

      if (el.seats !== undefined && isTableType(el.type)) {
        ctx.fillText(el.label, centerX, centerY - fontSize * 0.6);
        ctx.fillStyle = "rgba(189,212,228,0.5)";
        ctx.font = `600 ${fontSize * 0.8}px Manrope, sans-serif`;
        ctx.fillText(`${el.seats} seats`, centerX, centerY + fontSize * 0.6);
      } else {
        ctx.fillText(el.label, centerX, centerY);
      }
    }

    ctx.restore();

    const link = document.createElement("a");
    link.download = `floor-plan${roomId ? `-${roomId}` : ""}.png`;
    link.href = tmpCanvas.toDataURL("image/png");
    link.click();
  }, [elements, roomId]);

  // ─── Reset Zoom/Pan ─────────────────────────────────────────────
  const resetView = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // ─── Focus label input ──────────────────────────────────────────
  useEffect(() => {
    if (editingLabelId && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [editingLabelId]);

  // ─── Commit label edit ──────────────────────────────────────────
  const commitLabelEdit = useCallback(() => {
    if (!editingLabelId) return;
    if (editingLabelValue.trim()) {
      pushUndo(elements);
      setElements((prev) =>
        prev.map((el) =>
          el.id === editingLabelId ? { ...el, label: editingLabelValue.trim() } : el
        )
      );
    }
    setEditingLabelId(null);
  }, [editingLabelId, editingLabelValue, elements, pushUndo]);

  // ─── Styles ─────────────────────────────────────────────────────
  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(189,212,228,0.15)",
    borderRadius: 6,
    padding: "5px 8px",
    color: "rgba(189,212,228,0.7)",
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
    fontFamily: "Manrope, sans-serif",
  };

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "rgba(212,168,83,0.2)",
    border: "1px solid rgba(212,168,83,0.4)",
    color: "#d4a853",
  };

  // ─── Full Screen Wrapper ────────────────────────────────────────
  const fullScreenOverlay: React.CSSProperties = isFullScreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "#0a0f18",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Manrope, sans-serif",
      }
    : {};

  const containerStyle: React.CSSProperties = isFullScreen
    ? { flex: 1, display: "flex", flexDirection: "column" }
    : { padding: 16, display: "flex", flexDirection: "column", gap: 8, height: "100%" };

  // ─── Render ─────────────────────────────────────────────────────
  const canvasArea = (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        flex: 1,
        minHeight: isFullScreen ? 0 : 280,
        borderRadius: isFullScreen ? 0 : 8,
        overflow: "hidden",
        border: isFullScreen ? "none" : "1px solid rgba(189,212,228,0.1)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      />

      {/* Inline label editor */}
      {editingLabelId && (() => {
        const el = elements.find((e) => e.id === editingLabelId);
        if (!el) return null;
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const screenX = el.x * zoom + panOffset.x + rect.left - containerRef.current!.getBoundingClientRect().left;
        const screenY = el.y * zoom + panOffset.y + rect.top - containerRef.current!.getBoundingClientRect().top;
        return (
          <input
            ref={labelInputRef}
            value={editingLabelValue}
            onChange={(e) => setEditingLabelValue(e.target.value)}
            onBlur={commitLabelEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitLabelEdit();
              if (e.key === "Escape") setEditingLabelId(null);
            }}
            style={{
              position: "absolute",
              left: screenX,
              top: screenY,
              width: el.w * zoom,
              height: el.h * zoom,
              background: "rgba(13,21,32,0.9)",
              border: "1px solid #d4a853",
              borderRadius: 4,
              color: "rgba(189,212,228,0.9)",
              fontSize: 11,
              fontWeight: 700,
              textAlign: "center",
              fontFamily: "Manrope, sans-serif",
              outline: "none",
              zIndex: 10,
            }}
          />
        );
      })()}
    </div>
  );

  return (
    <div style={isFullScreen ? fullScreenOverlay : {}}>
      <div style={containerStyle}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isFullScreen ? "12px 16px" : 0,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(189,212,228,0.5)",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            Floor Plan
          </div>
          {isFullScreen && (
            <button onClick={() => setIsFullScreen(false)} style={buttonStyle}>
              <X size={12} />
              Close
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            padding: isFullScreen ? "0 16px 8px" : 0,
            flexShrink: 0,
          }}
        >
          {/* Add element */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowAddMenu((v) => !v)} style={showAddMenu ? activeButtonStyle : buttonStyle}>
              <Plus size={11} />
              Add
            </button>
            {showAddMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 4,
                  background: "#141c2a",
                  border: "1px solid rgba(189,212,228,0.15)",
                  borderRadius: 8,
                  padding: 4,
                  zIndex: 100,
                  minWidth: 150,
                  maxHeight: 280,
                  overflowY: "auto",
                }}
              >
                {(Object.keys(TYPE_LABELS) as ElementType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => addElement(type)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "6px 10px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 4,
                      color: "rgba(189,212,228,0.8)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Manrope, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: type === "table-round" ? "50%" : 2,
                        background: TYPE_COLORS[type],
                        border: "1px solid rgba(189,212,228,0.2)",
                        marginRight: 8,
                        verticalAlign: "middle",
                      }}
                    />
                    {TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delete */}
          <button onClick={deleteSelected} style={{ ...buttonStyle, opacity: selectedId ? 1 : 0.4 }} disabled={!selectedId}>
            <Trash2 size={11} />
            Del
          </button>

          {/* Divider */}
          <div style={{ width: 1, background: "rgba(189,212,228,0.1)", margin: "2px 2px" }} />

          {/* Grid snap */}
          <button onClick={() => setGridSnap((v) => !v)} style={gridSnap ? activeButtonStyle : buttonStyle}>
            <Grid3X3 size={11} />
          </button>

          {/* Zoom */}
          <button onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))} style={buttonStyle}>
            <ZoomOut size={11} />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 9,
              color: "rgba(189,212,228,0.5)",
              fontWeight: 700,
              minWidth: 32,
              justifyContent: "center",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            {Math.round(zoom * 100)}%
          </div>
          <button onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))} style={buttonStyle}>
            <ZoomIn size={11} />
          </button>

          {/* Reset view */}
          <button onClick={resetView} style={buttonStyle} title="Reset view">
            <RotateCcw size={11} />
          </button>

          {/* Divider */}
          <div style={{ width: 1, background: "rgba(189,212,228,0.1)", margin: "2px 2px" }} />

          {/* Undo / Redo */}
          <button
            onClick={undo}
            style={{ ...buttonStyle, opacity: undoStack.current.length > 0 ? 1 : 0.4 }}
          >
            <Undo2 size={11} />
          </button>
          <button
            onClick={redo}
            style={{ ...buttonStyle, opacity: redoStack.current.length > 0 ? 1 : 0.4 }}
          >
            <Redo2 size={11} />
          </button>

          {/* Divider */}
          <div style={{ width: 1, background: "rgba(189,212,228,0.1)", margin: "2px 2px" }} />

          {/* Export */}
          <button onClick={exportPng} style={buttonStyle}>
            <Download size={11} />
          </button>
        </div>

        {/* Canvas area */}
        {isSplitView ? (
          <div style={{ display: "flex", gap: 8, flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>{canvasArea}</div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                borderRadius: 8,
                border: "1px solid rgba(189,212,228,0.1)",
                background: "#0d1520",
                padding: 12,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(189,212,228,0.4)",
                  marginBottom: 8,
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Elements ({elements.length})
              </div>
              {elements.map((el) => (
                <div
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 8px",
                    borderRadius: 4,
                    marginBottom: 2,
                    cursor: "pointer",
                    background: el.id === selectedId ? "rgba(212,168,83,0.1)" : "transparent",
                    border: el.id === selectedId ? "1px solid rgba(212,168,83,0.3)" : "1px solid transparent",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: el.type === "table-round" ? "50%" : 2,
                      background: el.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(189,212,228,0.7)",
                      fontFamily: "Manrope, sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {el.label}
                    {el.seats !== undefined && (
                      <span style={{ color: "rgba(189,212,228,0.4)", marginLeft: 4 }}>
                        ({el.seats})
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          canvasArea
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0, padding: isFullScreen ? "8px 16px 16px" : 0 }}>
          <button
            onClick={() => setIsFullScreen(true)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(189,212,228,0.15)",
              borderRadius: 8,
              padding: "8px 0",
              color: "rgba(189,212,228,0.7)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            <Maximize2 size={12} />
            Full Screen
          </button>
          <button
            onClick={() => setIsSplitView((v) => !v)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: isSplitView ? "rgba(212,168,83,0.15)" : "rgba(255,255,255,0.07)",
              border: `1px solid ${isSplitView ? "rgba(212,168,83,0.3)" : "rgba(189,212,228,0.15)"}`,
              borderRadius: 8,
              padding: "8px 0",
              color: isSplitView ? "#d4a853" : "rgba(189,212,228,0.7)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            <Columns size={12} />
            Split View
          </button>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onClick={() => setContextMenu(null)}
          />
          <div
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 9999,
              background: "#141c2a",
              border: "1px solid rgba(189,212,228,0.2)",
              borderRadius: 8,
              padding: 4,
              minWidth: 130,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <button
              onClick={() => {
                setEditingLabelId(contextMenu.elementId);
                const el = elements.find((e) => e.id === contextMenu.elementId);
                if (el) setEditingLabelValue(el.label);
                setContextMenu(null);
              }}
              style={ctxMenuItemStyle}
              onMouseEnter={ctxMenuHover}
              onMouseLeave={ctxMenuLeave}
            >
              Rename
            </button>
            {isTableType(elements.find((e) => e.id === contextMenu.elementId)?.type ?? "custom") && (
              <button onClick={editSeats} style={ctxMenuItemStyle} onMouseEnter={ctxMenuHover} onMouseLeave={ctxMenuLeave}>
                Edit Seats
              </button>
            )}
            <div style={{ height: 1, background: "rgba(189,212,228,0.1)", margin: "4px 0" }} />
            <button
              onClick={deleteSelected}
              style={{ ...ctxMenuItemStyle, color: "#e05555" }}
              onMouseEnter={ctxMenuHover}
              onMouseLeave={ctxMenuLeave}
            >
              Delete
            </button>
          </div>
        </>
      )}

      {/* Close add menu when clicking elsewhere */}
      {showAddMenu && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => setShowAddMenu(false)}
        />
      )}
    </div>
  );
}

// ─── Context menu item helpers ─────────────────────────────────────

const ctxMenuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "6px 10px",
  background: "transparent",
  border: "none",
  borderRadius: 4,
  color: "rgba(189,212,228,0.8)",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Manrope, sans-serif",
};

function ctxMenuHover(e: React.MouseEvent<HTMLButtonElement>) {
  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)";
}

function ctxMenuLeave(e: React.MouseEvent<HTMLButtonElement>) {
  (e.target as HTMLElement).style.background = "transparent";
}
