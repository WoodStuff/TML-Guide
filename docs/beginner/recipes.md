# Recipes
In the [ModItem guide](moditem), we learned how to make a simple crafting recipe. This guide expands on that concept.

## Creating a modded item recipe
To create a recipe for a ModItem, you override the `AddRecipes()` method and declare a `Recipe` variable using `CreateRecipe()`.

```cs{11-15}
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace TutorialMod.Content.Items;

public class TestItem : ModItem
{
	// SetStaticDefaults, SetDefaults

	public override void AddRecipes()
	{
		Recipe recipe = CreateRecipe(); // create a recipe resulting in this item
		// add ingredients, etc...
	}
}
```

You can then add ingredients using `recipe.AddIngredient()`, which takes two arguments:
- The first argument is the item used as the ingredient. You can use `ItemID.SomeItem` to represent an item for this, replacing `SomeItem` with the item ID. You can find a [list of IDs here](https://terraria.wiki.gg/wiki/Item_IDs), or if you're working with Visual Studio, it'll autocomplete the IDs.
- The second argument specifies how many of the item is needed.

After you do all this, you call `recipe.Register() `to make sure the recipe gets added to the game.

An example recipe, where you use 25 clay and 5 stone to craft the ModItem:

```cs
public override void AddRecipes() {
	Recipe recipe = CreateRecipe(); // new recipe
	recipe.AddIngredient(ItemID.ClayBlock, 25); // use 25 clay blocks
	recipe.AddIngredient(ItemID.StoneBlock, 5); // use 5 stone blocks
	recipe.Register(); // add the recipe to the game: 25 clay + 5 stone -> 1 item
}
```

> [!NOTE]
> You can omit the stack size in `AddIngredient()` if you only use one item.<br>
> For example, `AddIngredient(ItemID.IronPickaxe)` uses a single iron pickaxe.

> [!NOTE]
> If you want the recipe to result in multiple items being crafted, add an argument to `CreateRecipe()`.<br>
For example, `Recipe recipe = CreateRecipe(5)` results in 5 items being crafted.

Another example:
```cs
public override void AddRecipes() {
	Recipe recipe = CreateRecipe(50); // 50 items will be crafted from this recipe
	recipe.AddIngredient(ItemID.PlatinumAxe); // use a single platinum axe
	recipe.Register(); // 1 platinum axe -> 50 items
}
```

You can also add multiple crafting recipes to an item.

```cs
public override void AddRecipes()
{
	Recipe recipe = CreateRecipe(); // recipe 1: uses gold axe
	recipe.AddIngredient(ItemID.GoldAxe);
	recipe.AddIngredient(ItemID.StoneBlock, 100);
	recipe.Register();

	recipe = CreateRecipe(); // recipe 2: uses platinum axe
	recipe.AddIngredient(ItemID.PlatinumAxe);
	recipe.AddIngredient(ItemID.StoneBlock, 100);
	recipe.Register();
}
```

## Crafting station requirement
Usually, an item should only be craftable near a workbench, anvil or some other crafting station.

To do this, you can use `recipe.AddTile()`. This method takes in one argument, the tile you need to be near to craft the item. You represent this tile with `TileID.SomeTile`:

```cs{6}
public override void AddRecipes()
{
	Recipe recipe = CreateRecipe();
	recipe.AddIngredient(ItemID.SandBlock, 10);
	recipe.AddIngredient(ItemID.CopperBar);
	recipe.AddTile(TileID.WorkBenches); // make the item craftable at a workbench
	recipe.Register();
}
```

Yes, you can set it to any tile, which means you can make recipes craftable near a dirt block, crimson vines, or anything else. [Here is a wiki page](https://terraria.wiki.gg/wiki/Tile_IDs) for tile IDs.

If a recipe has multiple tiles, you need to be near all of them at once to craft the item.

## Chain syntax
You can also create recipes by chaining methods. What this means is you don't create a `recipe` variable, but directly call `CreateRecipe()`, then chain the `AddIngredient()` and `AddTile()` methods on it.

```cs
public override void AddRecipes()
{
	// no variable is defined, you just chain the methods
	CreateRecipe()
		.AddIngredient(ItemID.SandBlock, 10)
		.AddIngredient(ItemID.CopperBar)
		.AddTile(TileID.WorkBenches)
		.Register();

	CreateRecipe()
		.AddIngredient(ItemID.SandBlock, 10)
		.AddIngredient(ItemID.TinBar)
		.AddTile(TileID.WorkBenches)
		.Register();
}
```

This syntax looks cleaner and less wordy. There are two things to keep in mind with this approach:
- There is a period before every instruction after `CreateRecipe()`.
- Only the last line, `.Register();`, has a semicolon.

You can use whichever way you prefer. The guide will use this syntax from now on, but everything here still applies to the other one.

## Modded ingredients
Since `ItemID` only holds vanilla items, there's a different way to add ModItems as ingredients: `.AddIngredient<ModdedItem>()`, where you replace ModdedItem with your ModItem class. The stack size can also be specified as a parameter.

An example:

```cs{5-6}
public override void AddRecipes()
{
	CreateRecipe()
		.AddIngredient(ItemID.HallowedBar, 2) // vanilla ingredient
		.AddIngredient<TestItem>(5) // modded ingredient - 5 TestItems
		.AddIngredient<TestSword>() // a single TestSword
		.Register();
}
```

You can also use modded tiles (ModTiles) as crafting stations with `.AddTile<ModdedTile>()`:

```cs{5}
public override void AddRecipes()
{
	CreateRecipe()
		.AddIngredient(ItemID.Wood, 200)
		.AddTile<CustomCraftingStation>()
		.Register();
}
```

## Recipe Groups

If you wanted to use Wood in a crafting recipe, you would most likely use something like `.AddIngredient(ItemID.Wood, 50)`. However, this would only accept regular forest Wood, meaning any Palm Wood or Boreal Wood wouldn't count. To solve this issue, we can use Recipe Groups.

Recipe groups are a type of ingredient that counts as one ingredient, but accepts multiple items. To solve our previous issue, instead of a Wood ingredient, we would add a Wood recipe group, which counts any type of wood.

To use a recipe group, you call `.AddRecipeGroup()`. This acts exactly like `.AddIngredient()`, but you specify a `RecipeGroupID` instead of an `ItemID`.

To add the Wood recipe group, you would do `.AddRecipeGroup(RecipeGroupID.Wood, 50)`. Now, you would be able to craft the item with any type of wood, say 30 Palm Wood and 20 Boreal Wood.

An example use of recipe groups:

```cs{5-6}
public override void AddRecipes()
{
	CreateRecipe()
		.AddIngredient(ItemID.Obsidian, 20) // regular ingredient: 20 obsidian
		.AddRecipeGroup(RecipeGroupID.Wood, 50) // 50 wood of any type
		.AddRecipeGroup(RecipeGroupID.IronBar, 5) // 5 iron bars or lead bars
		.AddTile(TileID.Anvils) // tile: craftable at anvil
		.Register();
}
```

Besides `Wood`, `IronBar`, `Sand` and `Fragment`, there aren't many useful recipe groups. You can make custom recipe groups, but it's a bit hard to do so, they will be discussed later.

## Conditions
You can add extra conditions that must be satisfied to craft the item. There are a lot of conditions, concerning basically everything. For a full list, you can [go here](https://github.com/tModLoader/tModLoader/blob/stable/patches/tModLoader/Terraria/Condition.cs).

To add a condition, you use `.AddCondition()`, and you can specify an argument using `Condition`. For example, `.AddCondition(Condition.BloodMoon)`, makes the item only craftable on a blood moon.

Here are a few conditions:

```cs{5-12}
public override void AddRecipes()
{
	CreateRecipe()
		.AddIngredient(ItemID.DirtBlock)
		.AddCondition(Condition.Hardmode) // only in hardmode
		.AddCondition(Condition.InDesert) // only in a desert
		.AddCondition(Condition.BloodMoon) // only during a blood moon
		.AddCondition(Condition.NearWater) // only near water - NearLava, NearHoney and NearShimmer work too
		.AddCondition(Condition.DownedMoonLord) // only after killing moon lord
		.AddCondition(Condition.ForTheWorthyWorld) // only in a for the worthy world
		.AddCondition(Condition.InExpertMode) // only in expert mode
		.AddCondition(Condition.InUnderworld) // only in the underworld
		.Register();
}
```