import { Scene, AssetLoader, Entity, Mouse, Keyboard, Key, Button, MouseButton } from 'cyclops';
import { utils, LoaderResource, Rectangle, Point } from 'pixi.js'
import {DataActor} from '../objects/Actor';



export default class Boot extends Scene {
  private entity: Entity;

  private keyboard = new Keyboard();

  private enterKey = new Key('Enter');

  private leftKey = new Key('ArrowLeft');
  private mouse = new Mouse();
  private leftMouse = new Button('left', MouseButton.LEFT);

  public override preload() {
    super.preload();
    this.keyboard.addKey(this.enterKey);
    this.keyboard.addKey(this.leftKey);
    this.mouse.addButton(this.leftMouse);
    AssetLoader.add('shroom.png', 'pictures/');
    AssetLoader.add('Actors.json','data/');
  }

  // @ts-ignore
  public override create(resources: utils.Dict<LoaderResource>): void {
    // @ts-ignore
    super.create(resources);

    const entity = {
      data: {
        id: 'shroom',
        sprite: {
          filename: resources.shroom.texture,
          index: 0,
          fps: 0,
        },
        collision: new Rectangle(0, 0, 0, 0),
      },
      coords: new Point(
        this.game.width / 2,
        this.game.height / 2,
      ),
    };
    this.entity = new Entity(entity.data, entity.coords);
    this.addChild(this.entity);
    const json = AssetLoader.getData<DataActor[]>('Actors');
    console.log(json[1].name);
  }

  public override update(dt?: number) {
    if (this.keyboard.isPressed(this.enterKey)) {
      this.game.sceneLoader.change('map');
    }
    if (this.keyboard.isPressed(this.leftKey) || this.mouse.isPressed(this.leftMouse)) {
      this.entity.rotation -= 0.1 * dt;
    }
  }

  // public override resize(width: number, height: number): void {}
}
