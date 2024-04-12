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
          <Route path="/" exact Component={Home} />
          <Route path="*" exact Component={NotFound} />
          <Route path="/add-student" exact Component={AddStudent} />
          <Route path="/get/:id" exact Component={ShowOne} />
          <Route path="/gpa/:sid" element={<GPA />} />
        </Routes>
      </Router>

      <Footer />
    </div>
  );
}

export default App;
