import { Button, Checkbox, Card, Space, Typography } from 'antd';
import './styles.less';
import { EditOutlined } from '@ant-design/icons';
import type { Todo } from '@/services/TodoList';

const { Text, Paragraph } = Typography;

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onUpdate: (id: number, title: string, description: string) => void;
    onDelete: (id: number) => void;
}
const TodoItem = ({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) => {
    return (
        <Card hoverable className={`todo-item-card ${todo.completed ? "completed" : ""}`}>
            <div className="todo-header">
                <Space>
                    <Checkbox checked={todo.completed} onChange={() => onToggle(todo.id)} />
                    <Text strong className="todo-text">{todo.title}</Text>
                </Space>
            </div>

            <Paragraph className='todo-description'>{todo.description}</Paragraph>
            <div className='todo-actions'>
                <Space>
                    <Button
                        type='primary'
                        size='small'
                        icon={<EditOutlined />}
                        onClick={() => onUpdate(todo.id, todo.title, todo.description)}
                    >
                        Edit
                    </Button>
                    <Button
                        type='primary'
                        size='small'
                        danger
                        onClick={() => onDelete(todo.id)}
                    >
                        Delete
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default TodoItem;