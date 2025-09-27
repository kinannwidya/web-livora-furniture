// src/components/customer/sections/home/Inspiration.tsx

// Imports: router and blog data
import { Link } from "react-router-dom";
import { blogPosts } from "../../../data/blogPosts";

// Inspiration section component
export default function Inspiration() {
  // Show first 3 blog posts
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-20">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ideas & Inspiration</h2>
        <Link to="/blog" className="text-sm text-purple-900 hover:text-purple-700">
          See all →
        </Link>
      </div>

      {/* Grid layout: left big card + right stacked cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: main featured post */}
        <Link
          to={`/blog/post/${posts[0].id}`}
          className="border border-gray-200 hover:border-gray-300 transition flex flex-col"
        >
          <div className="aspect-[5/3] md:aspect-[16/9] bg-gray-100 overflow-hidden">
            <img
              src={posts[0].img}
              alt={posts[0].title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex-1">
            <p className="text-sm text-gray-500 mb-1">{posts[0].date}</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {posts[0].title}
            </h3>
            <p className="text-sm text-gray-600">{posts[0].excerpt}</p>
          </div>
        </Link>

        {/* Right: two smaller stacked posts */}
        <div className="grid gap-6">
          {posts.slice(1).map((post) => (
            <Link
              key={post.id}
              to={`/blog/post/${post.id}`}
              className="border border-gray-200 hover:border-gray-300 transition flex flex-col sm:flex-row"
            >
              <div className="aspect-[5/3] sm:aspect-[4/3] sm:w-1/3 bg-gray-100 overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:w-2/3">
                <p className="text-xs text-gray-500 mb-1">{post.date}</p>
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
