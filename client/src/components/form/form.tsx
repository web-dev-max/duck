import type { FormProps, InputNumberProps } from "antd";
import { Button, Checkbox, Form, Input, InputNumber, Modal } from 'antd';
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
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const cleanPhone = values.phone.replace(/\D/g, '');
    const formattedPhone = `+7${cleanPhone.slice(-10)}`;
    
    console.log('Success:', { ...values, ducks: duckCount, phone: formattedPhone, agreed: values.agreed });
    // Отправка на сервер
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
              Я ознакомлен с правилами мероприятия и даю согласие на обработку персональных данных
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