import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Form, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../services/api";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");

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
    let ignore = false;

    const fetchInitialData = async () => {
      try {
        const [categoriesResponse, eventsResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/events", {
            params: {
              search: "",
              location: "",
              categoryId: "",
              date: "",
            },
          }),
        ]);

        if (!ignore) {
          setCategories(categoriesResponse.data);
          setEvents(eventsResponse.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    };

    fetchInitialData();

    return () => {
      ignore = true;
    };
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
      <header className="page-header">
        <div>
          <h1>Eventos</h1>
          <p>Pesquisa, filtra e inscreve-te em eventos disponíveis.</p>
        </div>
      </header>

      <Form onSubmit={handleSearch} className="filter-panel">
        <Row className="g-3 align-items-end">
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

          <Col xs={12} className="d-flex gap-2 flex-wrap">
            <Button type="submit" variant="primary">
              Filtrar
            </Button>

            <Button type="button" variant="outline-secondary" onClick={handleClearFilters}>
              Limpar
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className="event-grid">
        {events.length === 0 && (
          <Col>
            <div className="empty-state">Nenhum evento encontrado.</div>
          </Col>
        )}

        {events.map((event) => (
          <Col md={6} xl={4} key={event.id}>
            <Card className="event-card">
              <Card.Body>
                <div className="mb-2">
                  {event.category && <Badge bg="info">{event.category.name}</Badge>}
                </div>

                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>

                <div className="event-meta">
                  <span>
                    <strong>Data:</strong>{" "}
                    {new Date(event.date).toLocaleString("pt-PT")}
                  </span>
                  <span>
                    <strong>Local:</strong> {event.location}
                  </span>
                  <span>
                    <strong>Lotação:</strong>{" "}
                    {event.capacity ? event.capacity : "Sem limite"}
                  </span>
                  {event.creator && (
                    <span>
                      <strong>Criado por:</strong> {event.creator.name}
                    </span>
                  )}
                </div>

                <div className="card-actions">
                  <Link to={`/events/${event.id}`} className="btn btn-outline-primary">
                    Ver detalhe
                  </Link>

                  <Button variant="success" onClick={() => handleRegister(event.id)}>
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
