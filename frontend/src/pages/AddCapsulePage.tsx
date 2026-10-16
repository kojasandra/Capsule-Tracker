import { Link, useNavigate } from "react-router-dom";
import CapsuleForm from "../components/CapsuleForm";
import { createCapsule } from "../api/capsules";
import type { CapsuleInput } from "../types/capsule";

export default function AddCapsulePage() {
  const navigate = useNavigate();
  async function save(data: CapsuleInput) {
    const capsule = await createCapsule(data);
    navigate(`/capsules/${capsule.id}`);
  }
  return (
    <section className="narrow-page">
      <Link className="back-link" to="/">
        ← Back to collection
      </Link>
      <h1>Add a capsule</h1>
      <CapsuleForm onSubmit={save} submitLabel="Add capsule" />
    </section>
  );
}
