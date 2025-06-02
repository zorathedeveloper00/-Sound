import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFileLoad: (file: File) => void;
  onPlay: () => void;
  onExport: () => void;
  isPlaying: boolean;
  hasAudio: boolean;
  audioElement: HTMLAudioElement | null;
}

export function FileUpload({ onFileLoad, onPlay, onExport, isPlaying, hasAudio, audioElement }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
    }
  };

  return (
    <Card className="bg-[hsl(var(--dark-800))] border-[hsl(var(--dark-600))] p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-[hsl(var(--accent-blue))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            Audio File Management
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <input 
                ref={fileInputRef}
                type="file" 
                accept="audio/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="border-2 border-dashed border-[hsl(var(--dark-500))] hover:border-[hsl(var(--accent-blue))] rounded-lg p-8 text-center transition-colors duration-300">
                <svg className="w-12 h-12 text-[hsl(var(--text-muted))] mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
