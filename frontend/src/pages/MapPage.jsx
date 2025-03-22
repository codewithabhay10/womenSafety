import { useState } from 'react';
import SafetyMap from '../components/map/SafetyMap';

const MapPage = () => {
  const [viewMode, setViewMode] = useState('route'); // 'route' or 'isochrone'
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Safety Map</h1>
        <p className="text-gray-600">Find the safest routes and view safety information around your area.</p>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg text-blue-700">
        <h2 className="font-semibold mb-2">How to use the Safety Map</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Search for a destination or click directly on the map</li>
          <li>Toggle between route view and reachable areas view</li>
          <li>View safety information along your route</li>
          <li>Green markers indicate safe areas, yellow for caution, and red for areas to avoid</li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <SafetyMap />
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg mb-2">Safety Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span>Safe Area</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
              <span>Use Caution</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span>Avoid If Possible</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg mb-2">Map Features</h3>
          <ul className="text-gray-600 space-y-1">
            <li>• Find routes based on safety data</li>
            <li>• See where you can reach in 10 minutes</li>
            <li>• View community safety information</li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg mb-2">Share Feedback</h3>
          <p className="text-gray-600 mb-2">Is this route information accurate?</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Yes, helpful</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Not accurate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;