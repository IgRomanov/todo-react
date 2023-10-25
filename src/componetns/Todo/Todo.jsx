import axios from "axios";
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
			axios
				.post(`https://jsonplaceholder.typicode.com/todos`, {
					userId: 1,
					id: currentId,
					title: taskName,
					completed: false,
				})
				.then(() => {
					dispatch(
						setTasks([
							{ title: taskName, id: currentId, completed: false },
							...tasks,
						])
					);
					setTaskName("");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const handleStatusChange = (e) => {
		let id = Number(e.target.value);
		if (isNaN(id)) {
			id = e.target.value;
		}
		const currentStatus = tasks.find((task) => task.id === id).completed;

		axios
			.patch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
				completed: !currentStatus,
			})
			.then((res) => {
				dispatch(changeTaskStatus(id));
			})
			.catch((err) => {
				console.log(err);
			});
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
        setActiveTaskCount(tasks.filter((task) => !task.completed).length);
		if (activeBtn === "active") {
			return tasks.filter((task) => task.completed === false);
		} else if (activeBtn === "completed") {
			return tasks.filter((task) => task.completed === true);
		} else {
			return tasks;
		}
	}, [tasks, activeBtn]);

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}, [tasks]);

	useEffect(() => {
		const localData = JSON.parse(localStorage.getItem("tasks"));
		if (localData.length === 0)  {
			axios
				.get("https://jsonplaceholder.typicode.com/todos")
				.then((res) => {
					dispatch(setTasks(res.data));
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, []);

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
					{filtered.map(
						(
							task 
						) => (
							<TodoElement
								key={task.id}
								name={task.title}
								handleStatusChange={handleStatusChange}
								taskId={task.id}
								status={task.completed}
							/>
						)
					)}
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
