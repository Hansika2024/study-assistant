import { useRef, useState } from "react";
import { generateStudyContent } from "../lib/api";
import { validateStudyResult } from "../lib/validateResult";

export function useStudyGenerator() {
  const [state, setState] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  async function generate(input, mode) {
    const requestId = ++requestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState("loading");
    setData(null);
    setError(null);

    try {
      const result = await generateStudyContent(
        input,
        mode,
        controller.signal
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      const validation = validateStudyResult(result);

      if (!validation.valid) {
        setState("error");
        setError(validation.message);
        return;
      }

      setData(validation.data);
      setState("success");
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      setState("error");
      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    }
  }

  function reset() {
    requestIdRef.current += 1;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState("idle");
    setData(null);
    setError(null);
  }

  return {
    state,
    data,
    error,
    generate,
    reset,
  };
}