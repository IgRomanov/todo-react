import { useState } from "react";

const TodoElement = ({name, handleStatusChange, taskId, status, setTasks, tasks, currentFilterStatus, setFiltredTasks, setLastOperation}) => {
    const [isDisabled, setDisabled] = useState(true);
    const [changedName, setChangedName] = useState(name);

    const handleChangeDisabled = (e) => {
        setDisabled(false);
        e.target.focus();
        e.target.selectionStart = name.length;  
    };

    const handleTaskChange = (e) => {
        setChangedName(e.target.value);
    };

    const handleSubmitChange = (e) => {
        e.preventDefault();
        const changedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                task.taskName = changedName;
            }
            return task;
        })
        setTasks(changedTasks);
        setDisabled(true);
        setLastOperation('Clear completed');
    };

    const handleDeleteClick = () => {
        const remainingTasks = tasks.filter(task => task.id !== taskId);
        if (currentFilterStatus) {
            setFiltredTasks(remainingTasks);
        }

        setTasks(remainingTasks);

        if (remainingTasks.length === 0) {
            localStorage.clear();
        }
        setLastOperation('Task deleted');
    }

    return (
        <div className="todo__list-element">
            {status ? 
                <>
                    <div className="todo__list-container">
                        <input className="todo__checkbox todo__checkbox_green" type="checkbox" defaultChecked={status} value={taskId} onChange={handleStatusChange}></input>
                        <s className="todo__text-grey">{name}</s>
                    </div>
                    <button className="todo__btn-delete todo__btn_pointer" onClick={handleDeleteClick}></button>
                </>
                :
                <>  
                    <div className="todo__list-container">
                        <input className="todo__checkbox" type="checkbox" defaultChecked={status} onChange={handleStatusChange} value={taskId}></input>
                        <form onDoubleClick={handleChangeDisabled} onSubmit={handleSubmitChange} id="taskChange">
                            <input className="task__name" spellCheck="false" onBlur={_ => setDisabled(true)} onChange={handleTaskChange} disabled={isDisabled} value={isDisabled ? name : changedName}></input>
                        </form>
                    </div>
                    <button className="todo__btn-delete todo__btn_pointer" onClick={handleDeleteClick}></button>
                </>
            }
        </div>
    )
}

export default TodoElement;