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
  this.atWarPlayers = [];
}

Game.prototype.setGame = function(num){
  var players = num || 2;
  if (players > 9) {
    players = 9;
  } else if (players < 2) {
    players = 2
  }
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

Game.prototype.gameOver  = function (loser) {
  this.players.forEach(function (player) {
    if (loser.indexOf(player) < 0) {
      var winnerDiv = document.querySelector('#winner');
      var info = document.createElement('div');
      var p = document.createElement('h3');
      info.setAttribute('class', 'info');
      p.innerHTML = player.name + " wins the game!";
      info.appendChild(p);
      winnerDiv.appendChild(info);
    }
  })
}

Game.prototype.sortPlayers = function () {
  this.players.sort(function (a,b) {
    if (a.name < b.name)
    return -1
    if (a.name > b.name)
    return 1
    return 0
  })
}

Game.prototype.compare = function () {
  var loser = [];
  var playingCards = [];
  var playingScores = [];
  var winner;
  this.sortPlayers();
  //check for lost players and refreshes hand for active players
  this.players.forEach(function (player) {
    if (player.hand.length === 0 && player.collection.length === 0) {
      loser.push(player)
    } else {
      if (player.hand.length === 0 && player.collection.length > 0) {
        player.collection = shuffle(player.collection);
        player.collection.forEach(function (card) {
          player.hand.push(card)
        })
        player.collection = [];
      }
      if (player.hand.length > 0) {
        player.currentCard = player.hand[0];
      }
      player.playedCard = null;
    }
  });
  // game over if all but one player lost
  if (loser.length === this.players.length - 1) {
    this.gameOver(loser);
  } else {
    //active players play cards and it's displayed
    var game = document.querySelector('.game');
    var board = document.createElement('div');
    this.players.forEach(function (player) {
      if (loser.indexOf(player) < 0) {
        var image = document.createElement('div');
        var playerPlay = document.createElement('div');
        var name = document.createElement('h4');
        var cardsLeft = document.createElement('p');
        image.setAttribute('class', 'card');
        image.innerHTML = player.currentCard.card[0];
        name.innerHTML = player.name;
        playingCards.push(player.currentCard);
        player.playedCard = player.currentCard;
        player.hand.splice(0,1);
        player.currentCard = [];
        playingScores.push(player.playedCard.score);
        cardsLeft.innerHTML = "deck: " + (player.hand.length + player.collection.length);
        playerPlay.setAttribute('class', 'play');
        playerPlay.appendChild(name);
        playerPlay.appendChild(cardsLeft);
        playerPlay.appendChild(image);
        board.appendChild(playerPlay);
        game.appendChild(board);
      }
    })
    //checks for war
    var highestScore = Math.max.apply(null, playingScores);
    playingScores = [];
    var highest = playingCards.filter(function (card) {
      if (card.score === highestScore) {
        return card
      }
    });
    if (highest.length > 1) {
      //sets players to war status and starts war
      wars++;
      var length = this.players.length;
      var j = 0;
      var movingPlayers = [];
      for (var i = 0; i < length; i++) {
        if (this.players[j].playedCard !== null && this.players[j].playedCard.score === highestScore) {
          movingPlayers.push(this.players.splice(j, 1));
        } else {
          j++
        }
      }
      movingPlayers.forEach(function (player) {
        this.atWarPlayers.push(player[0]);
      }.bind(this));
      var info = document.createElement('div');
      var p = document.createElement('p');
      info.setAttribute('class', 'info');
      p.innerHTML = "war!!";
      info.appendChild(p);
      board.appendChild(info);
      this.war(playingCards);
    } else {
      // finds winner, gives cards and repeats round
      this.players.forEach(function (player) {
        if (loser.indexOf(player) < 0) {
          playingCards.forEach(function (card) {
            if (player.playedCard.score === highestScore) {
              winner = player;
            }
          });
        }
      })
      playingCards.forEach(function (card) {
        winner.collection.push(card);
      })
      var info = document.createElement('div');
      var p = document.createElement('p');
      info.setAttribute('class', 'info');
      p.innerHTML = winner.name + ": wins!";
      info.appendChild(p);
      board.appendChild(info);
      rounds++;
      this.compare();
    }
  }
}

Game.prototype.war = function (bucket) {
  var winner;
  var loser = [];
  var playingCards = [];
  var playingScores = [];
  var winner;
  // at war players bury three cards, if they can't, they are losers
  this.atWarPlayers.forEach(function (player) {
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
  // checks if all players are losers due to not enough cards
  if (loser.length === this.atWarPlayers.length) {
    // checks if not all players are at war
    if (this.players.length > 0) {
      var highestScore = 0;
      var highestPlayers = 0;
      this.players.forEach(function (player) {
        if (player.playedCard !== null && player.playedCard.score > highestScore) {
          highestScore = player.playedCard.score;
        }
      })
      this.players.forEach(function (player) {
        if (player.playedCard !== null && player.playedCard.score === highestScore) {
          highestPlayers++
        }
      })
      // gives cards to the next highest card before war and restarts the rounds
      if (highestPlayers < 2) {
        this.players.forEach(function (player) {
          if (player.playedCard !== null && player.playedCard.score === highestScore) {
            winner = player.name
            bucket.forEach(function (card) {
              player.collection.push(card);
            })
          }
        })
        this.atWarPlayers.forEach(function (player) {
          this.players.push(player);
        }.bind(this))
        this.atWarPlayers = [];
        var game = document.querySelector('.game');
        var board = document.createElement('div');
        var info = document.createElement('div');
        var p = document.createElement('p');
        info.setAttribute('class', 'info');
        p.innerHTML = 'not enough cards for war, ' + winner + ' wins the cards';
        info.appendChild(p);
        board.appendChild(info);
        game.appendChild(board);
        this.compare();
      } else {
        // starts another war for next highest card before war
        var winners = [];
        this.players.forEach(function (player) {
          if (player.playedCard !== null && player.playedCard.score === highestScore) {
            winners.push(player)
          }
        })
        this.atWarPlayers.forEach(function (player) {
          this.players.push(player);
        }.bind(this))
        this.atWarPlayers = [];
        winners.forEach(function (player) {
          this.atWarPlayers.push(player)
        }.bind(this));
        this.atWarPlayers.forEach(function (player) {
          if (player.hand.length === 0 && player.collection.length > 0) {
            player.collection = shuffle(player.collection);
            player.collection.forEach(function (card) {
              player.hand.push(card)
            })
            player.collection = [];
          }
          if (player.hand.length > 0) {
            player.currentCard = player.hand[0];
          }
          player.playedCard = null;
        })
        var game = document.querySelector('.game');
        var board = document.createElement('div');
        var info = document.createElement('div');
        var p = document.createElement('p');
        info.setAttribute('class', 'info');
        p.innerHTML = 'not enough cards for war, another war started!';
        info.appendChild(p);
        board.appendChild(info);
        game.appendChild(board);
        this.war(bucket);
      }
    } else {
      //if all players were at war and don't have enough cards, game is drawn
      var game = document.querySelector('.game');
      var board = document.createElement('div');
      var info = document.createElement('div');
      var p = document.createElement('p');
      info.setAttribute('class', 'info');
      p.innerHTML = 'What?! theres a draw!!';
      info.appendChild(p);
      board.appendChild(info);
      game.appendChild(board);
    }
  } else {
    //gives the cards to the winner and restarts rounds
    if (loser.length === this.atWarPlayers.length - 1) {
      var game = document.querySelector('.game');
      var board = document.createElement('div');
      var info = document.createElement('div');
      var p = document.createElement('p');
      info.setAttribute('class', 'info');
      p.innerHTML = 'not enough cards to war';
      info.appendChild(p);
      board.appendChild(info);
      game.appendChild(board);
      this.atWarPlayers.forEach(function (player) {
        if (loser.indexOf(player) < 0) {
          bucket.forEach(function (card) {
            player.collection.push(card);
          })
        }
        this.players.push(player);
      }.bind(this))
      this.atWarPlayers = [];
      this.compare();
    } else {
      // at war players play cards and displays them
      var game = document.querySelector('.game');
      var board = document.createElement('div');
      this.atWarPlayers.forEach(function (player) {
        if (loser.indexOf(player) < 0) {
          var image = document.createElement('div');
          var playerPlay = document.createElement('div');
          var name = document.createElement('h4');
          var cardsLeft = document.createElement('p');
          image.setAttribute('class', 'card');
          image.innerHTML = player.currentCard.card[0];
          name.innerHTML = player.name;
          cardsLeft.innerHTML = "deck: " + (player.hand.length + player.collection.length);
          playerPlay.setAttribute('class', 'play');
          playerPlay.appendChild(name);
          playerPlay.appendChild(cardsLeft);
          playerPlay.appendChild(image);
          board.appendChild(playerPlay);
          game.appendChild(board);
          playingCards.push(player.currentCard);
          player.playedCard = player.currentCard;
          player.hand.splice(0,1);
          player.currentCard = [];
          playingScores.push(player.playedCard.score);
        }
      })
      var highestScore = Math.max.apply(null, playingScores);
      playingScores = [];
      var highest = playingCards.filter(function (card) {
        if (card.score === highestScore) {
          return card
        }
      })
      if (highest.length > 1) {
        //starts another war with at war players
        playingCards.forEach(function (card) {
          bucket.push(card);
        })
        wars++;
        var info = document.createElement('div');
        var p = document.createElement('p');
        info.setAttribute('class', 'info');
        p.innerHTML = "war again!!";
        info.appendChild(p);
        board.appendChild(info);
        var length = this.atWarPlayers.length;
        var j = 0;
        var movingPlayers = [];
        for (var i = 0; i < length; i++) {
          if (this.atWarPlayers[j].playedCard.score !== highestScore) {
            movingPlayers.push(this.atWarPlayers.splice(j, 1));
          } else {
            j++
          }
        }
        movingPlayers.forEach(function (player) {
          this.players.push(player[0]);
        }.bind(this));
        this.war(bucket);
      } else {
        // gives cards to at war winner and restarts rounds
        this.atWarPlayers.forEach(function (player) {
          if (loser.indexOf(player) < 0) {
            playingCards.forEach(function (card) {
              if (player.playedCard.score === highestScore) {
                winner = player;
              }
            });
          }
          player.playedCard = null;
        });
        playingCards.forEach(function (card) {
          bucket.push(card);
        })
        bucket.forEach(function (card) {
          winner.collection.push(card);
        })
        this.atWarPlayers.forEach(function (player) {
          this.players.push(player);
        }.bind(this));
        this.atWarPlayers = [];
        rounds++;
        var info = document.createElement('div');
        var p = document.createElement('p');
        info.setAttribute('class', 'info');
        p.innerHTML = winner.name + " wins the war!";
        info.appendChild(p);
        board.appendChild(info);
        this.compare();
      }
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

//starts game with the push of a button

var rounds = 0;
var wars = 0;
var submit = document.querySelector('.submit');
if (submit) {
  submit.addEventListener('click', function (e) {
    var input = document.querySelector('.number');
    var war = new Game();
    war.setGame(input.value);
    war.startGame();
    var result = document.querySelector('.result');
    var info = document.createElement('div');
    var p = document.createElement('h3');
    info.setAttribute('class', 'info');
    p.innerHTML = 'rounds: '+ rounds + ' wars: ' + wars;
    info.appendChild(p);
    result.appendChild(info);
    var reset = document.querySelector('#reset');
    reset.style.display = 'inline-block';
    var form = document.querySelector('.form');
    form.style.display = 'none';
    var top = document.querySelector('#backTop');
    top.style.display = 'inline-block';
    var bottom = document.querySelector('#bottom');
    bottom.style.display = 'inline-block';
    e.preventDefault();
  });
}

var analyze = document.querySelector('.analyze');
if (analyze) {
  analyze.addEventListener('click', function (e) {
    var games = document.querySelector('.games');
    var row = document.querySelector('.row');
    var gif = document.querySelector('.gif');
    var dataTitle = document.querySelector('.data');
    var gamesNumber = games.value;
    if (gamesNumber > 10000) {
      gamesNumber = 10000
    } else if (gamesNumber < 10) {
      gamesNumber = 10
    }
    gif.style.display = 'inline-block';
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/simulate?games=' + gamesNumber)
    xhr.addEventListener('load', function () {
      var response = JSON.parse(xhr.response);
      var reset = document.querySelector('#reset');
      var form = document.querySelector('.form');
      var graphs = document.querySelector('.graphs');
      gif.style.display = 'none';
      form.style.display = 'none';
      reset.style.display = 'inline-block';
      graphs.style.display = 'inline-block';
      row.style.display = 'block';
      dataTitle.innerHTML = "Total Averages from " + gamesNumber + " games"
      var data = [
                   {letter: "rounds" + " " + response.rounds, frequency: response.rounds},
                   {letter: "wars" + " " + response.wars, frequency: response.wars},
                   {letter: "double wars" + " " + response.doubleWars, frequency: response.doubleWars}
                   ];
      var data1 = [
                   {letter: "longest round" + " " + response.longestRound, frequency: response.longestRound},
                   {letter: "shortest round" + " " + response.shortestRound, frequency: response.shortestRound},
                   ];
      var data2 = [
                   {letter: '0-4 Aces' + " " + response.aces[0].total, frequency: response.aces[0].total},
                   {letter: '1-3 Aces' + " " + response.aces[1].total, frequency: response.aces[1].total},
                   {letter: '2-2 Aces' + " " + (response.aces[2].total/2), frequency: (response.aces[2].total/2)},
                  ];
      //Bar Graph 1

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 500 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10);

      var svg = d3.select(".graph").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(data.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data, function(d) { return Number(d.frequency); })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Total");

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.letter); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.frequency); })
          .attr("height", function(d) { return height - y(d.frequency); });

      // bar graph 2

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 400 - margin.left - margin.right,
          height = 200 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10);

      var svg = d3.select(".graph1").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(data1.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data1, function(d) { return Number(d.frequency); })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Total");

      svg.selectAll(".bar")
          .data(data1)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.letter); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.frequency); })
          .attr("height", function(d) { return height - y(d.frequency); });

      // bar graph 3

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 400 - margin.left - margin.right,
          height = 200 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10);

      var svg = d3.select(".graph2").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(data2.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data2, function(d) { return Number(d.frequency); })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Total");

      svg.selectAll(".bar")
          .data(data2)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.letter); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.frequency); })
          .attr("height", function(d) { return height - y(d.frequency); });

      function type(d) {
        d.frequency = +d.frequency;
        return d;
      }

      loadLiquidFillGauge("zeroGauge", response.aces[0].won);
      loadLiquidFillGauge("oneGauge", response.aces[1].won);
      loadLiquidFillGauge("twoGauge", response.aces[2].won);
      loadLiquidFillGauge("threeGauge", response.aces[3].won);
      loadLiquidFillGauge("fourGauge", response.aces[4].won);
    })
    xhr.send();
    e.preventDefault();
  });
}
