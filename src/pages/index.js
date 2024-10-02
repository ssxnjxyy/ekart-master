import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthModal from "@/components/AuthModal";
import HeroSection from "@/components/HeroSection";
import Link from "next/link";
export default function Home() {

  return <main className="mt-16">
   {/* <AuthModal/> */}
   <HeroSection/>
  </main>;
}
