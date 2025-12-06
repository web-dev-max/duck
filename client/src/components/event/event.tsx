import './event.css';

const EventComponent = () => {
  return (
    <div className="event">
      <div className="event-block">
        <h2>Дата мероприятия</h2>
        <p>15.01.2026</p>
      </div>
      <div className="event-block">
        <h2>Время старта</h2>
        <p>09:30</p>
      </div>
    </div>
  )
};

export default EventComponent;