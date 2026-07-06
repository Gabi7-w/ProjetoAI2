import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import heroImage from "../assets/hero-evently.png";

function FeatureIcon({ type }) {
  const paths = {
    search: (
      <>
        <circle cx="17" cy="17" r="7" />
        <path d="m22 22 6 6" />
      </>
    ),
    ticket: (
      <>
        <path d="M9 13a4 4 0 0 0 0 8v5h22v-5a4 4 0 0 0 0-8V8H9v5Z" />
        <path d="M17 8v18" />
        <path d="M22 14h5" />
        <path d="M22 20h5" />
      </>
    ),
    calendar: (
      <>
        <rect x="8" y="10" width="24" height="22" rx="5" />
        <path d="M14 7v6" />
        <path d="M26 7v6" />
        <path d="M8 17h24" />
        <path d="M15 23h3" />
        <path d="M22 23h3" />
      </>
    ),
  };

  return (
    <span className="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 40 40" focusable="false">
        {paths[type]}
      </svg>
    </span>
  );
}

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-copy">
          <Badge bg="info" className="mb-3">
            Plataforma de eventos
          </Badge>
          <h1>Evently</h1>
          <p>
            Descobre eventos, filtra por categoria, gere inscrições e acompanha
            tudo num espaço simples e organizado.
          </p>

          <div className="home-actions">
            <Button as={Link} to="/events" variant="primary">
              Ver eventos
            </Button>

            {user ? (
              <Button as={Link} to="/events/create" variant="outline-primary">
                Criar evento
              </Button>
            ) : (
              <Button as={Link} to="/register" variant="outline-primary">
                Criar conta
              </Button>
            )}
          </div>
        </div>

        <div className="home-hero-media">
          <img src={heroImage} alt="Ilustração da plataforma de eventos" />
        </div>
      </section>

      <Row className="home-stat-grid">
        <Col md={4}>
          <div className="home-stat">
            <strong>Eventos</strong>
            <span>consulta pública com filtros por data, local e categoria</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="home-stat">
            <strong>Inscrições</strong>
            <span>registo e cancelamento diretamente na página do evento</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="home-stat">
            <strong>Backoffice</strong>
            <span>criação de eventos e gestão de categorias para utilizadores</span>
          </div>
        </Col>
      </Row>

      <section className="home-section">
        <div className="page-header">
          <div>
            <h1>O que podes fazer</h1>
            <p>As principais ações continuam disponíveis sem entrar logo na área de gestão.</p>
          </div>
        </div>

        <Row className="event-grid">
          <Col md={4}>
            <Card className="event-card feature-card">
              <Card.Body>
                <FeatureIcon type="search" />
                <Card.Title>Explorar eventos</Card.Title>
                <Card.Text>
                  Acede à listagem, pesquisa por texto e refina os resultados por local,
                  categoria ou data.
                </Card.Text>
                <div className="card-actions">
                  <Link to="/events" className="btn btn-outline-primary">
                    Abrir lista
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="event-card feature-card">
              <Card.Body>
                <FeatureIcon type="ticket" />
                <Card.Title>Gerir participação</Card.Title>
                <Card.Text>
                  Inicia sessão para te inscreveres em eventos e acompanhares as tuas
                  inscrições.
                </Card.Text>
                <div className="card-actions">
                  <Link to="/my-registrations" className="btn btn-outline-primary">
                    Minhas inscrições
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="event-card feature-card">
              <Card.Body>
                <FeatureIcon type="calendar" />
                <Card.Title>Criar e organizar</Card.Title>
                <Card.Text>
                  Utilizadores autenticados podem criar eventos, editar dados e organizar
                  categorias.
                </Card.Text>
                <div className="card-actions">
                  <Link to="/events/create" className="btn btn-outline-primary">
                    Novo evento
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default HomePage;
