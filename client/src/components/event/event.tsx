import { Button, InputNumber, type InputNumberProps } from 'antd';
import { useState } from 'react';
import './event.css';
import { ModalComponents } from '../modal/modal';
import FormComponents from '../form/form';

const EventComponent = () => {
  const [duckCount, setDuckCount] = useState<number | null>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const onChange: InputNumberProps['onChange'] = (value) => {
    setDuckCount(typeof value === 'number' ? value : null);
  };

  const totalPrice = duckCount ? duckCount * 500 : 0;

  const sharedProps = {
    mode: 'spinner' as const,
    min: 1,
    max: 100,
    value: duckCount,
    onChange,
  };

  const toggleOpenModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  const toggleOpenForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  return (
    <>
      <div className="event">
        <div className="event-block">
          <h2>Дата и время мероприятия</h2>
          <p>15.01.2026 в 09:30</p>
        </div>
        <div className="event-block">
          <h2>Адрес проведения</h2>
          <p>г. Калининград на реке Старая Преголя</p>
        </div>
        <div className="event-block form">
          <h2>Выберите количество уток</h2>
          <div className="form-custom">
            <div className="event-item">
              <InputNumber {...sharedProps} placeholder="Введите желаемое количество уток" />
              <p>Итого: <span>{totalPrice} ₽</span></p>
            </div>
            <div className="event-action">
              <Button type="primary" onClick={toggleOpenForm}>Регистрация</Button>
              <span className="text" onClick={toggleOpenModal}>Правила мероприятия</span>
            </div>
          </div>
        </div>
      </div>
      <ModalComponents isModalOpen={isModalOpen} onClose={toggleOpenModal} />
      <FormComponents 
        isFormOpen={isFormOpen} 
        onChange={onChange} 
        onClose={toggleOpenForm}
        duckCount={duckCount ?? 1}
        totalPrice={totalPrice}
        onOpenModal={toggleOpenModal}
      />
    </>
  );
};

export default EventComponent;