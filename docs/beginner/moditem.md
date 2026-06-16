# ModItem
ModItem is the simplest class. It is the class that every item derives from, including weapons, accessories, and armor.

## Creating an item
Let's create a simple item. Create a new class in Content -> Items and name it whatever you want. I'll call it TestItem.

A common mistake for naming the class is using spaces, apostrophes or any other special character. The computer won't understand this. In general, it's best to only use letters.

Like any other mod element, the item's class must be public and derive from the correct base element class. In our case this class is `ModItem`. It should look like this:

```cs
using Terraria; // these two will be needed later on
using Terraria.ID; // these two will be needed later on
using Terraria.ModLoader; // important!

namespace TutorialMod.Content.Items;

public class TestItem : ModItem
{
}
```

This is the base of a ModItem. The texture is a very important part of an item, so we'll go over that next.

## Texturing the item
Terraria's sprites use a style where each visible "pixel" is actually a 2x2 square of pixels. A really easy way to make sprites like this is by first drawing the sprite in regular 1x1 pixels, then resize the sprite 2x using the Nearest Neighbor option.

If you don't have a texture, you can use [a texture like this](https://github.com/tModLoader/tModLoader/blob/1.4.5/ExampleMod/Content/Items/ExampleItem.png) or anything else from ExampleMod.

Once the texture is ready, drop it into the same folder as your item file and make sure it's named just like your item class' name - in my case, `TestItem.png`.

> [!NOTE]
> The texture has to be a .png file.

## Item properties
Now we are ready to customize the item. There are two "hooks" (methods) that serve this purpose - `SetDefaults` and `SetStaticDefaults`.

Most properties are set in the `SetDefaults` hook. If you're coding in Visual Studio, you can type `override` to search for the hooks you can override, including `SetDefaults`.
Item properties are set like this: `Item.maxStack = 100;` This property, for example, sets the maximum amount of items in a stack to 100.

A really basic item's structure would look like this:
```cs
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items; // file-scoped namespace, which looks cleaner

public class TestItem : ModItem
{
	public override void SetStaticDefaults()
	{
		// modify external sets here
	}

	public override void SetDefaults()
	{
		// item properties here
		Item.maxStack = 100; // make the item stackable up to 100
	}
}
```

Below are the most important things you can set for regular items.

Property | Data Type | Meaning | Tips
:------: | :-------: | :-----: | :--:
`Item.width`<br>`Item.height` | `int` | The size of the item's sprite when held, dropped etc. | Set this to the texture's width and height respectively.
`Item.maxStack` | `int` | The maximum amount of items a stack can hold. | For most items, you should set this to `Item.CommonMaxStack`, which evaluates to 9999.<br>If it doesn't understand, add `using Terraria;` to the top.
`Item.value` | `int` | The amount of copper coins this item can be bought for, which is 5x the sell price. | Use `Item.sellPrice(p, g, s, c)` to generate a value from the sell price. For example, an item that sells for 21 gold, 55 silver and 50 copper: `Item.value = Item.sellPrice(0, 21, 55, 50);`<br>You can also use `Item.buyPrice(p, g, s, c)`.
`Item.rare` | `ItemRarityID` | The item's rarity (color of the name). | Use with ItemRarityID, something like: `Item.rare = ItemRarityID.Blue;`

There are many more properties specific to weapons, armor and other specific things, but they will be introduced later when we learn about them.

