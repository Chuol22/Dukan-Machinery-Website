"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Eye } from "lucide-react";

import BlogCard from "@/components/blog/BlogCard";
import BlogFilters from "@/components/blog/BlogFilters";
import NewsletterSignup from "@/components/blog/NewsletterSignup";

interface BlogAuthor {
  name: string;
  avatar: string;
  bio: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: string;
  views: number;
  likes: number;
  featured: boolean;
}

interface FilterOptions {
  search: string;
  category: string;
  tag: string;
  sortBy: "newest" | "oldest" | "popular" | "trending";
  dateRange: "all" | "week" | "month" | "year";
}

// Ensure every blog post has complete author information
const ensureCompletePostData = (posts: BlogPost[]): BlogPost[] => {
  return posts.map((post) => ({
    ...post,
    author: {
      name: post.author?.name || "Dukan Machinery",
      avatar: post.author?.avatar || "",
      bio: post.author?.bio || "Industry expert at Dukan Machinery",
    },
  }));
};

// Blog posts
const rawBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "choosing-right-feed-mill",
    title: "Choosing the Right Feed Mill for Your Farm",
    excerpt:
      "Key factors to consider when selecting poultry feed equipment for optimal production. Learn about capacity, energy efficiency, and maintenance requirements.",
    content: "Full content here...",
    featuredImage: "/images/insight/Mcn.jpg",
    author: {
      name: "Asefa Geze",
      avatar: "",
      bio: "Agricultural engineer with 15+ years of experience",
    },
    category: "Buying Guide",
    tags: ["feed-mill", "poultry", "equipment"],
    readTime: 8,
    publishedAt: "2026-03-15",
    views: 12450,
    likes: 342,
    featured: true,
  },
  {
    id: "2",
    slug: "reduce-energy-costs",
    title: "5 Ways to Reduce Energy Costs in Feed Processing",
    excerpt:
      "Practical tips to lower your electricity bills without compromising output quality. Discover energy-efficient motors and optimal scheduling.",
    content: "Full content here...",
    featuredImage: "/images/insight/Feed machinary for insight2.jpg",
    author: {
      name: "Samuel Kebede",
      avatar: "",
      bio: "Energy efficiency specialist",
    },
    category: "Optimization",
    tags: ["energy", "cost-saving", "efficiency"],
    readTime: 6,
    publishedAt: "2026-03-10",
    views: 8750,
    likes: 231,
    featured: false,
  },
  {
    id: "3",
    slug: "hammer-mill-maintenance",
    title: "Maintenance Schedule for Hammer Mills",
    excerpt:
      "A comprehensive guide to keeping your grinding equipment in top condition. Daily, weekly, and monthly checklists included.",
    content: "Full content here...",
    featuredImage: "/images/insight/Feed machinary for insight1.jpg",
    author: {
      name: "Tekle Berhan",
      avatar: "",
      bio: "Maintenance engineer",
    },
    category: "Maintenance",
    tags: ["hammer-mill", "maintenance", "repair"],
    readTime: 7,
    publishedAt: "2026-03-05",
    views: 6320,
    likes: 189,
    featured: false,
  },
  {
    id: "4",
    slug: "organic-fertilizer-future",
    title: "The Future of Organic Fertilizer Production",
    excerpt:
      "How automation is transforming the composting and drying process. Emerging technologies and market trends for 2026.",
    content: "Full content here...",
    featuredImage: "/images/insight/feed machinery insight3.jpg",
    author: {
      name: "Melat Alemayew",
      avatar: "",
      bio: "Agri-industrial consultant",
    },
    category: "Industry Trends",
    tags: ["fertilizer", "automation", "sustainability"],
    readTime: 5,
    publishedAt: "2026-02-28",
    views: 5210,
    likes: 167,
    featured: false,
  },
];

