// http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Layer.html
var MainSceneLayer = cc.Layer.extend({
    player_: null,

    // http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Layer.html#ctor
    ctor: function() {
        this._super();
        // director を指定する．
        // http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Director.html#constructor
        // > ATTENTION: USE cc.director INSTEAD OF cc.Director.
        // とあるように，cocos2d-js では cc.Director ではなく cc.director を利用する．
        // 直接シングルトンオブジェクトを指定しているため getInstance() は必要ない．
        var director = cc.director;
        // 画面サイズを取り出す
        var size = director.getWinSize();
        // 背景のスプライトを生成する
        // cocos2d-js では，読み込まれていないリソースを利用するのを防止するため，
        // スプライトにファイル名を直接指定せず
        // resource.js で指定したオブジェクト res.xxx を経由してファイル名を取得するのが行儀がよさそうだ．
        var background = new cc.Sprite(res.background);
        // スプライトの表示位置を設定する
        // cocos2d-x の Vec2 は別名 Point という (cocos2d-x 本の「3.4.4 ノードの位置の移動」参照)
        // cocos2d-js では Vec2 はみつからず，Point という名前に統一しているようだ．
        background.setPosition(new cc.Point(size.width / 2.0, size.height / 2.0));
        // 親ノードにスプライトを追加する
        this.addChild(background);

        this.player_ = new cc.Sprite(res.player); // Sprite を生成して player_ に格納
        this.player_.setPosition(new cc.Point(size.width / 2.0, size.height - 445)); // player_ の位置を設定
        this.addChild(this.player_); // シーンに player_ を配置

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                // タッチされたときの処理
                return true;
            },
            onTouchMoved: function(touch, event) {
                // タッチ中に動いたときの処理
                // touch には Touch オブジェクトが渡されてくる
                // http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Touch.html
                cc.log("Touch at (%f, %f)", touch.getLocationX(), touch.getLocationY());
            }
        }, this);
    }
});

// http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Scene.html
var MainScene = cc.Scene.extend({
    // http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Node.html#onEnter
    onEnter:function () {
        // API リファレンスに書いてある通り，
        // onEnter の中では必ず this._super() を呼ばなくてはならない．
        this._super();
        var layer = new MainSceneLayer();
        this.addChild(layer);
    }
});
