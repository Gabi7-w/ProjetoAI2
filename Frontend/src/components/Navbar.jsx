import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function AppNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Evently
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-lg-1">
            <Nav.Link as={Link} to="/">
              Início
            </Nav.Link>

            <Nav.Link as={Link} to="/events">
              Eventos
            </Nav.Link>

            {user && (
              <>
                <Nav.Link as={Link} to="/events/create">
                  Criar Evento
                </Nav.Link>

                <Nav.Link as={Link} to="/my-events">
                  Os meus eventos
                </Nav.Link>

                <Nav.Link as={Link} to="/my-registrations">
                  As minhas inscrições
                </Nav.Link>

                <Nav.Link as={Link} to="/categories">
                  Categorias
                </Nav.Link>
              </>
            )}

            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>

                <Nav.Link as={Link} to="/register">
                  Registo
                </Nav.Link>
              </>
            )}

            {user && (
              <>
                <span className="navbar-user ms-lg-3 me-lg-2 mt-2 mt-lg-0">
                  Olá, {user.name}
                </span>

                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
