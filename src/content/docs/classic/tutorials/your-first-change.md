---
title: Your First Change
sidebar:
  label: Your First Change
  order: 1
---
This tutorial makes one small, visible change to the game and follows it through the complete modding cycle. It assumes that you have already followed [Creating a Mod](../guides/creating-a-mod.md) and can build an unchanged project.

We will replace the first line of the Paragoomba tattle. Before writing the patch, we will find that message in the string sources, in the same way you might locate any other message you want to edit.

## 1. Build the Unchanged Project

Use **Compile Mod** before editing anything. This verifies that the clean ROM, dump, project directory, and output path are working together.

## 2. Find the Original Message

Open `$mod/strings/src/`. Each `.str` file contains one section of the game's messages, and its filename begins with that section's hexadecimal ID. The descriptive names provide a useful place to begin browsing.

We want an enemy tattle, so open `1C Enemy Tattles.str`. Search within the file for `Paragoomba`. The word appears in several messages, but the one we want begins:

```star-rod
#string:1C:002
{
	[Style Right]
	This is a Paragoomba.[BR]
	...
}
```

The declaration supplies the message ID. `1C` is the section and `002` is the message within that section, giving the complete ID `001C0002`.

When you do not know which section contains a message, search all the files under `$mod/strings/src/` for a phrase you remember from the game. Read the surrounding message before copying it; a short phrase or character name may appear in several unrelated messages.

## 3. Write the Patch by Hand

Create `$mod/strings/patch/first_change.str`, copy the complete Paragoomba message into it, and change its contents:

```star-rod
#string:1C:002 {
	[Style Right]
	This is a modified Paragoomba![BR]
	[Wait][End]
}
```

The matching declaration tells Star Rod to replace message `001C0002` with our modified one.

## 4. Build the Changed Project

Use **Compile Mod** again. Star Rod will incorporate our modified message with the original messages as it rebuilds their data.

## 5. Use the String Editor

The String Editor provides another way to search the same sources, inspect their markup, and preview a message while editing it.

Launch **String Editor** from Star Rod. On the **Resources** tab, select **All**, then open the **Strings** tab and enter `Paragoomba` in the filter. The filter searches message IDs, names, and visible text. Select `1C-002` and check the **Source** field to distinguish the original message in `1C Enemy Tattles.str` from the replacement in `first_change.str`.

To revise the patch, return to **Resources** and select `first_change` under `strings/patch/`. Open **Strings**, select `1C-002`, and edit the first line in the text pane. The preview changes as you type and reports invalid markup before you build the mod.

When you are finished, return to **Resources**, right-click `first_change`, and select **Save Changes**. Compile the mod and test the new revision. String Editor saves the selected resource; it does not compile the ROM for you.

## 6. Make the Change Your Own

Choose another message which you can reach easily in the game. Find it by browsing the section names or searching for some of its visible text, copy its complete declaration into a file under `$mod/strings/patch/`, and change it with either a text editor or String Editor. New named messages, choices, variables, and embedded map or battle messages use the same underlying pipeline and are covered by [Adding and Modifying Messages](../guides/adding-messages.md).
