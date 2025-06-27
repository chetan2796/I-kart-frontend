import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Header = () => {
  const router = useRouter();
  const handleSignout = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("No user is logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new toast.error("Failed to sign out");
      }
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      router.push("user/login");
    } catch (error) {
      console.error("Error during signout:", error);
      toast.error("Signout failed. Please try again.");
    }
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm flex p-5">
        <div className="container">
          <Link
            href="/dashboardSeller"
            className="btn btn-outline-primary btn-sm me-2 navbar-bra nd fw-bold text-black"
          >
            i-kart
          </Link>
        </div>
        -
        <div className="d-flex align-items-center ms-auto">
          <ul
            className="dropdown-menu dropdown-menu-end flex"
            aria-labelledby="userDropdown"
          >
            <li>
              <Link
                href="/profile_path"
                className="btn btn-outline-primary btn-sm me-2 dropdown-item text-black"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignout}
                className="btn btn-outline-primary btn-sm me-2 dropdown-item text-black"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
