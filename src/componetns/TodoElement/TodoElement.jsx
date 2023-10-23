import { useState } from "react";
import { deleteTask } from "../../store/slices/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, changeTaskName } from "../../store/slices/tasksSlice";


const TodoElement = ({name, handleStatusChange, taskId, status}) => {
    const tasks = useSelector((state) => state.tasks.value);
    const [isDisabled, setDisabled] = useState(true);
    const [changedName, setChangedName] = useState(name);
    const dispatch = useDispatch();

    const handleChangeDisabled = (e) => {
        setDisabled(false);
    };

    const handleTaskChange = (e) => {
        setChangedName(e.target.value);
    };

    const handleSubmitChange = (e) => {
        e.preventDefault();
        dispatch(changeTaskName({id: taskId, taskName: changedName}));
        setDisabled(true);
    };

    const handleDeleteClick = () => {
        dispatch(deleteTask(taskId));
        let remainingTasks;
        remainingTasks = tasks.filter(task => task.id !== taskId);
        dispatch(setTasks(remainingTasks));
        if (remainingTasks.length === 0) {
            localStorage.clear();
        }
    };

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
                        <form className="form__field" onDoubleClick={handleChangeDisabled} onSubmit={handleSubmitChange} id="taskChange">
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