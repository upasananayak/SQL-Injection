import { useState, useEffect } from "react";
import logo from "/home/upasana/221IT075/IAS/flask_sql_injection_detector_react+vite/flask_sql_injection_detector/NITK_Emblem.png"; 

export default function SQLInjectionDetector() {
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const savedQuery = sessionStorage.getItem("savedQuery");
    const savedModel = sessionStorage.getItem("savedModel");
    if (savedQuery) setQuery(savedQuery);
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("savedQuery", query);
    sessionStorage.setItem("savedModel", selectedModel);
  }, [query, selectedModel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || !selectedModel) {
      alert("Please enter a query and select a model.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, model: selectedModel }),
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error detecting SQL Injection:", error);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedModel("");
    setPrediction(null);
    sessionStorage.removeItem("savedQuery");
    sessionStorage.removeItem("savedModel");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-lightpurple-700 p-6">
   <div className="w-full bg-white shadow-md p-4 flex items-center justify-between mb-8">
  {/* Left - Logo */}
  <div className="flex-shrink-0 ml-4">
    <img src={logo} alt="NITK Logo" className="w-35 h-40 object-contain" />
  </div>

  {/* Center - Header Text */}
  <div className="flex flex-col items-center text-center flex-grow mx-4">
    <h2 className="text-xl font-bold text-gray-800">DEPARTMENT OF INFORMATION TECHNOLOGY</h2>
    <h2 className="text-lg font-semibold text-gray-700">
      NATIONAL INSTITUTE OF TECHNOLOGY KARNATAKA, SURATHKAL-575025
    </h2>
    <p className="mt-2 text-md font-medium text-gray-700">
      Information Assurance and Security (IT352) Course Project
    </p>
    <p className="mt-2 text-md text-gray-700">Carried out by</p>
    <p className="mt-1 text-md font-semibold text-gray-700">Prajna B Shettigar(221IT051)</p>
    <p className="text-md font-semibold text-gray-700">Upasana Nayak (221IT075)</p>
    <p className="mt-2 text-md text-gray-700">During Academic Session January — April 2025</p>
  </div>

  {/* Right - Empty Space (Optional) */}
  <div className="w-20"></div>
</div>
      <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center backdrop-blur-md">
         {/* Project Heading */}
   
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">🔍 SQL Injection Detector</h1>

        <label className="block text-lg font-semibold text-gray-700 mb-2">Enter SQL Query:</label>
        <textarea
          rows="4"
          placeholder="Type or paste your SQL query here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-4 focus:ring-pink-500"
        ></textarea>

        <label className="block text-lg font-semibold text-gray-700 mb-2">Select Model:</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          placeholder="Select a Model"
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-4 focus:ring-pink-500"
        >
          
          <option value="Model 1 Dataset 1">Model 1 (Dataset 1)</option>
          <option value="Model 1 Dataset 2">Model 1 (Dataset 2)</option>
          <option value="Model 2 Dataset 1">Model 2 (Dataset 1)</option>
          <option value="Model 2 Dataset 2">Model 2 (Dataset 2)</option>
        </select>

        <div className="flex justify-between gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition transform hover:scale-110"
          >
            ✅ Detect Injection
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition transform hover:scale-110"
          >
            ❌ Clear
          </button>
        </div>

        <div className="mt-8 p-5 border rounded-lg bg-gray-100 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700">Prediction Details</h2>
          <p className="text-gray-700 mt-2"><strong>Selected Model:</strong> {selectedModel || "Not selected"}</p>
          <p className="text-gray-700"><strong>Query:</strong> {query || "No query entered"}</p>
          <p className="mt-3 text-xl font-bold">
            <strong>Prediction:</strong>{" "}
            <span
              className={`text-2xl ${prediction === "SQL Injection Detected" ? "text-red-600" : "text-green-600"}`} >
              {prediction !== null ? prediction : "No prediction yet"}
            </span>
          </p>
        </div>

        {prediction && (
          <a
            href={`/generate_pdf?result=${encodeURIComponent(prediction)}&query=${encodeURIComponent(query)}&model=${encodeURIComponent(selectedModel)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition transform hover:scale-110"
          >
            📄 Download Report
          </a>
        )}
      </div>
    </div>
  );
}