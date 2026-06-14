"use client";

// BlogCard — article preview card with featured and grid layouts
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Bookmark,
  ArrowRight,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";

interface BlogCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: {
      name: string;
      avatar: string;
      bio: string;
    };
    category: string;
    tags: string[];
    readTime: number;
    publishedAt: string;
    views: number;
    likes: number;
    featured?: boolean;
  };
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  // Like and bookmark interaction state
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes || 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // Relative date label (Today, Yesterday, etc.)
  const formatDate = (dateString: string) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Safe access to author data with fallbacks
  const authorName = post?.author?.name || "Dukan Machinery";
  const authorAvatar = post?.author?.avatar || "";
  const authorInitial = authorName.charAt(0).toUpperCase();

  // Large horizontal layout for featured posts
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-56 lg:h-full min-h-[400px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {post?.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title || "Blog post"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white text-lg font-black">
                  Dukan Machinery
                </span>
              </div>
            )}
            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semiblack rounded-full shadow-lg">
                {post?.category || "Insights"}
              </span>
            </div>
            {/* Featured Badge */}
            {post?.featured && (
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 bg-orange-600 text-white text-sm font-semiblack rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post?.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post?.readTime || 5} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{(post?.views || 0).toLocaleString()} views</span>
                </div>
              </div>

              {/* Title */}
              <Link href={`/insights/${post?.slug || "#"}`}>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3 hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                  {post?.title || "Untitled Post"}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                {post?.excerpt ||
                  "Read more about agricultural machinery and feed processing insights."}
              </p>

              {/* Tags */}
              {post?.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Author */}
              <Link
                href={`/insights/author/${encodeURIComponent(authorName)}`}
                className="flex items-center gap-3 group"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-black text-lg">
                      {authorInitial}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {authorName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Author
                  </p>
                </div>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Like"
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span className="text-sm">{likesCount}</span>
                </button>
                <button
                  onClick={handleBookmark}
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                  aria-label="Bookmark"
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-orange-500 text-orange-500" : ""}`}
                  />
                </button>
                <Link href={`/insights/${post?.slug || "#"}`}>
                  <button className="flex items-center gap-2 text-orange-500 font-semiblack group-hover:gap-3 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Standard vertical card for grid listings
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {post?.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title || "Blog post"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white text-sm font-black">
              Dukan Machinery
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semiblack rounded-lg shadow-lg">
            {post?.category || "Insights"}
          </span>
        </div>

        {/* Featured Badge */}
        {post?.featured && (
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2 py-1 bg-orange-600 text-white text-xs font-semiblack rounded-lg shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post?.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post?.readTime || 5} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{post?.views || 0}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/insights/${post?.slug || "#"}`}>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 hover:text-orange-500 transition-colors duration-300 line-clamp-2">
            {post?.title || "Untitled Post"}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {post?.excerpt ||
            "Read more about agricultural machinery and feed processing insights."}
        </p>

        {/* Tags */}
        {post?.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-400">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
              {authorAvatar ? (
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-black">
                  {authorInitial}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {authorName}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Like"
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="text-xs">{likesCount}</span>
            </button>
            <Link href={`/insights/${post?.slug || "#"}`}>
              <button className="text-orange-500 hover:gap-2 transition-all text-sm font-medium flex items-center gap-1">
                Read
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
