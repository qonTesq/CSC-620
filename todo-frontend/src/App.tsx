import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import "./App.css";

type Todo = {
  id: number | string;
  task: string;
};

const API_URL = "http://localhost:5000/todos";
const JSON_HEADERS = { "Content-Type": "application/json" };

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [editing, setEditing] = useState<Todo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingId, setSavingId] = useState<Todo["id"] | null>(null);
  const [deletingId, setDeletingId] = useState<Todo["id"] | null>(null);
  const [error, setError] = useState("");

  const busy = submitting || savingId !== null || deletingId !== null;

  const request = async <T,>(
    url: string,
    options: RequestInit,
    message: string,
  ): Promise<T | null> => {
    try {
      setError("");
      const res = await fetch(url, options);
      if (!res.ok) throw new Error();
      return (await res.json()) as T;
    } catch {
      setError(message);
      return null;
    }
  };

  useEffect(() => {
    void (async () => {
      const data = await request<Todo[]>(API_URL, {}, "Unable to load todos.");
      if (data) setTodos(data);
    })();
  }, []);

  const addTodo = async () => {
    const value = task.trim();
    if (!value) return;

    setSubmitting(true);
    const todo = await request<Todo>(
      API_URL,
      {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ task: value, completed: false }),
      },
      "Unable to add todo.",
    );
    if (todo) {
      setTodos((prev) => [...prev, todo]);
      setTask("");
    }
    setSubmitting(false);
  };

  const updateTodo = async () => {
    if (!editing) return;
    const value = editing.task.trim();
    if (!value) return;

    setSavingId(editing.id);
    const todo = await request<Todo>(
      `${API_URL}/${editing.id}`,
      {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify({ task: value }),
      },
      "Unable to update todo.",
    );
    if (todo) {
      setTodos((prev) =>
        prev.map((item) => (item.id === todo.id ? todo : item)),
      );
      setEditing(null);
    }
    setSavingId(null);
  };

  const deleteTodo = async (id: Todo["id"]) => {
    try {
      setDeletingId(id);
      setError("");
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTodos((prev) => prev.filter((t) => t.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch {
      setError("Unable to delete todo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app-shell">
      <Container style={{ maxWidth: "760px" }}>
        <h1 className="todo-title">To-Do List</h1>

        <Form
          className="todo-form"
          onSubmit={(e) => {
            e.preventDefault();
            void addTodo();
          }}
        >
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Enter a task…"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              disabled={busy}
              aria-label="New task"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!task.trim() || busy}
            >
              {submitting ? "Adding…" : "Add Task"}
            </Button>
          </InputGroup>
        </Form>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {todos.length === 0 ? (
          <div className="todo-empty">
            <h2 className="todo-empty-title text-body">No tasks yet</h2>
            <p className="text-muted mb-0">
              Add your first item above to get started.
            </p>
          </div>
        ) : (
          <ListGroup variant="flush" className="todo-list">
            {todos.map((todo, index) => {
              const isEditing = editing?.id === todo.id;
              const isSaving = savingId === todo.id;

              return (
                <ListGroup.Item key={todo.id} className="px-0">
                  {isEditing ? (
                    <Form
                      className="todo-edit-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void updateTodo();
                      }}
                    >
                      <Form.Control
                        type="text"
                        value={editing.task}
                        onChange={(e) =>
                          setEditing({ ...editing, task: e.target.value })
                        }
                        disabled={isSaving}
                        aria-label="Edit task"
                      />
                      <div className="todo-edit-actions">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={!editing.task.trim() || isSaving}
                        >
                          {isSaving ? "Saving…" : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setEditing(null)}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div className="todo-item">
                      <div className="todo-item-copy">
                        <span className="todo-item-label text-muted">
                          Task {index + 1}
                        </span>
                        <p className="todo-task text-body mb-0">{todo.task}</p>
                      </div>
                      <div className="todo-item-actions">
                        <Button
                          variant="outline-primary"
                          onClick={() => setEditing(todo)}
                          disabled={busy}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => void deleteTodo(todo.id)}
                          disabled={busy}
                        >
                          {deletingId === todo.id ? "Deleting…" : "Delete"}
                        </Button>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Container>
    </div>
  );
}
