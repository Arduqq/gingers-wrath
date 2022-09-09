import { Scene } from 'phaser';

class BootScene extends Scene {
    constructor() {
        super("scene-boot");
    }

    preload() {
        // Load any assets here from your assets directory
        this.load.image('hazer', 'assets/hazer.png');
        this.load.image('antenna', 'assets/antenna.png');
        this.load.image('bullet', 'assets/capsule.png');
        this.load.image('enemy', 'assets/lyo-evil.png');
    }

    create() {
        this.scene.start('scene-game');
    }
}

export default BootScene;