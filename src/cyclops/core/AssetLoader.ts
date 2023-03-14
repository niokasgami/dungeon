/* eslint-disable comma-dangle */
import { Assets, Loader, LoaderResource, utils } from 'pixi.js';

export default class AssetLoader {
  public static readonly rootPath = 'assets/';


  private static resources = [];
  private static loader = new Loader();

  private static emitter = new utils.EventEmitter();

  public static readonly PATH = {
    characters: 'characters/',
    systems: 'systems/',
    data: 'data/',
  };

  public static on(event: string, listener: (..._args: any[]) => void) {
    this.emitter.on(event, listener);
  }

  public static getInstance() {
    return this.loader;
  }

  public static get(asset: string): LoaderResource {
    return this.loader.resources[asset];
  }

  /**
   * load the data of a json
   * @param asset - the json to load
   * @returns 
   */
  public static getData<T>(asset: string): T {
    return this.get(asset).data;
  }

  public static addCharacters(filename: string) {
    this.add(filename, this.PATH.characters);
  }

  public static addSystem(filename: string) {
    this.add(filename, this.PATH.systems);
  }

  public static addMap(filename: string) {
    this.add(filename, `${this.PATH.data}/maps/`);
  }

  public static newAdd(filename: string, directory: string) {
    const url = `${this.rootPath}${directory}/${filename}`;
    const key = filename.split('.')[0];
    // we use this as a way to keep track of the all the keys of the resources
    // it is due to how the new Asset system works.
    this.resources.push(key);
    Assets.add(key, url);
  }

  public static add(filename: string, directory: string) {
    const url = `${this.rootPath}${directory}/${filename}`;
    const key = filename.split('.')[0];
    if (this.loader.resources[key]) {
      // @todo the logger should warn about resource already existing
      return;
    }
    this.loader.add(key, url);
  }

  public static async newLoad() {
    await Assets.load(this.resources).then(() => {
      this.resources = [];
      this.emitter.emit("complete", )
    });
  }

  /**
     * will load all the queued images
     */
  public static load() {
    this.loader.load((loader, resources) => {
      this.emitter.emit('complete', resources);
    });

    this.loader.onProgress.once((loader, resource) => {
      this.emitter.emit('progress', loader, resource);
    });

    this.loader.onError.once((loader, resource) => {
      this.emitter.emit('error', loader, resource);
    });
  }
}
