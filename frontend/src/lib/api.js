const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function generateStudyContent(
  input,
  mode,
  signal
) {
  const response = await fetch(
    `${API_BASE_URL}/api/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        mode,
      }),
      signal,
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Failed to generate study content."
    );
  }

  if (!result.success || !result.data) {
    throw new Error(
      result?.error?.message ||
        "The server returned an invalid study result."
    );
  }

  return result.data;
}