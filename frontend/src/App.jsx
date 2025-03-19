import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SOSButton from './components/layout/SOSButton'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import ForumPage from './pages/ForumPage'
import DeepfakePage from './pages/DeepfakePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/deepfake" element={<DeepfakePage />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
      {isAuthenticated && <SOSButton />}
    </div>
  )
}

export default App
