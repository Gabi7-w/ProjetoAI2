import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Form, Badge } from "react-bootstrap";
import api from "../services/api";
import { Link } from "react-router-dom";

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [date, setDate] = useState("");

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const loadEvents = async () => {
        try {
            const response = await api.get("/events", {
                params: {
                    search,
                    location,
                    categoryId,
                    date,
                },
            });

            setEvents(response.data);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        }
    };

    useEffect(() => {
        loadCategories();
        loadEvents();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadEvents();
    };

    const handleClearFilters = () => {
        setSearch("");
        setLocation("");
        setCategoryId("");
        setDate("");

        setTimeout(() => {
            loadEvents();
        }, 0);
    };

    const handleRegister = async (eventId) => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Tens de iniciar sessão para te inscreveres num evento.");
            return;
        }

        try {
            await api.post(`/events/${eventId}/register`, {});

            alert("Inscrição realizada com sucesso!");
        } catch (error) {
            alert(error.response?.data?.message || "Erro ao realizar inscrição.");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Eventos</h1>
                    <p className="text-muted mb-0">
                        Pesquisa, filtra e inscreve-te em eventos.
                    </p>
                </div>
            </div>

            <Form onSubmit={handleSearch} className="mb-4 p-3 border rounded bg-light">
                <Row className="g-3">
                    <Col md={3}>
                        <Form.Label>Pesquisar</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ex.: React"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Label>Localização</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ex.: Viseu"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Todas</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={3}>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Col>

                    <Col xs={12} className="d-flex gap-2">
                        <Button type="submit" variant="primary">
                            Filtrar
                        </Button>

                        <Button type="button" variant="secondary" onClick={handleClearFilters}>
                            Limpar
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Row>
                {events.length === 0 && (
                    <Col>
                        <p className="text-muted">Nenhum evento encontrado.</p>
                    </Col>
                )}

                {events.map((event) => (
                    <Col md={4} className="mb-4" key={event.id}>
                        <Card className="h-100">
                            <Card.Body>
                                <div className="mb-2">
                                    {event.category && (
                                        <Badge bg="info">{event.category.name}</Badge>
                                    )}
                                </div>

                                <Card.Title>{event.title}</Card.Title>

                                <Card.Text>{event.description}</Card.Text>

                                <p className="mb-1">
                                    <strong>Data:</strong>{" "}
                                    {new Date(event.date).toLocaleString("pt-PT")}
                                </p>

                                <p className="mb-1">
                                    <strong>Local:</strong> {event.location}
                                </p>

                                <p className="mb-1">
                                    <strong>Lotação:</strong>{" "}
                                    {event.capacity ? event.capacity : "Sem limite"}
                                </p>

                                {event.creator && (
                                    <p className="mb-3">
                                        <strong>Criado por:</strong> {event.creator.name}
                                    </p>
                                )}

                                <div className="d-flex gap-2 flex-wrap">
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="btn btn-outline-primary"
                                    >
                                        Ver detalhe
                                    </Link>

                                    <Button
                                        variant="success"
                                        onClick={() => handleRegister(event.id)}
                                    >
                                        Inscrever-me
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default EventsPage;