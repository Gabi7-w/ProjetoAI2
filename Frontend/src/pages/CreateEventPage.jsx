import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateEventPage() {
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

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

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
            await api.post("/events", {
                ...formData,
                capacity: formData.capacity ? Number(formData.capacity) : null,
            });

            alert("Evento criado com sucesso!");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Erro ao criar evento.");
        }
    };

    if (!user) {
        return (
            <div className="alert alert-warning">
                Tens de iniciar sessão para criar eventos.
            </div>
        );
    }

    return (
        <>
            <h1>Criar Evento</h1>
            <p className="text-muted">
                Preenche os dados do novo evento.
            </p>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex.: Workshop de React"
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
                        placeholder="Descrição do evento"
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
                        placeholder="Ex.: Viseu"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Lotação</Form.Label>
                    <Form.Control
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="Ex.: 30"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
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
                    Criar evento
                </Button>
            </Form>
        </>
    );
}

export default CreateEventPage;