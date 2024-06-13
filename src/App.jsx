import React, { useEffect, useState } from 'react';
import './App.css';
import { TodoContextProvider } from './context/TodoContext';
import { TodoForm } from './components';
import TodoItem from './components/TodoItems';

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    setTodos((prev) => [
      { id: Date.now(), createdAt: new Date().toISOString(), ...todo },
      ...prev
    ]);
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo
      )
    );
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos && storedTodos.length > 0) {
      const parsedTodos = storedTodos.map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
      setTodos(parsedTodos);
    }
  }, []);

  useEffect(() => {
    const stringifiedTodos = todos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt).toISOString(),
    }));
    localStorage.setItem('todos', JSON.stringify(stringifiedTodos));
  }, [todos]);

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });

    const ordinalSuffix = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${ordinalSuffix(day)} ${month}`;
  };

  const groupedTodos = todos.reduce((acc, todo) => {
    const date = getFormattedDate(todo.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(todo);
    return acc;
  }, {});

  return (
    <TodoContextProvider value={{ todos, addTodo, deleteTodo, updateTodo, toggleComplete }}>
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">Bharat-Todo</h1>
          <div className="mb-4">
            <TodoForm />
          </div>
          <div>
            {Object.keys(groupedTodos).map((date) => (
              <div key={date} className="mb-6">
                <h2 className="text-xl font-semibold mb-4">{date}</h2>
                <div className="flex flex-wrap gap-y-3">
                  {groupedTodos[date].map((todo) => (
                    <div key={todo.id} className="w-full">
                      <TodoItem todo={todo} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TodoContextProvider>
  );
}

export default App;
