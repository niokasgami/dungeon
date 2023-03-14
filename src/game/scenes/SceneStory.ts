import { AssetLoader, Button, Mouse, MouseButton, Scene } from "cyclops";
import { Sprite, utils, LoaderResource, Text } from "pixi.js";
import { SpriteButton, SpriteCommands, SpriteDebug } from "../sprites";
import { Database } from "../management";
import { style } from "../Constant";
import { StoryManager } from "../management";

//import { sound } from '@pixi/sound';
import { AUDIO_TYPE, Audio } from "../management/Audio";


Audio.add('dungeon', 'bgm/Dungeon6.ogg', AUDIO_TYPE.BGM);

const test = "I am a very nice text :> \n and I can produce space!";



export class SceneStory extends Scene {

  private mouse = new Mouse();
  private leftMouse = new Button('left', MouseButton.LEFT);
  private background: Sprite;
  private mainArea: Sprite;
  private dialogue: Text;
  private choicesSprite: SpriteCommands;
  private okButtons: SpriteButton;
  private debugSprite: SpriteDebug;


  public override preload() {
    super.preload();
    this.mouse.addButton(this.leftMouse);
    Database.preload();
    AssetLoader.add('background.png', 'pictures/');
    AssetLoader.add('paper.png', 'pictures/');
    AssetLoader.add('button.png', 'pictures/');
    AssetLoader.add('ui.png', 'pictures/');


  }

  public override create(resources: utils.Dict<LoaderResource>) {
    super.create(resources);
    this.createBackground(resources);
    this.createMainArea(resources);
    this.createDialogue();
    this.createContinueButton(resources);
    this.createButtons(resources);
    Database.init();
    StoryManager.init(Database.$dataStory);
    this.start();
  }

  private createBackground(resources: utils.Dict<LoaderResource>) {
    this.background = new Sprite(resources.background.texture);
    this.addChild(this.background);
  }

  private createMainArea(resources: utils.Dict<LoaderResource>) {
    this.mainArea = new Sprite(resources.paper.texture);
    this.mainArea.anchor.set(0.5, 0.5);
    this.mainArea.x = this.game.width / 2;
    this.mainArea.y = this.game.height / 2
    this.addChild(this.mainArea);
  }

  private createDialogue() {
    this.dialogue = new Text(test, style);
    this.dialogue.anchor.x = 0.5;
    this.dialogue.anchor.y = 0.5;
    this.dialogue.x = this.center(this.game.width);

    this.dialogue.y = this.center(this.game.height);

    this.addChild(this.dialogue);
  }

  private createContinueButton(resources: utils.Dict<LoaderResource>) {
    this.okButtons = new SpriteButton(resources.button.texture, 'Continue');
    this.okButtons.anchor.set(0.5, 0.5);
    this.okButtons.x = this.game.width / 2;
    this.okButtons.y = this.game.height / 2 + 250;
    this.okButtons.scale.set(1.5, 1.5);
    this.okButtons.interactive = true;
    this.okButtons.on('pointerdown', this.onContinue.bind(this));
    this.okButtons.visible = false;
    this.okButtons.on('mouseover', () => { this.okButtons.scale.set(1.2, 1.2) });
    this.okButtons.on('mouseout', () => { this.okButtons.scale.set(1, 1) });
    this.addChild(this.okButtons);
  }

  public override start() {
    super.start();

    const story = StoryManager.currentNode;
    this.dialogue.text = story.dialogue;
    if (StoryManager.hasChoices()) {
      this.displayChoices();
    }
    //  Audio.play('dungeon', 0.1);
  }

  public onContinue() {
    const story = StoryManager.currentNode.goto;
    StoryManager.progress(story);
    this.refresh();
  }

  public displayChoices() {

    const choices = StoryManager.choices();
    for (let i = 0; i < choices.length; i++) {
      const child = this.choicesSprite.list()[i];
      child.label.scale.set(1, 1);
      child.x = 0;
      if (StoryManager.hasConditions(i)) {
        const condition = StoryManager.conditions(i);
        if (condition) {
          child.visible = true;
          child.setText(choices[i].text);
          this.choicesSprite.list()[i] = child;
        }
      } else {
        child.visible = true;
        child.setText(choices[i].text);
        this.choicesSprite.list()[i] = child;
      }
3
    }
    this.choicesSprite.visible = true;
    this.choicesSprite.refresh();
  }


  public onChoice(index: number) {
    const choice = StoryManager.choices()[index];
    if (StoryManager.hasAction(index)) {
      StoryManager.executeChoiceAction(index);
    }
    StoryManager.progress(choice.goto);
    this.refresh();
  }

  public refresh() {
    const story = StoryManager.currentNode;
    this.removeButtons();
    this.dialogue.text = story.dialogue;
    if (StoryManager.hasChoices()) {
      this.displayChoices();
    } else if (story.goto === 'GAME_OVER') {
      alert("GAMEOVER");
    } else {
      this.displayOkButton();
    }
  }

  public displayOkButton() {
    this.okButtons.visible = true;
  }

  public removeButtons() {
    for (const child of this.choicesSprite.list()) {
      child.visible = false;
    }
    this.choicesSprite.visible = false;
    this.okButtons.visible = false;
  }

  private createButtons(resources: utils.Dict<LoaderResource>) {
    let buttons: SpriteButton[] = [];
    for (let i = 0; i < 4; i++) {
      const button = new SpriteButton(resources.button.texture, String(i));
      button.on('pointerdown', this.onChoice.bind(this, i));
      button.on('mouseover', () => { button.scale.set(1.2, 1.2) });
      button.on('mouseout', () => { button.scale.set(1, 1) });
      button.visible = false;
      buttons.push(button);
    }
    this.choicesSprite = new SpriteCommands(buttons, StoryManager.choices());
    this.choicesSprite.x = this.game.width / 2 - 200;
    this.choicesSprite.y = this.game.height / 2 + 250;
    this.addChild(this.choicesSprite);
    console.log(this.choicesSprite);
  }

  public center(axis: number): number {
    return axis / 2;
  }

  public override update(dt: number) {
    super.update(dt);
  }
}

