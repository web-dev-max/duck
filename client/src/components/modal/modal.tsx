import { Modal } from "antd";
import { UserOutlined, ShoppingCartOutlined, CreditCardOutlined, MessageOutlined, BarcodeOutlined } from '@ant-design/icons';
import type { FC } from "react";

import './modal.css';

interface IModalComponents {
  isModalOpen: boolean;
  onClose?: () => void;
}

export const ModalComponents: FC<IModalComponents> = ({ isModalOpen, onClose }) => {
  return (
    <Modal
      title="Правила участия в гонках с утками:"
      open={isModalOpen}
      onOk={onClose}
      onCancel={onClose}
      okText="Закрыть"
      cancelText={null}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <ul>
        <li>
          <strong><UserOutlined style={{ fontSize: 20, marginRight: 8 }} />Регистрация</strong>: 
          Заполните имя, номер телефона и электронную почту. На один email возможна только одна регистрация.
        </li>
        <li>
          <strong><ShoppingCartOutlined style={{ fontSize: 20, marginRight: 8 }} />Выбор уток</strong>: 
          Укажите количество уток, которые хотите арендовать.
        </li>
        <li>
          <strong><CreditCardOutlined style={{ fontSize: 20, marginRight: 8 }} />Оплата</strong>: 
          После выбора уток нажмите «Продолжить» и произведите оплату. 
          <strong> Оплата взимается один раз — повторная регистрация и оплата с одного аккаунта невозможны.</strong>
        </li>
        <li>
          <strong><MessageOutlined style={{ fontSize: 20, marginRight: 8 }} />Получение чека</strong>: 
          После успешной оплаты вы получите чек на указанную Вами почту с номером заказа и номерами уток.
        </li>
        <li>
          <strong><BarcodeOutlined style={{ fontSize: 20, marginRight: 8 }} />Номер заказа и номера уток</strong> — 
          это Ваши персональные номера. Пожалуйста, сохраните их.
        </li>
      </ul>
    </Modal>
  );
};