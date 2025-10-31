export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <form className="flex flex-col gap-4 w-80">
        <input type="text" placeholder="Name" className="p-2 border rounded" required />
        <input type="email" placeholder="Email" className="p-2 border rounded" required />
        <input type="password" placeholder="Password" className="p-2 border rounded" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}
    