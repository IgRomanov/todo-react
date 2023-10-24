import { useState } from "react";
import { deleteTask } from "../../store/slices/tasksSlice";
import { useDispatch } from "react-redux";
import { changeTaskName } from "../../store/slices/tasksSlice";


const TodoElement = ({name, handleStatusChange, taskId, status}) => {
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
    };

    const clearSubmitData = () => {
        setDisabled(true);
        setChangedName(name);
    };

    return (
        <div className="todo__list-element">
            <div className="todo__list-container">
                {status ? 
                <>
                    <input className="todo__checkbox todo__checkbox_green" type="checkbox" defaultChecked={status} value={taskId} onChange={handleStatusChange}></input>
                    <s className="todo__text-grey">{name}</s>

                </>
                :
                <>
                    <input className="todo__checkbox" type="checkbox" defaultChecked={status} onChange={handleStatusChange} value={taskId}></input>
                    <form className="form__field" onDoubleClick={handleChangeDisabled} onSubmit={handleSubmitChange} id="taskChange">
                        <input className="task__name" spellCheck="false" onBlur={clearSubmitData} onChange={handleTaskChange} disabled={isDisabled} value={isDisabled ? name : changedName}></input>
                    </form>
                </>
                }
                
            </div>
            <button className="todo__btn-delete todo__btn_pointer" onClick={handleDeleteClick}></button>
        </div>
    )
}

export default TodoElement;