import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";
import { createPaste, getPaste } from "./services/api";

function App() {
  const { pasteId } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");

  const [createdUrl, setCreatedUrl] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [searchId, setSearchId] = useState("");
  const [retrievedData, setRetrievedData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // --- Auto-Fetch Logic ---
  useEffect(() => {
    if (pasteId) {
      setSearchId(pasteId);
      handleRetrieve(pasteId);
    }
  }, [pasteId]);

  // --- Handlers ---
  const handleCreate = async () => {
    if (!content.trim()) return;
    setIsCreating(true);
    setCreateError("");
    setCreatedUrl(null);

    try {
      const data = await createPaste(content, ttl, maxViews);

      // LOGIC: Point the user to YOUR Frontend, not the Backend HTML page
      const frontendUrl = `${window.location.origin}/p/${data.id}`;

      setCreatedUrl({ ...data, url: frontendUrl });
      setContent("");
    } catch (err) {
      setCreateError(typeof err === "string" ? err : "Failed to create paste");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRetrieve = async (idOverride = null) => {
    const idToFetch = idOverride || searchId;
    if (!idToFetch.trim()) return;

    setIsFetching(true);
    setFetchError("");
    setRetrievedData(null);

    try {
      const data = await getPaste(idToFetch);
      setRetrievedData(data);
      // Update URL nicely without reload
      if (!pasteId) {
        navigate(`/p/${idToFetch}`, { replace: true });
      }
    } catch (err) {
      setFetchError(
        typeof err === "string" ? err : "Paste not found or expired.",
      );
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1 onClick={() => navigate("/")}>Pastebin Lite</h1>
        <p className="subtitle">
          Secure, temporary text sharing with auto-expiry.
        </p>
      </header>

      <div className="grid-layout">
        {/* --- LEFT CARD: CREATE --- */}
        <div className="card">
          <h2>Create New Paste</h2>
          <textarea
            className="input-area"
            placeholder="Paste your code or text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="options-row">
            <div className="input-group">
              <label>Expires in (seconds)</label>
              <input
                type="number"
                placeholder="e.g. 60"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Max Views</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
              />
            </div>
          </div>

          <button
            className="primary-btn"
            onClick={handleCreate}
            disabled={isCreating || !content}
          >
            {isCreating ? "Creating Paste..." : "Generate Shareable Link"}
          </button>

          {createError && <div className="error-msg">{createError}</div>}

          {createdUrl && (
            <div className="success-box">
              <strong>Paste Created Successfully!</strong>
              <div className="url-display">
                <a href={createdUrl.url} target="_blank" rel="noreferrer">
                  {createdUrl.url}
                </a>
              </div>
              <p
                style={{
                  marginTop: "5px",
                  fontSize: "0.8rem",
                  color: "#166534",
                }}
              >
                ID: {createdUrl.id}
              </p>
            </div>
          )}
        </div>

        {/* --- RIGHT CARD: RETRIEVE --- */}
        <div className="card">
          <h2>Retrieve Paste</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Paste ID (e.g. a8s7d9f8)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              className="primary-btn"
              style={{ width: "auto" }}
              onClick={() => handleRetrieve()}
              disabled={isFetching}
            >
              {isFetching ? "..." : "Fetch"}
            </button>
          </div>

          {fetchError && <div className="error-msg">{fetchError}</div>}

          {retrievedData && (
            <div className="result-section">
              <div className="meta-tags">
                {retrievedData.remaining_views != null ? (
                  <span className="tag">
                    Views Left: {retrievedData.remaining_views}
                  </span>
                ) : (
                  <span className="tag">Views: Unlimited</span>
                )}

                {retrievedData.expires_at ? (
                  <span className="tag">
                    Expires:{" "}
                    {new Date(retrievedData.expires_at).toLocaleTimeString()}
                  </span>
                ) : (
                  <span className="tag">No Expiry</span>
                )}
              </div>
              <textarea
                readOnly
                value={retrievedData.content}
                className="read-area"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
