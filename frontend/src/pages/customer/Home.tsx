// src/pages/customer/Home.tsx
import { useState } from "react";

// Import sections
import HeroSection from "../../components/customer/home/HeroSection";
import PromoCarousel from "../../components/customer/home/PromoCarousel";
import FeaturedPicks from "../../components/customer/home/FeaturedPicks";
import Categories from "../../components/customer/home/Categories";
import ShopByRoom from "../../components/customer/home/ShopByRoom";
import HotProducts from "../../components/customer/home/HotProducts";
import Services from "../../components/customer/home/Services";
import Inspiration from "../../components/customer/home/Inspiration";
import Newsletter from "../../components/customer/home/Newsletter";

// Import images
import whitechair1 from "../../assets/whitechair1.jpg";
import hallway from "../../assets/Hallway.jpg";
import diningroom from "../../assets/dining room.jpg";

export default function Home() {
  const [q, setQ] = useState("");

  // ✅ Promo banners (dummy data)
  const banners = [
    {
      id: 1,
      title: "Autumn Essentials",
      subtitle: "Up to 30% off on beds & tables",
      cta: "Shop Deals",
      href: "/shop?promo=autumn",
      img: hallway,
    },
    {
      id: 2,
      title: "New Nordic Collection",
      subtitle: "Minimalist wood chairs & lighting",
      cta: "Explore Now",
      href: "/shop?collection=nordic",
      img: whitechair1,
    },
    {
      id: 3,
      title: "Bundle & Save",
      subtitle: "Dining room sets with extra perks",
      cta: "View Bundles",
      href: "/shop?bundle=living",
      img: diningroom,
    },
  ];

  return (
    <div className="space-y-10 md:space-y-24">
      <HeroSection q={q} setQ={setQ} />
      <PromoCarousel banners={banners} />
      <FeaturedPicks />
      <Categories />
      <Services />
      <ShopByRoom />
      <HotProducts />
      <Inspiration />
      <Newsletter />
    </div>
  );
}
