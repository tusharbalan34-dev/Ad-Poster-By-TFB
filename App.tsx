import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PosterPreview from './components/PosterPreview';
import { generatePoster, generateImageFromText } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import SparklesIcon from './components/icons/SparklesIcon';

type ImageState = {
  file: File;
  dataUrl: string;
  base64: string;
  mimeType: string;
};

type AspectRatio = '1:1' | '16:9' | '9:16';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('Summer Sale');
  const [headline, setHeadline] = useState<string>('50% Off Everything!');
  const [bodyText, setBodyText] = useState<string>('Limited time offer. Visit our store today.');
  const [baseImage, setBaseImage] = useState<ImageState | null>(null);
  const [logoImage, setLogoImage] = useState<ImageState | null>(null);
  
  const [editPrompt, setEditPrompt] = useState<string>('');
  
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [backgroundPrompt, setBackgroundPrompt] = useState<string>('A vibrant, abstract background with summer colors');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isGeneratingBackground, setIsGeneratingBackground] = useState<boolean>(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);

  const suggestedPrompt = useMemo(() => {
    let prompt = `Create a promotional poster with a "${theme}" theme. `;
    prompt += `The main headline is "${headline}". `;
    if (bodyText) prompt += `Include the body text: "${bodyText}". `;
    prompt += `The style should be eye-catching and professional. `;
    if (logoImage) prompt += `Incorporate the provided logo, placing it tastefully (e.g., top-right or bottom-center). `;
    prompt += `Use the base image as the primary visual element, but feel free to stylize it to match the theme.`;
    return prompt;
  }, [theme, headline, bodyText, logoImage]);

  const handleImageUpload = async (setter: React.Dispatch<React.SetStateAction<ImageState | null>>, file: File, dataUrl: string) => {
    try {
      const base64 = await fileToBase64(file);
      setter({ file, dataUrl, base64, mimeType: file.type });
    } catch (err) {
      setError('Failed to process image file.');
      console.error(err);
    }
  };

  const handleGenerateBackground = async () => {
    if (!backgroundPrompt) {
      setBackgroundError('Please enter a prompt to generate a background.');
      return;
    }
    setIsGeneratingBackground(true);
    setBackgroundError(null);
    setError(null);

    try {
      const imageDataUrl = await generateImageFromText(backgroundPrompt, aspectRatio);
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();
      const file = new File([blob], "ai-generated-asset.png", { type: blob.type });

      await handleImageUpload(setBaseImage, file, imageDataUrl);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setBackgroundError(errorMessage);
    } finally {
      setIsGeneratingBackground(false);
    }
  };

  const handleGenerateClick = async () => {
    if (!baseImage) {
      setError('Please upload a base image first.');
      return;
    }
    if (!editPrompt && !suggestedPrompt) {
        setError('Please provide an editing prompt.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPoster(null);

    const finalPrompt = editPrompt || suggestedPrompt;

    try {
      const result = await generatePoster({
        baseImage: { base64: baseImage.base64, mimeType: baseImage.mimeType },
        logoImage: logoImage ? { base64: logoImage.base64, mimeType: logoImage.mimeType } : undefined,
        prompt: finalPrompt,
      });
      setGeneratedPoster(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isGenerateDisabled = isLoading || !baseImage || isGeneratingBackground;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 flex flex-col gap-6 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-[var(--rich-blue)]/10">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[var(--rich-blue)]">1. Campaign Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-[var(--rich-blue)]/80">Campaign Theme</label>
                  <input
                    type="text"
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., Vintage, Modern, Eco-Friendly"
                    className="mt-1 block w-full bg-[var(--pale-gray)] border border-[var(--rich-blue)]/20 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--rich-blue)]/50 focus:border-[var(--rich-blue)]/80 sm:text-sm text-[var(--rich-blue)]"
                  />
                </div>
                <div>
                  <label htmlFor="headline" className="block text-sm font-medium text-[var(--rich-blue)]/80">Headline</label>
                  <input
                    type="text"
                    id="headline"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g., Grand Opening!"
                    className="mt-1 block w-full bg-[var(--pale-gray)] border border-[var(--rich-blue)]/20 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--rich-blue)]/50 focus:border-[var(--rich-blue)]/80 sm:text-sm text-[var(--rich-blue)]"
                  />
                </div>
                <div>
                  <label htmlFor="bodyText" className="block text-sm font-medium text-[var(--rich-blue)]/80">Body Text</label>
                  <textarea
                    id="bodyText"
                    rows={3}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="e.g., Join us on Saturday for exclusive deals."
                    className="mt-1 block w-full bg-[var(--pale-gray)] border border-[var(--rich-blue)]/20 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--rich-blue)]/50 focus:border-[var(--rich-blue)]/80 sm:text-sm text-[var(--rich-blue)]"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[var(--rich-blue)]">2. Upload Assets</h2>
              <div className="space-y-4">
                <ImageUploader 
                  id="base-image" 
                  label="Base Image (Required)" 
                  onImageUpload={(file, dataUrl) => handleImageUpload(setBaseImage, file, dataUrl)}
                  previewUrl={baseImage?.dataUrl ?? null}
                />
                
                <div className="p-4 bg-[var(--pale-gray)]/50 border border-[var(--rich-blue)]/20 rounded-xl space-y-3">
                    <div>
                        <p className="block text-sm font-medium text-[var(--rich-blue)]/80">Or generate one with AI</p>
                        <textarea
                            id="backgroundPrompt"
                            rows={3}
                            value={backgroundPrompt}
                            onChange={(e) => setBackgroundPrompt(e.target.value)}
                            placeholder="e.g., A minimalist geometric pattern"
                            className="mt-2 block w-full bg-white/80 border border-[var(--rich-blue)]/20 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--rich-blue)]/50 focus:border-[var(--rich-blue)]/80 sm:text-sm text-[var(--rich-blue)]"
                        />
                    </div>
                     <div>
                        <p className="block text-xs font-medium text-[var(--rich-blue)]/60 mb-2">Aspect Ratio</p>
                        <div className="flex gap-2">
                            {(['1:1', '16:9', '9:16'] as const).map((ratio) => (
                            <button
                                key={ratio}
                                type="button"
                                onClick={() => setAspectRatio(ratio)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                aspectRatio === ratio
                                    ? 'bg-[var(--rich-blue)] text-[var(--pale-gray)]'
                                    : 'bg-white/70 hover:bg-white text-[var(--rich-blue)]/80 border border-[var(--rich-blue)]/20'
                                }`}
                            >
                                {ratio === '1:1' ? 'Square' : ratio === '16:9' ? 'Landscape' : 'Portrait'}
                            </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleGenerateBackground}
                        disabled={isGeneratingBackground}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[var(--rich-blue)]/30 text-sm font-medium rounded-lg shadow-sm text-[var(--rich-blue)] bg-[var(--rich-blue)]/10 hover:bg-[var(--rich-blue)]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--pale-gray)] focus:ring-[var(--rich-blue)] disabled:bg-black/5 disabled:text-black/40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isGeneratingBackground ? 'Creating...' : 'Generate Background'}
                        {!isGeneratingBackground && <SparklesIcon className="w-4 h-4" />}
                    </button>
                    {backgroundError && <p className="text-red-500 text-xs mt-2">{backgroundError}</p>}
                </div>
                
                <ImageUploader 
                  id="logo-image" 
                  label="Logo (Optional)" 
                  onImageUpload={(file, dataUrl) => handleImageUpload(setLogoImage, file, dataUrl)} 
                  previewUrl={logoImage?.dataUrl ?? null}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-[var(--rich-blue)]">3. Generate with AI</h2>
                <div>
                  <label htmlFor="editPrompt" className="block text-sm font-medium text-[var(--rich-blue)]/80">Editing Prompt</label>
                   <p className="text-xs text-[var(--rich-blue)]/60 mb-2">Describe the changes you want. You can also use our suggestion below.</p>
                  <textarea
                    id="editPrompt"
                    rows={5}
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder={suggestedPrompt}
                    className="mt-1 block w-full bg-[var(--pale-gray)] border border-[var(--rich-blue)]/20 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--rich-blue)]/50 focus:border-[var(--rich-blue)]/80 sm:text-sm text-[var(--rich-blue)]"
                  />
                  <button
                    type="button"
                    onClick={() => setEditPrompt(suggestedPrompt)}
                    className="text-xs text-[var(--rich-blue)]/70 hover:text-[var(--rich-blue)] mt-2 transition-colors"
                  >
                    Use suggested prompt
                  </button>
                </div>
            </div>
            
            <button
              onClick={handleGenerateClick}
              disabled={isGenerateDisabled}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-base font-bold rounded-lg shadow-lg text-[var(--pale-gray)] bg-[var(--rich-blue)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--pale-gray)] focus:ring-[var(--rich-blue)] disabled:bg-[var(--rich-blue)]/40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Generating...' : 'Generate Poster'}
              {!isLoading && <SparklesIcon className="w-5 h-5" />}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Right Column: Previews */}
          <div className="lg:col-span-2">
            <PosterPreview
              originalImage={baseImage?.dataUrl ?? null}
              generatedPoster={generatedPoster}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;