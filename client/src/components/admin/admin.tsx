import { Modal, Input, Button, Space, Table, Spin } from "antd";
import { useState } from "react";
import type { FC } from "react";

import './admin.css';

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  paid: boolean;
  totalDucks: number;
  duckNumbers: string;
}

interface IAdmin {
  isModalOpen: boolean;
  onClose: () => void;
}

const Admin: FC<IAdmin> = ({ isModalOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserRow[]>([]);
  const [searchText, setSearchText] = useState("");

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
      fetchUserData();
    } else {
      setError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPassword("");
    setError(false);
    setData([]);
    onClose();
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://heppyduck.ru/api/v1/users/admin');
      console.log(response);
      if (!response.ok) throw new Error('Ошибка загрузки');
      const users = await response.json();
      setData(users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(user => {
    return user.duckNumbers.includes(searchText);
  });

  const columns = [
    { title: 'ФИО', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Телефон', dataIndex: 'phone', key: 'phone' },
    { title: 'Оплачено', dataIndex: 'paid', key: 'paid', render: (paid: boolean) => paid ? 'Да' : 'Нет' },
    { title: 'Уток', dataIndex: 'totalDucks', key: 'totalDucks' },
    { title: 'Номера уток', dataIndex: 'duckNumbers', key: 'duckNumbers' },
  ];

  return (
    <Modal
      title="Админ-панель"
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      closable={true}
      width={1000}
      className="admin-modal"
    >
      {!isAuthenticated ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Введите пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            status={error ? "error" : undefined}
          />
          {error && <div style={{ color: "red" }}>Неверный пароль</div>}
          <Button type="primary" onClick={handlePasswordSubmit} block>
            Войти
          </Button>
        </Space>
      ) : (
        <div>
          <Input
            placeholder="Поиск номеру утки или ФИО/телефон"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16, width: 300 }}
          />
          {loading ? (
            <Spin />
          ) : (
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: 800 }}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default Admin;