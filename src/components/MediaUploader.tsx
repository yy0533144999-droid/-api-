import React, { useRef } from 'react';
import { 
  FileAudio, 
  Film, 
  Image as ImageIcon, 
  Paperclip, 
  Sparkles, 
  X,
  UploadCloud
} from 'lucide-react';
import { MediaAttachment } from '../types';

interface MediaUploaderProps {
  attachments: MediaAttachment[];
  onChange: (attachments: MediaAttachment[]) => void;
  maxFiles?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  attachments,
  onChange,
  maxFiles = 5,
}) => {
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'video' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as Data URL
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      if (result) {
        const newAttachment: MediaAttachment = {
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type,
          url: result,
          name: file.name,
          size: formatFileSize(file.size),
        };
        onChange([...attachments, newAttachment]);
      }
    };
    reader.readAsDataURL(file);

    // reset input
    e.target.value = '';
  };

  const handleAddSampleAudio = () => {
    const sampleAudio: MediaAttachment = {
      id: `media-sample-audio-${Date.now()}`,
      type: 'audio',
      url: 'https://actions.google.com/sounds/v1/telephones/telephone_ring.ogg',
      name: 'צלצול_שלוחת_IVR_דוגמה.ogg',
      size: '142 KB',
      duration: '00:08',
    };
    onChange([...attachments, sampleAudio]);
  };

  const handleAddSampleVideo = () => {
    const sampleVideo: MediaAttachment = {
      id: `media-sample-video-${Date.now()}`,
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      name: 'הדרכת_הגדרת_שלוחה_IVR_וידאו.mp4',
      size: '2.4 MB',
      duration: '00:15',
    };
    onChange([...attachments, sampleVideo]);
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-2.5">
      {/* Hidden file inputs */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={(e) => handleFileUpload(e, 'audio')}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => handleFileUpload(e, 'video')}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'image')}
        className="hidden"
      />

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
          <Paperclip className="w-3.5 h-3.5 text-blue-600" />
          צירוף מדיה וקבצים:
        </span>

        {/* Audio upload button */}
        <button
          type="button"
          onClick={() => audioInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors shadow-2xs cursor-pointer"
          title="העלה קובץ שמע (WAV, MP3, OGG)"
        >
          <FileAudio className="w-3.5 h-3.5 text-sky-600" />
          <span>העלאת קובץ שמע (אודיו)</span>
        </button>

        {/* Video upload button */}
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
          title="העלה סרטון וידאו (MP4, WebM)"
        >
          <Film className="w-3.5 h-3.5 text-rose-600" />
          <span>העלאת סרטון (וידאו)</span>
        </button>

        {/* Image upload button */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
          title="העלה תמונה / צילום מסך"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>תמונה</span>
        </button>

        {/* Quick Sample Media buttons */}
        <div className="flex items-center gap-1 mr-auto text-xs">
          <button
            type="button"
            onClick={handleAddSampleAudio}
            className="text-[11px] text-sky-700 bg-sky-100/70 hover:bg-sky-200/80 px-2 py-1 rounded-lg transition-colors border border-sky-200"
            title="הוסף שמע הדגמה של IVR"
          >
            + צליל הדגמה
          </button>
          <button
            type="button"
            onClick={handleAddSampleVideo}
            className="text-[11px] text-rose-700 bg-rose-100/70 hover:bg-rose-200/80 px-2 py-1 rounded-lg transition-colors border border-rose-200"
            title="הוסף סרטון הדגמה"
          >
            + סרטון הדגמה
          </button>
        </div>
      </div>

      {/* Attachment Badges / Previews */}
      {attachments.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>קבצים מצורפים ({attachments.length}):</span>
            <span className="text-[10px]">יוצגו בנגן שמע או וידאו מובנה בפוסט</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {attachments.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-white border border-slate-200 shadow-2xs px-2.5 py-1.5 rounded-lg text-xs"
              >
                {item.type === 'audio' && <FileAudio className="w-4 h-4 text-sky-600" />}
                {item.type === 'video' && <Film className="w-4 h-4 text-rose-600" />}
                {item.type === 'image' && <ImageIcon className="w-4 h-4 text-emerald-600" />}

                <span className="font-medium text-slate-800 max-w-[150px] sm:max-w-[200px] truncate">
                  {item.name}
                </span>

                {item.size && (
                  <span className="text-[10px] text-slate-400 font-mono">({item.size})</span>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                  title="הסר קובץ"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
