---
title: Editing Items
sidebar:
  label: Editing Items
---
Open **Globals Editor → Items** to edit the item table. Changes are saved to `$mod/globals/Items.xml`.

## Edit an Existing Item

Select the item, make the changes, and save the Globals Editor. The message chooser is safer than typing a raw message ID because it stores a resolvable string name.

Be conservative with engine-special items such as boots, hammers, key items, coins, and recovery pickups. Their category bits are often checked by code outside the item table.

## Add a New Item

1. Create its name and description messages under `$mod/strings/patch/`.
2. Add or choose an image in **Globals Editor → Images**.
3. Return to **Items** and click **Add Item**. Append the item rather than shifting existing IDs.
4. Give it a unique identifier and choose its three messages.
5. Copy the type and target flags from the closest working vanilla item, then change only the properties you understand.
6. Choose **Create them automatically from an image** for a normal static icon, or select explicit item-entity and HUD-element scripts for custom animation.
7. Fill in the fields relevant to its type: HP and FP gain for food, power for a battle item, or move and menu order for a badge.
8. Save the Globals Editor and compile the mod. Resolve every unknown reference reported by the build before testing in game.

Automatic graphics creates a world item-entity script and a menu HUD element from the selected image. If the image has a second palette, it also creates the disabled HUD variant. With manual graphics, the normal HUD element may live in either the Item Icons or Always Loaded group; a sibling named `_disabled` supplies its disabled state.

## Make It Usable in Battle

A battle item needs an entry in `$mod/battle/item/Items.txt`. The entry associates the item ID with a battle-item patch under `$mod/battle/item/patch/` or one of the original sources under `$mod/battle/item/src/`. That battle source must provide `$Script_UseItem` as a `Script_Use` structure.

Choose the battle source used by a mechanically similar vanilla item, then create a `.bpat` with the same basename under `$mod/battle/item/patch/`. Copy the structures you need to change from the corresponding `.bscr` under `$mod/battle/item/src/`; do not rename or edit the original source. The item table potency fields are available to conventional item code, but `Script_UseItem` decides how targeting, animation, damage, healing, status, and inventory consumption proceed.

## Make It a Badge

A badge item points to a move from Globals Editor's Moves tab. The move supplies its BP cost and may also have an ability association for passive behavior. Adding the badge item alone does not create a new command or attack. Use an existing move when only the badge's presentation is new, or add the corresponding move and battle patches as well.

See [Item Data](../reference/item-data.md) for field definitions, type flags, and ID behavior.
