/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RemedyItem {
  icon: string; // Lucide icon name or emoji
  title: string;
  description: string;
}

export interface RadarStat {
  label: string;
  value: number; // 0 - 100
}

export interface CoffeeMenu {
  id: string;
  nameTh: string;
  nameEn: string;
  shortDesc: string;
  whatHeartWants: string;
  insight: string;
  remedies: RemedyItem[];
  radarStats: {
    energy: number;
    calm: number;
    focus: number;
    creativity: number;
    comfort: number;
  };
  colorTheme: {
    primary: string; // Tailwind color or hex
    secondary: string;
    glow: string;
    dust: string;
  };
}

export type SceneState = 'INTRO' | 'SELECTION' | 'BREWING' | 'RESULT';
