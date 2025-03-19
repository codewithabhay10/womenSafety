import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <section className="text-center py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Safety & Community for Women on the Move
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Navigate confidently with real-time safety maps, community insights, and emergency assistance when you need it most.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to={isAuthenticated ? "/map" : "/register"} 
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-medium"
          >
            Get Started Now
          </Link>
          <Link 
            to="/about" 
            className="text-primary-600 hover:text-primary-700 px-6 py-3 font-medium"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
