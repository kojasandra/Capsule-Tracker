import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { errorMessage, listCapsules, listBrands } from "../api/capsules";
import DeleteButton from "../components/DeleteButton";
import type { Capsule, LookupOption } from "../types/capsule";

export default function CapsulesPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const brand = params.get("brand_id") || "";
  const [draft, setDraft] = useState(search);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [brands, setBrands] = useState<LookupOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => setDraft(search), [search]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    async function load() {
      try {
        const [items, options] = await Promise.all([
          listCapsules(search, brand, controller.signal),
          listBrands(controller.signal),
        ]);
        if (!controller.signal.aborted) {
          setBrands(options);
          setCapsules(items);
        }
      } catch (error) {
        if (!controller.signal.aborted) setError(errorMessage(error));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [search, brand, refresh]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setParams({
      ...(draft.trim() ? { search: draft.trim() } : {}),
      ...(brand ? { brand_id: brand } : {}),
    });
  }

  return (
    <>
      <section className="collection-heading">
        <h1>Capsules</h1>
        <Link className="button primary" to="/capsules/new">
          Add capsule
        </Link>
      </section>
      <section>
        <form className="filters" onSubmit={applyFilters}>
          <label className="search-label">
            Search by name
            <input
              type="search"
              maxLength={120}
              placeholder="Search capsules"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <label>
            Filter by brand
            <select
              value={brand}
              onChange={(e) =>
                setParams({
                  ...(search ? { search } : {}),
                  ...(e.target.value ? { brand_id: e.target.value } : {}),
                })
              }
            >
              <option value="">All brands</option>
              {brands.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
              {brand && !brands.some((item) => String(item.id) === brand) && (
                <option value={brand}>Unknown brand</option>
              )}
            </select>
          </label>
          <button className="button secondary" type="submit">
            Search
          </button>
          {(search || brand) && (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setDraft("");
                setParams({});
              }}
            >
              Clear filters
            </button>
          )}
        </form>
        {loading ? (
          <p className="empty-state" role="status">
            Loading capsules…
          </p>
        ) : error ? (
          <div className="error" role="alert">
            <p>{error}</p>
            <button
              className="button secondary"
              onClick={() => setRefresh((n) => n + 1)}
            >
              Try again
            </button>
          </div>
        ) : capsules.length === 0 ? (
          <div className="empty-state">
            <h3>{search || brand ? "No capsules found" : "No capsules yet"}</h3>
            <p>
              {search || brand
                ? "Try a different name or brand."
                : "Add your first capsule to start your collection."}
            </p>
            <Link to="/capsules/new">Add a capsule →</Link>
          </div>
        ) : (
          <div className="capsule-grid">
            {capsules.map((capsule) => (
              <article className="capsule-card" key={capsule.id}>
                <h2>
                  <Link to={`/capsules/${capsule.id}`}>{capsule.name}</Link>
                </h2>
                <p>{capsule.brand.name}</p>
                <p>
                  {capsule.flavor_notes.map((note) => note.name).join(", ") ||
                    "No flavor notes"}
                </p>
                <dl className="card-details">
                  <div>
                    <dt>Intensity</dt>
                    <dd>{capsule.intensity} / 12</dd>
                  </div>
                  <div>
                    <dt>Price</dt>
                    <dd>€{Number(capsule.price_per_capsule).toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt>Stock</dt>
                    <dd>
                      {capsule.stock === 0 ? "Out of stock" : capsule.stock}
                    </dd>
                  </div>
                  <div>
                    <dt>Rating</dt>
                    <dd>
                      {capsule.rating ? `${capsule.rating} / 5` : "Not rated"}
                    </dd>
                  </div>
                </dl>
                <div className="card-actions">
                  <Link to={`/capsules/${capsule.id}`}>View</Link>
                  <Link
                    to={`/capsules/${capsule.id}/edit`}
                    aria-label={`Edit ${capsule.name}`}
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    capsule={capsule}
                    onDeleted={() => setRefresh((n) => n + 1)}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
