import SafetyMap from '../components/map/SafetyMap';

const MapPage = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold">Safety Map</h1>
      </div>
      
      <div className="h-[calc(100vh-200px)] min-h-[500px]">
        <SafetyMap />
      </div>
    </div>
  );
};

export default MapPage;
