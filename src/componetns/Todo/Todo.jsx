import { useEffect, useState } from "react";
import TodoElement from "../TodoElement/TodoElement";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, changeTaskStatus, filterTaskByStatus, clearFiltredTask } from "../../store/slices/tasksSlice";
import { taskAction } from "../../utils/const";

const Todo = () => {
    const tasks = useSelector((state) => state.tasks.value);
    const filtredTasks = useSelector((state) => state.tasks.filtred);
    const dispatch = useDispatch();
    const [currentFilterStatus, setCurrentFilterStatus] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [lastOperation, setLastOperation] = useState('');
    const { TASK_ADDED_MESSAGE, TASK_STATUS_MESSAGE } = taskAction;

    //Появились ошибки после добавления локального хранилища (одинаковые id), поэтому добавил такую функцию, которая генерирует уникальные id
    const setId = (taskLength) => {                       
        if (tasks.find(task => task.id === taskLength)) {
            return setId(taskLength+1);
        } else {
            return taskLength;
        }
    };
    
    const handleTaskNameChange = (e) => {
        setTaskName(e.target.value);
    };

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        if (taskName) {
            dispatch(setTasks([...tasks, {taskName, id: setId(tasks.length), status: false}]));
            setTaskName('');
        }
        setLastOperation(TASK_ADDED_MESSAGE);
    };

    const handleStatusChange = (e) => {
        const id = Number(e.target.value);
        dispatch(changeTaskStatus(id));
        setLastOperation(TASK_STATUS_MESSAGE);
    };

    const filterByStatus = (status) => {
        setCurrentFilterStatus(true);
        if (status) {
            dispatch(filterTaskByStatus(false));
        } else {
            dispatch(filterTaskByStatus(true));
        }
    };

    const handleActiveClick = () => {
        filterByStatus(false);
    };

    const handleCompletedClick = () => {
        filterByStatus(true);
    };

    const handleAllClick = () => {
        setCurrentFilterStatus(false);
        dispatch(clearFiltredTask());
    };

    useEffect(() => {
        setActiveTaskCount(tasks.filter(task => !task.status).length);
        if (tasks.length !== 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        };
    }, [tasks]);

    useEffect(() => {
        const localTasks = localStorage.getItem('tasks');
        if (localTasks) {
            dispatch(setTasks(JSON.parse(localTasks)));
        };
    }, []);

    return (
        <div className="todo">
            <h3 className="todo__title">todos</h3>
            <div className="todo__fields">
                    
                    <form onSubmit={handleTaskSubmit} id="taskAdd">
                        <label className="todo__task-label">
                            <button className="todo__arrow todo__btn_pointer"/>
                            <input className="todo__task-input" placeholder="What needs to be done?" onChange={handleTaskNameChange} value={taskName}></input>
                        </label>
                    </form>
                <div className="todo__list">
                    { 
                
                        (currentFilterStatus ? filtredTasks : tasks).map(task =>
                            <TodoElement 
                                key={task.id} 
                                name={task.taskName} 
                                handleStatusChange={handleStatusChange}
                                taskId={task.id}
                                status={task.status}
                                setLastOperation={setLastOperation}
                            />
                                
                        )
               
                    }
                </div>
                <div className="todo__params">
                    <span className="todo__left">{activeTaskCount > 1 ? `${activeTaskCount} items left` :  `${activeTaskCount} item left`}</span>
                    <div className="todo__buttons-container">
                        <button className="todo__btn todo__btn_pointer todo__btn_border" onClick={handleAllClick}>All</button>
                        <button className="todo__btn todo__btn_pointer" onClick={handleActiveClick}>Active</button>
                        <button className="todo__btn todo__btn_pointer" onClick={handleCompletedClick}>Completed</button>
                    </div>
                    <span className="todo__status-text">{lastOperation}</span>
                </div>
            </div>
        </div>
    )
}

export default Todo;