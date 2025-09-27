// Imports: service icons and background image
import {
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import summerlivora from "../../../assets/summer-livora.webp";

// Services list (title, description, and icon)
const services = [
  {
    title: "Fast Delivery",
    desc: "We ensure your orders are shipped quickly and arrive safely at your doorstep.",
    icon: TruckIcon,
  },
  {
    title: "Quality Assurance",
    desc: "Every piece is crafted with the highest quality materials and attention to detail.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Expert Consultation",
    desc: "Our team of experts is ready to help you find the perfect furniture for your home.",
    icon: StarIcon,
  },
  {
    title: "Custom Orders",
    desc: "Can't find what you're looking for? We can create custom furniture just for you.",
    icon: ChatBubbleOvalLeftEllipsisIcon,
  },
];

// Services section component
export default function Services() {
  return (
    <section className="relative bg-gray-50 py-8 md:py-16">
      {/* Background image (mobile only) */}
      <div className="absolute inset-0 md:hidden">
        <img
          src={summerlivora}
          alt="Why choose us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-12 md:gap-20 items-center py-8 md:py-0">
        {/* Left: section text + service items */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white md:text-gray-900 md:text-left mb-3 md:mb-4">
            Why Choose Us
          </h2>
          <p className="text-base md:text-lg text-gray-200 md:text-gray-600 mb-6 md:mb-10">
            We’re committed to making furniture shopping effortless and enjoyable —
            here’s what sets us apart.
          </p>

          {/* Service list */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-8">
            {services.map((s) => (
              <div key={s.title} className="flex items-start gap-3 md:gap-4">
                <s.icon className="w-6 h-6 md:w-8 md:h-8 text-white md:text-purple-900 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white md:text-gray-800 mb-1">
                    {s.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-200 md:text-gray-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: illustration image (desktop only) */}
        <div className="hidden md:block relative">
          <img
            src={summerlivora}
            alt="Why choose us"
            className="shadow-md object-cover w-full h-[420px]"
          />
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400/20 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
