import './main.css';
import Phaser, { Game } from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';


const canvas = document.getElementById('game-canvas');
const config = {
    type: Phaser.WEB_GL,
    width: 580,
    height: 435,
    canvas,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [
        BootScene,
        GameScene
    ]
};

const game = new Game(config);