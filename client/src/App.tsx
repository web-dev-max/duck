import EventComponent from './components/event/event'
import Footer from './components/footer/footer'
import Header from './components/header/header'
import Intro from './components/intro/intro'
import Video from './components/video/video'

function App() {

  return (
    <>
      <Header />
      <Intro />
      <EventComponent />
      <Video />
      <Footer />
    </>
  )
}

export default App
