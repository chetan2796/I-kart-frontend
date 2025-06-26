import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

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
      localStorage.removeItem("isLoggedIn");
      router.push("user/login");
    } catch (error) {
      console.error("Error during signout:", error);
      toast.error("Signout failed. Please try again.");
    }
  };

  return (
    <header className="header">
    </header>
  );
};

export default Header;
