import EventComponent from "../components/event/event";
import Intro from "../components/intro/intro";
import Video from "../components/video/video";

const HomePage = () => {
  return (
    <>
      <main>
        <Intro />
        <EventComponent />
        <Video />
      </main>
    </>
  );
};

export default HomePage;