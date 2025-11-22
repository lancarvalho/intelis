
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onEnd: (base64: string | null) => void;
  initialData?: string | null;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onEnd, initialData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize or restore
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size properly based on container width
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Save content before resize
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

        // Resize
        canvas.width = parent.clientWidth;
        canvas.height = 200; // Fixed height

        // Restore context settings
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';

        // Restore content (simple scale for demo, ideally re-draw paths)
        // For now, clear on resize to avoid blur, simpler for this iteration
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Restore initial data if present (simple display)
    if (initialData) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            setHasSignature(true);
        };
        img.src = initialData;
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const { x, y } = getCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const { x, y } = getCoordinates(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      if (!hasSignature) setHasSignature(true);
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
        onEnd(canvas.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      onEnd(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative border-2 border-gray-300 rounded-lg bg-gray-50 overflow-hidden touch-none">
         {!hasSignature && !isDrawing && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 select-none">
                 <div className="flex flex-col items-center">
                     <PenTool size={24} className="mb-2 opacity-50"/>
                     <span className="text-sm">Assine aqui com o dedo ou mouse</span>
                 </div>
             </div>
         )}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="w-full h-[200px] cursor-crosshair"
        />
      </div>
      <div className="flex justify-end">
        <button 
            type="button"
            onClick={clear}
            className="text-red-500 text-sm flex items-center gap-1 hover:text-red-700 transition-colors"
        >
            <Eraser size={14} /> Limpar Assinatura
        </button>
      </div>
    </div>
  );
};
