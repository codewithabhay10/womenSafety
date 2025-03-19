import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import FeatureCard from '../components/home/FeatureCard';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      
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
