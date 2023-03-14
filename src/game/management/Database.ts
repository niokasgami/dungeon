import { AssetLoader } from "cyclops";
import ItemBase from "../objects/ItemBase";
import { DataStory } from "./StoryManager";
import { DataPlayer } from "../objects/index";


export class Database {

  private static registry = new Map();

  public static $dataItems: ItemBase[];
  public static $dataStory: DataStory[];
  public static $dataPlayer: DataPlayer;

  public static preload() {
    this.LoadData();
  }
  public static init() {

    this.buildRegistry();
    //   this.$dataItems = this.get('Items');
    this.$dataStory = this.get('Story');
    this.$dataStory = this.get('Player');
  }

  private static LoadData() {
    this.load('Items.json', 'data/');
    this.load('Story.json', 'data/');
    this.load('Player.json', 'data/');
  }

  private static buildRegistry() {
    this.add('Story');
    this.add('Player');
  }
  private static load(filename: string, dir: string) {
    AssetLoader.add(filename, dir);
  }

  public static add(key: string) {
    if (!this.registry.has(key)) {
      const data = AssetLoader.getData(key);
      this.registry.set(key, data);

    } else {
      throw new Error(`the data ${key} is already assigned!`);
    }
  }

  public static get(key: string): any {
    if (!this.registry.has(key)) {
      throw new Error(`the data ${key} doesn't exist`);
    } else {
      return this.registry.get(key);
    }
  }
}
