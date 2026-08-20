---
title: Working with Images
sidebar:
  label: Working with Images
---
Image assets provide raster and palette data. HUD-element and item-entity scripts decide how those assets are drawn. Adding an image alone does not make it appear in the game; it must be referenced by a drawing script, message-image list, or another structure.

## Edit an Existing Image

1. Open **Globals Editor → Images** and select the asset.
2. Use **Choose** to locate its source PNG under `$mod/image/assets/`.
3. Confirm the texture format, palette count, vertical-flip setting, dimensions, and preview.
4. Save the Globals Editor and compile the mod.

Paths in `ImageAssets.xml` are relative to `$mod/image/assets/`. For an asset named `item/Mushroom`, Star Rod recognizes palette variants such as:

```text
image/assets/item/Mushroom.png
image/assets/item/Mushroom_alt.png
image/assets/item/Mushroom_alt2.png
```

Do not silently change the dimensions or texture format of an existing asset unless every script and renderer using it can accept the change. The preview shows what Star Rod loaded; the consuming script still determines how it is displayed.

If PNGs were placed in `image/assets/` by hand, use **Actions → Import Missing** to create image definitions for complete, unlisted image sets.

## Add an Image

1. Click **Add Image** in the Images tab.
2. Give the asset a unique name and choose its PNG.
3. Select the appropriate texture format. CI-4 is a natural fit for small paletted icons, but the image system also supports non-CI formats.
4. Check the preview and palette count, then save.
5. Reference the new asset from the script or structure which will draw it.

## Add a HUD Element

Open **Globals Editor → HUD Elements**, choose the load group where the element is needed, and click **Add Script**. A complete source for a simple static 32×32 element is:

```star-rod
EnableCI4
SetTileSize ( .IconSize:32x32 )
Loop
    SetIcon ( 60` ~ImageIcon:item/Mushroom )
Restart
End
```

For an item HUD element named `Mushroom`, a sibling named `Mushroom_disabled` provides the disabled appearance. If it is absent, Star Rod uses the normal element for both states. The disabled script commonly selects an alternate, desaturated palette.

## Add an Item Entity

Open **Globals Editor → Item Entities** and add a source under `$mod/image/itemscripts/`. A complete source for a static world icon is:

```star-rod
SetIcon ( 60` ~ImageIcon:item/Mushroom )
Restart
End
```

Use an explicit item-entity script when the world icon needs animation or special timing. For an ordinary item, Globals Editor can generate both its HUD and item-entity scripts from one image as part of the [item workflow](editing-items.md).

See [Image Assets and Scripts](../reference/image-scripts.md) for paths, load groups, commands, and naming rules.
