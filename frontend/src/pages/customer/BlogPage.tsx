// src/pages/customer/BlogPage.tsx
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { blogPosts } from "../../data/blogPosts";

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-800 mb-6 mt-2"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        {/* Page heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Ideas & Inspiration
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Read our latest blog posts on home decor, tips, and trends.
        </p>

        {/* Blog post list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/post/${post.id}`}
              className="group block overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Post image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Post content */}
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-500 mb-1">{post.date}</p>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-900 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Post tags */}
                {post.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
