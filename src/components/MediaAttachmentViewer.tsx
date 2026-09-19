import React, { useState, useRef } from 'react';
import { 
  Music, 
  Video, 
  Image as ImageIcon, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Maximize2, 
  FileAudio, 
  Film
} from 'lucide-react';
import { MediaAttachment } from '../types';

interface MediaAttachmentViewerProps {
  attachments?: MediaAttachment[];
  onRemove?: (id: string) => void;
  isEditable?: boolean;
}

export const MediaAttachmentViewer: React.FC<MediaAttachmentViewerProps> = ({
  attachments,
  onRemove,
  isEditable = false,
}) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-3 my-3">
      {attachments.filter((item): item is MediaAttachment => Boolean(item && typeof item === 'object' && item.id)).map((item) => (
        <div key={item.id} className="relative group">
          {item.type === 'audio' && (
            <AudioPlayerItem item={item} />
          )}

          {item.type === 'video' && (
            <VideoPlayerItem item={item} />
          )}

          {item.type === 'image' && (
            <ImagePlayerItem item={item} />
          )}

          {isEditable && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="absolute -top-2 -right-2 bg-rose-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-rose-700 transition-colors z-10"
              title="הסר קובץ"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// Custom Audio Player Item
const AudioPlayerItem: React.FC<{ item: MediaAttachment }> = ({ item }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error('Audio play error:', e);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatSecs = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-gradient-to-r from-sky-900/90 to-[#0f2b48] border border-sky-600/40 rounded-2xl p-3.5 sm:p-4 text-white shadow-md">
      <audio
        ref={audioRef}
        src={item.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Audio Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500/30 border border-sky-400/40 flex items-center justify-center shrink-0 text-sky-300 shadow-inner">
            <FileAudio className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h5 className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px] sm:max-w-xs">
                {item.name || 'קובץ שמע / הקלטת IVR'}
              </h5>
              <span className="text-[10px] bg-sky-400/20 text-sky-300 font-mono px-1.5 py-0.5 rounded border border-sky-400/30 shrink-0">
                AUDIO / WAV
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              השמעת קובץ קול / ניתוב טלפוניה
              {item.size ? ` • ${item.size}` : ''}
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-[#091d32] flex items-center justify-center font-bold shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
            title={isPlaying ? 'השהה' : 'נגן קובץ שמע'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={isMuted ? 'בטל השתקה' : 'השתק'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <a
            href={item.url}
            download={item.name || 'audio-file.mp3'}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="הורד קובץ שמע למחשב"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-3 flex items-center gap-2.5 text-xs text-slate-300">
        <span className="font-mono text-[11px] text-sky-200 min-w-[35px] text-left">
          {formatSecs(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />
        <span className="font-mono text-[11px] text-slate-400 min-w-[35px] text-right">
          {formatSecs(duration)}
        </span>
      </div>
    </div>
  );
};

// Video Player Item
const VideoPlayerItem: React.FC<{ item: MediaAttachment }> = ({ item }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="bg-[#0b1b2d] border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
      <div className="px-4 py-2.5 bg-[#0f2b48] border-b border-slate-700/60 flex items-center justify-between text-xs text-white">
        <div className="flex items-center gap-2 truncate">
          <Film className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-bold truncate">{item.name || 'סרטון הדרכה / סרטון מצורף'}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded border border-rose-400/30">
            VIDEO / MP4
          </span>
          <a
            href={item.url}
            download={item.name || 'video-file.mp4'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="הורד סרטון למחשב או לטלפון"
          >
            <Download className="w-3.5 h-3.5" />
            <span>הורדת סרטון</span>
          </a>
        </div>
      </div>
      <div className="relative bg-black flex items-center justify-center min-h-[220px]">
        {hasError ? (
          <div className="p-6 text-center text-slate-300 space-y-3">
            <Film className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-xs">הסרטון אינו נטען ישירות בדפדפן. ניתן להוריד או לצפות ישירות בקישור:</p>
            <a
              href={item.url}
              download={item.name || 'video-file.mp4'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-rose-500 transition-colors"
            >
              <Download className="w-4 h-4" />
              הורד סרטון ({item.name || 'וידאו'})
            </a>
          </div>
        ) : (
          <video
            controls
            playsInline
            preload="metadata"
            onError={() => setHasError(true)}
            className="w-full max-h-[420px] object-contain rounded-b-xl"
            src={item.url}
          >
            הדפדפן שלך אינו תומך בהצגת וידאו.
          </video>
        )}
      </div>
      <div className="px-4 py-2 bg-[#091a2b] text-[11px] text-slate-400 flex items-center justify-between">
        <span>{item.size ? `גודל קובץ: ${item.size}` : 'קובץ וידאו זמין לצפייה והורדה'}</span>
        <a
          href={item.url}
          download={item.name || 'video-file.mp4'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-300 hover:text-white flex items-center gap-1 font-medium underline"
        >
          <Download className="w-3 h-3" />
          <span>קישור להורדה ישירה</span>
        </a>
      </div>
    </div>
  );
};

// Image Item
const ImagePlayerItem: React.FC<{ item: MediaAttachment }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-xs">
        <div 
          onClick={() => setIsOpen(true)}
          className="cursor-pointer group relative overflow-hidden max-h-96 flex items-center justify-center bg-slate-950"
        >
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-auto max-h-96 object-contain group-hover:scale-101 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-semibold">
            <Maximize2 className="w-4 h-4" />
            <span>לחץ להגדלה</span>
          </div>
        </div>
        <div className="px-3 py-1.5 text-xs text-slate-600 bg-white border-t border-slate-100 flex items-center justify-between">
          <span className="truncate">{item.name}</span>
          {item.size && <span className="text-[11px] text-slate-400">{item.size}</span>}
        </div>
      </div>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={item.url}
            alt={item.name}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
};
