import * as migration_20260809_194604_initial from './20260809_194604_initial';
import * as migration_20260810_061404_phase1_hero_testimonials from './20260810_061404_phase1_hero_testimonials';

export const migrations = [
  {
    up: migration_20260809_194604_initial.up,
    down: migration_20260809_194604_initial.down,
    name: '20260809_194604_initial',
  },
  {
    up: migration_20260810_061404_phase1_hero_testimonials.up,
    down: migration_20260810_061404_phase1_hero_testimonials.down,
    name: '20260810_061404_phase1_hero_testimonials'
  },
];
