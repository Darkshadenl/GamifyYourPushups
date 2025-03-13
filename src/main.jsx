import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Add global error handler to catch and log errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Create a visible error message for debugging
  if (document.getElementById('root')) {
    const errorDiv = document.createElement('div');
    errorDiv.style.padding = '20px';
    errorDiv.style.margin = '20px';
    errorDiv.style.backgroundColor = '#ffeeee';
    errorDiv.style.border = '1px solid #ff0000';
    errorDiv.style.borderRadius = '5px';
    errorDiv.innerHTML = `
      <h2 style="color: #ff0000;">App Error</h2>
      <p>${event.error?.message || 'Unknown error'}</p>
      <pre style="overflow: auto; max-height: 300px;">${event.error?.stack || ''}</pre>
    `;
    
    document.getElementById('root').appendChild(errorDiv);
  }
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('Error rendering app:', error);
  
  // Show error in the DOM
  if (document.getElementById('root')) {
    document.getElementById('root').innerHTML = `
      <div style="padding: 20px; margin: 20px; background-color: #ffeeee; border: 1px solid #ff0000; border-radius: 5px;">
        <h2 style="color: #ff0000;">App Failed to Start</h2>
        <p>${error?.message || 'Unknown error'}</p>
        <pre style="overflow: auto; max-height: 300px;">${error?.stack || ''}</pre>
      </div>
    `;
  }
}
