import { defineConfig } from 'vitepress'

export default defineConfig({
	title: "tModLoader Guide",
	
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
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/WoodStuff/TML-Guide' }
		]
	},
})
