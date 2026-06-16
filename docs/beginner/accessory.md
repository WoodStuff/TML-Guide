# Accessory
In this guide, we will make a custom accessory that gives a buff to the player's stats.

## Creating the accessory
Accessories, just like any type of equipment, are ModItems. Let's create a new ModItem for the accessory, feel free to create a texture ([or steal it from ExampleMod](https://github.com/tModLoader/tModLoader/blob/1.4.4/ExampleMod/Content/Items/Accessories/ExampleImmunityAccessory.png)) and customize the item's properties.

To classify the item as an accessory and make it equippable, we'll have to set `Item.accessory = true;` in our `SetDefaults`.

```cs{4}
public override void SetDefaults()
{
	// accessory properties
	Item.accessory = true;

	// item properties
	Item.width = 26;
	Item.height = 32;
	Item.value = Item.sellPrice(0, 0, 40, 0);
	Item.rare = ItemRarityID.Blue;
}
```

> [!TIP]
> To mark it as a vanity accessory, set `Item.vanity = true;`.

## Adding an effect
Our accessory is equipable, but it doesn't do anything yet. Let's change that!

Let's start with a defense boost. For this, all we need to do is set `Item.defense` in our `SetDefaults`. For example, `Item.defense = 3;` will make the accessory grant 3 defense.

All our more advanced accessory functionality will be in the `UpdateAccessory` hook. If you're using Visual Studio, you can type `override` then a space, then search for this hook to autocomplete it. Alternatively, you can copy-paste this into your accessory class:

```cs
public override void UpdateAccessory(Player player, bool hideVisual)
{
	// accessory effects here
}
```

The main thing this hook gives us is the ability to do literally whatever with the player.

Let's start with a simple health regen boost. To do this, we can add to `player.lifeRegen`. The unit used here is health regeneration every 2 seconds, so a value of 6 will give 3 health per second. For comparison, the Band of Regeneration gives 1 health per second, so it gives 2 `player.lifeRegen`.

> [!NOTE]
> Make sure you add to `player.lifeRegen` instead of setting it, so it doesn't glitch with other life regen effects. Also note that `player` has to be in lowercase.

```cs{3}
public override void UpdateAccessory(Player player, bool hideVisual)
{
	player.lifeRegen += 16; // health regeneration: 8 hp/s
}
```

Here are some other useful things you can modify:

```cs
public override void UpdateAccessory(Player player, bool hideVisual)
{
	player.statLifeMax2 += 20; // +20 max HP
	player.statManaMax2 += 60; // +60 max mana
	player.manaCost -= 0.03f; // 3% reduced mana cost for magic weapons
	player.moveSpeed *= 1.1f; // 10% increased movement speed
	player.maxMinions += 1; // +1 minion slot
	player.name = "Oh no!"; // you probably should not do this (it does work though)
}
```

## Offensive buffs
When we buff attacks, like damage or attack speed, we can choose if we buff a certain class or general attacks. To set the class they affect, offensive buffs use `DamageClass`. The most important ones are `DamageClass.Melee`, `DamageClass.Ranged`, `DamageClass.Magic`, `DamageClass.Summon` which correspond to the respective classes, and `DamageClass.Generic`, which boosts all damage regardless of type.

To boost attack damage, we have to add to `player.GetDamage(class)`, where `class` is the `DamageClass` we want to buff. The value we're adding is a multiplier, so if we do `player.GetDamage(DamageClass.Generic) += 0.1f;`, it will boost all attack damage by 10%.

Attack modifiers can be stacked. An example `UpdateAccessory` would look like this:

```cs
public override void UpdateAccessory(Player player, bool hideVisual)
{
	player.GetDamage(DamageClass.Melee) += 0.03f; // +3% melee damage
	player.GetDamage(DamageClass.Ranged) += 0.10f; // +10% ranged damage
	player.GetDamage(DamageClass.Magic) -= 0.5f; // -50% magic damage
}
```

You can set other offensive buff values similarly to attack damage. Here's a list of all of them:

```cs
public override void UpdateAccessory(Player player, bool hideVisual)
{
	player.GetDamage(DamageClass.Generic) += 0.05f; // +5% to all damage
	player.GetAttackSpeed(DamageClass.Melee) += 0.1f; // +10% melee attack speed
	player.GetCritChance(DamageClass.Ranged) += 0.02f; // +2% ranged critical hit chance
	player.GetKnockback(DamageClass.Magic) += 0.3f; // +30% magic knockback

	// armor penetration uses absolute values instead of a multiplier!
	player.GetArmorPenetration(DamageClass.Summon) += 4f; // +4 armor penetration for summons
}
```

## Tooltip
We still have to add a tooltip to the accessory to display what it buffs. This has been covered in the [ModItem guide](moditem#display-name-and-tooltip), but let's recap.

When you build and reload your mod, new localization entries will get added to the file at  Localization -> `en-US_Mods.modname.hjson`. Each item will have a display name and tooltip attribute. Here you can add a descriptive tooltip about what your tooltip does.

> [!NOTE]
> Don't include the defense stat in the item's tooltip, as it is automatically added. If all your item does is add defense, you can skip adding a tooltip.

> [!TIP]
> Accessory tooltips usually follow the format *n% increased [stat name]*. Feel free to check the tooltips of similar accessories on the [Terraria wiki](https://terraria.wiki.gg/) to see what they do.

You can include multiple lines in the tooltip by encasing it within ''' instead of ", like so:

```txt{4-7}
TestAccessory: {
	DisplayName: Test Accessory
	Tooltip:
		'''
		5% increased ranged damage
		10% increased ranged critical strike chance
		'''
}
```

## Final accessory example
Here's an example file for an accessory:

```cs
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;

public class TestAccessory : ModItem
{
	public override void SetDefaults()
	{
		// accessory properties
		Item.accessory = true;
		Item.defense = 3; // +3 defense

		// item properties
		Item.width = 26;
		Item.height = 32;
		Item.value = Item.sellPrice(0, 0, 40, 0);
		Item.rare = ItemRarityID.Blue;
	}

	public override void AddRecipes()
	{
		CreateRecipe()
			.AddIngredient<TestItem>(4)
			.Register();
	}

	public override void UpdateAccessory(Player player, bool hideVisual)
	{
		player.lifeRegen += 4; // +2 hp/second (4 hp per 2 seconds)
		player.statLifeMax2 += 20; // +20 max HP

		player.GetDamage(DamageClass.Generic) += 0.2f; // +20% to all damage
		player.GetCritChance(DamageClass.Magic) += 0.04f; // +4% magic crit chance
		player.GetArmorPenetration(DamageClass.Magic) += 5; // +5 magic armor penetration
	}
}
```