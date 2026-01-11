import { useState } from 'react';
import {
  MapIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

// Custom RouteIcon component
const RouteIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const MapControlPanel = ({ 
  days, 
  selectedDay, 
  onDaySelect, 
  onToggleRoutes, 
  showRoutes = true,
  onCenterMap,
  totalDistance = 0,
  totalTime = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate statistics for each day
  const getDayStats = (dayId, activities) => {
    const activityCount = activities?.length || 0;
    const estimatedTime = activities?.reduce((total, activity) => {
      // Estimate time based on activity type
      const timeEstimates = {
        'Pyramids of Giza': 4,
        'Karnak Temple': 3,
        'Valley of the Kings': 3,
        'Luxor Temple': 2,
        'Abu Simbel': 3,
        'Philae Temple': 2,
        'default': 2
      };
      
      const activityName = activity.location || activity.title;
      return total + (timeEstimates[activityName] || timeEstimates.default);
    }, 0) || 0;

    return {
      activityCount,
      estimatedTime: `${estimatedTime}h`
    };
  };

  // Get day colors
  const getDayColor = (dayIndex) => {
    const colors = [
      '#D4AF37', // Gold
      '#1E40AF', // Blue
      '#DC2626', // Red
      '#059669', // Green
      '#7C3AED', // Purple
      '#EA580C', // Orange
      '#DB2777', // Pink
      '#0891B2'  // Cyan
    ];
    return colors[dayIndex % colors.length];
  };

  const dayEntries = Object.entries(days || {}).filter(([_, activities]) => activities && activities.length > 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-nile-blue to-pharaoh-gold p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Itinerary Map</h3>
              <p className="text-white/80 text-sm">
                {dayEntries.length} day{dayEntries.length !== 1 ? 's' : ''} planned
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isExpanded ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {/* Map Controls */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleRoutes}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showRoutes
                    ? 'bg-pharaoh-gold text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <RouteIcon className="w-4 h-4" />
                <span>Routes</span>
              </button>
              
              <button
                onClick={onCenterMap}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <MapPinIcon className="w-4 h-4" />
                <span>Center</span>
              </button>
            </div>

            {/* Trip Summary */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {totalDistance > 0 && (
                <div className="flex items-center space-x-1">
                  <RouteIcon className="w-4 h-4" />
                  <span>{totalDistance}km</span>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{totalTime}h</span>
                </div>
              )}
            </div>
          </div>

          {/* Day Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Days</h4>
              <button
                onClick={() => onDaySelect(null)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  selectedDay === null
                    ? 'bg-pharaoh-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Show All
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dayEntries.length > 0 ? (
                dayEntries.map(([dayId, activities], index) => {
                  const dayNumber = parseInt(dayId.split('-')[1]);
                  const dayColor = getDayColor(index);
                  const stats = getDayStats(dayId, activities);
                  const isSelected = selectedDay === dayId;

                  return (
                    <button
                      key={dayId}
                      onClick={() => onDaySelect(isSelected ? null : dayId)}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-pharaoh-gold bg-pharaoh-gold/5'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Day Number Badge */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: dayColor }}
                        >
                          {dayNumber}
                        </div>

                        {/* Day Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-gray-900 text-sm">
                              Day {dayNumber}
                            </h5>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span>{stats.activityCount}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="w-3 h-3" />
                                <span>{stats.estimatedTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Activities Preview */}
                          <div className="mt-1">
                            <p className="text-xs text-gray-600 truncate">
                              {activities.slice(0, 2).map(activity => 
                                activity.location || activity.title
                              ).join(' → ')}
                              {activities.length > 2 && ` +${activities.length - 2} more`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No destinations planned yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Add destinations to your itinerary to see them on the map
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          {dayEntries.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Legend</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-pharaoh-gold"></div>
                  <span className="text-gray-600">Destinations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-pharaoh-gold"></div>
                  <span className="text-gray-600">Routes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-gray-400" style={{borderStyle: 'dashed', borderWidth: '1px 0'}}></div>
                  <span className="text-gray-600">Hidden day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-pharaoh-gold font-bold text-sm">1</span>
                  <span className="text-gray-600">Day number</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapControlPanel;
