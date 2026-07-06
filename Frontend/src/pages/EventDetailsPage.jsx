import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import api from "../services/api";

function EventDetailsPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadParticipants = async () => {
    try {
      const response = await api.get(`/events/${id}/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error("Erro ao carregar participantes:", error);
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchDetails = async () => {
      try {
        const [eventResponse, participantsResponse] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/events/${id}/participants`),
        ]);

        if (!ignore) {
          setEvent(eventResponse.data);
          setParticipants(participantsResponse.data);
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
      }
    };

    fetchDetails();

    return () => {
      ignore = true;
    };
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
    return <div className="empty-state">A carregar evento...</div>;
  }

  return (
    <>
      <Link to="/events" className="btn btn-outline-secondary mb-3">
        Voltar
      </Link>

      <Card className="content-panel mb-4">
        <Card.Body>
          <div className="mb-3">
            {event.category && <Badge bg="info">{event.category.name}</Badge>}
          </div>

          <h1 className="details-title">{event.title}</h1>
          <p className="page-subtitle mb-4">{event.description}</p>

          <div className="event-meta">
            <span>
              <strong>Data:</strong> {new Date(event.date).toLocaleString("pt-PT")}
            </span>
            <span>
              <strong>Localização:</strong> {event.location}
            </span>
            <span>
              <strong>Lotação:</strong> {event.capacity ? event.capacity : "Sem limite"}
            </span>
            {event.creator && (
              <span>
                <strong>Criado por:</strong> {event.creator.name}
              </span>
            )}
            <span>
              <strong>Participantes inscritos:</strong> {participants.length}
            </span>
          </div>

          <div className="card-actions">
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
          </div>

          {isCreator && (
            <div className="alert alert-info mt-4 mb-0">
              Este evento foi criado por ti. Podes geri-lo na página{" "}
              <Link to="/my-events">Os meus eventos</Link>.
            </div>
          )}
        </Card.Body>
      </Card>

      <Card className="content-panel">
        <Card.Body>
          <Card.Title>Participantes</Card.Title>

          {participants.length === 0 && (
            <p className="text-muted mb-0">
              Ainda não existem participantes inscritos.
            </p>
          )}

          {participants.length > 0 && (
            <ListGroup className="participants-list mt-3">
              {participants.map((participant) => (
                <ListGroup.Item key={participant.id}>
                  <strong>{participant.name}</strong>
                  <span className="text-muted">{participant.email}</span>
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
