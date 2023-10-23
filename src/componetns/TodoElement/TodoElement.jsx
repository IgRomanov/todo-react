import { useState } from "react";
import { deleteTask } from "../../store/slices/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, changeTaskName } from "../../store/slices/tasksSlice";
import { taskAction } from "../../utils/const";


const TodoElement = ({name, handleStatusChange, taskId, status, setLastOperation}) => {
    const tasks = useSelector((state) => state.tasks.value);
    const [isDisabled, setDisabled] = useState(true);
    const [changedName, setChangedName] = useState(name);
    const dispatch = useDispatch();
    const { TASK_CHANGED_MESSAGE, TASK_DELETED_MESSAGE } = taskAction;

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
        setLastOperation(TASK_CHANGED_MESSAGE);
    };

    const handleDeleteClick = () => {
        dispatch(deleteTask(taskId));
        let remainingTasks;
        remainingTasks = tasks.filter(task => task.id !== taskId);
        dispatch(setTasks(remainingTasks));
        if (remainingTasks.length === 0) {
            localStorage.clear();
        }
        setLastOperation(TASK_DELETED_MESSAGE);
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