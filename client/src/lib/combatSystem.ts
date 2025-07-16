import { Monster } from "./gameTypes";

export interface CombatResult {
  damage: number;
  critical: boolean;
  effects?: string[];
}

export function calculateDamage(attacker: any, defender: any): CombatResult {
  const baseDamage = attacker.damage || 20;
  const criticalChance = 0.1; // 10% critical hit chance
  
  const isCritical = Math.random() < criticalChance;
  const damage = isCritical ? baseDamage * 2 : baseDamage;
  
  return {
    damage,
    critical: isCritical,
    effects: isCritical ? ['Critical Hit!'] : []
  };
}

export function processMonsterAI(monster: Monster, playerPosition: { x: number; y: number }): { x: number; y: number } {
  const dx = playerPosition.x - monster.position.x;
  const dy = playerPosition.y - monster.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > 0.1) {
    // Move towards player
    const moveX = dx / distance * 0.5;
    const moveY = dy / distance * 0.5;
    
    return {
      x: monster.position.x + moveX,
      y: monster.position.y + moveY
    };
  }
  
  return monster.position;
}

export function checkCollision(pos1: { x: number; y: number }, pos2: { x: number; y: number }, threshold: number = 1): boolean {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance < threshold;
}
