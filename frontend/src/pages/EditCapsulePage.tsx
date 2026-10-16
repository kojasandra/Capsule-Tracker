import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CapsuleForm from "../components/CapsuleForm";
import { errorMessage, getCapsule, updateCapsule } from "../api/capsules";
import type { Capsule, CapsuleInput } from "../types/capsule";

export default function EditCapsulePage() {
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
  async function save(data: CapsuleInput) {
    await updateCapsule(id, data);
    navigate(`/capsules/${id}`);
  }
  return (
    <section className="narrow-page">
      <Link className="back-link" to="/">
        ← Back to collection
      </Link>
      <h1>Edit capsule</h1>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : capsule ? (
        <CapsuleForm
          key={capsule.id}
          initial={capsule}
          onSubmit={save}
          submitLabel="Save changes"
        />
      ) : (
        <p role="status">Loading capsule…</p>
      )}
    </section>
  );
}
