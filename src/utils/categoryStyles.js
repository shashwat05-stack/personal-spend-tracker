import {
  Utensils,
  Car,
  ShoppingBag,
  ReceiptText,
  GraduationCap,
  Film,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  RefreshCw,
  Tag,
  Wallet
} from "lucide-react";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Education",
  "Entertainment",
  "Other"
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Refund",
  "Other"
];

export const CATEGORY_STYLES = {
  Food: { color: "#F97316", icon: "🍔", LucideIcon: Utensils },
  Travel: { color: "#3B82F6", icon: "🚕", LucideIcon: Car },
  Shopping: { color: "#EC4899", icon: "🛍️", LucideIcon: ShoppingBag },
  Bills: { color: "#8B5CF6", icon: "💡", LucideIcon: ReceiptText },
  Education: { color: "#06B6D4", icon: "📚", LucideIcon: GraduationCap },
  Entertainment: { color: "#F43F5E", icon: "🎬", LucideIcon: Film },
  Salary: { color: "#16A34A", icon: "💼", LucideIcon: Briefcase },
  Freelance: { color: "#14B8A6", icon: "🧑‍💻", LucideIcon: Laptop },
  Investment: { color: "#EAB308", icon: "📈", LucideIcon: TrendingUp },
  Gift: { color: "#D946EF", icon: "🎁", LucideIcon: Gift },
  Refund: { color: "#10B981", icon: "🔄", LucideIcon: RefreshCw },
  Other: { color: "#6B7280", icon: "🔖", LucideIcon: Tag },
};

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
}
