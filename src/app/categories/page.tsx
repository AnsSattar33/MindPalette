"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List, SortAsc, SortDesc, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryCard from "@/components/CategoryCard";
import CategoryStats from "@/components/CategoryStats";
import CategoryFilter from "@/components/CategoryFilter";

interface Category {
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
  icon: string;
  recentPosts: {
    id: string;
    title: string;
    createdAt: string;
    author: string;
  }[];
}

interface Post {
  id: string;
  title: string;
  description?: string;
  image?: string;
  tags: string[];
  createdAt: string;
  author: {
    name: string;
  };
  Like: any[];
  Comment: any[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "posts" | "recent">("posts");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch posts
      const postsResponse = await fetch('/api/posts');
      const postsData = await postsResponse.json();
      
      if (postsData.status === 'success') {
        setAllPosts(postsData.posts);
        setFilteredPosts(postsData.posts);
        
        // Generate categories from post tags
        const categoryMap = new Map<string, Category>();
        
        postsData.posts.forEach((post: Post) => {
          post.tags.forEach(tag => {
            if (!categoryMap.has(tag)) {
              categoryMap.set(tag, {
                name: tag,
                slug: tag.toLowerCase().replace(/\s+/g, '-'),
                description: `Explore ${tag} articles, tutorials, and insights`,
                postCount: 0,
                color: getCategoryColor(tag),
                icon: getCategoryIcon(tag),
                recentPosts: []
              });
            }
            
            const category = categoryMap.get(tag)!;
            category.postCount++;
            category.recentPosts.push({
              id: post.id,
              title: post.title,
              createdAt: post.createdAt,
              author: post.author.name
            });
          });
        });

        // Sort recent posts by date
        categoryMap.forEach(category => {
          category.recentPosts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          category.recentPosts = category.recentPosts.slice(0, 3); // Keep only 3 recent
        });

        const categoriesArray = Array.from(categoryMap.values());
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (tag: string): string => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500",
      "bg-yellow-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  const getCategoryIcon = (tag: string): string => {
    const icons: { [key: string]: string } = {
      "Next.js": "⚛️",
      "React": "⚛️",
      "TypeScript": "📘",
      "JavaScript": "📘",
      "Web Development": "🌐",
      "CSS": "🎨",
      "Tailwind CSS": "🎨",
      "Database": "🗄️",
      "MongoDB": "🍃",
      "Prisma": "🔧",
      "Authentication": "🔐",
      "NextAuth.js": "🔐",
      "Redux": "🔄",
      "State Management": "🔄",
      "Vercel": "▲",
      "Deployment": "🚀",
      "Accessibility": "♿",
      "UX": "👤",
      "Design": "🎨",
      "Frontend": "💻",
      "Backend": "⚙️",
      "Tutorial": "📚",
      "Programming": "💻"
    };
    return icons[tag] || "📝";
  };

  // Filter and sort categories
  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "posts":
          comparison = a.postCount - b.postCount;
          break;
        case "recent":
          const aRecent = a.recentPosts[0] ? new Date(a.recentPosts[0].createdAt).getTime() : 0;
          const bRecent = b.recentPosts[0] ? new Date(b.recentPosts[0].createdAt).getTime() : 0;
          comparison = aRecent - bRecent;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleCategoryClick = (categorySlug: string) => {
    if (selectedCategory === categorySlug) {
      setSelectedCategory("");
      setFilteredPosts(allPosts);
    } else {
      setSelectedCategory(categorySlug);
      const categoryName = categories.find(c => c.slug === categorySlug)?.name;
      const filtered = allPosts.filter(post => 
        post.tags.includes(categoryName || "")
      );
      setFilteredPosts(filtered);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setFilteredPosts(allPosts);
  };

  const hasActiveFilters = searchTerm || selectedCategory;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="w-full max-w-5xl px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Explore <span className="text-primary">Categories</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover articles organized by topics. Find exactly what you're looking for with our comprehensive category system.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg rounded-lg border border-border focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{allPosts.length}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{filteredPosts.length}</div>
            <div className="text-sm text-muted-foreground">Filtered Posts</div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="w-full max-w-6xl px-4 py-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          sortOrder={sortOrder}
          viewMode={viewMode}
          showFilters={showFilters}
          onCategorySelect={handleCategoryClick}
          onSortChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onViewModeChange={setViewMode}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </section>

      {/* Categories Grid */}
      <section className="w-full max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          All Categories
        </h2>
        {filteredCategories.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category.slug}
                category={category}
                viewMode={viewMode}
                isSelected={selectedCategory === category.slug}
                onClick={() => handleCategoryClick(category.slug)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No categories found. Try adjusting your search criteria.</p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Filtered Posts Section */}
      {selectedCategory && (
        <section className="w-full max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              Posts in "{categories.find(c => c.slug === selectedCategory)?.name}"
            </h2>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory("")}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>By {post.author.name}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full border-t py-6 mt-12 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} My Blog. All rights reserved.
      </footer>
    </main>
  );
}
