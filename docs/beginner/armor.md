# Armor
In this guide, we will make a set of armor.

## Creating the helmet
First of all, you'll have to decide if you want to have the code for all 3 armor pieces in a single file or have each item in a separate file. I'll keep them in separate files so everything is organized.

Let's create a new ModItem for the helmet. If you plan to keep all 3 armor pieces in this file, it might be better to call the file something like `TestArmor.cs`. Feel free to add an item texture ([like this one](https://github.com/tModLoader/tModLoader/blob/1.4.5/ExampleMod/Content/Items/Armor/ExampleHelmet.png)), set `SetDefaults` and add a crafting recipe. Here's the base of the item:

```cs
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;

public class TestHelmet : ModItem
{
	public override void SetDefaults()
	{
		// item properties
		Item.width = 22; // sprite texture (after upscaling) is 22x20
		Item.height = 20; // sprite texture (after upscaling) is 22x20
		Item.value = Item.sellPrice(0, 0, 80, 0); // a single item sells for 80 silver
		Item.rare = ItemRarityID.Blue; // blue rarity
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

Make sure to set `Item.defense` in `SetDefaults` so the helmet gives you defense.

We can't equip the helmet yet. It'll automatically become equipable when we specify a texture to render on the player. We've done this in [the accessory guide](./accessory#making-the-accessory-visible), but let's go over it again.

Creating textures for when the helmet is rendered on the player is hard to get right manually, it's recommended to take a base texture and possibly recolor it. [Here's a link](https://github.com/tModLoader/tModLoader/blob/1.4.5/ExampleMod/Content/Items/Armor/ExampleHelmet_Head.png) to an equipped helmet texture you can use.

Once you have this texture, put it in the same folder as the rest of your helmet data, and add `_Head` to the end of the filename. For example, since my item is `TestHelmet`, I would name it `TestHelmet_Head.png`.

Finally, we have to specify that this item should be rendered on the player when equipped. We can do this by adding the `[AutoloadEquip(EquipType.Head)]` attribute to the TestHelmet class, like this:

```cs
using Terraria.ModLoader; // important so AutoloadEquip gets recognized

namespace TutorialMod.Content.Items;

[AutoloadEquip(EquipType.Head)]
public class TestHelmet : ModItem
{
	// SetDefaults, AddRecipes etc.
}
```

Once you add this attribute, the helmet should become equipable.

(WIP)