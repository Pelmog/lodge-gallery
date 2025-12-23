import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Gallery } from './components/Gallery';
import { Lightbox } from './components/Lightbox';
import { getLodgeById, lodges } from './data/lodges';

function App() {
  const { lodgeId } = useParams<{ lodgeId: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect root to first lodge
  if (!lodgeId) {
    return <Navigate to={`/${lodges[0]?.id ?? ''}`} replace />;
  }

  const selectedLodge = getLodgeById(lodgeId);

  // Handle invalid lodge ID
  if (!selectedLodge) {
    return <Navigate to={`/${lodges[0]?.id ?? ''}`} replace />;
  }

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNavigateLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-800">{selectedLodge.name}</span>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Gallery lodge={selectedLodge} onImageClick={handleImageClick} />
        </main>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={selectedLodge.images}
          currentIndex={lightboxIndex}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigateLightbox}
          lodgeName={selectedLodge.name}
        />
      )}
    </div>
  );
}

export default App;
