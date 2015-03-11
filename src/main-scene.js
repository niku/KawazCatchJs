// http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Layer.html
var MainSceneLayer = cc.Layer.extend({
    player_: null,
    fruits_: [],
    score_: 0,
    isCrash_: false,
    second_: null,
    state_: null,
    scoreLabel_: null,
    secondLabel_: null,

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
                if(!this.isCrash_) {
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
                }
            }.bind(this)
        }, this);

        // スコアラベルの追加
        this.scoreLabel_ = new cc.LabelTTF(cc.formatStr("%d", this.score_), "Times New Roman", 16);
        this.scoreLabel_.setPosition(cc.p(size.width / 2.0 * 1.5, size.height - 40));
        this.scoreLabel_.enableShadow(cc.color.BLACK, cc.size(0.5, 0.5), 3);
        // cocos2d-js v3.3 ではまだ利用できなかった
        // this.scoreLabel_.enableOutline(cc.color.BLACK, 1.5);
        this.addChild(this.scoreLabel_);

        // スコアヘッダーの追加
        var scoreLabelHeader = new cc.LabelTTF("SCORE", "Times New Roman", 16);
        scoreLabelHeader.setPosition(cc.p(size.width / 2.0 * 1.5, size.height - 20));
        scoreLabelHeader.enableShadow(cc.color.BLACK, cc.size(0.5, 0.5), 3);
        // cocos2d-js v3.3 ではまだ利用できなかった
        // scoreLabelHeader.enableOutline(cc.color.BLACK, 1.5);
        this.addChild(scoreLabelHeader);

        // タイマーラベルの追加
        this.second_ = MainSceneLayer.TIME_LIMIT_SECOND;
        var second =  Math.floor(this.second_);
        this.secondLabel_ = new cc.LabelTTF(cc.formatStr("%d", second), "Times New Roman", 16);
        this.secondLabel_.setPosition(cc.p(size.width / 2.0, size.height - 40));
        // cocos2d-js v3.3 ではまだ利用できなかった
        // this.secondLabel_.enableOutline(cc.color.BLACK, 1.5);
        this.secondLabel_.enableShadow(cc.color.BLACK, cc.size(0.5, 0.5), 3);
        this.addChild(this.secondLabel_);

        // タイマーヘッダーの追加
        var secondLabelHeader = new cc.LabelTTF("TIME", "Times New Roman", 16);
        secondLabelHeader.setPosition(cc.p(size.width / 2.0, size.height - 20));
        secondLabelHeader.enableShadow(cc.color.BLACK, cc.size(0.5, 0.5), 3);
        // cocos2d-js v3.3 ではまだ利用できなかった
        // secondLabelHeader.enableOutline(cc.color.BLACK, 1.5);
        this.addChild(secondLabelHeader);

        // ゲーム状態を初期化する
        this.state_ = MainSceneLayer.GameState["PLAING"];

        // updateを毎フレーム実行するように登録する
        this.scheduleUpdate();
    },

    update: function(dt) {
        if (this.state_ === MainSceneLayer.GameState["PLAING"]) { // プレイ中のとき

            // 毎フレーム実行される
            var random = Math.floor(cc.random0To1() * (MainSceneLayer.FRUIT_SPAWN_RATE));
            if(random === 0) {
                this.addFruit();
            }

            this.fruits_.forEach(function(element, index, array) {
                var busketPosition = cc.pAdd(this.player_.getPosition(), cc.p(0, -10));
                var boundingBox = element.getBoundingBox(); // フルーツの矩形を取り出す
                var isHit = cc.rectContainsPoint(boundingBox, busketPosition);
                if (isHit) {
                    this.catchFruit(element);
                }
            }, this);

            // 残り秒数を減らす
            this.second_ -= dt;
            // int 型にする
            // JavaScript で小数点の整数部のみ利用するのに一番速い方法はビット演算を使う ( | 0 をつける ) こと
            // http://stackoverflow.com/questions/596467/how-do-i-convert-a-float-to-a-whole-number-in-javascript
            // Math.floor だと -0.1 が -1 になってしまう．
            // ここでは -0.1 は 0 になってほしい．
            var second =  this.second_ | 0;
            this.secondLabel_.setString(cc.formatStr("%d", second));

            if(this.second_ < 0) {
                // リザルト状態へ移行
                this.state_ = MainSceneLayer.GameState["RESULT"];
                this.onResult();
            }
        }
    },

    // http://www.cocos2d-x.org/reference/html5-js/V3.2/symbols/cc.Node.html#onEnterTransitionDidFinish
    onEnterTransitionDidFinish: function() {
        this._super();
        cc.audioEngine.playMusic(res.mainMusic, true);
    },

    addFruit: function() {
        // 画面サイズを取り出す
        var winSize = cc.director.getWinSize();


        // フルーツの種類の数を上限としたランダムな整数を取得する
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        // の「min から max までの乱整数を返す関数」を参考にした
        var randomFruitNumber = Math.floor(cc.random0To1() * (MainSceneLayer.FruitType.length));
        // フルーツを作成する
        var fruit = new cc.Sprite(res.fruits[randomFruitNumber]);
        fruit.setTag(randomFruitNumber); // フルーツの種類をタグとして指定する

        var fruitSize = fruit.getContentSize(); // フルーツのサイズを取り出す
        var fruitXPos = Math.floor(cc.random0To1() * (winSize.width)); // X軸のランダムな位置を選択する

        fruit.setPosition(cc.p(fruitXPos,
                               winSize.height - MainSceneLayer.FRUIT_TOP_MARGIN - fruitSize.height / 2.0));
        this.addChild(fruit);
        this.fruits_.push(fruit);

        // 地面の座標
        var ground = cc.p(fruitXPos, 0);
        // 3秒かけてgroundの位置まで落下させるアクション
        var fall = cc.moveTo(3, ground);
        // removeFruitを即座に呼び出すアクション
        var remove = cc.callFunc(this.removeFruit, this, fruit);
        // fallとremoveを連続して実行させるアクション
        var sequence = cc.sequence(fall, remove);
        fruit.runAction(sequence);

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
    },

    catchFruit: function(fruit) {
        var fruitType = fruit.getTag();
        switch(MainSceneLayer.FruitType[fruitType]) {
        case "GOLDEN":
            this.score_ += MainSceneLayer.GOLDEN_FRUIT_SCORE;
            cc.audioEngine.playEffect(res.catchGoldenEffect, false);
            break;
        default:
            this.score_ += 1;
            cc.audioEngine.playEffect(res.catchFruitEffect, false);
        }
        this.removeFruit(fruit);
        this.scoreLabel_.setString(cc.formatStr("%d", this.score_));
    },

    onCatchBomb: function() {
        // クラッシュ状態にする
        this.isCrash_ = true;

        // アニメーションの作成
        var frames = [];
        var playerSize = this.player_.getContentSize();
        var animationFrameCount = 3; // アニメーションのフレーム数
        // アニメ用のフレームを読み込む
        for(i=0; i<animationFrameCount; ++i) {
            var rect = cc.rect(playerSize.width * i, 0, playerSize.width, playerSize.height);
            var frame = new cc.SpriteFrame(res.playerCrash, rect);
            frames.push(frame);
        }

        // アニメーションを作成する
        var animation = new cc.Animation(frames, 10.0 / 60.0);
        animation.setLoops(3); // 3回繰り返して再生する
        animation.setRestoreOriginalFrame(true);
        this.player_.runAction(cc.sequence(cc.animate(animation),
                                           cc.callFunc(function() {
                                               this.isCrash_ = false;
                                           }, this)));
        this.score_ = Math.max(0, this.score_ - MainSceneLayer.BOMB_PENALTY_SCORE); // 4点引いて0点未満になったら0点にする
        cc.audioEngine.playEffect(res.crashEffect);
    },

    onResult: function() {
        this.state_ = MainSceneLayer.GameState["RESULT"];
        var winSize = cc.director.getWinSize();

        // 「もう一度遊ぶ」ボタン
        var replayButton = new cc.MenuItemImage(res.replayButton,
                                                res.replayButtonPressed,
                                                function() {
                                                    var scene = new MainScene();
                                                    var transition = new cc.TransitionFade(0.5, scene);
                                                    cc.director.runScene(transition);
                                                    cc.audioEngine.playEffect(res.decideEffect, false);
                                                });

        // 「タイトルへ戻る」ボタン
        var titleButton = new cc.MenuItemImage(res.titleButton,
                                               res.titleButtonPressed,
                                               function() {
                                                   // 「タイトルへ戻る」ボタンを押したときの処理
                                                   cc.audioEngine.playEffect(res.decideEffect, false);
                                               });

        // 2つのボタンからメニューを作成する
        var menu = new cc.Menu(replayButton, titleButton);
        // ボタンを縦に並べる
        menu.alignItemsVerticallyWithPadding(15); // ボタンを縦に並べる
        menu.setPosition(cc.p(winSize.width / 2.0, winSize.height / 2.0));
        this.addChild(menu);
    },
});
MainSceneLayer.FruitType = [
    "APPLE",
    "GRAPE",
    "ORANGE",
    "BANANA",
    "CHERRY",
    "GOLDEN",
    "BOMB"
];
// 黄金のフルーツを取ったときの点数
MainSceneLayer.GOLDEN_FRUIT_SCORE = 5;
/// 爆弾を取ったときのマイナス点
MainSceneLayer.BOMB_PENALTY_SCORE = 4;
// フルーツの画面上端からのマージン(px)
MainSceneLayer.FRUIT_TOP_MARGIN = 40;
// フルーツの出現率
MainSceneLayer.FRUIT_SPAWN_RATE = 20;
// 制限時間
MainSceneLayer.TIME_LIMIT_SECOND = 60.0;
// ゲームの状態を表す
MainSceneLayer.GameState = {
    "PLAYING": 0,
    "RESULT":  1
};

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
