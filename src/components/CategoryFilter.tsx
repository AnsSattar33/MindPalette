"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, SortAsc, SortDesc, Grid, List, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
  postCount: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  sortBy: "name" | "posts" | "recent";
  sortOrder: "asc" | "desc";
  viewMode: "grid" | "list";
  showFilters: boolean;
  onCategorySelect: (categorySlug: string) => void;
  onSortChange: (sortBy: "name" | "posts" | "recent") => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
  onViewModeChange: (viewMode: "grid" | "list") => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  sortBy,
  sortOrder,
  viewMode,
  showFilters,
  onCategorySelect,
  onSortChange,
  onSortOrderChange,
  onViewModeChange,
  onToggleFilters,
  onClearFilters,
  hasActiveFilters
}: CategoryFilterProps) {
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "posts", label: "Post Count" },
    { value: "recent", label: "Most Recent" }
  ];

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </Button>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-none border-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-none border-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "name" | "posts" | "recent")}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
            className="px-2"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-muted rounded-lg p-4 border border-border"
          >
            <div className="space-y-4">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Filter by Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onCategorySelect("")}
                    className="text-xs"
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.slug}
                      variant={selectedCategory === category.slug ? "default" : "outline"}
                      size="sm"
                      onClick={() => onCategorySelect(category.slug)}
                      className="text-xs"
                    >
                      {category.name}
                      <span className="ml-1 text-xs opacity-75">
                        ({category.postCount})
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">
                      {categories.length}
                    </div>
                    <div className="text-muted-foreground">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
                    </div>
                    <div className="text-muted-foreground">Total Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {Math.round(categories.reduce((sum, cat) => sum + cat.postCount, 0) / categories.length)}
                    </div>
                    <div className="text-muted-foreground">Avg per Category</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {categories.filter(cat => cat.postCount > 0).length}
                    </div>
                    <div className="text-muted-foreground">Active Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
