import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { FaSearch, FaSpinner, FaRobot, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/SearchBar.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const searchRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const closeSuggestions = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", closeSuggestions);

    // Initialize Web Speech API if supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setListening(true);
        toast.info("🎙️ Voice Search listening... Speak now!", { autoClose: 2500 });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setListening(false);
        toast.success(`🎙️ Searching for: "${transcript}"`);
        onSearch(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setListening(false);
        toast.warning("Could not hear speech clearly. Please try speaking again.");
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      document.removeEventListener("click", closeSuggestions);
    };
  }, [onSearch]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      toast.error("Voice search is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Voice Start Error:", err);
      }
    }
  };

  const fetchSuggestions = async (value) => {
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(
        `/search?query=${encodeURIComponent(value)}`
      );

      if (Array.isArray(response.data)) {
        setSuggestions(response.data.slice(0, 8));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Suggestion Error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSearch = () => {
    if (!query.trim() || loading) return;
    onSearch(query);
    setSuggestions([]);
  };

  const selectSuggestion = (product) => {
    const title = typeof product === "string" ? product : product.title;
    setQuery(title);
    onSearch(title);
    setSuggestions([]);
  };

  return (
    <section className="search-section">
      <div className="search-header">
        <span className="search-badge">
          <FaRobot /> AI Product Search
        </span>
        <h2>Find Your Perfect Product</h2>
        <p>Search thousands of Amazon products using AI or hands-free Voice Search.</p>
      </div>

      <div className="search-box-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />

          <input
            type="text"
            className="search-input"
            placeholder={
              listening
                ? "🎙️ Listening... Speak your product request now..."
                : "Search products like Shoes, Laptop, Headphones..."
            }
            value={query}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          {/* Voice Search Button */}
          <button
            type="button"
            className={`voice-search-btn ${listening ? "listening" : ""}`}
            onClick={toggleVoiceSearch}
            title={listening ? "Stop Voice Search" : "Start Voice Search"}
          >
            {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spin" />
                Searching...
              </>
            ) : (
              <>
                <FaSearch />
                Search
              </>
            )}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((item, index) => {
              const title = typeof item === "string" ? item : item.title;
              const image = typeof item === "string" ? "" : item.image;

              return (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => selectSuggestion(item)}
                >
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <span>{title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchBar;