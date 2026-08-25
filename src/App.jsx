import './App.css'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <div className="site-wrapper">
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  )
}

export default App
