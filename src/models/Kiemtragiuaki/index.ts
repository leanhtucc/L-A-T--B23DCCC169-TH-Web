/* eslint-disable @typescript-eslint/no-shadow */
import { RoomManager } from "@/services/Kiemtragiuaki"; 
import { useEffect, useState } from "react";
import { Form } from "antd";

export default function useRoomManagerModel() { 
    // khởi tạo state phòng học
    const [rooms, setRooms] = useState<RoomManager[]>([]);
    // khởi tạo state thông báo
    const [message, setMessage] = useState<string>('');
    // khởi tạo state loading
    const [loading, setLoading] = useState<boolean>(false);
    // khởi tạo state lỗi
    const [error, setError] = useState<string | null>(null);
    // khởi tạo state để mở modal sửa hoặc thêm phòng
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // khởi tạo state id phòng đang sửa
    const [editingRoomId, setEditingRoomId] = useState<string | null>(null); 
    // khởi tạo state để lưu form
    const [form] = Form.useForm();
    // khởi tạo state để lưu thông tin phòng học
    const refreshData = () => {
        // lấy dữ liệu từ localStorage
        setLoading(true);
        // giả lập thời gian tải dữ liệu
        const data = JSON.parse(localStorage.getItem('roomManagers') || '[]'); 
        setRooms(data); 
        setLoading(false);
    };
    // lấy dữ liệu từ localStorage khi component được mount
    useEffect(() => {
        refreshData();
    }, []);
        // mở modal thêm phòng
    const handleAdd = (initialValues?: Partial<RoomManager>) => {
        form.resetFields();
        // nếu có giá trị khởi tạo thì set giá trị cho form
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
        // set id phòng đang sửa là null
        setEditingRoomId(null);
        // mở modal
        setIsModalVisible(true);
    };
     // mở modal sửa phòng
    const handleEdit = (id: string) => {
        const room = rooms.find((r) => r.id === id); 
        // nếu tìm thấy phòng thì set giá trị cho form
        if (room) {
            // set id phòng đang sửa
            form.setFieldsValue(room);
            setEditingRoomId(id); 
            setIsModalVisible(true);
        }
    };
     // xóa phòng
    const handleDelete = (id: string) => {
        const room = rooms.find((r) => r.id === id);
        // kiểm tra xem phòng có tồn tại không
        if (room && Number(room.numberOfSeat) >= 30) { 
            setMessage('Không thể xóa phòng có từ 30 chỗ ngồi trở lên.');
            return;
        }
        const updatedRooms = rooms.filter((room) => room.id !== id); 
        setRooms(updatedRooms); 
        localStorage.setItem('roomManagers', JSON.stringify(updatedRooms)); 
    };
    // lưu phòng
    const handleSave = () => {
        const values = form.getFieldsValue();
        // kiểm tra xem tên phòng đã tồn tại chưa
        if (rooms.some(room => room.name === values.name && room.id !== editingRoomId)) { 
            setMessage('Tên phòng đã tồn tại.');
            return;
        }
        // kiểm tra xem số chỗ ngồi có hợp lệ không
        if (editingRoomId) {
            const updatedRooms = rooms.map((room) =>
                room.id === editingRoomId ? { ...room, ...values } : room
            );
            setRooms(updatedRooms); 
            localStorage.setItem('roomManagers', JSON.stringify(updatedRooms));
            setIsModalVisible(false);
        } else {
            // tạo mới phòng
            const newRoom = {
                ...values,
                id: `P${Date.now()}`.slice(0, 10), // Limit the ID to 10 characters
                numberOfSeat: Number(values.numberOfSeat),
            };
            setRooms([...rooms, newRoom]);
            localStorage.setItem('roomManagers', JSON.stringify([...rooms, newRoom])); 
            setIsModalVisible(false);
        }
    };
    // đóng modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    // xác nhận lưu phòng
    const handleOk = () => {
        handleSave();
        setIsModalVisible(false);
    };
    return {
        rooms, 
        message,
        loading,
        error,
        isModalVisible,
        editingRoomId, 
        form,
        handleAdd,
        handleEdit,
        handleDelete,
        handleSave,
        handleCancel,
        handleOk,
    };
}