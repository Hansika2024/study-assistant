export default function ResultView({ data }) {
  if (!data) {
    return null;
  }

  return (
    <section>
      <h2>{data.title}</h2>

      <p>
        Generated type: <strong>{data.type}</strong>
      </p>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}