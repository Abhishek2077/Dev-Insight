import SessionTracker from '../components/SessionTracker';

function NewSessionPage() {
  return (
    <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 p-6 md:p-8 rounded-2xl shadow-lg">
            <SessionTracker />
        </div>
    </div>
  );
}
export default NewSessionPage;