export default function ProfilePage() {
  const userData = {
    email: "student@unt.edu",
    name: "Firstname Lastname",
    role: "User / Student",
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        User Profile
      </h1>

      <div>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
          Profile Details
        </h2>
        <p style={{ marginBottom: "10px" }}>Name: {userData.name}</p>
        <p style={{ marginBottom: "10px" }}>Role: {userData.role}</p>
        <p style={{ marginBottom: "10px" }}>Email: {userData.email}</p>
      </div>

      <hr style={{ margin: "20px 0", border: "1px solid #ccc" }} />

      <div>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
          Security
        </h2>
        <button style={{ marginRight: "10px", padding: "5px 10px", border: "1px solid #000", background: "none" }}>
          Change Password
        </button>
        <button style={{ padding: "5px 10px", border: "1px solid #000", background: "none" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}