var TitleScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new TitleSceneLayer();
        this.addChild(layer);
    }
});

var TitleSceneLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var winSize = cc.director.getWinSize();

        // 背景の追加
        var background = new cc.Sprite(res.titleBackground);
        background.setPosition(cc.p(winSize.width / 2.0, winSize.height / 2.0));
        this.addChild(background);

        // ロゴの追加
        var logo = new cc.Sprite(res.titleLogo);
        logo.setPosition(cc.p(winSize.width / 2.0, winSize.height - 150));
        this.addChild(logo);

        // Touch to Startの追加
        var touchToStart = new cc.Sprite(res.titleStart);
        touchToStart.setPosition(cc.p(winSize.width / 2.0, 90));
        // 点滅させるアクションの定義
        var blink = cc.sequence(cc.fadeTo(0.5, 127),
                                cc.fadeTo(0.5, 255));
        touchToStart.runAction(cc.repeatForever(blink));
        this.addChild(touchToStart);

        // 画面をタッチしたときにメイン画面へ遷移
        var listener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                cc.audioEngine.playEffect(res.decideEffect);
                // 何度も押せないように一度押したらアクションを無効化する
                cc.eventManager.removeListener(listener);
                // 0.5秒待ってからcallFuncを呼ぶ
                var delay = cc.delayTime(0.5);
                // ゲームを始めるアクション
                var startGame = cc.callFunc(function() {
                    var scene = new MainScene();
                    var transition = new cc.TransitionPageTurn(0.5, scene, true);
                    cc.director.runScene(transition);
                }, this);
                this.runAction(cc.sequence(delay,
                                           startGame));
                return true;
            }.bind(this),
        }, this);
    },

    onEnterTransitionDidFinish: function() {
        this._super();
        cc.audioEngine.playMusic(res.titleMusic, true);
    }
});
