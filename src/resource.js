var res = {
    background: "res/images/background.png",
    player: "res/images/player.png",
    fruits: [
        "res/images/fruit0.png",
        "res/images/fruit1.png",
        "res/images/fruit2.png",
        "res/images/fruit3.png",
        "res/images/fruit4.png"
    ]
};

var g_resources = [];
for (var i in res) {
    if(res[i].constructor === Array) {
        for(var j in res[i]) {
            g_resources.push(res[i][j]);
        }
    } else {
        g_resources.push(res[i]);
    }
}
