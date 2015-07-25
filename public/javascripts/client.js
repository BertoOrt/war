var deck = [
  //spades
  {card: ["🂡"], score: 14 },
  {card: ["🂮"], score: 13 },
  {card: ["🂭"], score: 12 },
  {card: ["🂫"], score: 11 },
  {card: ["🂪"], score: 10 },
  {card: ["🂩"], score: 9 },
  {card: ["🂨"], score: 8 },
  {card: ["🂧"], score: 7 },
  {card: ["🂦"], score: 6 },
  {card: ["🂥"], score: 5 },
  {card: ["🂤"], score: 4 },
  {card: ["🂣"], score: 3 },
  {card: ["🂢"], score: 2 },
  //hearts//
  {card: ["🂡"], score: 14 },
  {card: ["🂾"], score: 13 },
  {card: ["🂽"], score: 12 },
  {card: ["🂻"], score: 11 },
  {card: ["🂺"], score: 10 },
  {card: ["🂹"], score: 9 },
  {card: ["🂸"], score: 8 },
  {card: ["🂷"], score: 7 },
  {card: ["🂶"], score: 6 },
  {card: ["🂵"], score: 5 },
  {card: ["🂴"], score: 4 },
  {card: ["🂳"], score: 3 },
  {card: ["🂲"], score: 2 },
  //clubs
  {card: ["🃑"], score: 14 },
  {card: ["🃞"], score: 13 },
  {card: ["🃝"], score: 12 },
  {card: ["🃛"], score: 11 },
  {card: ["🃚"], score: 10 },
  {card: ["🃙"], score: 9 },
  {card: ["🃘"], score: 8 },
  {card: ["🃗"], score: 7 },
  {card: ["🃖"], score: 6 },
  {card: ["🃕"], score: 5 },
  {card: ["🃔"], score: 4 },
  {card: ["🃓"], score: 3 },
  {card: ["🃒"], score: 2 },
  //diamonds
  {card: ["🃁"], score: 14 },
  {card: ["🃎"], score: 13 },
  {card: ["🃍"], score: 12 },
  {card: ["🃋"], score: 11 },
  {card: ["🃊"], score: 10 },
  {card: ["🃉"], score: 9 },
  {card: ["🃈"], score: 8 },
  {card: ["🃇"], score: 7 },
  {card: ["🃆"], score: 6 },
  {card: ["🃅"], score: 5 },
  {card: ["🃄"], score: 4 },
  {card: ["🃃"], score: 3 },
  {card: ["🃂"], score: 2 },
];

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function Game(){
  this.players = [];
  this.deck = deck;
}

Game.prototype.setGame = function(players){
  for(i=0;i<players; i++){
    var name = 'player' + (i + 1);
    this.players.push(new Player(name));
  }
  var players = this.players;
  var deck = shuffle(this.deck);
  while(deck.length > 0) {
    players.forEach(function (player,ind,arr) {
      if (deck.length > 0) {
        var card = deck.splice(0,1);
        player.hand.push(card[0]);
      }
      player.start();
    })
  }
  this.deck = [];
}

Game.prototype.startGame = function () {
  this.compare();
}

Game.prototype.compare = function () {
  var loser = [];
  var playingCards = [];
  var playingScores = [];
  var winner;
  this.players.forEach(function (player) {
    if (player.hand.length === 0 && player.collection.length === 0) {
      loser.push(player)
    }
  });
  if (loser.length === this.players.length - 1) {
    this.players.forEach(function (player) {
      if (loser.indexOf(player) < 0) {
        console.log(player.name + " wins!");
      }
    })
  } else {
    this.players.forEach(function (player) {
      if (loser.indexOf(player) < 0) {
        playingCards.push(player.currentCard);
        player.hand.splice(0,1);
        playingScores.push(player.currentCard.score);
      }
    })
    var highestScore = Math.max.apply(null, playingScores);
    var highest = playingCards.filter(function (card) {
      if (card.score === highestScore) {
        return card
      }
    });
    if (highest.length > this.players.length - 1) {
      console.log('war!');
      this.war(playingCards);
    } else {
      this.players.forEach(function (player) {
        playingCards.forEach(function (card) {
          if (player.currentCard.score === highestScore) {
            winner = player;
          }
        });
        if (player.hand.length === 0 && player.collection.length > 0) {
          player.collection.forEach(function (card) {
            player.hand.push(card)
          })
          player.collection = [];
        }
        if (player.hand.length > 0) {
          player.currentCard = player.hand[0];
        }
      })
      playingCards.forEach(function (card) {
        winner.collection.push(card);
      })
      this.compare();
    }
  }
}

Game.prototype.war = function (newCards) {
  var bucket = newCards;
  var winner;
  var loser = [];
  var playingCards = [];
  var playingScores = [];
  var winner;
  this.players.forEach(function (player) {
    if (player.hand.length > 3) {
      var cards = player.hand.splice(0,3);
      cards.forEach(function (card) {
        bucket.push(card)
      })
      player.currentCard = player.hand[0];
    } else if (player.collection.length > 0) {
      player.collection.forEach(function (card) {
        player.hand.push(card);
      })
      player.collection = [];
      if (player.hand.length > 3) {
        var cards = player.hand.splice(0,3);
        cards.forEach(function (card) {
          bucket.push(card)
        })
        player.currentCard = player.hand[0];
      } else {
        loser.push(player);
        player.hand.forEach(function (card) {
          bucket.push(card)
        });
        player.hand = [];
      }
    } else {
      loser.push(player);
      player.hand.forEach(function (card) {
        bucket.push(card)
      });
      player.hand = [];
    }
  });
  if (loser.length === this.players.length - 1) {
    this.players.forEach(function (player) {
      if (loser.indexOf(player) < 0) {
        console.log(player.name + " wins!");
      }
    })
  } else {
    this.players.forEach(function (player) {
      if (loser.indexOf(player) < 0) {
        playingCards.push(player.currentCard);
        player.hand.splice(0,1);
        playingScores.push(player.currentCard.score);
      }
    })
    var highestScore = Math.max.apply(null, playingScores);
    var highest = playingCards.filter(function (card) {
      if (card.score === highestScore) {
        return card
      }
    })
    if (highest.length > this.players.length - 1) {
      playingCards.forEach(function (card) {
        bucket.push(card);
      })
      console.log('double war!');
      this.war(bucket);
    } else {
      this.players.forEach(function (player) {
        playingCards.forEach(function (card) {
          if (player.currentCard.score === highestScore) {
            winner = player;
          }
        });
        if (player.hand.length === 0) {
          player.collection.forEach(function (card) {
            player.hand.push(card)
          })
          player.collection = [];
        }
        if (player.hand.length > 0) {
          player.currentCard = player.hand[0];
        }
      })
      playingCards.forEach(function (card) {
        bucket.push(card);
      })
      bucket.forEach(function (card) {
        winner.collection.push(card);
      })
      this.compare();
    }
  }
}

function Player(name) {
  this.name = name;
  this.hand = [];
  this.collection = [];
}

Player.prototype.start = function () {
  this.currentCard = this.hand[0];
}

var war = new Game();
war.setGame(2);
war.startGame();
