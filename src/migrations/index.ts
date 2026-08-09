import * as migration_20260809_194604_initial from './20260809_194604_initial';

export const migrations = [
  {
    up: migration_20260809_194604_initial.up,
    down: migration_20260809_194604_initial.down,
    name: '20260809_194604_initial'
  },
];
