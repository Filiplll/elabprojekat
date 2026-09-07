export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 shadow-sm">
      {Array.isArray(message) ? (
        <ul className="list-inside list-disc space-y-1">
          {message.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
