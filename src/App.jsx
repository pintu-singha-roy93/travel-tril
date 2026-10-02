import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import '../src/assets/css/Common.css'
import Landing from './pages/landing/Landing'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/Landing" element={<Landing />} />
      <Route
        path="/home"
        element={
          <>
            
            <Home />
          </>
        }
      />
    </Routes>
  )
}

export default App
