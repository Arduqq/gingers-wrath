import Phaser from 'phaser'

export default class EnemySpawner {
	constructor(scene, enemyKey = 'enemy') {
		this.scene = scene
		this.key = enemyKey

		this._group = this.scene.physics.add.group()
	}

	get group()
	{
		return this._group
	}

	spawn(playerX = 0) {
		const y = (playerX < 217) ? Phaser.Math.Between(0,217) : Phaser.Math.Between(217, 435)

        const enemy = this.group.create(600, y, this.key)
        enemy.body.setAllowGravity(false)
		enemy.setVelocity(Phaser.Math.Between(-200, -190), 0)
		
		return enemy
	}
}