export const handleSignout = async (router) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/user/login");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to sign out");
    }

    localStorage.clear();
    router.push("/user/login");
  } catch (error) {
    console.error("Error during signout:", error);
  }
};
