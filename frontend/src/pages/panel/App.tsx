import { useState } from "react";
import reactLogo from "@assets/react.svg";
import viteLogo from "/vite.svg";
import "@shared/App.css";

function App() {
  const [apiMessage, setApiMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const callBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/hello');
      const data = await response.json();
      setApiMessage(data.message);
    } catch (error) {
      console.error(error)
      setApiMessage('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Sidebar</h1>
      <h1>Collaborative Tomagachi</h1>
      
      <div className="card">
        <button onClick={callBackend} disabled={loading}>
          {loading ? 'Calling API...' : 'Call Backend API'}
        </button>
        <p>
          Backend connection test - calls http://localhost:3000/api/hello
        </p>
        {apiMessage && (
          <p style={{ margin: '10px 0', color: apiMessage.includes('Error') ? 'red' : 'green', fontSize: '14px' }}>
            {apiMessage}
          </p>
        )}
      </div>
      
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
