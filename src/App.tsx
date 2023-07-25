import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import FileEncryption from './Component/FileEncryption';
import Home from './Component/Home';
import TextEncryption from './Component/TextEncryption';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text-encryption" element={<TextEncryption />} />
        <Route path="/file-encryption" element={<FileEncryption />} />
      </Routes>
    </Router>
  );
}

export default App;
