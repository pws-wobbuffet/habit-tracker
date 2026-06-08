import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  base: '/habit-tracker',
  integrations: [
    starlight({
      title: 'Habit Tracker',
      description: 'Mobile-first PWA habit tracker — offline-first, installable, iOS-native feel.',
      social: {
        github: 'https://github.com/pws-wobbuffet/habit-tracker',
      },
      sidebar: [{ label: 'Documentation', autogenerate: { directory: '.' } }],
    }),
  ],
})
