
import React, { useState, useCallback } from 'react';
import type { AspectRatio, Resolution } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { generateVideo } from './services/geminiService';

// --- Helper Components (defined within App.tsx to reduce file count) ---

const Header: React.FC = () => (
  <header className="py-4 px-8 border-b border-brand-gray-700 w-full">
    <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
      VEO Video Generator
    </h1>
  </header>
);

interface OptionSelectorProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  selectedValue: T;
  onChange: (value: T) => void;
}

const OptionSelector = <T extends string,>({ label, options, selectedValue, onChange }: OptionSelectorProps<T>) => (
  <div>
    <label className="block text-sm font-medium text-brand-gray-200 mb-2">{label}</label>
    <div className="flex items-center gap-4 bg-brand-gray-800 p-1 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-full text-center px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
            selectedValue === option.value
              ? 'bg-brand-purple text-white font-semibold shadow-lg'
              : 'bg-transparent text-brand-gray-200 hover:bg-brand-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const Spinner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <svg className="animate-spin h-12 w-12 text-brand-purple-light mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-lg font-semibold text-brand-gray-100">Generating Video</p>
    <p className="text-sm text-brand-gray-300 mt-1">{message}</p>
  </div>
);


// --- Main Application Component ---

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [resolution, setResolution] = useState<Resolution>('1080p');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(image?.preview) URL.revokeObjectURL(image.preview);
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const removeImage = () => {
    if(image?.preview) URL.revokeObjectURL(image.preview);
    setImage(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setVideoUrl(null);
    setError(null);
    setLoadingMessage('Preparing assets...');

    try {
      let imagePayload;
      if (image) {
        const base64Data = await fileToBase64(image.file);
        imagePayload = { data: base64Data, mimeType: image.file.type };
      }

      const videoBlob = await generateVideo(
        { prompt, image: imagePayload, aspectRatio, soundEnabled, resolution },
        (message: string) => setLoadingMessage(message)
      );
      
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred during video generation.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, image, aspectRatio, soundEnabled, resolution]);

  return (
    <div className="min-h-screen bg-brand-gray-900 flex flex-col items-center">
      <Header />
      <main className="w-full max-w-7xl flex-grow p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Controls Panel */}
          <div className="bg-brand-gray-800 rounded-xl p-6 flex flex-col gap-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">Video Configuration</h2>
            
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-brand-gray-200 mb-2">Prompt</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your video. You can use plain text or a JSON formatted string."
                className="w-full h-32 p-3 bg-brand-gray-900 border border-brand-gray-700 rounded-lg text-brand-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-200 mb-2">Reference Image (Optional)</label>
              {image ? (
                <div className="relative group">
                  <img src={image.preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition opacity-0 group-hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-brand-gray-700 rounded-lg flex items-center justify-center text-brand-gray-400">
                  <label htmlFor="image-upload" className="cursor-pointer p-4 text-center hover:text-brand-purple-light transition">
                    Click to upload
                    <input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} disabled={isLoading} />
                  </label>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OptionSelector label="Aspect Ratio" options={[{value: '16:9', label: '16:9'}, {value: '9:16', label: '9:16'}]} selectedValue={aspectRatio} onChange={setAspectRatio} />
              <OptionSelector label="Resolution" options={[{value: '720p', label: '720p'}, {value: '1080p', label: '1080p'}]} selectedValue={resolution} onChange={setResolution} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-gray-200 mb-2">Sound</label>
              <div className="flex items-center gap-4 bg-brand-gray-800 p-1 rounded-lg">
                <button onClick={() => setSoundEnabled(true)} className={`w-full text-center px-4 py-2 text-sm rounded-md transition-colors duration-200 ${soundEnabled ? 'bg-brand-purple text-white font-semibold shadow-lg' : 'bg-transparent text-brand-gray-200 hover:bg-brand-gray-700'}`}>Enabled</button>
                <button onClick={() => setSoundEnabled(false)} className={`w-full text-center px-4 py-2 text-sm rounded-md transition-colors duration-200 ${!soundEnabled ? 'bg-brand-purple text-white font-semibold shadow-lg' : 'bg-transparent text-brand-gray-200 hover:bg-brand-gray-700'}`}>Disabled</button>
              </div>
               <p className="text-xs text-brand-gray-400 mt-2">Note: Sound & Resolution are for future model compatibility and may not be applied by the current VEO model.</p>
            </div>
            

            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt}
              className="w-full mt-auto py-3 px-6 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple-light transition-all duration-300 disabled:bg-brand-gray-700 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {isLoading ? 'Generating...' : 'Generate Video'}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-brand-gray-800 rounded-xl p-6 flex flex-col items-center justify-center shadow-2xl min-h-[400px] lg:min-h-0">
            {isLoading ? (
              <Spinner message={loadingMessage} />
            ) : error ? (
              <div className="text-center text-red-400">
                <h3 className="text-lg font-bold mb-2">Error</h3>
                <p className="text-sm bg-red-900 bg-opacity-30 p-3 rounded-md">{error}</p>
              </div>
            ) : videoUrl ? (
              <div className="w-full flex flex-col items-center gap-4">
                 <video src={videoUrl} controls className="w-full max-h-[60vh] rounded-lg" />
                 <a
                    href={videoUrl}
                    download={`veo-video-${Date.now()}.mp4`}
                    className="w-full max-w-md text-center py-3 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105"
                 >
                   Download Video
                 </a>
              </div>
            ) : (
              <div className="text-center text-brand-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <h3 className="mt-4 text-lg font-semibold text-brand-gray-200">Your generated video will appear here</h3>
                <p className="mt-1 text-sm">Fill in the details on the left and click "Generate Video" to start.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
