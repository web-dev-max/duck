import './video.css';

const Video = () => (
  <div className="video" id="video">
    <iframe
      width="100%"
      height="600"
      src="https://rutube.ru/play/embed/66435ef703bcad71a823868ab29ce6a3/"
      allow="clipboard-write; autoplay"
      allowFullScreen
      title="HEPPY DUCK video"
    ></iframe>
  </div>
);

export default Video;