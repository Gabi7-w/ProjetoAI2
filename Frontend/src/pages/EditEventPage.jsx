import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    categoryId: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const formatDateTimeLocal = (value) => {
    if (!value) return "";

    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (!user) return;

    let ignore = false;

    const fetchEditData = async () => {
      try {
        const [categoriesResponse, eventResponse] = await Promise.all([
          api.get("/categories"),
          api.get(`/events/${id}`),
        ]);

        if (!ignore) {
          const event = eventResponse.data;

          setCategories(categoriesResponse.data);
          setFormData({
            title: event.title || "",
            description: event.description || "",
            date: formatDateTimeLocal(event.date),
            location: event.location || "",
            capacity: event.capacity || "",
            categoryId: event.categoryId || "",
          });
        }
      } catch {
        alert("Erro ao carregar evento.");
        navigate("/my-events");
      }
    };

    fetchEditData();

    return () => {
      ignore = true;
    };
  }, [id, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/events/${id}`, {
        ...formData,
        capacity: formData.capacity ? Number(formData.capacity) : null,
      });

      alert("Evento atualizado com sucesso.");
      navigate("/my-events");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao atualizar evento.");
    }
  };

  if (!user) {
    return (
      <div className="alert alert-warning">
        Tens de iniciar sessão para editar eventos.
      </div>
    );
  }

  return (
    <>
      <Link to="/my-events" className="btn btn-outline-secondary mb-3">
        Voltar
      </Link>

      <section className="form-panel">
        <h1>Editar Evento</h1>
        <p className="page-subtitle mb-4">Atualiza os dados do evento.</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data e hora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Localização</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lotação</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Seleciona uma categoria</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            Guardar alterações
          </Button>
        </Form>
      </section>
    </>
  );
}

export default EditEventPage;
