import { HashRouter, Routes, Router, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Navbar from "./Navbar/Navbar";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing"
import Footer from "./pages/Footer";
import Login from "./loginsignup/Login";
function App() {
  return (
    <div>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/About" element={<About/>} />
          <Route path="/features" element={<Features/>} />
          <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={ <Login/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}
export default App;
