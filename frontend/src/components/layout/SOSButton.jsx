import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation as useLocationContext } from '../../context/LocationContext';
import { sendSOS } from '../../services/auth';

const SOSButton = () => {
  const { user } = useAuth();
  const { currentLocation } = useLocationContext();
  const [sending, setSending] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSOSClick = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    if (!user || !currentLocation) return;

    try {
      setSending(true);
      await sendSOS(user.userId, currentLocation);
      alert('SOS alert sent successfully to your emergency contacts.');
    } catch (error) {
      console.error('Failed to send SOS:', error);
      alert('Failed to send SOS alert. Please try again.');
    } finally {
      setSending(false);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showConfirmation ? (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-64">
          <p className="text-gray-800 font-medium mb-3">Send SOS alert to your emergency contacts?</p>
          <div className="flex justify-between">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={sending}
            >
              Cancel
            </button>
            <button 
              onClick={handleSOSClick}
              className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-700"
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Confirm'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSOSClick}
          className="bg-danger hover:bg-red-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
          aria-label="SOS Emergency Button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SOSButton;
