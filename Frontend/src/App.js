import "./App.css";
import Header from "./Components/Header";
import AddStudent from "./Pages/AddStudent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import ShowOne from "./Components/ShowOne";
import Footer from "./Components/Footer";
import NotFound from "./Components/NotFound";
import GPA from './Pages/GPA';

function App() {
  return (
    <div>
      <Header />

      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/get/:id" element={<ShowOne />} />
          <Route path="/student/gpa/:sid" element={<GPA />} />
        </Routes>
      </Router>

      <Footer />
    </div>
  );
}

export default App;
