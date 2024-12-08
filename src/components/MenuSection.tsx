import React, { useState } from 'react';
import { MenuItem, ThemeColors } from '../types';
import { ChevronDown, ChevronUp, ImageOff } from 'lucide-react';

interface MenuSectionProps {
  category: string;
  items: MenuItem[];
  theme: ThemeColors;
  searchTerm: string;
  defaultExpanded?: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  category,
  items = [],
  theme,
  searchTerm,
  defaultExpanded = true
}) => {
  console.log('Category:', category);
  console.log('Items:', items);

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const menuItems = Array.isArray(items) ? items : [];

  const filteredItems = menuItems.filter(
    item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (searchTerm && filteredItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 last:mb-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center py-3 px-4 rounded-lg transition-colors"
        style={{ backgroundColor: `${theme.primary}15` }}
      >
        <h3 className="text-2xl font-semibold" style={{ color: theme.text }}>
          {category}
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6" style={{ color: theme.text }} />
        ) : (
          <ChevronDown className="w-6 h-6" style={{ color: theme.text }} />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 px-2">
          {filteredItems.map((item, index) => (
            <div
              key={`${category}-${item.name}-${index}`}
              className="flex gap-4 p-4 rounded-lg transition-colors hover:bg-opacity-5"
              style={{ backgroundColor: `${theme.primary}05` }}
            >
              {item.imageUrl ? (
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'placeholder-image-url';
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                  <ImageOff className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 
                    className="text-xl font-medium"
                    style={{ color: theme.text }}
                  >
                    {item.name}
                  </h4>
                  {item.price !== undefined && (
                    <span 
                      className="text-lg font-medium ml-4"
                      style={{ color: theme.accent }}
                    >
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <p 
                  className="text-base"
                  style={{ color: `${theme.text}CC` }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuSection;