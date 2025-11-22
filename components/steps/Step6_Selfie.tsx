import React, { useRef, useState, useEffect } from 'react';
import { FormData } from '../../types';
import { Camera, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Step6Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Step6_Selfie: React.FC<Step6Props> = ({ data, updateData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(data.selfie);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const image = canvasRef.current.toDataURL('image/png');
        setCapturedImage(image);
        updateData({ selfie: image });
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    updateData({ selfie: null });
    startCamera();
  };

  useEffect(() => {
    if (!capturedImage) {
       startCamera();
    }
    return () => {
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 animate-fade-in flex flex-col items-center">
      <h2 className="text-2xl font-bold text-intelis-darkBlue mb-2">Validação Facial</h2>
      <p className="text-gray-600 text-sm text-center max-w-lg">
        Para sua segurança e para cumprir os requisitos legais, precisamos de uma selfie atual.
        Posicione seu rosto no centro da câmera.
      </p>

      <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-lg overflow-hidden shadow-xl border-4 border-gray-200">
        {error ? (
            <div className="w-full h-full flex items-center justify-center text-white text-center p-4">
                {error}
            </div>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Selfie" className="w-full h-full object-cover flip-horizontal" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
          />
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-4 mt-4">
        {!capturedImage && !error && (
          <Button onClick={takePhoto} className="w-48">
            <Camera className="mr-2" size={20} />
            Tirar Foto
          </Button>
        )}

        {capturedImage && (
          <Button onClick={retake} variant="outline" className="w-48">
            <RefreshCw className="mr-2" size={20} />
            Tirar Outra
          </Button>
        )}
      </div>
    </div>
  );
};
