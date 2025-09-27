import {
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import summerlivora from "../../assets/summer-livora.webp";

/**
 * Services list (each with title, description, and icon)
 */
const services = [
  {
    title: "Fast Delivery",
    description:
      "With our trusted logistics partners, we guarantee your furniture is shipped quickly, safely, and with real-time tracking so you can stay updated.",
    icon: TruckIcon,
  },
  {
    title: "Quality Assurance",
    description:
      "Every product is crafted from premium materials and undergoes a strict quality control process to ensure it meets our highest standards.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Expert Consultation",
    description:
      "Our design professionals are ready to guide you in choosing furniture that fits your lifestyle, space, and aesthetic vision.",
    icon: StarIcon,
  },
  {
    title: "Custom Orders",
    description:
      "Looking for something unique? We offer custom-made furniture services to bring your ideas to life, tailored to your needs.",
    icon: ChatBubbleOvalLeftEllipsisIcon,
  },
];

/**
 * AboutPage
 * 
 * Displays the About section with:
 * - Hero banner
 * - Company story
 * - Services grid
 * - CTA (Explore Collection)
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen pb-16">
      {/* ---------------------------
          HERO SECTION
      ---------------------------- */}
      <section
        className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${summerlivora})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-4 md:px-12 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            About LIVORA
          </h1>
          <p className="text-base md:text-lg text-gray-200">
            Timeless design, premium quality, and comfort for your home.
          </p>
        </div>
      </section>

      {/* ---------------------------
          MAIN CONTENT
      ---------------------------- */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 space-y-16 md:space-y-20 mt-12 md:mt-16">

        {/* Our Story */}
        <section className="grid md:grid-cols-2 px-6 md:px-0 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Our Story
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4">
              LIVORA was founded with a simple mission: to make modern,
              high-quality furniture accessible for everyone. We believe that
              your home should be a reflection of your lifestyle—comfortable,
              elegant, and timeless.
            </p>
            <p className="text-base md:text-lg text-gray-600">
              Combining craftsmanship with innovative design, we work closely
              with artisans and use premium materials to deliver furniture that
              lasts for generations.
            </p>
          </div>
          <img
            src={summerlivora}
            alt="LIVORA showroom"
            className="shadow-lg object-cover w-full h-56 sm:h-72 md:h-80"
          />
        </section>

        {/* Our Services */}
        <section className="bg-gray-100 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Our Services
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
              From delivery to design guidance, LIVORA is committed to giving
              you a worry-free shopping experience at every stage.
            </p>

            {/* Services grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-white shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center"
                >
                  <service.icon className="w-10 h-10 md:w-12 md:h-12 text-purple-900 mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-16 md:py-24 text-center text-white bg-purple-900/60 backdrop-blur-sm">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight">
              Elevate Your Everyday Living
            </h2>
            <p className="text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto text-purple-100">
              Experience furniture that blends timeless design with comfort and
              creating spaces that truly feel like home.
            </p>
            <Link
              to="/products"
              className="px-6 py-2.5 md:px-8 md:py-3 bg-gray-900 text-purple-100 font-semibold uppercase tracking-wide shadow-md hover:bg-purple-800 hover:text-white transition"
            >
              Explore Collection
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