const blogPosts = ensureCompletePostData(rawBlogPosts);const allCategories = [...new Set(blogPosts.map((post) => post.category))];
const allTags = [...new Set(blogPosts.flatMap((post) => post.tags))];

export default function InsightsPage() {
  const [filteredPosts, setFilteredPosts] =
    useState<BlogPost[]>(blogPosts);

  const [featuredPost, setFeaturedPost] =
    useState<BlogPost>(
      blogPosts.find((post) => post.featured) ?? blogPosts[0]
    );

  const [regularPosts, setRegularPosts] =
    useState<BlogPost[]>(
      blogPosts.filter((post) => !post.featured)
    );

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...blogPosts];

    // Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();

      filtered = filtered.filter((post) => {
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    // Category
    if (filters.category) {
      filtered = filtered.filter(
        (post) => post.category === filters.category
      );
    }

    // Tag
    if (filters.tag) {
      filtered = filtered.filter((post) =>
        post.tags.includes(filters.tag)
      );
    }

    // Date
    if (filters.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;

        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;

        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (post) => new Date(post.publishedAt) >= filterDate
      );
    }

    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
        break;

      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
        );
        break;

      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;

      case "trending":
        filtered.sort(
          (a, b) => b.likes / b.views - a.likes / a.views
        );
        break;
    }

    const featured =
      filtered.find((post) => post.featured) ?? filtered[0];

    const regular = filtered.filter(
      (post) => post.id !== featured?.id
    );

    setFilteredPosts(filtered);

    if (featured) {
      setFeaturedPost(featured);
    }

    setRegularPosts(regular);
  };const industryInsights = [
    {
      icon: TrendingUp,
      title: "The Future of Feed Pelletizing",
      description:
        "How automated moisture control is revolutionizing output quality in 2026.",
      category: "Optimization",
      image: "/images/blog/insights/feed-pelletizing.jpg",
    },
    {
      icon: Clock,
      title: "Extending Machine Lifespans",
      description:
        "Essential preventative maintenance tips for heavy industrial mixers.",
      category: "Maintenance",
      image: "/images/blog/insights/machine-lifespan.jpg",
    },
    {
      icon: Eye,
      title: "Ethiopian Agri-Growth",
      description:
        "How local manufacturing is reducing reliance on machinery imports.",
      category: "Case Study",
      image: "/images/blog/insights/ethiopian-agri.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <main className="grow pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-16">
          <div className="container mx-auto px-2 sm:px-4 lg:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-green-800 dark:text-white mb-4">
                Expert{" "}
                <span className="text-orange-500">Insights & Blog</span>
              </h1>

              <div className="w-24 h-2 bg-orange-500 mx-auto rounded-full mb-6" />

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Expert advice, industry trends, and practical tips to optimize
                your agricultural processing operations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
            <BlogCard post={featuredPost} featured={true} />
          </section>
        )}

        {/* Filters */}
        <section className="py-12 container mx-auto px-2 sm:px-4 lg:px-6">
          <BlogFilters
            onFilterChange={handleFilterChange}
            categories={allCategories}
            tags={allTags}
            totalPosts={filteredPosts.length}
          />

          {/* Posts Grid */}
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
              {regularPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-500 dark:text-gray-400">
                No posts found matching your criteria.
              </p>
            </motion.div>
          )}
        </section>

        {/* Industry Insights */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-black text-green-800 dark:text-white mb-4">
                Industry <span className="text-orange-500">Insights</span>
              </h2>
              <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full" />
            </motion.div><div className="grid md:grid-cols-3 gap-8">
              {industryInsights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
                    <insight.icon className="w-6 h-6 text-orange-500" />
                  </div>

                  <span className="text-xs font-black text-orange-500 uppercase tracking-wider">
                    {insight.category}
                  </span>

                  <h3 className="text-xl font-black text-secondary-dark dark:text-white mt-2 mb-2">
                    {insight.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {insight.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup variant="default" />
        </section>
      </main>
    </div>
  );
}