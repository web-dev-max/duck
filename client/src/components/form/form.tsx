import type { FormProps, InputNumberProps } from "antd";
import { Button, Checkbox, Form, Input, InputNumber, message, Modal } from 'antd';
import { MaskedInput } from 'antd-mask-input';
import { type FC } from "react";

import './form.css';

type FieldType = {
  name: string;
  email: string;
  phone: string;
  ducks: number;
  agreed: boolean;
};

interface IFormComponents {
  isFormOpen: boolean;
  onClose?: () => void;
  duckCount: number;
  onChange: InputNumberProps['onChange'];
  totalPrice: number;
  onOpenModal: () => void;
}

const FormComponents: FC<IFormComponents> = ({ isFormOpen, onClose, duckCount, onChange, totalPrice, onOpenModal }) => {

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const cleanPhone = values.phone.replace(/\D/g, '');
    const formattedPhone = `+7${cleanPhone.slice(-10)}`;
    const orderid = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = {
      name: values.name,
      email: values.email,
      phone: formattedPhone,
      ducks: duckCount,
      agreed: values.agreed,
      verificationCode: orderid,
    };

    try {
      const response = await fetch('https://heppyduck.ru/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Данный пользователь уже зарегистрирован');
        } else {
          throw new Error('Ошибка при регистрации');
        }
      }
      const userData = await response.json();
      const { duckNumbers, verificationCode } = userData;
      message.success('Заявка отправлена! Переходим к оплате...');

      const cart = JSON.stringify([
        {
          name: `Билет на мероприятие: № ${verificationCode}. Номера ваших уток: ${duckNumbers}`,
          quantity: duckCount,
          price: Math.round(totalPrice / duckCount),
          amount: totalPrice,
          payment_method: "full_payment",
          payment_object: "service",
          vat: "none"
        }
      ]);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://heppyduck.server.paykeeper.ru/create/';
      form.style.display = 'none';

      const fields = {
        sum: totalPrice.toString(),
        orderid,
        clientid: values.name,
        service_name: "Участие в мероприятии «Happy Duck»",
        client_email: values.email,
        client_phone: formattedPhone,
        cart,
      };

      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      const msg = error instanceof Error ? error.message : 'Неизвестная ошибка';
      message.error(msg);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const sharedProps = {
    mode: 'spinner' as const,
    min: 1,
    max: 100,
    value: duckCount,
    onChange,
  };

  return (
    <Modal
      title="Регистрация на участие"
      open={isFormOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form
        name="userForm"
        initialValues={{ 
          ducks: duckCount,
          agreed: false
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        size="large"
      >
        <Form.Item<FieldType>
          label="ФИО"
          name="name"
          rules={[{ required: true, message: 'Пожалуйста, введите ФИО!' }]}
          className="form-custom-antd"
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          className="form-custom-antd"
          rules={[
            { required: true, message: 'Пожалуйста, введите email!' },
            { type: 'email', message: 'Некорректный email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Телефон"
          name="phone"
          className="form-custom-antd"
          rules={[
            {required: true, message: 'Пожалуйста, введите телефон!'},
            {
              validator(_, value) {
                const digits = value?.replace(/\D/g, '') || '';
                if (digits.length !== 11) {
                  return Promise.reject('Проверьте корректность номера');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <MaskedInput
            mask="+7 (000) 000-00-00"
            placeholder="+7 (___) ___-__-__"
          />
        </Form.Item>
        
        <Form.Item<FieldType>
          label="Количество уток"
          name="ducks"
          className="form-custom-antd"
          rules={[{ required: true, message: 'Укажите количество уток' }]}
        >
            <div className="event-item">
              <InputNumber {...sharedProps} placeholder="Введите желаемое количество уток" />
              <p>Итого: <span>{totalPrice} ₽</span></p>
            </div>
        </Form.Item>
        <div className="charity-info">
            <p className="charity-text">
                🎗️ Большая часть собранных средств от мероприятия будет направлена в онкологический центр для помощи больным детям
            </p>
        </div>
        <Button className="more" onClick={onOpenModal}>📜 Правила мероприятия</Button>

        <Form.Item<FieldType>
          name="agreed"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject('Необходимо согласиться с правилами'),
            },
          ]}
          className="agreement-checkbox"
        >
          <Checkbox>
            <span>
              Я ознакомлен с правилами мероприятия, так же с <a href="/garantii" target="_blank">гарантийными условиями</a> и даю согласие на обработку <a href="/privacy-policy" target="_blank">персональных данных</a>
            </span>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Перейти к оплате
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormComponents;