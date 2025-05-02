
import React from 'react';
import { Table, Button, Space, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminPageHeader from '../../components/AdminPageHeader';

const UserManagement = () => {
  const [dataSource, setDataSource] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    message.info(`编辑用户: ${record.username}`);
  };

  const handleDelete = (record) => {
    message.warning(`删除用户: ${record.username}`);
  };

  const handleAdd = () => {
    message.success('添加新用户');
  };

  React.useEffect(() => {
    // TODO: 替换为实际API调用
    setLoading(true);
    setTimeout(() => {
      setDataSource([
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'user' },
        { id: 3, username: 'user2', email: 'user2@example.com', role: 'user' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="用户管理"
        extra={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加用户
          </Button>
        ]}
      />
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default UserManagement;
