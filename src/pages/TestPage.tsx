import React, { useState } from 'react';
import { testApiIntegration } from '../utils/apiTester';

const TestPage: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestApi = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await testApiIntegration();
      setTestResult(result);
    } catch (err) {
      setError('Test failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
      
      <div className="mb-6">
        <button
          onClick={handleTestApi}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isLoading ? 'Testing...' : 'Run API Integration Test'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="font-semibold mb-2">Test Result:</h2>
          <pre className="bg-white p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Click the "Run API Integration Test" button to test API connectivity</li>
          <li>Navigate through each form section by clicking on them in the left sidebar</li>
          <li>Fill out each form section with valid data</li>
          <li>After completing all sections, go to the Results page</li>
          <li>Click "Start Run" to initiate processing</li>
          <li>Wait for the run to complete and view the results</li>
        </ol>
      </div>
    </div>
  );
};

export default TestPage;