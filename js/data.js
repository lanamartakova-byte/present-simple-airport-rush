(function () {
  'use strict';
  window.AirportRush = {
    data: {
      games: [
        { id: 'checkin', title: 'CHECK-IN', grammar: 'Affirmative' },
        { id: 'security', title: 'SECURITY', grammar: 'Negative' },
        { id: 'questions', title: 'FIND YOUR GATE', grammar: 'Questions' }
      ],
      checkinQuestions: [
        {
          "sentence": "My brother ___ at the airport.",
          "options": [
            "work",
            "works",
            "workes"
          ],
          "answer": "works"
        },
        {
          "sentence": "The café ___ at 6 a.m.",
          "options": [
            "open",
            "opens",
            "openes"
          ],
          "answer": "opens"
        },
        {
          "sentence": "She ___ to London every month.",
          "options": [
            "fly",
            "flies",
            "flys"
          ],
          "answer": "flies"
        },
        {
          "sentence": "Passengers usually ___ online.",
          "options": [
            "check in",
            "checks in",
            "check ins"
          ],
          "answer": "check in"
        },
        {
          "sentence": "The shuttle ___ every 20 minutes.",
          "options": [
            "leave",
            "leaves",
            "leafs"
          ],
          "answer": "leaves"
        },
        {
          "sentence": "He ___ two small bags.",
          "options": [
            "have",
            "has",
            "haves"
          ],
          "answer": "has"
        },
        {
          "sentence": "Anna ___ her passport in her handbag.",
          "options": [
            "carry",
            "carries",
            "carrys"
          ],
          "answer": "carries"
        },
        {
          "sentence": "This bus ___ at Terminal 1.",
          "options": [
            "stop",
            "stops",
            "stopes"
          ],
          "answer": "stops"
        },
        {
          "sentence": "Our flight ___ at 8:45.",
          "options": [
            "depart",
            "departs",
            "departes"
          ],
          "answer": "departs"
        },
        {
          "sentence": "The pilot ___ to the passengers before the flight.",
          "options": [
            "talk",
            "talks",
            "talkes"
          ],
          "answer": "talks"
        },
        {
          "sentence": "My parents ___ abroad twice a year.",
          "options": [
            "travel",
            "travels",
            "traveles"
          ],
          "answer": "travel"
        },
        {
          "sentence": "The plane ___ at 10:30.",
          "options": [
            "arrive",
            "arrives",
            "arrieves"
          ],
          "answer": "arrives"
        },
        {
          "sentence": "Jack usually ___ a window seat.",
          "options": [
            "choose",
            "chooses",
            "choises"
          ],
          "answer": "chooses"
        },
        {
          "sentence": "We always ___ our tickets online.",
          "options": [
            "buy",
            "buys",
            "buies"
          ],
          "answer": "buy"
        },
        {
          "sentence": "The information desk ___ at midnight.",
          "options": [
            "close",
            "closes",
            "closees"
          ],
          "answer": "closes"
        },
        {
          "sentence": "My wife ___ a small suitcase when she travels.",
          "options": [
            "take",
            "takes",
            "taks"
          ],
          "answer": "takes"
        },
        {
          "sentence": "They usually ___ at the airport two hours early.",
          "options": [
            "arrive",
            "arrives",
            "arrieves"
          ],
          "answer": "arrive"
        },
        {
          "sentence": "Sarah ___ her passport before every trip.",
          "options": [
            "check",
            "checks",
            "checkes"
          ],
          "answer": "checks"
        },
        {
          "sentence": "The airport bus ___ past our hotel.",
          "options": [
            "go",
            "goes",
            "gos"
          ],
          "answer": "goes"
        },
        {
          "sentence": "I always ___ my boarding pass on my phone.",
          "options": [
            "keep",
            "keeps",
            "keepes"
          ],
          "answer": "keep"
        }
      ],
      sounds: {
        music: 'assets/sounds/background_music.mp3',
        correct: 'assets/sounds/correct.wav',
        wrong: 'assets/sounds/wrong.wav',
        click: 'assets/sounds/click.wav',
        airport_ding: 'assets/sounds/airport_ding.wav',
        reward: 'assets/sounds/reward.wav',
        seatbelt: 'assets/sounds/seatbelt.wav',
        takeoff: 'assets/sounds/takeoff.wav'
      }
    }
  };
}());
