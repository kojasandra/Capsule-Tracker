import { useState } from "react";
import { deleteCapsule, errorMessage } from "../api/capsules";
import type { Capsule } from "../types/capsule";

export default function DeleteButton({
  capsule,
  onDeleted,
}: {
  capsule: Capsule;
  onDeleted: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setBusy(true);
    setError("");
    try {
      await deleteCapsule(capsule.id);
      onDeleted();
    } catch (error) {
      setError(errorMessage(error));
      setBusy(false);
    }
  }

  return (
    <div>
      {!confirming ? (
        <button
          className="text-button danger"
          onClick={() => setConfirming(true)}
          aria-label={`Delete ${capsule.name}`}
        >
          Delete
        </button>
      ) : (
        <div
          className="delete-confirmation"
          role="group"
          aria-label="Delete confirmation"
        >
          <p>Delete {capsule.name}? This cannot be undone.</p>
          <button
            className="text-button"
            disabled={busy}
            onClick={() => {
              setConfirming(false);
              setError("");
            }}
          >
            Keep capsule
          </button>
          <button
            className="text-button danger"
            disabled={busy}
            onClick={handleDelete}
          >
            {busy ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
