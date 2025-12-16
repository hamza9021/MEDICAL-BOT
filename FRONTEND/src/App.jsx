import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] md:h-[800px]">
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;