import { createSlice } from "@reduxjs/toolkit";

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        value: [],
        filtred: [],
    },
    reducers: {
        setTasks: (state, action) => {
            state.value = action.payload;
        },

        changeTaskStatus: (state, action) => {
            if (state.filtred.length > 0) {
                state.filtred = state.filtred.filter((task) => {
                    if (task.id === action.payload) {
                        task.status = !task.status;
                    }
                    return task.id !== action.payload;
                });
            };

            state.value = state.value.map((task) => {
                if (task.id === action.payload) {
                    task.status = !task.status;
                }
                return task;
            })
        },

        changeTaskName: (state, action) => {
            if (state.filtred.length > 0) {
                state.filtred = state.filtred.map((task) => {
                    if (task.id === action.payload.id) {
                        task.taskName = action.payload.taskName;
                    }
                    return task;
                });
            };
            
            state.value = state.value.map((task) => {
                if (task.id === action.payload.id) {
                    task.taskName = action.payload.taskName;
                }
                return task;
            })
        },

        deleteTask: (state, action) => {
            if (state.filtred.length > 0) {
                state.filtred = state.filtred.filter(task => task.id !== action.payload);
            }
            state.value = state.value.filter(task => task.id !== action.payload);
        },

        filterTaskByStatus: (state, action) => {
            state.filtred = state.value.filter(task => task.status !== action.payload);
        },

        clearFiltredTask: (state) => {
            state.filtred = [];
        }
    }
});

export const { 
    setTasks, 
    deleteTask, 
    filterTaskByStatus, 
    clearFiltredTask, 
    changeTaskStatus, 
    changeTaskName,
} = tasksSlice.actions;

export default tasksSlice.reducer;