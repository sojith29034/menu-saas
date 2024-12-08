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
  items, 
  theme, 
  searchTerm,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Ensure items is an array before filtering
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
    <div className="mb-6 last:mb-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center py-4 px-2 rounded-lg hover:bg-opacity-10 transition-colors"
        style={{ backgroundColor: `${theme.primary}10` }}
      >
        <h3 className="text-xl font-medium" style={{ color: theme.text }}>
          {category}
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" style={{ color: theme.text }} />
        ) : (
          <ChevronDown className="w-5 h-5" style={{ color: theme.text }} />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {filteredItems.map((item, index) => (
            <div
              key={`${category}-${item.name}-${index}`}
              className="flex justify-between items-start p-2 rounded-lg hover:bg-opacity-5 transition-colors"
              style={{ backgroundColor: `${theme.primary}05` }}
            >
              <div className="flex gap-4">
                {item.imageUrl && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span class="text-gray-400"><ImageOff class="w-6 h-6" /></span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-lg mb-1" style={{ color: theme.text }}>
                    {item.name}
                  </h4>
                  <p className="text-sm" style={{ color: `${theme.text}CC` }}>
                    {item.description}
                  </p>
                </div>
              </div>
              {item.price && (
                <span className="font-medium text-lg ml-4" style={{ color: theme.accent }}>
                  ${item.price}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuSection;