var PlatformerGame = PlatformerGame || {};

//loading the game assets
PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    // this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('sky', 'assets/sky_new.png');
    this.game.load.image('ground', 'assets/ground_new.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('button', 'assets/button.png', 190, 49, 2);
    this.game.load.spritesheet('button2', 'assets/button2.png', 190, 49, 2);
    this.game.load.spritesheet('dude', 'assets/spritesheet_caveman.png', 32, 32, 4*4);
    this.game.load.spritesheet('barrel', 'assets/barrel.png', 20, 20, 4);
    this.game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32, 4);
  },
  create: function() {
    this.state.start('Game');
  }
};
