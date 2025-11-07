import React from 'react';

interface PosterPreviewProps {
  originalImage: string | null;
  generatedPoster: string | null;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="w-full aspect-square bg-[var(--pale-gray-dark)] rounded-lg animate-pulse flex items-center justify-center">
        <svg className="w-12 h-12 text-[var(--pale-gray)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>
)

const PosterPreview: React.FC<PosterPreviewProps> = ({ originalImage, generatedPoster, isLoading }) => {
  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[var(--rich-blue)]">Original Image</h3>
          {originalImage ? (
            <img src={originalImage} alt="Original Upload" className="w-full aspect-square object-contain rounded-xl bg-white/50" />
          ) : (
             <div className="w-full aspect-square bg-white/50 rounded-xl flex items-center justify-center text-[var(--rich-blue)]/50">
                <p>Upload a base image to begin</p>
             </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[var(--rich-blue)]">Generated Poster</h3>
          {isLoading ? (
            <LoadingSkeleton />
          ) : generatedPoster ? (
            <img src={generatedPoster} alt="Generated Poster" className="w-full aspect-square object-contain rounded-xl bg-white/50" />
          ) : (
            <div className="w-full aspect-square bg-white/50 rounded-xl flex items-center justify-center text-[var(--rich-blue)]/50">
                <p>Your AI-generated poster will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosterPreview;