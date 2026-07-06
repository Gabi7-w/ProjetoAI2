import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import api from "../services/api";

function MyEventsPage() {
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const loadMyEvents = async () => {
    try {
      const response = await api.get("/events/my-created");
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar os teus eventos:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    let ignore = false;

    const fetchMyEvents = async () => {
      try {
        const response = await api.get("/events/my-created");

        if (!ignore) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar os teus eventos:", error);
      }
    };

    fetchMyEvents();

    return () => {
      ignore = true;
    };
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Tens a certeza que queres eliminar este evento?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${id}`);
      alert("Evento eliminado com sucesso.");
      loadMyEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao eliminar evento.");
    }
  };

  if (!user) {
    return (
      <div className="alert alert-warning">
        Tens de iniciar sessão para veres os teus eventos.
      </div>
    );
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Os meus eventos</h1>
          <p>Gere os eventos que criaste.</p>
        </div>

        <Link to="/events/create" className="btn btn-primary">
          Criar evento
        </Link>
      </header>

      <Row className="event-grid">
        {events.length === 0 && (
          <Col>
            <div className="empty-state">Ainda não criaste nenhum evento.</div>
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
                </div>

                <div className="card-actions">
                  <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm">
                    Ver
                  </Link>

                  <Link to={`/events/${event.id}/edit`} className="btn btn-warning btn-sm">
                    Editar
                  </Link>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    Eliminar
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

export default MyEventsPage;
