import React, { useState } from "react";
import InputForm from "./components/InputForm";
import ShortenedUrlsTable from "./components/ShortenedUrlsTable";
import StatsPage from "./components/StatsPage";

const API_URL = "http://localhost:3000"; // change to backend URL if different

const App = () => {
  const [links, setLinks] = useState([]);
  const [stats] = useState([]);

  const handleShorten = async (urls) => {
    try {
      const urlObj = urls[0];
      const response = await fetch(`${API_URL}/shorturls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urlObj),
      });
      const data = await response.json();
      if (response.ok) {
        // Backend returns a single shortened-link object
        setLinks(prev => [data, ...prev]);
      } else {
        alert(data.error || "Failed to shorten URL(s)");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>React URL Shortener</h1>
      <InputForm onShorten={handleShorten} />
      <ShortenedUrlsTable links={links} />
      <StatsPage stats={stats} />
    </div>
  );
};

export default App;
