import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { errorMessage, getCapsule } from "../api/capsules";
import DeleteButton from "../components/DeleteButton";
import type { Capsule } from "../types/capsule";

export default function CapsuleDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setCapsule(null);
    setError("");
    getCapsule(id, controller.signal)
      .then(setCapsule)
      .catch((error) => {
        if (!controller.signal.aborted) setError(errorMessage(error));
      });
    return () => controller.abort();
  }, [id]);

  return (
    <section className="narrow-page">
      <Link className="back-link" to="/">
        ← Back to collection
      </Link>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : !capsule ? (
        <p role="status">Loading capsule…</p>
      ) : (
        <>
          <h1>{capsule.name}</h1>
          <p>{capsule.brand.name}</p>
          <article className="detail-panel">
            <dl className="detail-grid">
              <div>
                <dt>Intensity</dt>
                <dd>
                  {capsule.intensity}
                  <small> / 12</small>
                </dd>
              </div>
              <div>
                <dt>Price per capsule</dt>
                <dd>€{Number(capsule.price_per_capsule).toFixed(2)}</dd>
              </div>
              <div>
                <dt>In stock</dt>
                <dd>
                  {capsule.stock}
                  <small> capsules</small>
                </dd>
              </div>
              <div>
                <dt>Your rating</dt>
                <dd>
                  {capsule.rating ? `${capsule.rating} / 5` : "Not rated"}
                </dd>
              </div>
            </dl>
            <div className="note-section">
              <h2>Flavor notes</h2>
              <p>
                {capsule.flavor_notes.map((note) => note.name).join(", ") ||
                  "No flavor notes yet."}
              </p>
            </div>
            <div className="note-section">
              <h2>Comment</h2>
              <p>{capsule.comment || "No comment yet."}</p>
            </div>
            <p className="muted">
              Added{" "}
              {new Date(capsule.created_at).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </p>
            <div className="detail-actions">
              <Link
                className="button primary"
                to={`/capsules/${capsule.id}/edit`}
              >
                Edit capsule
              </Link>
              <DeleteButton capsule={capsule} onDeleted={() => navigate("/")} />
            </div>
          </article>
        </>
      )}
    </section>
  );
}
