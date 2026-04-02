import { Alert, Button, InputNumber, type InputNumberProps } from 'antd';
import { useState } from 'react';
import { Typography, Row, Col } from 'antd';
import { ModalComponents } from '../modal/modal';
import FormComponents from '../form/form';
import './event.css';

const { Paragraph, Text } = Typography;

const TrophyIcon = () => <span style={{ fontSize: '28px' }}>🏆</span>;
const SmileIcon = () => <span style={{ fontSize: '28px' }}>😊</span>;
const GiftIcon = () => <span style={{ fontSize: '28px' }}>🎁</span>;

const EventComponent = () => {
  const [duckCount, setDuckCount] = useState<number | null>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const onChange: InputNumberProps['onChange'] = (value) => {
    setDuckCount(typeof value === 'number' ? value : null);
  };

  const totalPrice = duckCount ? duckCount * 1000 : 0;

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
      <div className="about" id="contact">
        <div className="about-tick">
          <div className="about-tick-title">
            HAPPY DUCK
          </div>
          <div className="marquee-container">
            <div className="marquee-content">
              <span>Приглашаем вас на самый масштабный и незабываемый праздник для детей в России!&nbsp;&nbsp;&nbsp;</span>
              <span>Приглашаем вас на самый масштабный и незабываемый праздник для детей в России!&nbsp;&nbsp;&nbsp;</span>
              <span>Приглашаем вас на самый масштабный и незабываемый праздник для детей в России!&nbsp;&nbsp;&nbsp;</span>
              <span>Приглашаем вас на самый масштабный и незабываемый праздник для детей в России!&nbsp;&nbsp;&nbsp;</span>
              <span>Приглашаем вас на самый масштабный и незабываемый праздник для детей в России!&nbsp;&nbsp;&nbsp;</span>
              <span>Приглашаем вас на самый масштабный и незабываемый праздник для детей в России!&nbsp;&nbsp;&nbsp;</span>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: '50px' }}>
          <Col xs={24} sm={12} md={8}>
            <div className="about-item" style={{ padding: '15px', borderRadius: '20px' }}>
              <TrophyIcon />
              <div style={{ marginLeft: '10px', flex: 1 }}>
                <Text strong style={{ color: 'rgba(19, 20, 29, .9)', fontSize: '18px' }}>
                  Гонка уток
                </Text>
                <Paragraph style={{ color: 'rgba(255, 100, 0, 1)', fontSize: '16px', marginTop: '8px', marginBottom: 0 }}>
                  Захватывающая гонка на реке Старая Преголя в г. Калининград! Каждый участник может побороться за призы.
                </Paragraph>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div className="about-item" style={{ padding: '15px', borderRadius: '20px' }}>
              <SmileIcon />
              <div style={{ marginLeft: '10px', flex: 1 }}>
                <Text strong style={{ color: 'rgba(19, 20, 29, .9)', fontSize: '18px' }}>
                  Праздничный концерт
                </Text>
                <Paragraph style={{ color: 'rgba(255, 100, 0, 1)', fontSize: '16px', marginTop: '8px', marginBottom: 0 }}>
                  Яркое шоу с любимыми мультгероями и аниматорами, которые подарят детям радость и веселье.
                </Paragraph>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div className="about-item" style={{ padding: '15px', borderRadius: '20px' }}>
              <GiftIcon />
              <div style={{ marginLeft: '10px', flex: 1 }}>
                <Text strong style={{ color: 'rgba(19, 20, 29, .9)', fontSize: '18px' }}>
                  Атмосфера праздника
                </Text>
                <Paragraph style={{ color: 'rgba(255, 100, 0, 1)', fontSize: '16px', marginTop: '8px', marginBottom: 0 }}>
                  Ароматные угощения, мыльные пузыри и дружелюбная атмосфера создадут день, полный смеха и впечатлений!
                </Paragraph>
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ textAlign: 'center'}}>
          <Text strong style={{ fontSize: '20px', color: 'rgba(19, 20, 29, .9)' }}>
            Не упустите шанс подарить своим детям день, полный смеха и незабываемых впечатлений!
          </Text>
          <br />
          <Text style={{ fontSize: '18px', color: 'rgba(255, 100, 0, 1)' }}>
            Мы ждём вас с нетерпением!
          </Text>
        </div>
      </div>

      <div className="event" id="event">
        <div className="event-block">
          <h2>Дата и время мероприятия</h2>
          <p>07.06.2026 в 11:00</p>
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
              {/* <span className="text" onClick={toggleOpenModal}>Правила мероприятия</span> */}
            </div>
          </div>
          <Alert
            title="Оплата возможна только банковской картой"
            description="Оплата через СБП временно не поддерживается"
            type="warning"
            showIcon
          />
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