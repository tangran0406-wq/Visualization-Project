
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
        name: "隆江猪肘饭",
        category: "standard",
        calories: 950,
        protein: 25,
        carbs: 110,
        fat: 45,
        price: 15,
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
        price: 18,
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
        price: 6,
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
        price: 14,
        description: "原汁原味，鲜甜Q弹。",
      }, {
        id: "7",
        name: "羊肉烩面",
        category: "standard",
        calories: 780,
        protein: 28,
        carbs: 90,
        fat: 26,
        price: 15,
        description: "浓郁羊肉汤配筋道烩面，适合需要能量补给的一天。"
      },
      {
        id: "8",
        name: "麻辣香锅",
        category: "standard",
        calories: 900,
        protein: 30,
        carbs: 60,
        fat: 55,
        price: 22,
        description: "重口味代表作，麻辣入魂，食材丰富但热量偏高。"
      },
      {
        id: "9",
        name: "烤鱼饭",
        category: "standard",
        calories: 750,
        protein: 32,
        carbs: 70,
        fat: 24,
        price: 15,
        description: "外焦里嫩的烤鱼配米饭，鱼肉蛋白质充足。"
      },
      {
        id: "10",
        name: "巴西烤肉饭",
        category: "standard",
        calories: 820,
        protein: 35,
        carbs: 65,
        fat: 30,
        price: 12,
        description: "大块烤肉配谷物主食，肉量十足，适合力量训练后。"
      },
      {
        id: "11",
        name: "培根滑蛋饭",
        category: "standard",
        calories: 780,
        protein: 24,
        carbs: 75,
        fat: 32,
        price: 15,
        description: "培根香配嫩滑鸡蛋，口感顺滑但脂肪含量略高。"
      },
      {
        id: "12",
        name: "椰子鸡",
        category: "fat-loss",
        calories: 520,
        protein: 30,
        carbs: 25,
        fat: 20,
        price: 36,
        description: "清爽椰香鸡汤为主，油脂相对较少，偏清淡更适合控制热量。"
      }, {
        id: "13",
        name: "小笼包",
        category: "standard",
        calories: 480,
        protein: 16,
        carbs: 55,
        fat: 18,
        price: 8,
        description: "皮薄多汁，一笼下去刚好有饱腹感，适合当早餐或加餐。"
      },
      {
        id: "14",
        name: "葱油拌面",
        category: "standard",
        calories: 650,
        protein: 14,
        carbs: 90,
        fat: 22,
        price: 4.5,
        description: "葱香四溢，酱香浓郁，典型高碳水主食型餐品。"
      },
      {
        id: "15",
        name: "馋嘴砂锅",
        category: "standard",
        calories: 780,
        protein: 28,
        carbs: 70,
        fat: 35,
        price: 15,
        description: "砂锅煨制入味，荤素搭配丰富，但整体偏油偏咸。"
      },
      {
        id: "16",
        name: "兰州拉面",
        category: "standard",
        calories: 720,
        protein: 24,
        carbs: 95,
        fat: 18,
        price: 8,
        description: "一清二白三红四绿五黄，面量充足，适合高能量消耗日。"
      },
      {
        id: "17",
        name: "烤鸭饭",
        category: "standard",
        calories: 820,
        protein: 30,
        carbs: 80,
        fat: 32,
        price: 22,
        description: "烤鸭皮脆肉嫩，酱汁浓郁，风味极佳但脂肪含量较高。"
      },
      {
        id: "18",
        name: "重庆小面",
        category: "standard",
        calories: 650,
        protein: 18,
        carbs: 85,
        fat: 20,
        price: 14,
        description: "麻辣鲜香，劲道小面，一碗下去超满足。"
      },
      {
        id: "19",
        name: "清炒西兰花",
        category: "fat-loss",
        calories: 110,
        protein: 6,
        carbs: 10,
        fat: 4,
        price: 10,
        description: "简单清炒，低油低盐，减脂必点经典蔬菜。"
      },
      {
        id: "20",
        name: "蒜蓉生菜",
        category: "fat-loss",
        calories: 90,
        protein: 3,
        carbs: 8,
        fat: 5,
        price: 8,
        description: "爽脆鲜嫩，蒜香浓郁，清爽不油腻。"
      },
      {
        id: "21",
        name: "鱼香肉丝",
        category: "standard",
        calories: 320,
        protein: 18,
        carbs: 20,
        fat: 18,
        price: 14,
        description: "酸甜微辣开胃，是大众最常点的热菜之一。"
      },
      {
        id: "22",
        name: "宫保鸡丁",
        category: "standard",
        calories: 380,
        protein: 22,
        carbs: 16,
        fat: 24,
        price: 15,
        description: "花生脆香，鸡丁鲜嫩，经典川菜但偏油。"
      },
      {
        id: "23",
        name: "回锅肉",
        category: "standard",
        calories: 480,
        protein: 20,
        carbs: 10,
        fat: 38,
        price: 18,
        description: "肥瘦相间，香辣过瘾，但油脂含量较高。"
      },
      {
        id: "24",
        name: "水煮肉片",
        category: "standard",
        calories: 430,
        protein: 32,
        carbs: 9,
        fat: 28,
        price: 7,
        description: "鲜辣麻香，肉片嫩滑，但油量不低。"
      },
      {
        id: "25",
        name: "干煸四季豆",
        category: "standard",
        calories: 300,
        protein: 10,
        carbs: 20,
        fat: 20,
        price: 5,
        description: "四季豆煸得干香入味，是非常下饭的小热菜。"
      },
      {
        id: "26",
        name: "杭椒牛柳",
        category: "standard",
        calories: 350,
        protein: 28,
        carbs: 8,
        fat: 20,
        price: 12,
        description: "牛柳鲜嫩，杭椒爽辣，是高蛋白的优质选择。"
      },
      {
        id: "27",
        name: "清蒸南瓜",
        category: "fat-loss",
        calories: 120,
        protein: 3,
        carbs: 28,
        fat: 1,
        price: 4,
        description: "天然甜味，低脂健康，是轻食中的固定搭配。"
      },
      {
        id: "28",
        name: "拍黄瓜",
        category: "fat-loss",
        calories: 70,
        protein: 2,
        carbs: 5,
        fat: 4,
        price: 6,
        description: "清爽开胃的凉菜，低热量又能补充蔬菜。"
      },
      {
        id: "29",
        name: "麻婆豆腐",
        category: "standard",
        calories: 330,
        protein: 18,
        carbs: 14,
        fat: 22,
        price: 7,
        description: "麻辣鲜香，豆腐入口即化，蛋白质含量不错。"
      },
      {
        id: "30",
        name: "滑蛋虾仁",
        category: "fat-loss",
        calories: 260,
        protein: 24,
        carbs: 4,
        fat: 16,
        price: 22,
        description: "高蛋白低碳水，虾仁鲜甜，适合健身人群。"
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
