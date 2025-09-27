// src/pages/customer/BlogDetailPage.tsx
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogPosts } from "../../data/blogPosts";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the blog post by ID (convert param to number)
  const post = useMemo(() => {
    const numericId = Number(id);
    return blogPosts.find((p) => p.id === numericId);
  }, [id]);

  // If post not found → show fallback screen
  if (!post) {
    return (
      <div className="min-h-screen pb-12">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <div className="py-12 text-center">
            <h1 className="text-2xl font-semibold mb-2">Post not found</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-purple-900 hover:underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Simple reading time estimation (~200 words per minute)
  const words = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-3xl mx-auto px-6 md:px-8">

        {/* Back button */}
        <div className="pt-6 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-purple-900"
          >
            <ArrowLeftIcon className="w-6 h-6" />
            Go Back
          </button>
        </div>

        {/* Post title */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>

        {/* Meta info: date, reading time, tags */}
        <div className="mt-3 text-sm text-gray-500 flex items-center gap-3">
          <span>{post.date}</span>
          <span>•</span>
          <span>{readingTime} min read</span>
          {post.tags?.length > 0 && (
            <>
              <span>•</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Hero image */}
        <div className="mt-6 aspect-[16/9] bg-gray-100 overflow-hidden">
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Post content (Markdown with GFM support) */}
        <article className="prose prose-sm sm:prose lg:prose-lg max-w-none mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Previous / Next post navigation */}
        <div className="mt-12 flex justify-between text-sm">
          <div>
            {post.id > 1 && (
              <button
                onClick={() => navigate(`/blog/post/${post.id - 1}`)}
                className="text-purple-900 hover:underline"
              >
                ← Previous post
              </button>
            )}
          </div>
          <div>
            {post.id < blogPosts.length && (
              <button
                onClick={() => navigate(`/blog/post/${post.id + 1}`)}
                className="text-purple-900 hover:underline"
              >
                Next post →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
