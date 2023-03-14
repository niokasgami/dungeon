import { DataChoice} from "../management";
import { Sprite} from "pixi.js";
import { SpriteButton } from "./SpriteButton";

export class SpriteCommands extends Sprite {

  private sprites: SpriteButton[];
  private data: DataChoice[];

  constructor(groups: SpriteButton[], data: DataChoice[]){
    super();
    this.data = data;
    this.anchor.set(0.5,0.5);
    this.sprites = groups;
    this.build();
    this.setPosition();
  }

  private build() {
    for(const sprite of this.sprites){
      this.addChild(sprite);
    }
  }

  public list(): SpriteButton[]{
    return this.sprites;
  }

  public refresh(){
    this.setPosition();
  }
  private setPosition(){
    let x = 0;
    let y = 0;
    let choices = this.buildListCount();
    let nextLine = false;
    for(let i = 0; i < choices; i++){
      this.sprites[i].x = x;
      this.sprites[i].y = y;
      if(choices === 1){
        x = (this.sprites[i].width) + 15;
        break;
      }
      x += (this.sprites[i].width) + 70;

      if(i >= 1 && !nextLine){
        nextLine = true;
        x = choices > 3 ? 0 : (this.sprites[i].width / 2) + 70;
        y = (this.sprites[i].height) + 15;
      }
    }
  }

  private buildListCount(): number {
    let count = 0;
    for (const button of this.sprites){
      if(button.visible === true){
        count++;
      }
    }
    return count;
  }
}
