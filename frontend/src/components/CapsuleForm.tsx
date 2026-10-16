import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { errorMessage, listBrands, listFlavorNotes } from "../api/capsules";
import type { Capsule, CapsuleInput, LookupOption } from "../types/capsule";

interface Props {
  initial?: Capsule;
  onSubmit: (data: CapsuleInput) => Promise<void>;
  submitLabel: string;
}

export default function CapsuleForm({ initial, onSubmit, submitLabel }: Props) {
  const [values, setValues] = useState({
    name: initial?.name ?? "",
    brand_id: initial ? String(initial.brand_id) : "",
    intensity: String(initial?.intensity ?? 5),
    price_per_capsule: initial?.price_per_capsule ?? "",
    stock: String(initial?.stock ?? 0),
    rating: initial?.rating == null ? "" : String(initial.rating),
    comment: initial?.comment ?? "",
  });
  const [selectedNotes, setSelectedNotes] = useState<number[]>(
    initial?.flavor_notes.map((note) => note.id) ?? [],
  );
  const [brands, setBrands] = useState<LookupOption[]>([]);
  const [notes, setNotes] = useState<LookupOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoadingOptions(true);
    setOptionsError("");
    Promise.all([
      listBrands(controller.signal),
      listFlavorNotes(controller.signal),
    ])
      .then(([brands, notes]) => {
        if (!controller.signal.aborted) {
          setBrands(brands);
          setNotes(notes);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setOptionsError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingOptions(false);
      });
    return () => controller.abort();
  }, [retry]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function change(field: keyof typeof values, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!values.name.trim() || !values.brand_id) {
      setError("Enter a name and select a brand.");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        brand_id: Number(values.brand_id),
        intensity: Number(values.intensity),
        flavor_note_ids: selectedNotes,
        price_per_capsule: values.price_per_capsule,
        stock: Number(values.stock),
        rating: values.rating === "" ? null : Number(values.rating),
        comment: values.comment.trim() || null,
      });
    } catch (error) {
      setError(errorMessage(error));
      setBusy(false);
    }
  }

  return (
    <form className="form-panel" onSubmit={submit}>
      <fieldset
        disabled={
          busy || loadingOptions || !!optionsError || brands.length === 0
        }
      >
        <legend>Capsule details</legend>
        <div className="form-grid">
          <label>
            Name
            <input
              required
              maxLength={120}
              value={values.name}
              onChange={(e) => change("name", e.target.value)}
              placeholder="e.g. Arpeggio"
            />
          </label>
          <label>
            Brand
            <select
              required
              value={values.brand_id}
              onChange={(e) => change("brand_id", e.target.value)}
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Intensity (1–12)
            <input
              required
              type="number"
              min="1"
              max="12"
              step="1"
              value={values.intensity}
              onChange={(e) => change("intensity", e.target.value)}
            />
          </label>
          <label>
            Price per capsule (€)
            <input
              required
              type="number"
              min="0"
              max="999999.99"
              step="0.01"
              value={values.price_per_capsule}
              onChange={(e) => change("price_per_capsule", e.target.value)}
              placeholder="0.45"
            />
          </label>
          <label>
            Stock
            <input
              required
              type="number"
              min="0"
              max="2147483647"
              step="1"
              value={values.stock}
              onChange={(e) => change("stock", e.target.value)}
            />
          </label>
          <label>
            Rating <span className="optional">optional</span>
            <select
              value={values.rating}
              onChange={(e) => change("rating", e.target.value)}
            >
              <option value="">Not rated yet</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </label>
          <div className="full-width">
            <label htmlFor="flavor-note-select">
              Flavor notes <span className="optional">optional</span>
            </label>
            <select
              id="flavor-note-select"
              value=""
              onChange={(e) => {
                if (e.target.value)
                  setSelectedNotes((previous) => [
                    ...previous,
                    Number(e.target.value),
                  ]);
              }}
            >
              <option value="">Select a flavor note to add</option>
              {notes
                .filter((note) => !selectedNotes.includes(note.id))
                .map((note) => (
                  <option key={note.id} value={note.id}>
                    {note.name}
                  </option>
                ))}
            </select>
            <p className="muted">
              Choose one or more notes. Select another to add it.
            </p>
            <div className="selected-notes" aria-label="Selected flavor notes">
              {selectedNotes.map((id) => {
                const note = notes.find((item) => item.id === id);
                return (
                  <button
                    type="button"
                    key={id}
                    className="note-chip"
                    aria-label={`Remove ${note?.name ?? "flavor note"}`}
                    onClick={() =>
                      setSelectedNotes((previous) =>
                        previous.filter((item) => item !== id),
                      )
                    }
                  >
                    {note?.name ?? "Loading…"} <span aria-hidden="true">×</span>
                  </button>
                );
              })}
            </div>
          </div>
          <label className="full-width">
            Comment <span className="optional">optional</span>
            <textarea
              maxLength={2000}
              rows={3}
              value={values.comment}
              onChange={(e) => change("comment", e.target.value)}
              placeholder="What did you think of this cup?"
            />
          </label>
        </div>
      </fieldset>
      {loadingOptions && <p role="status">Loading brands and flavor notes…</p>}
      {optionsError && (
        <div className="error" role="alert">
          <p>{optionsError}</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Retry options
          </button>
        </div>
      )}
      {!loadingOptions && !optionsError && brands.length === 0 && (
        <p className="error" role="alert">
          No brands are available yet. Add the sample data before creating a
          capsule.
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <Link
          className="button secondary"
          to={initial ? `/capsules/${initial.id}` : "/"}
        >
          Cancel
        </Link>
        <button
          className="button primary"
          disabled={
            busy || loadingOptions || !!optionsError || brands.length === 0
          }
        >
          {busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
