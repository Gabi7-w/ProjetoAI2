import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="empty-state">
      <h1>404</h1>

      <p className="page-subtitle mx-auto mb-4">
        Esta página não existe.
      </p>

      <Link to="/events" className="btn btn-primary">
        Voltar aos eventos
      </Link>
    </div>
  );
}

export default NotFoundPage;
