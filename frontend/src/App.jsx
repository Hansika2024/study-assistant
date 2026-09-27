import { useState } from "react";
import Header from "./components/Header";
import PromptInput from "./components/PromptInput";
import ModeSelector from "./components/ModeSelector";
import GenerateButton from "./components/GenerateButton";
import ResultView from "./components/ResultView";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import { useStudyGenerator } from "./hooks/useStudyGenerator";

export default function App() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("quiz");

  const {
    state,
    data,
    error,
    generate,
    reset,
  } = useStudyGenerator();

  const handleGenerate = () => {
    const trimmedInput = input.trim();

    if (trimmedInput.length < 3) {
      return;
    }

    generate(trimmedInput, mode);
  };

  const isLoading = state === "loading";
  const canGenerate =
    input.trim().length >= 3 && !isLoading;

  return (
    <div className="app">
      <main className="container">
        <Header />

        <section className="generator-card">
          <PromptInput
            value={input}
            onChange={setInput}
          />

          <ModeSelector
            mode={mode}
            onChange={setMode}
          />

          <GenerateButton
            onClick={handleGenerate}
            disabled={!canGenerate}
            loading={isLoading}
          />
        </section>

        {state === "idle" && <EmptyState />}

        {state === "loading" && <LoadingState />}

        {state === "error" && (
          <ErrorState
            message={error}
            onRetry={handleGenerate}
          />
        )}

        {state === "success" && data && (
          <ResultView
            data={data}
            onRestart={reset}
          />
        )}
      </main>
    </div>
  );
}