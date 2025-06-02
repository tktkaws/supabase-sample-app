"use server";

import { createClient } from "./utils/supabase/server";

import { Database } from "../types/database.types";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export async function getTodos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }

  return data;
}

export async function addTodo(text: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .insert([{ text }])
    .select()
    .single();

  if (error) {
    console.error("Error adding todo:", error);
    return null;
  }

  return data;
}

export async function updateTodo(id: number, text: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({ text })
    .eq("id", id);

  if (error) {
    console.error("Error updating todo:", error);
    return false;
  }

  return true;
}

export async function deleteTodo(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting todo:", error);
    return false;
  }

  return true;
} 