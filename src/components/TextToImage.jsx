import React, { useState } from "react";
import { FaDownload, FaWandMagicSparkles } from "react-icons/fa6";

const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt 
          }),
        }
      );


      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    } catch (err) {
      setError(`Failed to generate image: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "generated-image.png";
      link.click();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl p-8 max-w-md w-full shadow-2xl text-white text-center">
      <h1 className="text-2xl font-bold mb-6">Text to Image Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="A cat playing guitar"
        className="w-full px-4 py-3 rounded-xl text-black text-sm mb-4 outline-none border border-gray-300 placeholder:text-gray-400"
      />

      <button
        onClick={generateImage}
        disabled={!prompt || loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-base font-semibold transition ${
          loading || !prompt
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <FaWandMagicSparkles />
        {loading ? "Generating..." : "Generate"}
      </button>

      <p className="text-sm text-gray-200 mt-4">
        Try:{" "}
        <span
          onClick={() => setPrompt("A dragon flying over mountains")}
          className="underline cursor-pointer"
        >
          A dragon flying over mountains
        </span>
      </p>

      {error && <p className="text-red-300 mt-3">{error}</p>}

      {imageUrl && (
        <div className="mt-6">
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded-xl mx-auto shadow-lg"
          />
          <button
            onClick={handleDownload}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black hover:bg-gray-100 font-medium"
          >
            <FaDownload />
            Download Image
          </button>
        </div>
      )}

      <p className="text-xs text-gray-300 mt-6">
        Built using React & Hugging Face API
      </p>
    </div>
  );
};

export default TextToImage;



