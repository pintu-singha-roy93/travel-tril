import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Home from './pages/home/Home'
import '../src/assets/css/Common.css'

function App() {

  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  )
}

export default App
