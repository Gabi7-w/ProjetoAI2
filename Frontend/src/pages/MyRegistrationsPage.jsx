import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import api from "../services/api";

function MyRegistrationsPage() {
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const loadRegistrations = async () => {
    try {
      const response = await api.get("/events/me/registrations");
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar inscrições:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    let ignore = false;

    const fetchRegistrations = async () => {
      try {
        const response = await api.get("/events/me/registrations");

        if (!ignore) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar inscrições:", error);
      }
    };

    fetchRegistrations();

    return () => {
      ignore = true;
    };
  }, [userId]);

  const handleCancelRegistration = async (eventId) => {
    const confirmCancel = confirm(
      "Tens a certeza que queres cancelar esta inscrição?"
    );

    if (!confirmCancel) return;

    try {
      await api.delete(`/events/${eventId}/register`);
      alert("Inscrição cancelada com sucesso.");
      loadRegistrations();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao cancelar inscrição.");
    }
  };

  if (!user) {
    return (
      <div className="alert alert-warning">
        Tens de iniciar sessão para veres as tuas inscrições.
      </div>
    );
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>As minhas inscrições</h1>
          <p>Consulta e gere os eventos em que estás inscrito.</p>
        </div>
      </header>

      <Row className="event-grid">
        {events.length === 0 && (
          <Col>
            <div className="empty-state">
              Ainda não estás inscrito em nenhum evento.
            </div>
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
                  {event.creator && (
                    <span>
                      <strong>Criado por:</strong> {event.creator.name}
                    </span>
                  )}
                </div>

                <div className="card-actions">
                  <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm">
                    Ver detalhe
                  </Link>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleCancelRegistration(event.id)}
                  >
                    Cancelar inscrição
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

export default MyRegistrationsPage;
