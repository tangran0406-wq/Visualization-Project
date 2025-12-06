
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem, ComparisonAnalysis } from "../types";

const apiKey = process.env.API_KEY;
// Using a safe fallback if the key is missing during dev (though instructions say assume it exists)
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const MODEL_NAME = "gemini-2.5-flash";

// Special Hardcoded Item (The "Viral" Mashed Potato Noodles)
const SPECIAL_DISH: FoodItem = {
  id: "special-01",
  name: "网红土豆泥拌面",
  category: "standard",
  calories: 915,
  protein: 28,
  carbs: 110,
  fat: 42,
  price: 26,
  description: "满满碳水快乐炸弹！黑椒肉片浇头配上绵密土豆泥和劲道宽面。",
};

export const generateCanteenMenu = async (): Promise<FoodItem[]> => {
  const prompt = `
    Generate a realistic JSON list of 12 distinct meals typically found in a Chinese corporate or university cafeteria (First Floor).
    - 6 items should be "fat-loss" (healthy, boiled/steamed, high protein, low carb/fat) meals.
    - 6 items should be "standard" (greasy, fried, high carb, delicious but calorie-dense) meals.
    
    Ensure the data includes realistic estimates for calories, protein, carbs, and fat per serving.
    Prices should be in CNY (RMB).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING, description: "Chinese name of the dish" },
              category: { type: Type.STRING, enum: ['fat-loss', 'standard'] },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              price: { type: Type.NUMBER },
              description: { type: Type.STRING, description: "Short appetizing description in Chinese" },
            },
            required: ["id", "name", "category", "calories", "protein", "carbs", "fat", "price", "description"],
          },
        },
      },
    });

    if (response.text) {
      const generatedItems = JSON.parse(response.text) as FoodItem[];
      // Force prepend the special dish
      return [SPECIAL_DISH, ...generatedItems];
    }
    return [SPECIAL_DISH];
  } catch (error) {
    console.error("Failed to generate menu:", error);
    // Fallback data
    return [
      SPECIAL_DISH,
      { 
        id: "1", 
        name: "水煮鸡胸肉套餐", 
        category: "fat-loss", 
        calories: 450, 
        protein: 40, 
        carbs: 30, 
        fat: 10, 
        price: 18, 
        description: "低脂高蛋白，搭配西蓝花和糙米饭。",
      },
      { 
        id: "2", 
        name: "清蒸龙利鱼", 
        category: "fat-loss", 
        calories: 380, 
        protein: 35, 
        carbs: 20, 
        fat: 8, 
        price: 22, 
        description: "口感鲜嫩，无刺清爽。",
      },
      { 
        id: "3", 
        name: "红烧肉盖浇饭", 
        category: "standard", 
        calories: 950, 
        protein: 25, 
        carbs: 110, 
        fat: 45, 
        price: 25, 
        description: "肥而不腻，酱汁浓郁，米饭杀手。",
      },
      { 
        id: "4", 
        name: "麻辣香锅", 
        category: "standard", 
        calories: 1200, 
        protein: 30, 
        carbs: 80, 
        fat: 85, 
        price: 30, 
        description: "重油重辣，香气扑鼻，十分下饭。",
      },
      { 
        id: "5", 
        name: "西红柿炒鸡蛋", 
        category: "standard", 
        calories: 600, 
        protein: 15, 
        carbs: 40, 
        fat: 35, 
        price: 15, 
        description: "国民下饭菜，酸甜可口。",
      },
      { 
        id: "6", 
        name: "白灼基围虾", 
        category: "fat-loss", 
        calories: 200, 
        protein: 45, 
        carbs: 2, 
        fat: 3, 
        price: 35, 
        description: "原汁原味，鲜甜Q弹。",
      }
    ];
  }
};

export const analyzeComparison = async (item1: FoodItem, item2: FoodItem): Promise<ComparisonAnalysis> => {
  const prompt = `
    Compare these two canteen meals for a user trying to eat healthy/lose fat:
    
    Meal A: ${item1.name} (${item1.calories}kcal, P:${item1.protein}g, C:${item1.carbs}g, F:${item1.fat}g)
    Meal B: ${item2.name} (${item2.calories}kcal, P:${item2.protein}g, C:${item2.carbs}g, F:${item2.fat}g)
    
    Provide a concise analysis in Chinese JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING, description: "Which one is better and briefly why (1 sentence)" },
            keyDifferences: { type: Type.STRING, description: "Main nutritional difference (max 2 sentences)" },
            nutritionalTips: { type: Type.STRING, description: "A tip for eating the selected meal (e.g., eat less sauce)" }
          },
          required: ["recommendation", "keyDifferences", "nutritionalTips"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ComparisonAnalysis;
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      recommendation: "无法获取AI建议",
      keyDifferences: "请直接参考图表数据。",
      nutritionalTips: "保持均衡饮食。"
    };
  }
};
