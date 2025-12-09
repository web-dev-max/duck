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
      okText="Прочитал"
      cancelText={null}
      cancelButtonProps={{ style: { display: 'none' } }}
      closable={false}
    >
      <ul>
        <li><strong><UserOutlined style={{ fontSize: 20, marginRight: 8, }} />Регистрация</strong>: Для начала заполните поля с именем, фамилией, номером телефона и электронной почтой.</li>
        <li><strong><ShoppingCartOutlined style={{ fontSize: 20, marginRight: 8, }} />Выбор уток</strong>: Укажите количество уток, которые хотите арендовать.</li>
        <li><strong><CreditCardOutlined style={{ fontSize: 20, marginRight: 8, }} />Оплата</strong>: После выбора уток нажмите "Продолжить" и произведите оплату.</li>
        <li><strong><MessageOutlined style={{ fontSize: 20, marginRight: 8, }} />Получение кода</strong>: После успешной оплаты вам придёт SMS с индивидуальным кодом и чеком.</li>
        <li><strong><BarcodeOutlined style={{ fontSize: 20, marginRight: 8, }} />Код</strong> — это номер вашей утки и билет на праздник. Пожалуйста, не теряйте его.</li>
      </ul>
    </Modal>
  );
};