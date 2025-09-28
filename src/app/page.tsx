import Image from "next/image";
import LandingPage from "./Home/page";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* <h1 className="text-4xl font-bold mb-8">Welcome to the Blog Website</h1> */}
      <LandingPage />
    </div>
  );
}