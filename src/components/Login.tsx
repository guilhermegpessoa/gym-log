import { supabase } from '../supabase';

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      alert('Error logging in with Google');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to track your gains
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
