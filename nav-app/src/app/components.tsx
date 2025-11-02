import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-blue-800 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold">UNT Navigator</h1>
      <ul className="flex gap-4">
        <li><Link href="/">Landing</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/signup">Sign Up</Link></li>
        <li><Link href="/home">Home</Link></li>
        <li><Link href="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}
