# Game Engine/Graphics

## Objective

Research on what would be a good approach for handling game mechanics and graphics for this project.

## What is Web GL

A JavaScript API for rendering high-performance interactive 3D and 2D graphics within any compatible web browser without the use of plug-ins. WebGL is low-level (requires manual shader creation, geometry buffering, and rendering pipeline management). WebGL is great for 3D rendering.

## What is Phaser

An open source specialized 2D JavaScript game framework that uses WebGL (and HTML5 Canvas) for rendering. Phaser is high-level (handles physics, input, sprites, audio).

## Getting Started with Phaser

Phaser has an [official template project using React and Phaser](https://github.com/phaserjs/template-react-ts) which much of this information is based on.

### 1. Install via npm

`npm install phaser`

### 2. Set up types in `tsconfig.app.json`

```json
"lib": ["ES2022", "DOM", "DOM.Iterable", "es6", "scripthost"],
"typeRoots": ["./node_modules/phaser/types"],
"types": ["Phaser"]
```

### 3. Game Config and Start

[Game config docs](https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig).

```Typescript
// phaser.ts
import Phaser from 'phaser';
import { Boot, Room, MainMenu, Preloader } from '@src/game/scenes';
import { GAME_PARENT_ID } from '@src/game/lib/constants';


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,      // Which renderer to use. AUTO picks WEBGL if available, otherwise CANVAS.
    width: 1024,            // width of game in game pixels
    height: 768,            // height of game in game pixels
    parent: GAME_PARENT_ID,  // HTMLElement or string (id of element that will contain the game screen)
    backgroundColor: '#fff',
    pixelArt: true,         // Sets antialias to false and roundPixels to true.
    scene: [                  // A scene or scenes to add to the game.
        Boot,
        Preloader,
        MainMenu,
        Room,
    ]
};

export const StartGame = () => {
    return new Phaser.Game({ ...config, parent: GAME_PARENT_ID });
}
```

```Typescript
// constants.ts
export const GAME_PARENT_ID = 'game-container';
export enum GameEvents {
    SCENE_READY = 'SCENE_READY'
}

export enum GameScenes {
    BOOT = 'BOOT',
    ROOM = 'ROOM'
}
```

```Typescript
// usePhaser.ts
const usePhaser = (ref) => {
    const game = useRef<Phaser.Game | null>();

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame(GAME_PARENT_ID);
            if (ref !== null)
            {
                ref.current = { game: game.current, scene: null };
            }
        }
        return () => {
            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }
        }
    }, [ref]);
}
```

### 4. Set up EventBus

Facilitates transmission of events between phaser and the React app and hook to handle events

```Typescript
// phaser.ts
// Used to emit events between components, HTML and Phaser scenes
export const EventBus = new Phaser.Events.EventEmitter();

// useEventListener.ts
import { GAME_EVENTS } from '@src/game/lib/constants'
import { EventBus } from '@src/game/lib/phaser';

export useEventListener = (gameRef: React.Ref<Phaser.Game | null>) => {

    const onSceneReady = (currentScene: Phaser.Scene) => {
        ref.current.scene = currentScene;
    };

    useEffect(() => {
        EventBus.on(GameEvents.SCENE_READY, onSceneReady);
        return () => {
            EventBus.removeListener(GameEvents.SCENE_READY);
        }

    }, [ref])
}

```

### 5. Add Scenes

[Scene Documentation](https://docs.phaser.io/phaser/concepts/scenes)

Scenes are where we handle logic to load assets and where sprites, game logic and all of the Phaser systems live. Multiple scenes can be running at the same time.

The general order of scenes is:

`Boot → Preloader → [Main Game Scenes] → EndScene`

The base scene class that all our scenes should extend. Any logic that all scenes should have access to should be implemented here.

```Typescript
// Scene.ts

interface SceneProps {
    name: string;
}

class Scene extends Phaser.Scene {
    constructor (name) {
        super(name);
    }

    create () {
        // Send event to indicate that the scene is ready
        // Only have to emit this event if we need to access the scene from React
        EventBus.emit(GameEvents.SCENE_READY, this);
    }
}
```

The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

```Typescript
// scenes/Boot.ts
export class Boot extends Scene
{
    constructor () {
        super(GameScenes.BOOT);
    }

    preload () {
        this.load.image('background', 'assets/bg.png');
    }

    create () {
        this.scene.start(GameScenes.PRELOADER);
    }
}
```

Load assets that are needed by the main game scenes here, we can show a loading screen here using assets loaded in in the Boot scene.

```Typescript
// scenes/Preloader.ts
export class Preloader extends Scene
{
    constructor () {
        super(GameScenes.PRELOADER);
    }

    init () {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload () {
        //  Load the assets for the game
        this.load.setPath('assets');
        this.load.image('pet', 'pet.png');
        this.load.image('chair', 'chair.png');
    }

    create () {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
```

```Typescript
// scenes/Room.ts
import { GameScenes } from '@src/game/lib/constants';
class RoomScene extends Scene {
    constructor () {
        super(GameScenes.ROOM);
    }

    create () {
        // Game Objects and logic here

        // At the end of create method, or once all necessary data is loaded:
        super.create();
    }

    changeScene () {
        this.scene.start('GameOver');
    }
}
```

### 6. Add Pet Sprites

The base sprite class that all our sprites (pets etc) should extend.

```Typescript
// Sprite.ts
export interface Coordinates {
    x: number;
    y: number;
}
interface SpriteInitParams {
    spriteSheet: Img;
    initialPosition: Coordiates;
    phaserRef: React.Ref;
}
export class Sprite {
    spriteSheet: Img;
    position: Coordinates;
    game: React.Ref;

    constructor(params: SpriteInitParams) {
        this.spriteSheet = params.spriteSheet;
        this.position = params.initialPosition;
        this.game = params.phaserRef;

    }

    getCurrentScene() {
        return this.game.current.scene;
    }

    add() {
        // Add sprite to current scene
        const { x, y } = this.position;
        const scene = getCurrentScene()
        if (!scene) return;
        // Sprite Game Object instance
        return scene.add.sprite(x, y, this.image);
    }

    move(coords: Coordinates) {
        this.position = coords;
        const scene = getCurrentScene()
        if (!scene) return

        scene.moveLogo(({ x, y }) => {
            setSpritePosition({ x, y });

        });
    }

}

```

### 7. Phaser Game Component `GameContainer`

Initialize the game in React

```Typescript
// GameContainer/index.tsx
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { EventBus, StartGame } from '@src/game/lib/phaser';
import { useEventListener } from '@src/hooks/useEventListener'
import { GAME_PARENT_ID } from '@src/game/lib/constants';

export const GameContainer = () => {
    export const game = useContext(GameContext);
    // start phaser game
    usePhaser(game.phaserRef);
    // start event listeners
    useEventListener(game.phaserRef);

    return (
        <div id={GAME_PARENT_ID}></div>
    );

};
```

### 6. Create context to save game state

```Typescript
// gameContext.ts
import { createContext } from 'react';

export interface GameState {
    phaserRef: Ref | null;
}

const initialGameState = {
    phaserRef: null;
}

export const GameContext = createContext(initialGameState);

```

### 7. Connect it all together in `App.tsx`

```Typescript
import { useRef, useState } from 'react';
import { GameContext } from '@src/context/gameContext';
import Phaser from 'phaser';
import { GameContainer } from '@src/components/GameContainer';

function App () {

    // References to the PhaserGame instance (exposes game state)
    const phaserRef = useRef();

    return (
        <GameContext value={{ phaserRef }}>
            <div id="app">
                <GameContainer />
                <GameMenu />
            </div>
        </GameContext>
    )
}

export default App

```

## Frontend Directory structure for Phaser files

```
frontend/
├── src/
│   ├── pages/
│   │   └── ...
│   ├── game/
│   │   ├── scenes/
│   │   │   ├── Scene.ts
│   │   │   └── ...
│   │   ├── sprites/
│   │   │   ├── Sprite.ts
│   │   │   └── ...     # Pets
│   │   └── lib/
│   │       ├── constants.ts
│   │       ├── movementUtils.ts
│   │       └── phaser.ts
│   ├── components/
│   │    ├── GameMenu/
│   │    │  └── index.tsx
│   │    └──  GameContainer/
│   │       └── index.tsx
│   ├── hooks/
│   │       ├── usePhaser.ts
│   │       └── useEventListener.ts
│   ├── contexts
│   │       └── gameContext.ts
├── vite.config.ts         # Config for multi-page build
├── manifest.config.ts     # Config for the extension manifest
├── package.json
└── README.md

```
