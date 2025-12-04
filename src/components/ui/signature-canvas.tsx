import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "./button";
import { Eraser } from "lucide-react";

interface SignatureCanvasProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  onSignatureChange?: (isEmpty: boolean) => void;
  className?: string;
}

export const SignatureCanvas = ({
  width = 300,
  height = 150,
  strokeColor = "#000000",
  strokeWidth = 2,
  onSignatureChange,
  className = "",
}: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Set drawing styles
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }, [width, height, strokeColor, strokeWidth]);

  const getCoordinates = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;

      if ("touches" in e) {
        const touch = e.touches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      } else {
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        };
      }
    },
    [width, height]
  );

  const startDrawing = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      const coords = getCoordinates(e);
      if (!coords) return;

      setIsDrawing(true);
      lastPointRef.current = coords;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
      }
    },
    [getCoordinates]
  );

  const draw = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const coords = getCoordinates(e);
      if (!coords || !lastPointRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      // Draw smooth line using quadratic curve
      const midPoint = {
        x: (lastPointRef.current.x + coords.x) / 2,
        y: (lastPointRef.current.y + coords.y) / 2,
      };

      ctx.quadraticCurveTo(
        lastPointRef.current.x,
        lastPointRef.current.y,
        midPoint.x,
        midPoint.y
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(midPoint.x, midPoint.y);

      lastPointRef.current = coords;

      if (isEmpty) {
        setIsEmpty(false);
        onSignatureChange?.(false);
      }
    },
    [isDrawing, getCoordinates, isEmpty, onSignatureChange]
  );

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPointRef.current = null;
    }
  }, [isDrawing]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    setIsEmpty(true);
    onSignatureChange?.(true);
  }, [width, height, onSignatureChange]);

  const getDataUrl = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  }, []);

  const getBlob = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve(null);
        return;
      }
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }, []);

  // Check if signature has enough content (not just a dot)
  const isValidSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let nonWhitePixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      // Check if pixel is not white
      if (pixels[i] < 250 || pixels[i + 1] < 250 || pixels[i + 2] < 250) {
        nonWhitePixels++;
      }
    }

    // Require at least 100 non-white pixels for a valid signature
    return nonWhitePixels > 100;
  }, [isEmpty]);

  // Expose methods via ref
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      (canvas as any).getSignatureDataUrl = getDataUrl;
      (canvas as any).getSignatureBlob = getBlob;
      (canvas as any).clearSignature = clear;
      (canvas as any).isValidSignature = isValidSignature;
      (canvas as any).isSignatureEmpty = () => isEmpty;
    }
  }, [getDataUrl, getBlob, clear, isValidSignature, isEmpty]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          className="touch-none cursor-crosshair w-full"
          style={{ maxWidth: width, height }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-muted-foreground/50 text-sm">
              请在此处手写签名
            </span>
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={clear}
        className="self-start"
      >
        <Eraser className="w-4 h-4 mr-1" />
        清除签名
      </Button>
    </div>
  );
};

export default SignatureCanvas;
