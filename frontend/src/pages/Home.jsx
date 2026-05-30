import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section with Background Images Carousel */}
      <div className="relative bg-gray-900">
        {/* Simple Carousel - Multiple background images with fade effect */}
        <div className="absolute inset-0">
          <div className="relative h-full w-full overflow-hidden">
            <img 
              src="https://thumbs.dreamstime.com/b/paddy-fields-landscape-andhra-pradesh-india-80772254.jpg" 
              alt="Serene paddy fields in Andhra Pradesh" 
              className="absolute inset-0 h-full w-full object-cover opacity-40 animate-fade"
            />
            <img 
              src="https://thumbs.dreamstime.com/b/beautiful-landscape-agriculture-paddy-field-rice-farm-sunset-127861029.jpg" 
              alt="Golden sunset over rice fields" 
              className="absolute inset-0 h-full w-full object-cover opacity-40 animate-fade delay-5000"
            />
            <img 
              src="https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=2359938384204704" 
              alt="Morning light in tropical paddy fields" 
              className="absolute inset-0 h-full w-full object-cover opacity-40 animate-fade delay-10000"
            />
            <img 
              src="https://thumbs.dreamstime.com/b/young-rice-plants-flooded-paddy-field-malaysia-close-up-growing-langkawi-reflection-sky-surrounding-vegetation-411792558.jpg" 
              alt="Close-up of young rice plants with water reflection" 
              className="absolute inset-0 h-full w-full object-cover opacity-40 animate-fade delay-15000"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
        </div>

        {/* Hero Content - Original sizes and text */}
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🌾 Raitu Bhoomi
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Preserving Agricultural Knowledge and Experience
            </p>
            <p className="text-lg mb-12 leading-relaxed">
              A platform to record, structure, and preserve the full farming lifecycle — time,
              effort, cost, labor, yield, and lived experience — so that human work, knowledge,
              and memory are not lost.
            </p>

            <div className="flex justify-center space-x-4">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition shadow-lg"
                    data-testid="home-register-button"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-lg text-lg border-2 border-green-600 transition shadow-lg"
                    data-testid="home-login-button"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Archive Section - Exactly original */}
      <div className="bg-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Farming Practices & Experiences
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Read real experiences shared by experienced farmers. See the reality and difficulty
            of agriculture through their lived experiences.
          </p>
          <Link
            to="/archive"
            className="inline-block bg-white text-green-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition shadow-lg"
            data-testid="view-archive-button"
          >
            View Knowledge Archive
          </Link>
        </div>
      </div>

      {/* Features Section - More effective cards with hover effects */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-green-600">
            <div className="text-4xl mb-4 text-center">👨‍🌾</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">For Farmers</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Track seasonal activities and timeline</li>
              <li>• Record costs and investments</li>
              <li>• Maintain yield records</li>
              <li>• Share farming experiences</li>
              <li>• Coordinate labor requirements</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-green-600">
            <div className="text-4xl mb-4 text-center">👷</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">For Labor</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Find work opportunities nearby</li>
              <li>• Set travel preferences</li>
              <li>• Track work history</li>
              <li>• Build work experience record</li>
              <li>• Respectful, dignified platform</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-green-600">
            <div className="text-4xl mb-4 text-center">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Knowledge Archive</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Read real farming experiences</li>
              <li>• Learn from practiced methods</li>
              <li>• Understand agricultural effort</li>
              <li>• Preserve farmer knowledge</li>
              <li>• No advice, only experience</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Principles Section - Clean, no marks */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Principles
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-lg text-gray-800 mb-2">No Teaching or Advice</h3>
              <p className="text-gray-600">
                We don't tell farmers what to do. We help them record what they already know and
                do.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-lg text-gray-800 mb-2">No Predictions</h3>
              <p className="text-gray-600">
                We don't predict outcomes or yields. We record actual results for reflection.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Respect & Dignity</h3>
              <p className="text-gray-600">
                Every user is treated with respect. No ratings, no judgments, no social media
                pressures.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Memory Preservation</h3>
              <p className="text-gray-600">
                Agricultural knowledge and experience are recorded and preserved for future
                generations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;