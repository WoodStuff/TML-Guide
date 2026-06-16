import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'tModLoader Guide',
	description: 'Guide for tModLoader',
	base: '/TML-Guide/',
	
	themeConfig: {
		aside: false,

		sidebar: [
			{
				text: 'Beginner',
				items: [
					{ text: 'ModItem', link: '/beginner/moditem' },
					{ text: 'Recipes', link: '/beginner/recipes' },
					{ text: 'Melee Weapon', link: '/beginner/meleeweapon' },
					{ text: 'Ranged Weapon', link: '/beginner/rangedweapon' },
					{ text: 'Accessory', link: '/beginner/accessory' },
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/WoodStuff/TML-Guide' }
		]
	},
})
