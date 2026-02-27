import {
  Puzzle,
  Zap,
  Ruler,
  Shield,
  ArrowUpDown,
  Cable,
  Wrench,
  LayoutGrid,
  MonitorSmartphone,
  Armchair,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  puzzle: Puzzle,
  zap: Zap,
  ruler: Ruler,
  shield: Shield,
  'arrow-up-down': ArrowUpDown,
  cable: Cable,
  wrench: Wrench,
  'layout-grid': LayoutGrid,
  'monitor-smartphone': MonitorSmartphone,
  armchair: Armchair,
};

export function getIcon(name: string): LucideIcon {
  const icon = iconMap[name.toLowerCase()];
  return icon ?? Puzzle;
}
