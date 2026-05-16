'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import BlogCard from '@/components/blog/BlogCard'
import BlogFilters from '@/components/blog/BlogFilters'
import NewsletterSignup from '@/components/blog/NewsletterSignup'

export default function InsightsPageClient() {
  const t = useTranslations('insights')
  const [filteredPosts, setFilteredPosts] = useState(() => {
    // Get blog posts from translations
    const posts = [
      {
        id: t('blogPosts.0.id'),
        slug: t('blogPosts.0.slug'),
        title: t('blogPosts.0.title'),
        excerpt: t('blogPosts.0.excerpt'),
        content: 'Full content here...',
        featuredImage: '/images/insight/Mcn.jpg',
        author: {
          name: t('blogPosts.0.author.name'),
          avatar: '',
          bio: t('blogPosts.0.author.bio')
        },
        category: t('blogPosts.0.category'),
        tags: t('blogPosts.0.tags').split(','),
        readTime: parseInt(t('blogPosts.0.readTime')),
        publishedAt: t('blogPosts.0.publishedAt'),
        views: parseInt(t('blogPosts.0.views')),
        likes: parseInt(t('blogPosts.0.likes')),
        featured: t('blogPosts.0.featured') === 'true',
      },
      {
        id: t('blogPosts.1.id'),
        slug: t('blogPosts.1.slug'),
        title: t('blogPosts.1.title'),
        excerpt: t('blogPosts.1.excerpt'),
        content: 'Full content here...',
        featuredImage: '/images/insight/Feed machinary for insight2.jpg',
        author: {
          name: t('blogPosts.1.author.name'),
          avatar: '',
          bio: t('blogPosts.1.author.bio')
        },
        category: t('blogPosts.1.category'),
        tags: t('blogPosts.1.tags').split(','),
        readTime: parseInt(t('blogPosts.1.readTime')),
        publishedAt: t('blogPosts.1.publishedAt'),
        views: parseInt(t('blogPosts.1.views')),
        likes: parseInt(t('blogPosts.1.likes')),
        featured: t('blogPosts.1.featured') === 'true',
      },
      {
        id: t('blogPosts.2.id'),
        slug: t('blogPosts.2.slug'),
        title: t('blogPosts.2.title'),
        excerpt: t('blogPosts.2.excerpt'),
        content: 'Full content here...',
        featuredImage: '/images/insight/Feed machinary for insight1.jpg',
        author: {
          name: t('blogPosts.2.author.name'),
          avatar: '',
          bio: t('blogPosts.2.author.bio')
        },
        category: t('blogPosts.2.category'),
        tags: t('blogPosts.2.tags').split(','),
        readTime: parseInt(t('blogPosts.2.readTime')),
        publishedAt: t('blogPosts.2.publishedAt'),
        views: parseInt(t('blogPosts.2.views')),
        likes: parseInt(t('blogPosts.2.likes')),
        featured: t('blogPosts.2.featured') === 'true',
      },
      {
        id: t('blogPosts.3.id'),
        slug: t('blogPosts.3.slug'),
        title: t('blogPosts.3.title'),
        excerpt: t('blogPosts.3.excerpt'),
        content: 'Full content here...',
        featuredImage: '/images/insight/feed machinery insight3.jpg',
        author: {
          name: t('blogPosts.3.author.name'),
          avatar: '',
          bio: t('blogPosts.3.author.bio')
        },
        category: t('blogPosts.3.category'),
        tags: t('blogPosts.3.tags').split(','),
        readTime: parseInt(t('blogPosts.3.readTime')),
        publishedAt: t('blogPosts.3.publishedAt'),
        views: parseInt(t('blogPosts.3.views')),
        likes: parseInt(t('blogPosts.3.likes')),
        featured: t('blogPosts.3.featured') === 'true',
      }
    ]
    return posts
  })

  const allCategories = [...new Set(filteredPosts.map((post) => post.category))]
  const allTags = [...new Set(filteredPosts.flatMap((post) => post.tags))]

  const ensureCompletePostData = (posts: any[]) =>
    posts.map((post) => ({
      ...post,
      author: {
        name: post.author?.name || 'Dukan Machinery',
        avatar: post.author?.avatar || '',
        bio: post.author?.bio || t('authorBio.default'),
      },
    }))

  const [featuredPost, setFeaturedPost] = useState(filteredPosts.find((p) => p.featured) || filteredPosts[0])
  const [regularPosts, setRegularPosts] = useState(filteredPosts.filter((p) => !p.featured))

  const handleFilterChange = (filters: any) => {
    let filtered = ensureCompletePostData(filteredPosts)

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      )
    }

    if (filters.category && filters.category !== 'All Categories') {
      filtered = filtered.filter((post) => post.category === filters.category)
    }

    if (filters.tag && filters.tag !== 'All Tags') {
      filtered = filtered.filter((post) => post.tags.includes(filters.tag))
    }

    if (filters.dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      switch (filters.dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }
      filtered = filtered.filter((post) => new Date(post.publishedAt) >= filterDate)
    }

    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'trending':
        filtered.sort((a, b) => b.likes / b.views - a.likes / a.views)
        break
    }

    const featured = filtered.find((p) => p.featured) || filtered[0]
    setFilteredPosts(filtered)
    if (featured) setFeaturedPost(featured)
    setRegularPosts(filtered.filter((p) => p.id !== featured?.id))
  }

  const industryInsights = [
    {
      icon: TrendingUp,
      title: t('insights.cards.0.title'),
      description: t('insights.cards.0.description'),
      category: t('insights.cards.0.category'),
    },
    {
      icon: Clock,
      title: t('insights.cards.1.title'),
      description: t('insights.cards.1.description'),
      category: t('insights.cards.1.category'),
    },
    {
      icon: Eye,
      title: t('insights.cards.2.title'),
      description: t('insights.cards.2.description'),
      category: t('insights.cards.2.category'),
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <main className="flex-grow pt-24">
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-16">
          <div className="container mx-auto px-2 sm:px-4 lg:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-green-800 dark:text-white mb-4">
                {t('pageTitle')} <span className="text-orange-500">{t('pageTitleHighlight')}</span>
              </h1>
              <div className="w-24 h-2 bg-orange-500 mx-auto rounded-full mb-6" />
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('pageDescription')}
              </p>
            </motion.div>
          </div>
        </section>

        {featuredPost && (
          <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
            <BlogCard post={featuredPost} featured />
          </section>
        )}

        <section className="py-12 container mx-auto px-2 sm:px-4 lg:px-6">
          <BlogFilters
            onFilterChange={handleFilterChange}
            categories={allCategories}
            tags={allTags}
            totalPosts={filteredPosts.length}
          />

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
              <p className="text-gray-500 dark:text-gray-400">{t('filters.noResults')}</p>
            </motion.div>
          )}
        </section>

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
                {t('insights.title')} <span className="text-orange-500">{t('insights.titleHighlight')}</span>
              </h2>
              <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
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

        <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup variant="default" />
        </section>
      </main>
    </div>
  )
}