"use client";

import { motion } from "motion/react";
import { BarChart3, FileText, Tag, Filter } from "lucide-react";

interface CategoryStatsProps {
  totalCategories: number;
  totalPosts: number;
  filteredPosts: number;
  selectedCategory?: string;
}

export default function CategoryStats({
  totalCategories,
  totalPosts,
  filteredPosts,
  selectedCategory
}: CategoryStatsProps) {
  const stats = [
    {
      label: "Total Categories",
      value: totalCategories,
      icon: Tag,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      label: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      label: "Filtered Posts",
      value: filteredPosts,
      icon: Filter,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-lg p-6 shadow-sm border border-border"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
