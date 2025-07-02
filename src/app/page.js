//import Image from "next/image";
//import Main  from "./components/Main";
import Login from "./user/login/page";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Login />
      <Link href="/about">About</Link>
    </>
  );
}
