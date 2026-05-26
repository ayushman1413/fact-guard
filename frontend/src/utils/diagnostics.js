import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function checkBackendHealth() {
  try {
    const response = await axios.get(`${API_URL}/`, {
      timeout: 5000,
    });
    return {
      status: 'online',
      message: response.data?.status || 'Backend is running',
    };
  } catch (error) {
    return {
      status: 'offline',
      message: `Cannot connect to backend at ${API_URL}. Make sure the server is running.`,
    };
  }
}

export function getEnvironmentInfo() {
  return {
    apiUrl: API_URL,
    isDevelopment: import.meta.env.DEV,
    mode: import.meta.env.MODE,
  };
}

export async function testPDFAnalysis(sampleText) {
  try {
    // This would test if the backend can process claims
    console.log('Would test PDF analysis with sample text');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