A full list of item properties [can be found here](https://github.com/tModLoader/tModLoader/wiki/Item-Class-Documentation).

Here is an example item with these 5 properties filled out:

```cs{16-20}
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;

public class TestItem : ModItem
{
	public override void SetStaticDefaults()
	{
		// we will get back to this part later
	}

	public override void SetDefaults()
	{
		Item.width = 26; // sprite texture (after upscaling) is 26x26
		Item.height = 26; // sprite texture (after upscaling) is 26x26
		Item.maxStack = Item.CommonMaxStack; // regular item stackable to 9999
		Item.value = Item.sellPrice(0, 0, 10, 0); // a single item sells for 10 silver
		Item.rare = ItemRarityID.Blue; // blue rarity
	}
}
```

This is now a fully functional item. While it exists, it's unobtainable, so the next step is making it craftable.
> [!TIP]
> You can use a mod like [Cheat Sheet](https://steamcommunity.com/sharedfiles/filedetails/?id=2563784437) to give yourself any item for testing, so you can obtain it even if it's not craftable yet.

## Adding a crafting recipe
Crafting recipes are added in another hook, `AddRecipes`. In other words, it's a method that goes alongside the two `SetDefaults` hooks.

Each recipe starts by creating a Recipe variable through `CreateRecipe()`:

```cs{3}
public override void AddRecipes()
{
	Recipe recipe = CreateRecipe(); // create a recipe resulting in this item
	// ...
}
```

Now we can start adding ingredients. To do that, you call `recipe.AddIngredient()`. This method takes two parameters:
- The first parameter is the item used as the ingredient. You can use `ItemID` to represent an item for this, like `ItemID.StoneBlock` for stone. If you use Visual Studio, it should autocomplete the IDs, otherwise you can use [this wiki page](https://terraria.wiki.gg/wiki/Item_IDs).
- The second parameter is the amount of the item needed. You can leave this blank if you only use one item.

A few examples:

```cs
public override void AddRecipes()
{
	Recipe recipe = CreateRecipe(); // start the recipe
	recipe.AddIngredient(ItemID.StoneBlock, 10); // 10 stone blocks
	recipe.AddIngredient(ItemID.DirtBlock, 250); // 250 dirt blocks
	recipe.AddIngredient(ItemID.IronShortsword); // a single iron shortsword
	recipe.Register(); // add the recipe to the game
}
```

Now the recipe is craftable in-game!

As you can see, there is a `recipe.Register()` at the end. You add this to the end to make sure the recipe gets registered to the game.

You can make the recipe craft multiple items by adding an argument to `CreateRecipe()`:

```cs{3}
public override void AddRecipes()
{
	Recipe recipe = CreateRecipe(10); // 10 TestItems are crafted from this method
	recipe.AddIngredient(ItemID.HellstoneBar); // recipe takes in a single hellstone bar
	recipe.Register(); // 1 hellstone bar -> 10 TestItems
}
```

To make the recipe require a crafting station, you can use `AddTile()`. This time, you use TileID for the argument. [Here is a wiki page](https://terraria.wiki.gg/wiki/Tile_IDs) for the tile IDs.

Here is a recipe making the item only craftable at an anvil:

```cs{5}
public override void AddRecipes()
{
	Recipe recipe = CreateRecipe();
	recipe.AddIngredient(ItemID.ChlorophyteBar, 10);
	recipe.AddTile(TileID.Anvils); // make item craftable at any anvil (regular & hardmode)
	recipe.Register();
}
```

Crafting recipes are explored more thoroughly in the [recipe guide](recipes).

## Static Defaults
The `SetStaticDefaults` hook also sets item properties, but in a different way.

Outside the item classes, the game holds "sets" - key-value pairs, which encode additional info about each item. These can be like the research count for journey mode, or if the item floats when dropped (like souls). You don't need to set any of these properties, or any at all.

There is one property that is simpler to set than the rest - the number of items needed to research an item in Journey Mode. You set this one just like the `SetDefaults` properties, difference being that you have to put it in the other method:

```cs{3}
public override void SetStaticDefaults()
{
	Item.ResearchUnlockCount = 100; // 100 items are needed to unlock duplication for this item
}
```

The rest of the properties are accessed like: `ItemID.Sets.SomeProperty[Type]`, where you replace `SomeProperty` with the property you want to change. Visual Studio should be able to show a list of all the properties, but here are some useful ones:

Property | Data Type | Meaning
:------: | :-------: | :-----:
`ItemID.Sets.ItemNoGravity[Type]` | `bool` | Decides if the item should float in the air when dropped, like souls.
`ItemID.Sets.ItemIconPulse[Type]` | `bool` | Decides if the item should pulse (sprite grows and shrinks) in the inventory and when dropped, like souls.
`ItemID.Sets.OreDropsFromSlime[Type]` | `(int, int)` | Makes an item a rare drop from slimes if it's an ore.<br>The type represents the minimum and maximum amounts droppable. This is a tuple - you can create one like `(3, 13)`.

Here is a `SetStaticDefaults` that would hypothetically implement all of these properties:

```cs
public override void SetStaticDefaults()
{
	Item.ResearchUnlockCount = 100;
	ItemID.Sets.ItemNoGravity[Type] = true; // item floats in the air
	ItemID.Sets.ItemIconPulse[Type] = true; // item pulses in inventory
	ItemID.Sets.OreDropsFromSlime[Type] = (3, 13); // all ores use this value
}
```

Again, not every item has to set these properties. It's usually enough to just set the research unlock count.

## Display name and tooltip
The file at Localization -> `en-US_Mods.modname.hjson` stores items' display names and tooltips. These get automatically generated on Build and Reload.

When you build and reload, something like this should appear in the file:

```txt
TestItem: {
	DisplayName: Test Item
	Tooltip: ""
}
```

You can change these two values if you want to, but usually these default values work fine. You can omit the quotes in the Tooltip if you're going to add one.

Multiline tooltips can be written between ''' marks, like the Example Sword does it.

## Final example
A completed item file would look something like this:

```cs
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;

public class TestItem : ModItem
{
	public override void SetStaticDefaults()
	{
		Item.ResearchUnlockCount = 100; // 100 items are needed to unlock duplication for this item
		ItemID.Sets.ItemNoGravity[Type] = true; // item floats in the air when dropped
	}

	public override void SetDefaults()
	{
		Item.width = 26; // sprite texture (after upscaling) is 26x26
		Item.height = 26; // sprite texture (after upscaling) is 26x26
		Item.maxStack = Item.CommonMaxStack; // regular item stackable to 9999
		Item.value = Item.sellPrice(0, 0, 10, 0); // a single item sells for 10 silver
		Item.rare = ItemRarityID.Blue; // blue rarity
	}

	public override void AddRecipes()
	{
		Recipe recipe = CreateRecipe(5); // start the recipe - crafts 5 TestItems
		recipe.AddIngredient(ItemID.SandBlock, 10); // ingredient: 10 sand blocks
		recipe.AddIngredient(ItemID.CopperBar); // ingredient: 1 copper bar
		recipe.AddTile(TileID.WorkBenches); // make the item craftable at a workbench
		recipe.Register(); // add the recipe to the game
	}
}
```