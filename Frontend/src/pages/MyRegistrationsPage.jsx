import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import api from "../services/api";

function MyRegistrationsPage() {
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadRegistrations = async () => {
    try {
      const response = await api.get("/events/me/registrations");
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar inscrições:", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadRegistrations();
    }
  }, []);

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
      <h1>As minhas inscrições</h1>
      <p className="text-muted">
        Consulta e gere os eventos em que estás inscrita.
      </p>

      <Row>
        {events.length === 0 && (
          <Col>
            <p className="text-muted">
              Ainda não estás inscrita em nenhum evento.
            </p>
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

                {event.creator && (
                  <p className="mb-3">
                    <strong>Criado por:</strong> {event.creator.name}
                  </p>
                )}

                <div className="d-flex gap-2 flex-wrap">
                  <Link
                    to={`/events/${event.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
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