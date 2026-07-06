import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login realizado com sucesso.");
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao iniciar sessão.");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body>
          <Card.Title>Iniciar sessão</Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemplo@email.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Entrar
            </Button>
          </Form>

          <p className="mt-3 mb-0">
            Ainda não tens conta? <Link to="/register">Criar conta</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginPage;