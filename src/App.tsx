import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import About from './components/About';
import Experience from './components/Experience';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/experience' element={<Experience />}/>
        {/* <Route path='/vroom' element={() => {
          window.location.href = 'https://example.com/1234'; 
        }}/> */}
        <Route path='/' element={<About />}/>
      </Routes>
    </Router>
  );
}

export default App;
