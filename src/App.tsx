import React, { FC, ChangeEvent, useState, useEffect } from "react";
import "./App.css";



import TodoTask from "./Components/TodoTask";
import { ITask } from "./Interfaces";

import axios from 'axios';

const App: FC = () => {
  const [task, setTask] = useState<string>("");
  const [deadline, setDeadline] = useState<number>(0);
  const [todoList, setTodoList] = useState<ITask[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
      .then(response => setTodoList(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);



  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === "task") {
      setTask(event.target.value);
    } else {
      setDeadline(Number(event.target.value));
    }
  };



  const addTask = (): void => {

    const newTask = { taskName: task, deadline: deadline, completed: false };
    axios.post('http://localhost:3001/tasks', newTask)
      .then(response => setTodoList([...todoList, response.data]))
      .catch(error => console.error('Error adding task:', error));
    setTask("");
    setDeadline(0);
  };

  //completion
  const completeTask = (taskNameToDelete: string): void => {
    const taskToDelete = todoList.find(task => task.taskName === taskNameToDelete);
    if (taskToDelete) {
      axios.delete(`http://localhost:3001/tasks/${taskToDelete.id}`)
        .then(() => {
          setTodoList(todoList.filter(task => task.taskName !== taskNameToDelete));
        })
        .catch(error => console.error('Error deleting task:', error));
    }
  };




  return (
    <div className="App">
      <div className="header">
        <div className="inputContainer">
          <input

        
            type="text"

            placeholder="Task..."
            name="task"
            value={task}
            onChange={handleChange}
          />
          <input

            type="number"
            placeholder="Deadline (in Days)..."
            name="deadline"

            value={deadline}
            onChange={handleChange}
          />
        </div>
        <button onClick={addTask}>Add Task</button>
      </div>


      <div className="todoList">
        {todoList.map((task: ITask, key: number) => {
          return <TodoTask key={key} task={task} completeTask={completeTask} />;
        })}
      </div>
    </div>
  );
};

export default App;
