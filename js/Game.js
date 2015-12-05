var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {

    this.player;
    this.platforms;
    this.cursors;
    this.stars;

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.game.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    this.ground = this.platforms.create(20, this.game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    this.ground.scale.setTo(2.4, 2);

    //  This stops it from falling away when you jump on it
    this.ground.body.immovable = true;

    //  Now let's create two ledges
    //this.ledge = this.platforms.create(400, 400, 'ground');
    //this.ledge.body.immovable = true;

    //this.ledge = this.platforms.create(-150, 350, 'ground');
    //this.ledge.body.immovable = true;

    // The player and its settings
    this.player = this.game.add.sprite(160, this.game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.02;
    this.player.body.gravity.y = 500;
    this.player.body.collideWorldBounds = false;
    this.player.anchor.setTo(0.5);
    this.player.scale.x *= -1; // we only run right
    this.player.animations.add('run', [12,13,14,15,0,1,2,3,4,5,6,7,8,9,10,11], 10, true);


    this.baddie = this.game.add.sprite(100, this.game.world.height - 150, 'baddie');
    this.game.physics.arcade.enable(this.baddie);

    //  Player physics properties. Give the little guy a slight bounce.
    this.baddie.body.bounce.y = 0.02;
    this.baddie.body.gravity.y = 500;
    this.baddie.body.collideWorldBounds = false;
    this.baddie.anchor.setTo(0.5);
    //this.baddie.scale.x *= -1; // we only run right
    this.baddie.animations.add('run', [2,3], 10, true);
    this.baddie.animations.play('run');

    this.barrels = this.game.add.group();


    //  Finally some stars to collect
    this.stars = this.game.add.group();

    //  We will enable physics for any star that is created in this group
    this.stars.enableBody = true;


    //  The score
    scoreText = this.game.add.text(320, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    score = 0;


    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.rkey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.jump.onDown.add(this.actionOnClick, this);
    this.rkey.onDown.add(this.reset, this);
    

    this.game.camera.follow(this.player);
    this.playerSpeed = 0;
    this.player.animations.play('run');
    this.scrollSpeed = 3;

    this.button2 = this.game.add.button(570, 50, 'button2', this.reset, this, 0, 0, 1, 0);
    this.button = this.game.add.button(50, 50, 'button', this.actionOnClick, this, 0, 0, 1, 0);

    //this.button.fixedToCamera = true;
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add(this.playerOut, this);
    this.gameOver = false;
    this.timer = 0;
  },

  update: function() {

    this.timer++;
    if (!this.gameOver) {
        score += 1;
        scoreText.text = '  Score: ' + score;
    }
    this.platforms.x -= this.scrollSpeed;

    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.baddie, this.platforms);
    this.game.physics.arcade.collide(this.barrels, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(this.baddie, this.barrels, this.knockBack, null, this);
    this.game.physics.arcade.overlap(this.player, this.barrels, this.knock, null, this);

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = this.playerSpeed;

    if (this.timer % 250 == 210) {
        this.baddie.body.velocity.y = -400;
    }
    if (this.timer % 250 == 0) {

        this.createRandomTerrain();
    }
    if (this.timer % 200 == 0) {
        this.spawnBarrel();
    }
    if (this.game.rnd.integerInRange(1, 1010) + this.timer*2/4000 > 1000) {
        this.spawnBarrel();
    }

  },

  collectStar : function(player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

  },

  spawnBarrel : function() {

    this.barrel = this.barrels.create(900, this.game.rnd.integerInRange(75, 680), 'barrel');
    this.barrel.animations.add('roll', [0,1,2,3], 10, true);
    this.barrel.animations.play('roll');
    this.game.physics.arcade.enable(this.barrel);
    this.barrel.body.bounce.y = 0.7;
    this.barrel.body.gravity.y = 400;
    this.barrel.anchor.setTo(0.5,0.5);
    this.barrel.body.velocity.x = -this.game.rnd.integerInRange(175, 380);
    this.barrel.body.collideWorldBounds = false;
    this.barrel.checkWorldBounds = false;

  },

  reset : function() {
    this.state.restart();   
  },
  actionOnClick : function(player) {
    if (this.player.body.touching.down) {
        this.player.body.velocity.y = -350;
    }
  },

  createRandomTerrain : function() {
    
    this.ledge = this.platforms.create(900 + this.timer*3, this.game.rnd.integerInRange(475, 580), 'ground');
    this.ledge.body.immovable = true;
    
  },

  knock: function() {
    this.player.body.velocity.y = 20;
    this.player.body.y += 10;
  },

  knockBack : function(baddie, barrel) {
    barrel.body.velocity.x *= -2;
    barrel.body.velocity.y *= -2;
  },
  playerOut : function() {
    if (!this.gameOver) {

        this.scrollSpeed = 0;
        this.gameOver = true;
        scoreText.text = '  Score: ' + score + "\n\n\n\n\n\n\n\n\n\nGAME OVER";
        promptForNameAndSubmitHighscore(score); 
    }
    
  }
};
