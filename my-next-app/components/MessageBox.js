export default function MessageBox({ message, type }) {
  if (!message) return null;

  return (
    <div className={`p-3 rounded mb-4 ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      {message}
    </div>
  );
}
