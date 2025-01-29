import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Callback from "./pages/Callback";
import Error from "./pages/Error"; // Import the Error component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<Error />} /> 
      </Routes>
    </Router>
  );
};

export default App;