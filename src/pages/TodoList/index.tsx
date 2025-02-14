import React, { useEffect, useState } from 'react';
import { Input, Button, List, Select, Space, message } from 'antd';
import TodoItem from '@/components/TodoList';
import { addTodo, clearAllTodos, deleteTodo, getTodos, saveTodos, toggleTodo, updateTodo } from '@/models/todolistModel';

const { Option } = Select;

const TodoList = () => {
    const [todos, setTodos] = useState<{ id: number; title: string; description: string; completed: boolean }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setTodos(getTodos());
    }, []);

    useEffect(() => {
        saveTodos(todos);
    }, [todos]);

    const handleAddOrUpdateTodo = () => {
        if (!inputValue.trim()) {
            message.warning('Vui lòng nhập tiêu đề công việc!');
            return;
        }
        if (editingId !== null) {
            setTodos(updateTodo(todos, editingId, inputValue, descriptionValue));
            setEditingId(null);
        } else {
            setTodos(addTodo(todos, inputValue, descriptionValue));
        }
        setInputValue('');
        setDescriptionValue(''); // Reset ô nhập mô tả sau khi thêm/sửa
    };

    const handleEdit = (id: number, title: string, description: string) => {
        setEditingId(id);
        setInputValue(title);
        setDescriptionValue(description);
    };

    const filteredTodos = todos.filter(todo =>
        (filter === 'all' || (filter === 'completed' && todo.completed) || (filter === 'incomplete' && !todo.completed))
        && todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>Todo List</h2>
            <Space direction='vertical' style={{ width: '100%' }}>
                <Input
                    placeholder='Enter todo....'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPressEnter={handleAddOrUpdateTodo}
                />
                <Input
                    placeholder='Enter todo description....'
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    onPressEnter={handleAddOrUpdateTodo}
                />
                <Button type='primary' onClick={handleAddOrUpdateTodo}>
                    {editingId !== null ? 'Update' : 'Add'}
                </Button>
            </Space>

            <Space direction='horizontal' style={{ marginTop: '20px', width: '100%' }}>
                <Input
                    placeholder='Search todo...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                    defaultValue='all'
                    style={{ width: '100px' }}
                    onChange={(value) => setFilter(value)}
                >
                    <Option value='all'>All</Option>
                    <Option value='completed'>Completed</Option>
                    <Option value='incomplete'>Incomplete</Option>
                </Select>
            </Space>

            <List
                style={{ marginTop: '20px' }}
                bordered
                dataSource={filteredTodos}
                renderItem={(todo) => (
                    <TodoItem
                        todo={todo}
                        onToggle={(id) => setTodos(toggleTodo(todos, id))}
                        onUpdate={() => handleEdit(todo.id, todo.title, todo.description)}
                        onDelete={(id) => setTodos(deleteTodo(todos, id))}
                    />
                )}
            />

            {todos.length > 0 && (
                <Button
                    type='dashed'
                    danger
                    onClick={clearAllTodos}
                    style={{ marginTop: "10px" }}
                >
                    Clear All
                </Button>
            )}
        </div>
    );
};

export default TodoList;