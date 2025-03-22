import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import FeatureCard from '../components/home/FeatureCard';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      
      {/* New illustration section */}
      <div className="flex justify-center my-10">
        <div className="relative max-w-4xl w-full">
          {/* Laptop/Monitor Illustration */}
          <div className="relative mx-auto" style={{ maxWidth: "700px" }}>
            <div className="bg-gray-800 rounded-t-xl p-2 aspect-[16/9] relative overflow-hidden">
              {/* Screen Content - App Dashboard Preview */}
              <div className="bg-gradient-to-r from-primary-50 to-indigo-50 h-full w-full rounded-sm overflow-hidden relative">
                {/* Map-like elements */}
                <div className="absolute top-5 left-5 right-5 bottom-5 bg-white rounded-lg shadow-sm p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-24 h-6 bg-primary-100 rounded-md"></div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary-200"></div>
                      <div className="w-8 h-8 rounded-full bg-red-200"></div>
                    </div>
                  </div>
                  
                  <div className="flex-grow grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-gray-100 rounded-lg relative">
                      {/* Map visualization */}
                      <div className="absolute inset-0 bg-blue-50 rounded-lg overflow-hidden">
                        <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full bg-blue-100 opacity-30"></div>
                        <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-blue-200 opacity-40"></div>
                        <div className="absolute bottom-1/3 left-1/4 w-12 h-12 rounded-full bg-green-200 opacity-50"></div>
                        <div className="absolute w-2 h-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-2 h-1/2">
                        <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 h-1/2">
                        <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-2/3 h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Laptop base/stand */}
            <div className="relative mx-auto bg-gray-900 rounded-b-xl h-5 max-w-[70%]">
              <div className="absolute left-1/2 bottom-0 w-10 h-3 bg-gray-700 transform -translate-x-1/2 translate-y-[80%] rounded-b-lg"></div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary-100 rounded-full opacity-70"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-100 rounded-full opacity-70"></div>
        </div>
      </div>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        <FeatureCard
          title="Safety Map"
          description="View real-time safety information and find secure routes."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          }
          link="/map"
        />
        <FeatureCard
          title="Community Forum"
          description="Share and discover safety tips from women in your area."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          }
          link="/forum"
        />
        <FeatureCard
          title="Deepfake Detection"
          description="Protect yourself from digital manipulation and misinformation."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          }
          link="/deepfake"
        />
      </section>
    </div>
  );
};

export default HomePage;