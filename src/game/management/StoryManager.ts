import { Database } from "./Database";
import { Evaluator } from "./Evaluator";

export interface DataStory {
  id: string;
  dialogue: string;
  action?: string;
  goto?: string;
  choices?: DataChoice[]
};

export interface DataChoice {
  text: string,
  goto: string,
  conditions?: string;
}
/*
const story: DataStory[] = [
  {
    id: 'start',
    dialogue: "You see a strange fire under the place \n what do you do?",
    choices: [
      {
        text: "touch it",
        goto: 'burned'
      },
      {
        text: "light it off",
        conditions: () => inventory.waterBucket === true,
        goto: 'extinguished'
      },
      {
        text: "You wonder where there's a lit fire in this place.",
        conditions: () => inventory.waterBucket === true,
        goto: 'looking'
      },
      {
        text: "light it off",
        conditions: () => inventory.waterBucket === true,
        goto: 'extinguished'
      }
    ]
  },
  {
    id: 'burned',
    dialogue: "You burned your hand off!",
    goto: 'GAME_OVER'
  },
  {
    id: 'extinguished',
    dialogue: "you extinguished the fire!",
    goto: 'GAME_OVER'
  },
  {
    id: 'looking',
    dialogue: "It is true that the fire is placed to quite the unusual place",
    goto: 'start'
  }
];
*/
interface Story {
  label?: string
  action?: string
  choices: DataChoice[]
}
type storyType = [string, Story];

class newStoryManager {

  private static current: storyType;
  private static id: number = 0;
  private static stories: storyType[];

  public static init(story: storyType[]) {
    this.stories = story;
    this.id = 0;
    this.current = this.stories[0];
  }

  public static node(): storyType {
    return this.current;
  }

  public static dialogue(): string {
    return this.current[0];
  }

  public static options(): Story {
    return this.current[1];
  }

  public static label(): string {
    return this.options().label;
  }

  public static action(): string {
    return this.options().action;
  }

  public static choices(): DataChoice[] {
    return this.options().choices;
  }


  public static progress() {
    this.id++;
    this.current = this.stories[this.id];
  }

  public static jump(label: string): number {
    let id = 0;
    for (let i = 0; i < this.stories.length; i++) {
      const options = this.stories[i][1];
      if (options.label === label) {
        id = i;
        break;
      }
    }
    return id;
  }
}
export class StoryManager {

  public static currentNode: DataStory;
  public static id: string = 'notStarted';
  private static story: DataStory[];

  public static init(story: DataStory[]) {
    this.story = story;
    this.id = 'start';
    this.currentNode = this.findNode(this.id);
  }

  public static findNode(id: string): DataStory {
    //@ts-ignore
    const results = this.story.find(node => node.id === id);
    if (results === undefined) {
      console.error("the id: " + id + " doesn't exist!");
    }
    return results
  }

  public static hasChoices() {
    return this.currentNode?.choices !== undefined;
  }

  public static hasConditions(index: number) {
    //@ts-ignore
    return this.currentNode.choices[index].conditions !== undefined;
  }

  public static conditions(index: number): boolean {
    const condition = this.currentNode.choices[index].conditions;
    return Evaluator.eval(condition, null, true);
  }

  public static choices() {
    return this.currentNode?.choices;
  }

  public static progress(index: string) {
    this.id = index;
    this.currentNode = this.findNode(index);
  }

  public static hasAction(index: number) {
    if (index === -1) {
      return this.currentNode.action !== undefined;
    } else {
      return this.currentNode.choices[index].action !== undefined;
    }
  }
  public static executeAction() {
    //@ts-ignore
    window.eval(this.currentNode.action);
  }

  public static executeChoiceAction(index: number) {
    //@ts-ignore
    window.eval(this.currentNode.choices[index].action)
  }
}
