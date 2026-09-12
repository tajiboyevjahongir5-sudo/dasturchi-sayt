import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} daqiqa`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} soat`;
  return `${hours} soat ${mins} daqiqa`;
}

export function calculateLevel(xp: number): { level: number; title: string; currentXP: number; requiredXP: number } {
  const levels = [
    { threshold: 0, title: "Yangi boshlovchi" },
    { threshold: 100, title: "Kuzatuvchi" },
    { threshold: 300, title: "O'rganuvchi" },
    { threshold: 600, title: "Amaliyotchi" },
    { threshold: 1000, title: "Ishlab chiquvchi" },
    { threshold: 1500, title: "Tajribali dasturchi" },
    { threshold: 2200, title: "Mutaxassis" },
    { threshold: 3000, title: "Usta dasturchi" },
    { threshold: 4000, title: "Ekspert" },
    { threshold: 5500, title: "Arxitektor" },
    { threshold: 7500, title: "Mentor" },
    { threshold: 10000, title: "Grandmaster" },
  ];

  let level = 0;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].threshold) {
      level = i;
      break;
    }
  }

  const currentThreshold = levels[level].threshold;
  const nextThreshold = levels[level + 1]?.threshold ?? levels[level].threshold + 2500;
  
  return {
    level: level + 1,
    title: levels[level].title,
    currentXP: xp - currentThreshold,
    requiredXP: nextThreshold - currentThreshold,
  };
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Juda yaxshi", color: "text-emerald-500" };
  if (score >= 70) return { label: "Yaxshi o'zlashtirilgan", color: "text-blue-500" };
  if (score >= 50) return { label: "Asosiy tushuncha shakllanmoqda", color: "text-yellow-500" };
  return { label: "Yana mashq qilish kerak", color: "text-red-500" };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
