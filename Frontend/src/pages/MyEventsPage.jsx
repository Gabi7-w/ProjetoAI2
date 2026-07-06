import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import api from "../services/api";

function MyEventsPage() {
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadMyEvents = async () => {
    try {
      const response = await api.get("/events/my-created");
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar os teus eventos:", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadMyEvents();
    }
  }, []);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Os meus eventos</h1>
          <p className="text-muted mb-0">
            Gere os eventos que criaste.
          </p>
        </div>

        <Link to="/events/create" className="btn btn-primary">
          Criar evento
        </Link>
      </div>

      <Row>
        {events.length === 0 && (
          <Col>
            <p className="text-muted">
              Ainda não criaste nenhum evento.
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

                <div className="d-flex gap-2 mt-3 flex-wrap">
                  <Link
                    to={`/events/${event.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Ver
                  </Link>

                  <Link
                    to={`/events/${event.id}/edit`}
                    className="btn btn-warning btn-sm"
                  >
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