# Star Rod Sprite Editor

![Screenshot of the Star Rod Sprite Editor's Resource tab](./img/StarRod_SpriteEditor.png "Star Rod Sprite Editor")

## Under Construction

Quick notes:

* Sprite images must be indexed, and have at most 15 colors + 1 transparent (for this reason, [aseprite](https://www.aseprite.org/) or [libresprite](https://github.com/LibreSprite/LibreSprite) are the recommended sprite editors)
* Sprite widths must be divisible by 16, heights divisible by 8
* The width and height must be smaller than 256
* The transparent color will create a slight outline on the character in-game, if you set the transparent color to match the sprite outline you can mask this effect
