import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function UnderConstruction({
  title = "Coming Soon",
  message = "This page is still under development. Please check back later.",
}: {
  title?: string;
  message?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        {title}
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 transition"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back
      </button>
    </div>
  );
}
