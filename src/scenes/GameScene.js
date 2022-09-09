import { Scene } from 'phaser';

import EnemySpawner from './EnemySpawner.js'

const ENEMY_KEY = 'enemy';

class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'bullet');
    }

    fire (x, y)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(300);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        this.rotation += 0.02;

        if (this.x >= 600)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

}

class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 20,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet (x, y)
    {
        let bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y);
        }
    }
}

class GameScene extends Scene {

    constructor() {
        super("scene-game");
        
		this.enemySpawner = undefined
    }

    
    floating;
    curve;
    graphics;

    spawnEnemies(spawner, player) {
        spawner.spawn(player.x);
        setTimeout(_ => this.spawnEnemies(spawner, player), Phaser.Math.Between(2500, 3000));
    }

    hit(player, enemy) {
		this.physics.pause()

		player.setTint(0xff0000)


		this.gameOver = true
	}

    hitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();

    }
    create() {
        this.hazerFloatRadius = {
            x: 5,
            y: 10
        }
        this.graphics = this.add.graphics();
        this.physics.world.setBounds(20, 20, 560, 395);
        this.bullets = new Bullets(this);
        this.floating = { t: 0, vec: new Phaser.Math.Vector2() };
        this.curve = new Phaser.Curves.Ellipse(0, 0, this.hazerFloatRadius.x,  this.hazerFloatRadius.y);
        // Add, scale, and make up a speed for our creature
        this.hazer = this.physics.add.sprite(150, 125, 'hazer');
        this.antenna = this.physics.add.sprite(230, 132.5, 'antenna');

        
		this.enemySpawner = new EnemySpawner(this, ENEMY_KEY)
		const enemyGroup = this.enemySpawner.group
        this.spawnEnemies(this.enemySpawner, this.hazer);
		this.physics.add.collider(this.hazer, enemyGroup, this.hit, null, this)
		this.physics.add.collider(this.bullets, enemyGroup, this.hitEnemy, null, this)

        // The antenna collides with the world bounds
        this.antenna.body.collideWorldBounds = true;

        this.hazer.body.setAllowGravity(false);
        this.antenna.body.setAllowGravity(false);
        this.hazer.setScale(0.15);
        this.antenna.setScale(0.15);
        this.hazerSpeed = 100;
        // Create a helper object for our arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursorsWASD = this.input.keyboard.addKeys('W,A,S,D');

        // Floating effect for Hazer
        this.tweens.add({
            targets: this.floating,
            t: 1,
            ease: 'Linear',
            duration: 6000,
            repeat: -1
        });

        // fires a bullet on SPACE
        this.input.keyboard.on('keydown-SPACE', () => {
            this.bullets.fireBullet(this.antenna.x, this.antenna.y);
        });

    }

    update() {
        // Listen for keyboard input
        const { left, right, up, down } = this.cursors;
        const { W, A, S, D } = this.cursorsWASD;
        // set the current speed of Hazer to 0 if the antenna reaches world bounds
        var speedModifier = 1;
        
        // Player movement handling when antenna is not oob
            if (left.isDown || A.isDown) {
                this.antenna.setVelocityX(speedModifier * -this.hazerSpeed);
            } else if (right.isDown || D.isDown) {
                this.antenna.setVelocityX(speedModifier * this.hazerSpeed);
            } else {
                this.antenna.setVelocityX(0);
            }
            if (up.isDown || W.isDown) {
                this.antenna.setVelocityY(speedModifier * -this.hazerSpeed);
            } else if (down.isDown || S.isDown) {
                this.antenna.setVelocityY(speedModifier * this.hazerSpeed);
            } else {
                this.antenna.setVelocityY(0);
            }
            
            this.hazer.x = this.antenna.x - this.floating.vec.x - 60;
            this.hazer.y = this.antenna.y - this.floating.vec.y;
            this.curve.getPoint(this.floating.t, this.floating.vec);
    }



}
export default GameScene;