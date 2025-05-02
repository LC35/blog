
import React from 'react';
import { Table, Button, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminPageHeader from '../../components/AdminPageHeader';

const CategoryManagement = () => {
  const [dataSource, setDataSource] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '文章数量',
      dataIndex: 'count',
      key: 'count',
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
    message.info(`编辑分类: ${record.name}`);
  };

  const handleDelete = (record) => {
    message.warning(`删除分类: ${record.name}`);
  };

  const handleAdd = () => {
    message.success('添加新分类');
  };

  React.useEffect(() => {
    // TODO: 替换为实际API调用
    setLoading(true);
    setTimeout(() => {
      setDataSource([
        { id: 1, name: '前端开发', count: 12 },
        { id: 2, name: '后端开发', count: 8 },
        { id: 3, name: 'DevOps', count: 5 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="分类管理"
        extra={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加分类
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

export default CategoryManagement;
