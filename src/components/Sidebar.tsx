import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { lodges, categories, type Lodge } from '../data/lodges';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLodgeId = location.pathname.slice(1) || lodges[0]?.id;

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories)
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleSelectLodge = (id: string) => {
    navigate(`/${id}`);
    onClose(); // Close sidebar on mobile after selection
  };

  const lodgesByCategory = categories.reduce((acc, category) => {
    acc[category] = lodges.filter(l => l.category === category);
    return acc;
  }, {} as Record<string, Lodge[]>);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          h-screen overflow-y-auto flex-shrink-0
        `}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Lodge Gallery</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-2">
          {categories.map(category => (
            <div key={category} className="mb-1">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>{category}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedCategories.has(category) ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {expandedCategories.has(category) && (
                <div className="ml-2 mt-1 space-y-1">
                  {lodgesByCategory[category].map(lodge => (
                    <button
                      key={lodge.id}
                      onClick={() => handleSelectLodge(lodge.id)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                        currentLodgeId === lodge.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {lodge.name}
                      <span className="ml-2 text-xs text-gray-400">
                        ({lodge.images.length})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
