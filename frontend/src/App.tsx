import { Link, NavLink, Route, Routes } from "react-router-dom";
import CapsulesPage from "./pages/CapsulesPage";
import CapsuleDetailPage from "./pages/CapsuleDetailPage";
import AddCapsulePage from "./pages/AddCapsulePage";
import EditCapsulePage from "./pages/EditCapsulePage";

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="wordmark" to="/">
          Capsule Tracker
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Collection
          </NavLink>
          <NavLink to="/capsules/new">Add capsule</NavLink>
        </nav>
      </header>
      <main id="main">
        <Routes>
          <Route path="/" element={<CapsulesPage />} />
          <Route path="/capsules/new" element={<AddCapsulePage />} />
          <Route path="/capsules/:id" element={<CapsuleDetailPage />} />
          <Route path="/capsules/:id/edit" element={<EditCapsulePage />} />
          <Route
            path="*"
            element={
              <section className="empty-state">
                <h1>Page not found</h1>
                <Link to="/">Back to collection</Link>
              </section>
            }
          />
        </Routes>
      </main>
    </>
  );
}
