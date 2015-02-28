// http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Layer.html
var MainSceneLayer = cc.Layer.extend({
    player_: null,
    fruits_: [],

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
        // cocos2d-js では Vec2 はみつからず，cc.p という名前に統一しているようだ．
        //
        // new cc.Point は
        // http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Point.html#constructor
        // > please do not use its constructor to create points
        // なので使わないこと．
        background.setPosition(cc.p(size.width / 2.0, size.height / 2.0));
        // 親ノードにスプライトを追加する
        this.addChild(background);

        this.player_ = new cc.Sprite(res.player); // Sprite を生成して player_ に格納
        this.player_.setPosition(cc.p(size.width / 2.0, size.height - 445)); // player_ の位置を設定
        this.addChild(this.player_); // シーンに player_ を配置

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                // タッチされたときの処理
                return true;
            }.bind(this),
            onTouchMoved: function(touch, event) {
                // タッチ中に動いたときの処理
                // touch には Touch オブジェクトが渡されてくる
                // http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Touch.html

                // 前回とのタッチ位置との差をベクトルで取得する
                var delta = touch.getDelta();

                // 現在のかわずたんの座標を取得する
                var position = this.player_.getPosition();

                // 現在座標 + 移動量を新たな座標にする
                var newPosition = cc.pAdd(position, delta);

                var winSize = cc.director.getWinSize();

                this.player_.setPosition(cc.pClamp(newPosition, cc.p(0, position.y), cc.p(winSize.width, position.y)));
            }.bind(this)
        }, this);
    },

    addFruit: function() {
        // 画面サイズを取り出す
        var winSize = cc.director.getWinSize();


        // フルーツの種類の数を上限としたランダムな整数を取得する
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        // の「min から max までの乱整数を返す関数」を参考にした
        var randomFruitNumber = Math.floor(cc.random0To1() * (MainSceneLayer.FruitType.length));
        // フルーツを作成する
        var fruitName = cc.formatStr("fruit%d", randomFruitNumber);
        var fruit = new cc.Sprite(res[fruitName]);
        fruit.setTag(randomFruitNumber); // フルーツの種類をタグとして指定する

        var fruitSize = fruit.getContentSize(); // フルーツのサイズを取り出す
        var fruitXPos = Math.floor(cc.random0To1() * (winSize.width)); // X軸のランダムな位置を選択する

        fruit.setPosition(cc.p(fruitXPos,
                               winSize.height - MainSceneLayer.FRUIT_TOP_MARGIN - fruitSize.height / 2.0));
        this.addChild(fruit);
        this.fruits_.push(fruit);

        return fruit;
    },

    removeFruit: function(fruit) {
        var removed = false;
        // fruits_にfruitが含まれているかを確認する
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        this.fruits_.forEach(function(element, index, array) {
            if(element === fruit) {
                // 親ノードから削除する
                fruit.removeFromParent();
                // 配列から削除する
                // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                array.splice(index, 1);
                removed = true;
                return;
            }
        });
        return removed;
    }
});
MainSceneLayer.FruitType = [
    "APPLE",
    "GRAPE",
    "ORANGE",
    "BANANA",
    "CHERRY"
];
// フルーツの画面上端からのマージン(px)
MainSceneLayer.FRUIT_TOP_MARGIN = 40;

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
