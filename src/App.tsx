import ActivityForm from './components/ActivityForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Gym Log 💪
        </h1>

        <ActivityForm />
      </div>
    </div>
  );
}

export default App;
