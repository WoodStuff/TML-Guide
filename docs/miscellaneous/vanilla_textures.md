# Vanilla Textures
Creating textures by hand is often a really tedious task, especially in the case of tiles and equipped textures for armor and accessories. To save time, we can reuse and edit vanilla textures.

## Extracting vanilla assets
If you own a copy of Terraria, you also own the assets. However, they're in the form of `.xnb` files, which we can't do much with. We have to decompile them to `.png` files first.

To decompile them, we can use a tool called [TConvert](https://forums.terraria.org/index.php?threads/tconvert-extract-content-files-and-convert-them-back.61706/). It'll automatically detect the location of the assets and decompile all of them to a folder somewhere. It takes a few minutes to run.

> [!WARNING]
> When TConvert finishes, it'll show a bunch of errors that it wasn't able to decompile some shaders. This is normal, these files are not of much use anyway.

This will extract literally every texture the game uses. Here are a few texture types you might want to edit and the ways to find them:
- **Items:** Their file name is `Item_XXX` where XXX is the item's ID. You can find the ID by searching the item on the [Terraria wiki](https://terraria.wiki.gg).
- **Tiles:** Their file name is `Tile_XXX` where XXX is the tile's ID. You can find the ID on the wiki too, however keep in mind that tile IDs are different from item IDs.
- **Accessory on player:** For some reason they are both in the Images folder and Images -> Accessories. Their file name is `Acc_Type_XXX`, where Type is the way it renders on the player (e.g. Shield), and XXX is some random number that I don't know what represents. You'll have to go one by one to find a specific texture.
- **Armor on player:** Helmet and greaves are in the Images folder, breastplates are in Images -> Accessories. Their file name is `Armor_XXX` for breastplates, or `Armor_Head_XXX` or `Armor_Legs_XXX`, where similar to accessories the ID is meaningless and you'll have to guess which one is which.

If you don't want to run an .exe program on your computer, there's also a way to decompile assets in the browser.

## Decompiling in the browser
[Here's a browser page](https://lybell-art.github.io/xnb-js/) that allows converting from `.xnb` to `.png`.

First, you'll have to locate where your assets are. If you're on Windows + Steam, they're stored in `C:\Program Files (x86)\Steam\steamapps\common\Terraria\Content`. Send those to the website and it'll decompile them.

> [!WARNING]
> Don't try to decompile every `.xnb` file at once or the page will become unstable. It's recommended to decompile just the category you need, then search for the image. [TConvert](https://forums.terraria.org/index.php?threads/tconvert-extract-content-files-and-convert-them-back.61706/) is recommended if you want to decompile every file.