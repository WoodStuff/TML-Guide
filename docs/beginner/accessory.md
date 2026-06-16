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
> To mark it as a vanity accessory, set `Item.vanity = true;`

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
	player.lifeRegen = 16; // health regeneration: 8 hp/s
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
When we buff attacks, like damage or attack speed, we can choose if we buff a certain class or general attacks. To set the class they affect, offensive buffs use `DamageClass`.