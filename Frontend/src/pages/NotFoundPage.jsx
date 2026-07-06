import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1>404</h1>

      <p className="text-muted">
        Esta página não existe.
      </p>

      <Link to="/" className="btn btn-primary">
        Voltar aos eventos
      </Link>
    </div>
  );
}

export default NotFoundPage;