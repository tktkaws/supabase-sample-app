"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { createClient } from "./utils/supabase/client";
import { Database } from "@/types/database.types";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching todos:", error);
          return;
        }

        if (data) {
          setTodos(data);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        const { data, error } = await supabase
          .from("todos")
          .insert([
            {
              text: newTodo,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error("Error adding todo:", error);
          return;
        }

        if (data) {
          setTodos([...todos, data]);
          setNewTodo("");
        }
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleUpdateTodo = async (id: number) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ text: editingText })
        .eq("id", id);

      if (error) {
        console.error("Error updating todo:", error);
        return;
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editingText } : todo
        )
      );
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting todo:", error);
        return;
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Todoリスト</h1>
        
        <div className={styles.addTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="新しいタスクを入力"
          />
          <button onClick={handleAddTodo}>追加</button>
        </div>

        <ul className={styles.todoList}>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <span className={styles.todoId}>{todo.id}</span>
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className={styles.editInput}
                  />
                  <div className={styles.editButtons}>
                    <button onClick={() => handleUpdateTodo(todo.id)}>保存</button>
                    <button onClick={handleCancelEdit}>キャンセル</button>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.todoText}>{todo.text}</span>
                  <div className={styles.todoButtons}>
                    <button onClick={() => handleStartEdit(todo)}>編集</button>
                    <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
