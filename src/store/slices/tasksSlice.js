import { createSlice } from "@reduxjs/toolkit";

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        value: JSON.parse(localStorage.getItem('tasks')) || [],
        filtred: [],
    },
    reducers: {
        setTasks: (state, action) => {
            state.value = action.payload;
        },

        changeTaskStatus: (state, action) => {
            state.value = state.value.map((task) => {
                if (task.id === action.payload) {
                    task.status = !task.status;
                }
                return task;
            })
        },

        changeTaskName: (state, action) => {
            state.value = state.value.map((task) => {
                if (task.id === action.payload.id) {
                    task.title = action.payload.taskName;
                }
                return task;
            })
        },

        deleteTask: (state, action) => {
            state.value = state.value.filter(task => task.id !== action.payload);
        },

        deleteTasks: (state) => {
            state.value = [];
        },

    }
});

export const { 
    setTasks,
    deleteTasks, 
    deleteTask, 
    changeTaskStatus, 
    changeTaskName,
} = tasksSlice.actions;

export default tasksSlice.reducer;