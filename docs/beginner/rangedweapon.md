# Ranged Weapon
In this guide, you will learn how to make a ranged weapon, like a bow or a gun.

## Creating a bow
First, we have to make the base of the item. This is covered in the [ModItem](https://woodstuff.github.io/TML-Guide/beginner/moditem.html) guide, or you can copy-paste it from here, like a real programmer.

Make sure to add a texture. If you aren't drawing them yourself, you can steal it from somewhere like the [vanilla bow textures](https://terraria.wiki.gg/wiki/Bows).

```cs
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;
 
public class TestBow : ModItem
{
	public override void SetDefaults()
	{
		Item.width = 28; // make sure to change this to your texture's size!
		Item.height = 46; // make sure to change this to your texture's size!
		Item.value = Item.sellPrice(0, 0, 40, 0);
		Item.rare = ItemRarityID.Blue;
	}

	public override void AddRecipes()
	{
		CreateRecipe()
			.AddIngredient<TestItem>(7)
			.AddTile(TileID.Anvils)
			.Register();
	}
}
```

Making a bow is much easier than making a sword. We can call `Item.DefaultToBow(...)` at the start of our `SetDefaults`, and it'll automatically set most of the properties common to bows, like the ranged class and shooting arrows. This method has two parameters:

1. The cooldown between shots, in frames. This is like the `Item.useTime`, where a higher value means slower shots.
2. The velocity of the arrow. For reference, early ore bows have a velocity of 6.6.

You can find reference values for both of these [in here](https://terraria.wiki.gg/wiki/List_of_ranged_weapons).

Normally, you would call it like this: `Item.DefaultToBow(25, 6.6f);` But now you have some numbers floating around without any indication of what they mean. These are known as "magic numbers", and it is good practice to make them more clear. To do this, you can label them with named arguments, like: `Item.DefaultToBow(singleShotTime: 25, shotVelocity: 6.6f);`

Note that in the case of named arguments, the labels must be exactly the name of the argument (you can't change the name). It's up to you if you want to write it like this, but I'd recommend it, since it's more readable.

This is how it should look:

```cs{4}
public override void SetDefaults()
{
	// bow properties
	Item.DefaultToBow(singleShotTime: 25, shotVelocity: 6.6f);

	// common item properties
	Item.width = 28;
	Item.height = 46;
	Item.value = Item.sellPrice(0, 0, 40, 0);
	Item.rare = ItemRarityID.Blue;
}
```

Now we can set the rest of the bow's stats. We can use the same properties as the melee weapon.
> [!NOTE]
> Since the bow's attack speed was already accounted for, we don't need to set the `Item.useTime` and `Item.useAnimation`.

Property | Data Type | Meaning | Tips
:------: | :-------: | :-----: | :--:
`Item.damage` | `int` | The weapon's base damage when used.
`Item.knockBack` | `float` | How far the attacked enemy is knocked. | Early pre-hardmode bows have no knockback. If you want that, you can omit this property.
`Item.crit` | `int` | The bonus critical chance of this weapon, on top of the base 4% crit chance. | For example, a value of 6 will give this weapon a 10% crit chance (4% + 6% = 10%). You don't have to set this if your weapon doesn't give a bonus crit chance, like most weapons.

Now if you open the game and obtain the bow (don't forget to get some arrows!), you will be able to shoot from it!

## Final bow example
This code creates a basic bow:

```cs{12-14}
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;
 
public class TestBow : ModItem
{
	public override void SetDefaults()
	{
		// bow properties
		Item.DefaultToBow(singleShotTime: 20, shotVelocity: 8f); // sets all the bow's properties
		Item.damage = 12;
		Item.knockBack = 0.5f; // extremely weak knockback

		// common item properties
		Item.width = 28;
		Item.height = 46;
		Item.value = Item.sellPrice(0, 0, 45, 0); // sells for 45 silver
		Item.rare = ItemRarityID.Blue;
	}

	public override void AddRecipes()
	{
		CreateRecipe()
			.AddIngredient<TestItem>(8)
			.AddTile(TileID.Anvils)
			.Register();
	}
}
```

## Creating a gun
Just like before, a gun requires the creation of a `ModItem` and a texture. Here is a convenient [link to a gun texture](https://github.com/tModLoader/tModLoader/blob/1.4.4/ExampleMod/Content/Items/Weapons/ExampleGun.png). Make sure to set your basic item stats and add a recipe.

Guns don't have a specific `DefaultToGun(...)` method, so at the start of our `SetDefaults`, we'll have to call Item.`DefaultToRangedWeapon(...)` instead, which defines a more general ranged weapon. This method has 4 parameters:

1. **baseProjType:** The projectile shot by the weapon. In our case, guns are hardcoded to always shoot bullets, so we can set this to whatever we want.
By convention, all guns have this set to `ProjectileID.PurificationPowder`.
2. **ammoID:** The ammo type consumed by the weapon. Guns fire bullets, so we'll use `AmmoID.Bullet`.
3. **singleShotTime:** The cooldown between shots, in frames. This does the same thing as in `Item.DefaultToBow(...)`.
4. **shotVelocity:** The velocity of the arrow. Again, same thing as in `Item.DefaultToBow(...)`.

After calling this method, you can set the stats (`Item.damage`, `Item.knockBack`, `Item.crit`) like usual.

This is how the `SetDefaults` should look:

```cs{4-6}
public override void SetDefaults()
{
	// gun properties          // doesn't matter what we put here             // gun uses bullets
	Item.DefaultToRangedWeapon(baseProjType: ProjectileID.PurificationPowder, ammoID: AmmoID.Bullet, singleShotTime: 24, shotVelocity: 12f);
	Item.damage = 22;
	Item.knockBack = 5f; // average knockback

	// common item properties
	Item.width = 62;
	Item.height = 32;
	Item.value = Item.sellPrice(0, 0, 50, 0);
	Item.rare = ItemRarityID.Blue;
}
```

This is now a functional gun you can shoot bullets from.

Depending on the texture you used, the positioning of the gun in the player's hands might look weird, holding the wrong part of the gun, like in the [ExampleGun sprite](https://github.com/tModLoader/tModLoader/blob/1.4.4/ExampleMod/Content/Items/Weapons/ExampleGun.png). We can adjust where the player holds the gun by adding the `HoldoutOffset()` hook - hooks are methods we override from `ModItem` to add custom behavior to an item, like moving the gun's sprite in our case. If you're using Visual Studio, you can type `override` in the class then autocomplete `HoldoutOffset()` to easily override it.

This method returns a vector that moves the in-game gun texture. Feel free to play around with it until it looks natural (hot reload recommended).

For the ExampleGun sprite, I find a value of `[2, -2]` to look good. Here's the structure of the file after adding the new hook:

```cs{13}
using Microsoft.Xna.Framework; // important for Vector2!
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;
 
public class TestGun : ModItem
{
	/* SetDefaults() */
	/* AddRecipes() */

	public override Vector2? HoldoutOffset() => new Vector2(2, -2);
}
```

## Final gun example

This code will add a basic gun into the game:

```cs
using Microsoft.Xna.Framework;
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;
 
public class TestGun : ModItem
{
	public override void SetDefaults()
	{
		// gun properties          // doesn't matter what we put here             // gun uses bullets
		Item.DefaultToRangedWeapon(baseProjType: ProjectileID.PurificationPowder, ammoID: AmmoID.Bullet, singleShotTime: 18, shotVelocity: 10f);
		Item.damage = 18;
		Item.knockBack = 2f; // very weak knockback

		// common item properties
		Item.width = 62;
		Item.height = 32;
		Item.value = Item.sellPrice(0, 0, 75, 0);
		Item.rare = ItemRarityID.Blue;
	}

	public override void AddRecipes()
	{
		CreateRecipe()
			.AddIngredient<TestItem>(12)
			.AddRecipeGroup(RecipeGroupID.IronBar, 12)
			.AddTile(TileID.Anvils)
			.Register();
	}

	// adjust the gun's position in the player's hands
	public override Vector2? HoldoutOffset() => new Vector2(2, -2);
}
```