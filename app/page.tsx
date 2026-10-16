import { CartDrawer, CartPill } from "@/components/Cart";
import Favourites from "@/components/Favourites";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Nav from "@/components/Nav";
import OvenScene from "@/components/OvenScene";
import Story from "@/components/Story";
import Visit from "@/components/Visit";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <OvenScene />
        <Story />
        <Favourites />
        <Menu />
        <Visit />
      </main>
      <Footer />
      <CartPill />
      <CartDrawer />
    </>
  );
}
