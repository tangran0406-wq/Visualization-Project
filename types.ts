
export interface FoodItem {
  id: string;
  name: string;
  category: 'fat-loss' | 'standard';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  description: string;
}

export interface ComparisonAnalysis {
  recommendation: string;
  keyDifferences: string;
  nutritionalTips: string;
}

export enum AppView {
  NUTRITION = 'NUTRITION',
  NEW_ARRIVALS = 'NEW_ARRIVALS',
  TAKEOUT_VS_CANTEEN = 'TAKEOUT_VS_CANTEEN',
  CROWD_SIM = 'CROWD_SIM',
  WEEKLY_STORY = 'WEEKLY_STORY',
  DISH_RECOMMENDATIONS = 'DISH_RECOMMENDATIONS'
}

export interface ArrivalItem {
  id: number;
  name: string;
  location: string;
  rating: number;
  tags: string[];
  image: string;
}

export interface CrowdData {
  time: string;
  load: number;
}

export interface MealDetail {
  name: string;
  cal: number;
  desc: string;
  recommendationRate?: number; // 0-100 score
}

export interface DailyPlan {
  day: string;
  date: string;
  theme: string;
  themeColor: string; // 'emerald', 'rose', 'blue', etc.
  mood: string;
  totalCal: number;
  breakfast: MealDetail;
  lunch: MealDetail;
  dinner: MealDetail;
  tips: string;
}

export interface WeeklyStoryData {
  totalCalories: number;
  topDish: string;
  topDishCount: number;
  keywords: string[];
  weeklyIdeally: DailyPlan[];
}

export interface RecommendationItem {
  id: number;
  name: string;
  price: number;
  rating: number;
  stall: string; // e.g., "Sichuan Window"
  tags: string[];
  description: string;
  image: string; // emoji or placeholder
}

export interface ZoneRecommendations {
  southFirst: RecommendationItem[];
  southSecond: RecommendationItem[];
  north: RecommendationItem[];
}
