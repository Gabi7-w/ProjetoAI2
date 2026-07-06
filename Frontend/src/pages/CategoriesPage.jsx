import { useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import api from "../services/api";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        if (!ignore) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Escreve o nome da categoria.");
      return;
    }

    try {
      await api.post("/categories", { name });

      setName("");
      loadCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao criar categoria.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Tens a certeza que queres eliminar esta categoria?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao eliminar categoria.");
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Categorias</h1>
          <p>Gere as categorias dos eventos.</p>
        </div>
      </header>

      <section className="form-panel mb-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome da categoria</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex.: Workshop"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Criar categoria
          </Button>
        </Form>
      </section>

      {categories.length === 0 && (
        <div className="empty-state">Ainda não existem categorias.</div>
      )}

      {categories.length > 0 && (
        <ListGroup>
          {categories.map((category) => (
            <ListGroup.Item
              key={category.id}
              className="d-flex justify-content-between align-items-center gap-3"
            >
              <strong>{category.name}</strong>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDelete(category.id)}
              >
                Eliminar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}

export default CategoriesPage;
