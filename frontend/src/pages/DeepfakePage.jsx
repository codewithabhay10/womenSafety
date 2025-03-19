import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const DeepfakePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
    }
  };
  
  const handleAnalyze = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setResult({
        isDeepfake: Math.random() > 0.5,
        confidence: Math.floor(Math.random() * 30) + 70
      });
      setIsAnalyzing(false);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Deepfake Detection</h1>
        
        <Card>
          <p className="mb-6">
            Upload an image or video to check if it has been digitally manipulated using deepfake technology.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
            {selectedFile ? (
              <div>
                <p className="mb-2">Selected file: {selectedFile.name}</p>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2">Drag and drop files here or</p>
                <label className="cursor-pointer text-primary-500 hover:text-primary-600">
                  <span>Browse files</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="px-6"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Media'}
            </Button>
          </div>
          
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${result.isDeepfake ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <div className="flex items-center">
                {result.isDeepfake ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="font-bold">Potential Deepfake Detected</h3>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="font-bold">No Deepfake Detected</h3>
                  </>
                )}
              </div>
              <p className="mt-2">Confidence: {result.confidence}%</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DeepfakePage;
