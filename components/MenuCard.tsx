
import React from 'react';
import { FoodItem } from '../types';

interface MenuCardProps {
  item: FoodItem;
  isSelected: boolean;
  onSelect: (item: FoodItem) => void;
  disabled: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, isSelected, onSelect, disabled }) => {
  const isHealthy = item.category === 'fat-loss';
  
  // Dynamic border and shadow based on selection and category
  const baseClasses = "relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer border-2 bg-white";
  const selectedClasses = isSelected 
    ? "border-blue-500 shadow-xl scale-[1.02] ring-2 ring-blue-200" 
    : "border-transparent hover:shadow-lg hover:-translate-y-1 shadow-sm";
  
  const headerBg = isHealthy ? "bg-emerald-100/50" : "bg-orange-100/50";
  const headerText = isHealthy ? "text-emerald-700" : "text-orange-700";
  const borderColor = isHealthy ? "border-emerald-200" : "border-orange-200";

  const handleClick = () => {
    if (!disabled || isSelected) {
      onSelect(item);
    }
  };

  return (
    <div 
      className={`${baseClasses} ${selectedClasses} ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed grayscale-[0.5]' : ''}`}
      onClick={handleClick}
    >
      {/* Top Header Bar / Category Indicator */}
      <div className={`px-4 py-3 flex justify-between items-center ${headerBg} border-b ${borderColor}`}>
        <div className="flex items-center space-x-2">
           <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 ${headerText}`}>
             {isHealthy ? '减脂优选' : '家常风味'}
           </span>
        </div>
        {isSelected && (
          <div className="bg-blue-600 text-white p-1 rounded-full shadow-lg transform scale-75">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 pt-3">
        {/* Title & Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg leading-tight pr-2">{item.name}</h3>
          <span className="text-lg font-semibold text-gray-600 tracking-tight">¥{item.price}</span>
        </div>
        
        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8 leading-relaxed">{item.description}</p>

        {/* Nutrition Data Grid */}
        <div className="grid grid-cols-4 gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="text-center col-span-1 border-r border-gray-200">
             <span className="block text-[10px] text-gray-400 uppercase tracking-wide">热量</span>
             <span className={`block font-black text-sm ${item.calories > 800 ? 'text-red-500' : 'text-gray-800'}`}>
               {item.calories}
             </span>
          </div>
          <div className="text-center col-span-1 border-r border-gray-200">
             <span className="block text-[10px] text-gray-400 uppercase tracking-wide">蛋白</span>
             <span className="block font-bold text-sm text-blue-600">{item.protein}g</span>
          </div>
          <div className="text-center col-span-1 border-r border-gray-200">
             <span className="block text-[10px] text-gray-400 uppercase tracking-wide">碳水</span>
             <span className="block font-bold text-sm text-amber-600">{item.carbs}g</span>
          </div>
          <div className="text-center col-span-1">
             <span className="block text-[10px] text-gray-400 uppercase tracking-wide">脂肪</span>
             <span className="block font-bold text-sm text-violet-600">{item.fat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
