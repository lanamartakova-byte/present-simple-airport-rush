(function (app) {
  'use strict';
  app.data.gateQuestions = [
  {
    "type": "type",
    "situation": "You need to get to Terminal 2. Ask for help.",
    "answer": "Does this bus go to Terminal 2?",
    "prompt": "(this bus / go / to Terminal 2)"
  },
  {
    "type": "build",
    "situation": "You want to pay by card. Ask.",
    "answer": "Do you accept cards?",
    "cards": [
      "Do",
      "you",
      "accept",
      "cards",
      "?"
    ]
  },
  {
    "type": "type",
    "situation": "You are on the way to the shuttle.",
    "answer": "Does the shuttle leave from here?",
    "prompt": "(from here / leave / the shuttle)"
  },
  {
    "type": "choose",
    "situation": "Choose the correct question.",
    "answer": "Where does the shuttle stop?",
    "choices": [
      "Where the shuttle stops?",
      "Where does the shuttle stop?",
      "Where does the shuttle stops?"
    ]
  },
  {
    "type": "build",
    "situation": "Build the question.",
    "answer": "How often does the shuttle run?",
    "cards": [
      "the shuttle",
      "How often",
      "run",
      "does",
      "?"
    ]
  },
  {
    "type": "choose",
    "situation": "Choose the correct question about the shuttle.",
    "answer": "Does the shuttle go to the plane?",
    "choices": [
      "Does the shuttle goes to the plane?",
      "Do the shuttle go to the plane?",
      "Does the shuttle go to the plane?"
    ]
  },
  {
    "type": "type",
    "situation": "Make a question.",
    "answer": "How long does the journey take?",
    "prompt": "(take / how long / the journey)"
  },
  {
    "type": "build",
    "situation": "Build the question.",
    "answer": "Does the bus stop near the plane?",
    "cards": [
      "near the plane",
      "Does",
      "stop",
      "the bus",
      "?"
    ]
  },
  {
    "type": "choose",
    "situation": "Choose the correct question.",
    "answer": "Which plane does the shuttle go to?",
    "choices": [
      "Which plane does the shuttle go to?",
      "Which plane the shuttle goes to?",
      "Which plane does the shuttle goes to?"
    ]
  },
  {
    "type": "type",
    "situation": "Make a question.",
    "answer": "Does the plane wait for the passengers?",
    "prompt": "(for the passengers / wait / the plane)"
  },
  {
    "type": "build",
    "situation": "Build the question.",
    "answer": "Where does boarding start?",
    "cards": [
      "boarding",
      "Where",
      "start",
      "does",
      "?"
    ]
  },
  {
    "type": "type",
  "situation": "Make a question.",
  "answer": "Where do I show my ticket?",
  "prompt": "(my ticket / where / show / I / do)"
  },
  {
    "type": "choose",
    "situation": "Choose the correct question.",
    "answer": "Do passengers board here?",
    "choices": [
      "Does passengers board here?",
      "Do passengers boards here?",
      "Do passengers board here?"
    ]
  },
  {
    "type": "fix",
    "situation": "",
    "answer": "What time this flight leaves?",
    "prompt": "What time does this flight leave?"
  },
  {
    "type": "type",
    "situation": "One last question!",
    "answer": "Do I need to show my boarding pass?",
    "prompt": "(my boarding pass / I / need / to show)"
  }
];
}(window.AirportRush));
