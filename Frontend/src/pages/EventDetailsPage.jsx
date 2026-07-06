import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import api from "../services/api";

function EventDetailsPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Erro ao carregar evento:", error);
    }
  };

  const loadParticipants = async () => {
    try {
      const response = await api.get(`/events/${id}/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error("Erro ao carregar participantes:", error);
    }
  };

  useEffect(() => {
    loadEvent();
    loadParticipants();
  }, [id]);

  const isRegistered = user
    ? participants.some((participant) => participant.id === user.id)
    : false;

  const isCreator = user && event && event.creatorId === user.id;

  const handleRegister = async () => {
    if (!user) {
      alert("Tens de iniciar sessão para te inscreveres.");
      return;
    }

    try {
      await api.post(`/events/${id}/register`, {});
      alert("Inscrição realizada com sucesso.");
      loadParticipants();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao realizar inscrição.");
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await api.delete(`/events/${id}/register`);
      alert("Inscrição cancelada com sucesso.");
      loadParticipants();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao cancelar inscrição.");
    }
  };

  if (!event) {
    return <p>A carregar evento...</p>;
  }

  return (
    <>
      <Link to="/" className="btn btn-outline-secondary mb-3">
        Voltar
      </Link>

      <Card className="mb-4">
        <Card.Body>
          <div className="mb-2">
            {event.category && (
              <Badge bg="info">{event.category.name}</Badge>
            )}
          </div>

          <Card.Title as="h1">{event.title}</Card.Title>

          <Card.Text>{event.description}</Card.Text>

          <p className="mb-1">
            <strong>Data:</strong>{" "}
            {new Date(event.date).toLocaleString("pt-PT")}
          </p>

          <p className="mb-1">
            <strong>Localização:</strong> {event.location}
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

          <p className="mb-3">
            <strong>Participantes inscritos:</strong> {participants.length}
          </p>

          {!isCreator && !isRegistered && (
            <Button variant="success" onClick={handleRegister}>
              Inscrever-me
            </Button>
          )}

          {!isCreator && isRegistered && (
            <Button variant="outline-danger" onClick={handleCancelRegistration}>
              Cancelar inscrição
            </Button>
          )}

          {isCreator && (
            <div className="alert alert-info mt-3 mb-0">
              Este evento foi criado por ti. Podes geri-lo na página{" "}
              <Link to="/my-events">Os meus eventos</Link>.
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Participantes</Card.Title>

          {participants.length === 0 && (
            <p className="text-muted mb-0">
              Ainda não existem participantes inscritos.
            </p>
          )}

          {participants.length > 0 && (
            <ListGroup>
              {participants.map((participant) => (
                <ListGroup.Item key={participant.id}>
                  {participant.name} — {participant.email}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default EventDetailsPage;