import useRoomManagerModel from '@/models/Kiemtragiuaki';
import React, { useState } from 'react';
import { Table, Input, Select, Button, Space, Modal, Form, message } from 'antd';
import { RoomManager } from '@/services/Kiemtragiuaki';

const { Search } = Input;
const { Option } = Select;

// Define a mapping for person values to display names
const personMapping = {
    "Người A": "Lê Anh Tú",
    "Người B": "Nguyễn Văn An",
    "Người C": "Trần Thị Bích",
    "Người D": "Lê Hoàng Nam",
    "Người E": "Phạm Thùy Dung",
    "Người F": "Đỗ Minh Hải"
};

// Define a mapping for room types
const roomTypeMapping = {
    1: "Lý thuyết",
    2: "Thực hành",
    3: "Hội trường"
};

const QuanLyPhongHoc = () => {
    const {
        rooms,
        loading,
        isModalVisible,
        editingRoomId,
        form,
        handleAdd,
        handleEdit,
        handleDelete,
        handleSave,
        handleCancel,
    } = useRoomManagerModel();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRoomType, setFilterRoomType] = useState('');
    const [filterPersonInCharge, setFilterPersonInCharge] = useState('');

    const filteredRooms = rooms
        .filter(room => room.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(room => (filterRoomType ? room.roomType === Number(filterRoomType) : true))
        .filter(room => (filterPersonInCharge ? room.personInChanrge === filterPersonInCharge : true));

    const confirmDelete = (id: string, numberOfSeat: number) => {
        if (numberOfSeat >= 30) {
            message.error('Không thể xóa phòng có từ 30 chỗ ngồi trở lên.');
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa phòng này?',
            onOk: () => handleDelete(id),
        });
    };

    const columns = [
        { title: 'Mã phòng', dataIndex: 'id', key: 'id', align: 'center' as 'center' },
        { title: 'Tên phòng', dataIndex: 'name', key: 'name', align: 'center' as 'center' },
        { title: 'Số chỗ ngồi', dataIndex: 'numberOfSeat', key: 'numberOfSeat', sorter: (a: RoomManager, b: RoomManager) => Number(a.numberOfSeat) - Number(b.numberOfSeat), align: 'center' as 'center' },
        {
            title: 'Loại phòng',
            dataIndex: 'roomType',
            key: 'roomType',
            align: 'center' as 'center',
            render: (type: number) => roomTypeMapping[type as keyof typeof roomTypeMapping] || type
        },
        {
            title: 'Người phụ trách',
            dataIndex: 'personInChanrge',
            key: 'personInChanrge',
            align: 'center' as 'center',
            render: (person: string) => personMapping[person as keyof typeof personMapping] || person
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center' as 'center',
            render: (_: any, record: RoomManager) => (
                <Space>
                    <Button onClick={() => handleEdit(String(record.id))}>Sửa</Button>
                    <Button danger onClick={() => confirmDelete(String(record.id), Number(record.numberOfSeat))}>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Search placeholder="Tìm kiếm theo tên phòng" onSearch={setSearchTerm} enterButton />
                <Select placeholder="Lọc theo loại phòng" onChange={setFilterRoomType} allowClear>
                    <Option value="1">Lý thuyết</Option>
                    <Option value="2">Thực hành</Option>
                    <Option value="3">Hội trường</Option>
                </Select>
                <Select placeholder="Lọc theo người phụ trách" onChange={setFilterPersonInCharge} allowClear>
                    {[...new Set(rooms.map(room => room.personInChanrge))].map(person => (
                        <Option key={String(person)} value={person}>{personMapping[person as keyof typeof personMapping] || person}</Option>
                    ))}
                </Select>
                <Button type="primary" onClick={() => handleAdd()}>Thêm phòng</Button>
            </Space>
            <Table
                dataSource={filteredRooms}
                columns={columns}
                rowKey="id"
                loading={loading}
            />
            <Modal
                title={editingRoomId ? 'Chỉnh sửa phòng' : 'Thêm phòng'}
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên phòng"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên phòng' },
                            { max: 50, message: 'Tên phòng không được vượt quá 50 ký tự' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="personInChanrge"
                        label="Người phụ trách"
                        rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
                    >
                        <Select>
                            <Option value="Người A">Lê Anh Tú</Option>
                            <Option value="Người B">Nguyễn Văn An</Option>
                            <Option value="Người C">Trần Thị Bích</Option>
                            <Option value="Người D">Lê Hoàng Nam</Option>
                            <Option value="Người E">Phạm Thùy Dung</Option>
                            <Option value="Người F">Đỗ Minh Hải</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="numberOfSeat"
                        label="Số chỗ ngồi"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số chỗ ngồi' },
                            { type: 'number', min: 10, max: 200, message: 'Số chỗ ngồi phải từ 10 đến 200' },
                        ]}
                        getValueFromEvent={(e) => Number(e.target.value)}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="roomType"
                        label="Loại phòng"
                        rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
                    >
                        <Select>
                            <Option value="1">Lý thuyết</Option>
                            <Option value="2">Thực hành</Option>
                            <Option value="3">Hội trường</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuanLyPhongHoc;