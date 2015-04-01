var res = {
    background: "res/images/background.png",
    titleBackground: "res/images/title_background.png",
    titleLogo: "res/images/title_logo.png",
    titleStart: "res/images/title_start.png",
    ready: "res/images/ready.png",
    start: "res/images/start.png",
    finish: "res/images/finish.png",
    player: "res/images/player.png",
    playerCrash: "res/images/player_crash.png",
    fruits: "res/images/fruits.png",
    replayButton: "res/images/replay_button.png",
    replayButtonPressed: "res/images/replay_button_pressed.png",
    titleButton: "res/images/title_button.png",
    titleButtonPressed: "res/images/title_button_pressed.png",
    mainMusic: "res/bgm/main.mp3",
    titleMusic: "res/bgm/title.mp3",
    catchFruitEffect: "res/se/catch_fruit.mp3",
    catchGoldenEffect: "res/se/catch_golden.mp3",
    catchBombEffect: "res/se/catch_bomb.mp3",
    crashEffect: "res/se/crash.mp3",
    decideEffect: "res/se/decide.mp3",
    startEffect: "res/se/start.mp3",
    finishEffect: "res/se/finish.mp3"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
