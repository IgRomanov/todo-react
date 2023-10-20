import { useEffect, useState } from "react";
import TodoElement from "../TodoElement/TodoElement";

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [filtredTasks, setFiltredTasks] = useState([]);
    const [currentFilterStatus, setCurrentFilterStatus] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [lastOperation, setLastOperation] = useState('');

    //Появились ошибки после добавления локального хранилища (одинаковые id), поэтому добавил такую функцию, которая генерирует уникальные id
    const setId = (taskLength) => {                       
        if (tasks.find(task => task.id === taskLength)) {
            return setId(taskLength+1);
        } else {
            return taskLength;
        }
    }
    
    const handleTaskNameChange = (e) => {
        setTaskName(e.target.value);
    };

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        if (taskName) {
            setTasks([...tasks, {taskName, id: setId(tasks.length), status: false}]);
            setTaskName('');
        }
        setLastOperation('Task is added');
    };

    const handleStatusChange = (e) => {
        const taskStatus = tasks.find(task => task.id === Number(e.target.value)).status;
        if (taskStatus) {
            const currentTasks = tasks.map((task) => {
                if (task.id === Number(e.target.value)) {
                    task.status=false;
                }
                return task;
            });
            if (currentFilterStatus) {
                setFiltredTasks(currentTasks);
                filterByStatus(true);
            } else {
                setTasks(currentTasks);
            }
        } else {
            const currentTasks = tasks.map((task) => {
                if (task.id === Number(e.target.value)) {
                    task.status=true;
                }
                return task;
            });
            if (currentFilterStatus) {
                setFiltredTasks(currentTasks);
                filterByStatus(false);
            } else {
                setTasks(currentTasks);
            }
        }
        setLastOperation('Status changed');
    };

    const filterByStatus = (status) => {
        setCurrentFilterStatus(true);
        if (status) {
            setFiltredTasks(tasks.filter(task => task.status === true));
        } else {
            setFiltredTasks(tasks.filter(task => task.status === false));
        }
    }

    const handleActiveClick = () => {
        filterByStatus(false);
    };

    const handleCompletedClick = () => {
        filterByStatus(true);
    };

    const handleAllClick = () => {
        setCurrentFilterStatus(false);
    };

    useEffect(() => {
        setActiveTaskCount(tasks.filter(task => !task.status).length);
        if (tasks.length !== 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        };
    },[tasks, filtredTasks]);

    useEffect(() => {
        const localTasks = localStorage.getItem('tasks');
        if (localTasks) {
            setTasks(JSON.parse(localTasks));
        };
    },[]);

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
                    !currentFilterStatus ?
                        tasks.map(task =>
                            <TodoElement 
                                key={task.id} 
                                name={task.taskName} 
                                handleStatusChange={handleStatusChange}
                                taskId={task.id}
                                status={task.status}
                                setTasks={setTasks}
                                tasks={tasks}
                                setLastOperation={setLastOperation}
                            />
                                
                        )
                    : 
                        filtredTasks.map(task =>
                            <TodoElement 
                                key={task.id} 
                                name={task.taskName} 
                                handleStatusChange={handleStatusChange}
                                taskId={task.id}
                                status={task.status}
                                setTasks={setTasks}
                                tasks={tasks}
                                currentFilterStatus={currentFilterStatus}
                                setFiltredTasks={setFiltredTasks}
                                setLastOperation={setLastOperation}
                                filtredTasks={filtredTasks}
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