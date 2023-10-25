import { useEffect, useState, useMemo } from "react";
import TodoElement from "../TodoElement/TodoElement";
import { useDispatch, useSelector } from "react-redux";
import {
	setTasks,
	changeTaskStatus,
	deleteTasks,
} from "../../store/slices/tasksSlice";
import { v4 as uuidv4 } from "uuid";

const Todo = () => {
	const tasks = useSelector((state) => state.tasks.value);
	const dispatch = useDispatch();
	const [taskName, setTaskName] = useState("");
	const [activeTaskCount, setActiveTaskCount] = useState(0);
	const [activeBtn, setActiveBtn] = useState("all");

	const handleTaskNameChange = (e) => {
		setTaskName(e.target.value);
	};

	const handleTaskSubmit = (e) => {
		let currentId = uuidv4();
		e.preventDefault();
		if (taskName) {
			dispatch(
				setTasks([{ taskName, id: currentId, status: false }, ...tasks])
			);
			setTaskName("");
		}
	};

	const handleStatusChange = (e) => {
		let id = Number(e.target.value);
		if (isNaN(id)) {
			id = e.target.value;
		}
		dispatch(changeTaskStatus(id));
	};

	const handleActiveClick = () => {
		setActiveBtn("active");
	};

	const handleCompletedClick = () => {
		setActiveBtn("completed");
	};

	const handleAllClick = () => {
		setActiveBtn("all");
	};

	const handleDeleteAllClick = () => {
		dispatch(deleteTasks());
		localStorage.removeItem("tasks");
	};

	const filtered = useMemo(() => {
		setActiveTaskCount(tasks.filter((task) => !task.status).length);
		if (activeBtn === "active") {
			return tasks.filter((task) => task.status === false);
		} else if (activeBtn === "completed") {
			return tasks.filter((task) => task.status === true);
		} else {
			return tasks;
		}
	}, [tasks, activeBtn]);

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
        console.log(tasks)
	}, [tasks]);

	return (
		<div className="todo">
			<h3 className="todo__title">todos</h3>
			<div className="todo__fields">
				<form onSubmit={handleTaskSubmit} id="taskAdd" className="form__field">
					<label className="todo__task-label">
						<button className="todo__arrow todo__btn_pointer" />
						<input
							className="todo__task-input"
							placeholder="What needs to be done?"
							onChange={handleTaskNameChange}
							value={taskName}
						></input>
					</label>
				</form>
				<div className="todo__list">
					{filtered.map((task) => (
						<TodoElement
							key={task.id}
							name={task.taskName}
							handleStatusChange={handleStatusChange}
							taskId={task.id}
							status={task.status}
						/>
					))}
				</div>
				<div className="todo__params">
					<span className="todo__left">
						{activeTaskCount > 1
							? `${activeTaskCount} items left`
							: `${activeTaskCount} item left`}
					</span>
					<div className="todo__buttons-container">
						<button
							className={`todo__btn todo__btn_pointer ${
								activeBtn === "all" && "todo__btn_border"
							}`}
							onClick={handleAllClick}
						>
							All
						</button>
						<button
							className={`todo__btn todo__btn_pointer ${
								activeBtn === "active" && "todo__btn_border"
							}`}
							onClick={handleActiveClick}
						>
							Active
						</button>
						<button
							className={`todo__btn todo__btn_pointer ${
								activeBtn === "completed" && "todo__btn_border"
							}`}
							onClick={handleCompletedClick}
						>
							Completed
						</button>
					</div>
					<button
						className="todo__btn_pointer todo__clear-btn"
						onClick={handleDeleteAllClick}
					>
						Clear completed
					</button>
				</div>
			</div>
		</div>
	);
};

export default Todo;
