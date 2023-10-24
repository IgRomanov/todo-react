import { useEffect, useState } from "react";
import TodoElement from "../TodoElement/TodoElement";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, changeTaskStatus, filterTaskByStatus, clearFiltredTasks, deleteTasks } from "../../store/slices/tasksSlice";

const Todo = () => {
    const tasks = useSelector((state) => state.tasks.value);
    const filtredTasks = useSelector((state) => state.tasks.filtred);
    const dispatch = useDispatch();
    const [currentFilterStatus, setCurrentFilterStatus] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [activeBtn, setActiveBtn] = useState('');

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
    };

    const handleStatusChange = (e) => {
        const id = Number(e.target.value);
        dispatch(changeTaskStatus(id));
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
        setActiveBtn('active');
    };

    const handleCompletedClick = () => {
        filterByStatus(true);
        setActiveBtn('completed');
    };

    const handleAllClick = () => {
        setActiveBtn('all');
        setCurrentFilterStatus(false);
        dispatch(clearFiltredTasks());
    };

    const handleDeleteAllClick = () => {
        dispatch(deleteTasks());
        dispatch(clearFiltredTasks());
        localStorage.removeItem('tasks');
    }

    useEffect(() => {
        setActiveTaskCount(tasks.filter(task => !task.status).length);
        if (tasks.length !== 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        };
    }, [tasks]);

    useEffect(() => {
        setActiveBtn('all');
        const localTasks = localStorage.getItem('tasks');
        if (localTasks) {
            dispatch(setTasks(JSON.parse(localTasks)));
        };
        return () => {
            console.log('sfsf')
            localStorage.clear()
        }
    }, []);

    return (
        <div className="todo">
            <h3 className="todo__title">todos</h3>
            <div className="todo__fields"> 
                    <form onSubmit={handleTaskSubmit} id="taskAdd" className="form__field">
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
                            />
                                
                        )
               
                    }
                </div>
                <div className="todo__params">
                    <span className="todo__left">{activeTaskCount > 1 ? `${activeTaskCount} items left` :  `${activeTaskCount} item left`}</span>
                    <div className="todo__buttons-container">
                        <button className={`todo__btn todo__btn_pointer ${activeBtn === 'all' && 'todo__btn_border'}`} onClick={handleAllClick}>All</button>
                        <button className={`todo__btn todo__btn_pointer ${activeBtn === 'active' && 'todo__btn_border'}`} onClick={handleActiveClick}>Active</button>
                        <button className={`todo__btn todo__btn_pointer ${activeBtn === 'completed' && 'todo__btn_border'}`} onClick={handleCompletedClick}>Completed</button>
                    </div>
                    <button className="todo__btn_pointer todo__clear-btn" onClick={handleDeleteAllClick}>Clear completed</button>
                </div>
            </div>
        </div>
    )
}

export default Todo;