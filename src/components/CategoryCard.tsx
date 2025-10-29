"use client";

import { motion } from "framer-motion";
import { Calendar, FileText, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface CategoryCardProps {
  category: Category;
  viewMode: "grid" | "list";
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export default function CategoryCard({ 
  category, 
  viewMode, 
  isSelected, 
  onClick, 
  className 
}: CategoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "flex items-center p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2",
          isSelected 
            ? "border-primary bg-primary/10" 
            : "border-transparent hover:border-border",
          className
        )}
      >
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mr-4",
          category.color
        )}>
          {category.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold truncate">
              {category.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="w-4 h-4 mr-1" />
              {category.postCount} posts
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1 truncate">
            {category.description}
          </p>
          
          {/* Recent Posts */}
          {category.recentPosts.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Recent: {category.recentPosts[0].title}
            </div>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-muted-foreground ml-4" />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2",
        isSelected 
          ? "border-primary bg-primary/10" 
          : "border-transparent hover:border-border",
        className
      )}
    >
      {/* Header with Icon and Color */}
      <div className={cn(
        "h-24 flex items-center justify-center text-white text-4xl relative overflow-hidden",
        category.color
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative z-10">{category.icon}</div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Post Count */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold">
            {category.name}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            <FileText className="w-4 h-4 mr-1" />
            {category.postCount}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {category.description}
        </p>

        {/* Recent Posts */}
        {category.recentPosts.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Recent Posts
            </h4>
            <div className="space-y-1">
              {category.recentPosts.slice(0, 2).map((post, index) => (
                <div key={index} className="flex items-center text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2"></div>
                  <span className="truncate flex-1">{post.title}</span>
                  <span className="ml-2 text-muted-foreground">{formatDate(post.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="w-3 h-3 mr-1" />
            {category.recentPosts[0]?.author || "Various authors"}
          </div>
          <div className="flex items-center text-primary text-sm font-medium">
            Explore
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
