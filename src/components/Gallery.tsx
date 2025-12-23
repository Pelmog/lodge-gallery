import { type Lodge } from '../data/lodges';

interface GalleryProps {
  lodge: Lodge;
  onImageClick: (index: number) => void;
}

export function Gallery({ lodge, onImageClick }: GalleryProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{lodge.name}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {lodge.images.map((image, index) => (
          <button
            key={image.full}
            onClick={() => onImageClick(index)}
            className="aspect-square overflow-hidden rounded-lg bg-gray-200 hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src={image.thumb}
              alt={`${lodge.name} - Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
