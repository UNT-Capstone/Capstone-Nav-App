export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
}
