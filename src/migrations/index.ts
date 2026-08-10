import * as migration_20260809_194604_initial from './20260809_194604_initial';
import * as migration_20260810_061404_phase1_hero_testimonials from './20260810_061404_phase1_hero_testimonials';
import * as migration_20260810_062636_phase2_about_novavera from './20260810_062636_phase2_about_novavera';
import * as migration_20260810_063311_phase3_media from './20260810_063311_phase3_media';
import * as migration_20260810_064009_phase4_resources from './20260810_064009_phase4_resources';
import * as migration_20260810_065357_phase5_images from './20260810_065357_phase5_images';
import * as migration_20260810_111624_integrations from './20260810_111624_integrations';

export const migrations = [
  {
    up: migration_20260809_194604_initial.up,
    down: migration_20260809_194604_initial.down,
    name: '20260809_194604_initial',
  },
  {
    up: migration_20260810_061404_phase1_hero_testimonials.up,
    down: migration_20260810_061404_phase1_hero_testimonials.down,
    name: '20260810_061404_phase1_hero_testimonials',
  },
  {
    up: migration_20260810_062636_phase2_about_novavera.up,
    down: migration_20260810_062636_phase2_about_novavera.down,
    name: '20260810_062636_phase2_about_novavera',
  },
  {
    up: migration_20260810_063311_phase3_media.up,
    down: migration_20260810_063311_phase3_media.down,
    name: '20260810_063311_phase3_media',
  },
  {
    up: migration_20260810_064009_phase4_resources.up,
    down: migration_20260810_064009_phase4_resources.down,
    name: '20260810_064009_phase4_resources',
  },
  {
    up: migration_20260810_065357_phase5_images.up,
    down: migration_20260810_065357_phase5_images.down,
    name: '20260810_065357_phase5_images',
  },
  {
    up: migration_20260810_111624_integrations.up,
    down: migration_20260810_111624_integrations.down,
    name: '20260810_111624_integrations'
  },
];
