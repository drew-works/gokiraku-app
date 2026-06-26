const menuData = {
    // お好み焼き
    okonomi: [
        { id: 'o1', name: '紅しょうが天', price: 810 },
        { id: 'o2', name: '桜エビ天', price: 860 },
        { id: 'o3', name: '納豆天', price: 880 },
        { id: 'o4', name: 'ねねぎ天', price: 880 },
        { id: 'o5', name: '切イカ天', price: 920 },
        { id: 'o6', name: 'ツナ天', price: 920 },
        { id: 'o7', name: '豚天', price: 920 },
        { id: 'o8', name: 'ギョーザ天', price: 920 },
        { id: 'o9', name: '牛天 (和牛)', price: 990 },
        { id: 'o10', name: '三色天（桜エビ・切イカ・紅しょうが）', price: 990 },
        { id: 'o11', name: '長ネギ天 (ちぢみ風)', price: 990 },
        { id: 'o12', name: 'タコ天', price: 1020 },
        { id: 'o13', name: '生イカ天', price: 1020 },
        { id: 'o14', name: '生エビ天', price: 1020 },
        { id: 'o15', name: '豚ネギ天', price: 1020 },
        { id: 'o16', name: 'ピザ天', price: 1060 },
        { id: 'o17', name: 'カレー天', price: 1060 },
        { id: 'o18', name: '明太子天', price: 1160 },
        { id: 'o19', name: '豚キムチ天', price: 1180 },
        { id: 'o20', name: 'しらす梅天（しらす・梅・大葉・ネギ）', price: 1180 },
        { id: 'o21', name: 'モチチーズねぎ天', price: 1180 },
        { id: 'o22', name: 'カープ天 (広島風) ※キムチ 又は 切イカ', price: 1190 },
        { id: 'o23', name: 'カキ天 (冬限定)', price: 1200 },
        { id: 'o24', name: '豚チーズダブル天', price: 1240 },
        { id: 'o25', name: '牛スジ天', price: 1380 },
        { id: 'o26', name: 'MIX天（牛・豚・コーン）', price: 1560 },
        { id: 'o27', name: 'ごきらく天（タコ・イカ・あさり・エビ）', price: 1560 },
        { id: 'o28', name: 'シーフードピザ天', price: 1560 },
        { id: 'o29', name: 'スタミナ天 (大盛)（ニンニク・ニラ・牛・豚・切イカ・紅しょうが）', price: 1680 }
    ],

    // もんじゃ焼き
    monja: [
        { id: 'm1', name: '紅しょうがもんじゃ', price: 810 },
        { id: 'm2', name: 'ベビースターもんじゃ', price: 870 },
        { id: 'm3', name: '納豆もんじゃ', price: 880 },
        { id: 'm4', name: 'コーンもんじゃ', price: 880 },
        { id: 'm5', name: 'そばもんじゃ', price: 880 },
        { id: 'm6', name: '切イカもんじゃ', price: 920 },
        { id: 'm7', name: 'ツナもんじゃ', price: 920 },
        { id: 'm8', name: 'キムチもんじゃ', price: 920 },
        { id: 'm9', name: 'チーズもんじゃ', price: 920 },
        { id: 'm10', name: '生イカもんじゃ', price: 1020 },
        { id: 'm11', name: '生エビもんじゃ', price: 1020 },
        { id: 'm12', name: 'タコもんじゃ', price: 1020 },
        { id: 'm13', name: '塩辛もんじゃ', price: 1020 },
        { id: 'm14', name: 'もちチーズもんじゃ', price: 1050 },
        { id: 'm15', name: 'カレーもんじゃ', price: 1080 },
        { id: 'm16', name: 'ツナチーズもんじゃ', price: 1160 },
        { id: 'm17', name: '明太子もんじゃ', price: 1160 },
        { id: 'm18', name: '激辛もんじゃ', price: 1180 },
        { id: 'm19', name: 'カレーうどんもんじゃ', price: 1190 },
        { id: 'm20', name: 'もちチーズせんべいもんじゃ', price: 1190 },
        { id: 'm21', name: 'もち明太子もんじゃ', price: 1370 },
        { id: 'm22', name: 'イタリアンもんじゃ（トマト・バジル・チーズ・バター）', price: 1370 },
        { id: 'm23', name: '明太チーズもんじゃ', price: 1410 },
        { id: 'm24', name: 'MIXもんじゃ（豚・牛・コーン）', price: 1560 },
        { id: 'm25', name: 'ほうれん草もんじゃ（ベーコン・チーズ・バター）', price: 1580 },
        { id: 'm26', name: 'もち明太子チーズもんじゃ', price: 1580 },
        { id: 'm27', name: 'ごきらくもんじゃ（タコ・アサリ・切イカ・生イカ）', price: 1580 }
    ],

    // リゾットもんじゃ
    risottoMonja: [
        { id: 'r1', name: '海鮮リゾットもんじゃ（エビ・イカ・タコ・チーズ・バター・ライス）', price: 1760 },
        { id: 'r2', name: '地中海リゾットもんじゃ（トマト・ツナ・レモン・チーズ・バター・ライス）', price: 1760 },
        { id: 'r3', name: 'キノコとベーコンの白ワインリゾットもんじゃ', price: 1760 },
        { id: 'r4', name: 'グリーンカレーリゾットもんじゃ', price: 1760 },
        { id: 'r5', name: 'レッドカレーリゾットもんじゃ', price: 1760 }
    ],

    // 鉄板焼き
    teppan: [
        { id: 't1', name: 'アスパラバター', price: 590 },
        { id: 't2', name: 'エリンギガーリック', price: 650 },
        { id: 't3', name: 'さつまいもバター', price: 690 },
        { id: 't4', name: 'はんぺんバター', price: 810 },
        { id: 't5', name: 'イカゲソバター', price: 810 },
        { id: 't6', name: '野菜盛', price: 830 },
        { id: 't7', name: 'コーンじゃがバター', price: 850 },
        { id: 't8', name: 'ベーコンじゃがバター', price: 880 },
        { id: 't9', name: 'きのこバター', price: 920 },
        { id: 't10', name: 'はんぺんチーズ', price: 950 },
        { id: 't11', name: '鶏ももバター', price: 980 },
        { id: 't12', name: '鶏ももバターガーリック', price: 1080 },
        { id: 't13', name: '豚キムチ', price: 1080 },
        { id: 't14', name: '豚カルビ', price: 1080 },
        { id: 't15', name: '豚ロースバター', price: 1080 },
        { id: 't16', name: 'ごきらくウインナー', price: 1080 },
        { id: 't17', name: 'ごきらくチョリソー', price: 1080 },
        { id: 't18', name: '生イカバター', price: 1230 },
        { id: 't19', name: 'ホタテバター', price: 1230 },
        { id: 't20', name: '生かきバター (冬限定)', price: 1230 },
        { id: 't21', name: '特選和牛カルビ', price: 1360 },
        { id: 't22', name: '黒毛和牛ヒレステーキ', isCustomPrice: true, priceStr: '時価(店員にお尋ねください)' },
        { id: 't23', name: '黒毛和牛サーロインステーキ', isCustomPrice: true, priceStr: '時価(店員にお尋ねください)' }
    ],

    // タコ焼き
    takoyaki: [
        { id: 'tk1', name: 'タコ焼き', price: 990 },
        { id: 'tk2', name: 'チーズ焼き (エビ、チーズ)', price: 990 },
        { id: 'tk3', name: 'タコ餃子焼き', price: 1060 }
    ],

    // 焼きそば
    yakisoba: [
        { id: 'y1', name: '焼きそば', price: 980 },
        { id: 'y2', name: '焼きうどん', price: 980 },
        { id: 'y3', name: 'カレー焼きそば', price: 990 },
        { id: 'y4', name: 'ピリモツ焼きそば', price: 1280 },
        { id: 'y5', name: '海鮮焼きそば（エビ、タコ、イカ、豚肉）', price: 1560 },
        { id: 'y6', name: '海鮮塩焼きそば（塩だれ、エビ、イカ、タコ、豚肉、ネギ）', price: 1560 }
    ],

    // ごはん
    gohan: [
        { id: 'g1', name: 'ライス', price: 280 },
        { id: 'g2', name: 'キムチチャーハン', price: 960 },
        { id: 'g3', name: 'ガーリックチャーハン', price: 1010 },
        { id: 'g4', name: 'エビチャーハン (玉子付き)', price: 1090 },
        { id: 'g5', name: 'そばチャーハン', price: 1090 },
        { id: 'g6', name: '玉子', price: 100 },
        { id: 'g7', name: 'マヨネーズ', price: 100 }
    ],

    // おつまみ
    otsumami: [
        { id: 's1', name: 'お新香', price: 480 },
        { id: 's2', name: '板わさ', price: 480 },
        { id: 's3', name: 'もろきゅう', price: 490 },
        { id: 's4', name: 'イカ塩辛', price: 490 },
        { id: 's5', name: '梅タタキ', price: 490 },
        { id: 's6', name: 'もずく酢', price: 490 },
        { id: 's7', name: '冷奴', price: 530 },
        { id: 's8', name: 'しらすおろし', price: 530 },
        { id: 's9', name: '冷トマト', price: 530 },
        { id: 's10', name: 'ニンニクオイル', price: 530 },
        { id: 's11', name: '枝豆', price: 540 },
        { id: 's12', name: 'キムチ', price: 560 },
        { id: 's13', name: '牛すじ煮込', price: 650 },
        { id: 's14', name: 'ピリ辛もつ焼', price: 650 },
        { id: 's15', name: 'ナスとピーマンの辛味噌炒め', price: 660 },
        { id: 's16', name: 'チャンジャ', price: 660 },
        { id: 's17', name: 'タコチャンジャ', price: 670 },
        { id: 's18', name: 'エビマヨ', price: 680 },
        { id: 's19', name: 'タコキムチ', price: 680 },
        { id: 's20', name: 'エビのガーリック炒め', price: 690 },
        { id: 's21', name: '明太子', price: 710 },
        { id: 's22', name: '豆腐ツナ', price: 710 }
    ],

    // サラダ
    salad: [
        { id: 'sd1', name: '水菜とカリカリベーコンサラダ', price: 660 },
        { id: 'sd2', name: '大根サラダ', price: 720 },
        { id: 'sd3', name: 'ツナサラダ', price: 720 },
        { id: 'sd4', name: 'シーザーサラダ', price: 740 },
        { id: 'sd5', name: 'ほうれん草サラダ', price: 870 },
        { id: 'sd6', name: 'じゃこサラダ', price: 990 },
        { id: 'sd7', name: '豆腐とワカメサラダ', price: 990 },
        { id: 'sd8', name: '豚しゃぶサラダ', price: 1090 },
        { id: 'sd9', name: 'ごきらくサラダ（炒めたナス・ししとう・大和芋）', price: 1390 }
    ],

    // デザート
    dessert: [
        { id: 'z1', name: 'バニラアイス', price: 380 },
        { id: 'z2', name: 'チョコかけアイス', price: 410 },
        { id: 'z3', name: '黒みつアイス', price: 410 },
        { id: 'z4', name: 'あんみつ', price: 680 },
        { id: 'z5', name: 'クリームあんみつ', price: 860 },
        { id: 'z6', name: 'あんこ巻', price: 790 },
        { id: 'z7', name: '杏巻', price: 790 },
        { id: 'z8', name: 'チョコレート巻', price: 790 }
    ],

    // ★修正：アルコールのメイン画面には大カテゴリーだけを配置
    alcohol: [
        { id: 'cat_beer', name: 'ビール', price: 0 },
        { id: 'cat_binbeer', name: '瓶ビール', price: 0 },
        { id: 'cat_nonalc', name: 'ノンアルコールビール', price: 0 },
        { id: 'cat_sour', name: 'サワー・お茶ハイ', price: 0 },
        { id: 'cat_whiskey', name: 'ウイスキー・ハイボール', price: 0 },
        { id: 'cat_cocktail', name: 'カクテル・果実酒', price: 0 },
        { id: 'cat_wine', name: 'ワイン', price: 0 },
        { id: 'cat_sake', name: 'お酒 (日本酒)', price: 0 },
        { id: 'cat_shochu', name: '焼酎 (グラス)', price: 0 },
        { id: 'cat_bottle', name: '焼酎ボトル・マッコリボトル', price: 0 },
        { id: 'cat_makkoli', name: 'マッコリ', price: 0 },
        { id: 'cat_set', name: 'セット・その他', price: 0 }
    ],
    
    // ソフトドリンク
    softDrink: [
        { id: 'd1', name: 'ミネラルウォーター', price: 390 },
        { id: 'd2', name: 'コーヒー (アイス・ホット)', price: 390 },
        { id: 'd3', name: 'ウーロン茶', price: 390 },
        { id: 'd4', name: '玉露茶', price: 390 },
        { id: 'd5', name: 'ジャスミン茶', price: 390 },
        { id: 'd6', name: 'カルピス', price: 390 },
        { id: 'd7', name: 'ラムネ', price: 480 },
        { id: 'd8', name: '炭酸', price: 480 },
        { id: 'd9', name: 'バヤリースオレンジ (瓶)', price: 550 },
        { id: 'd10', name: 'ジンジャーエール (瓶)', price: 550 },
        { id: 'd11', name: 'こどもビール (瓶)', price: 560 },
        { id: 'd12', name: 'コーラ (瓶)', price: 600 },
        { id: 'd13', name: 'クリームソーダ', price: 590 }
    ],

    // トッピングメニュー
    topping: [
        { id: 'tp1', name: 'マヨネーズ', price: 100 },
        { id: 'tp2', name: 'バター (1ヶ)', price: 80 },
        { id: 'tp3', name: 'たまご', price: 100 },
        { id: 'tp4', name: 'もち', price: 150 },
        { id: 'tp5', name: '紅しょうが', price: 150 },
        { id: 'tp6', name: 'ニンニク', price: 150 },
        { id: 'tp7', name: 'カレー粉', price: 150 },
        { id: 'tp8', name: 'バジル', price: 150 },
        { id: 'tp9', name: '梅干し (1ヶ)', price: 160 },
        { id: 'tp10', name: '桜エビ', price: 250 },
        { id: 'tp11', name: '麺 (半分)', price: 250 },
        { id: 'tp12', name: '納豆', price: 250 },
        { id: 'tp13', name: 'あさり', price: 250 },
        { id: 'tp14', name: 'コーン', price: 250 },
        { id: 'tp15', name: 'ネギ', price: 250 },
        { id: 'tp16', name: '大葉', price: 250 },
        { id: 'tp17', name: '切イカ', price: 250 },
        { id: 'tp18', name: '豚', price: 250 },
        { id: 'tp19', name: 'ベビースター', price: 250 },
        { id: 'tp20', name: 'せんべい (1枚)', price: 260 },
        { id: 'tp21', name: 'ベーコン', price: 300 },
        { id: 'tp22', name: 'キムチ', price: 320 },
        { id: 'tp23', name: 'チーズ', price: 320 },
        { id: 'tp24', name: 'ツナ', price: 320 },
        { id: 'tp25', name: '生イカ', price: 380 },
        { id: 'tp26', name: 'タコ', price: 380 },
        { id: 'tp27', name: '塩辛', price: 380 },
        { id: 'tp28', name: 'エビ', price: 380 },
        { id: 'tp29', name: 'ホタテ', price: 380 },
        { id: 'tp30', name: 'トマト', price: 380 },
        { id: 'tp31', name: '明太子', price: 400 },
        { id: 'tp32', name: 'ホウレン草', price: 450 },
        { id: 'tp33', name: '麺 (1玉)', price: 500 },
        { id: 'tp34', name: 'コーンバター', price: 580 }
    ],

    // お好み焼き、もんじゃ限定でポップアップで開くトッピング
    popupTopping: [
        { id: 'tp4', name: 'もち', price: 150 },
        { id: 'tp5', name: '紅しょうが', price: 150 },
        { id: 'tp7', name: 'カレー', price: 150 },
        { id: 'tp8', name: 'バジル', price: 150 },
        { id: 'tp9', name: '梅干し (1ヶ)', price: 160 },
        { id: 'tp10', name: '桜エビ', price: 250 },
        { id: 'tp11', name: '麺 (半分)', price: 250 },
        { id: 'tp12', name: '納豆', price: 250 },
        { id: 'tp13', name: 'あさり', price: 250 },
        { id: 'tp14', name: 'コーン', price: 250 },
        { id: 'tp15', name: 'ネギ', price: 250 },
        { id: 'tp16', name: '大葉', price: 250 },
        { id: 'tp17', name: '切イカ', price: 250 },
        { id: 'tp18', name: '豚', price: 250 },
        { id: 'tp19', name: 'ベビースター', price: 250 },
        { id: 'tp20', name: 'せんべい (1枚)', price: 260 },
        { id: 'tp21', name: 'ベーコン', price: 300 },
        { id: 'tp22', name: 'キムチ', price: 320 },
        { id: 'tp23', name: 'チーズ', price: 320 },
        { id: 'tp24', name: 'ツナ', price: 320 },
        { id: 'tp25', name: '生イカ', price: 380 },
        { id: 'tp26', name: 'タコ', price: 380 },
        { id: 'tp27', name: '塩辛', price: 380 },
        { id: 'tp28', name: 'エビ', price: 380 },
        { id: 'tp29', name: 'ホタテ', price: 380 },
        { id: 'tp30', name: 'トマト', price: 380 },
        { id: 'tp31', name: '明太子', price: 400 },
        { id: 'tp32', name: 'ホウレン草', price: 450 },
        { id: 'tp33', name: '麺 (1玉)', price: 500 }
    ],
    // ★新しく追加：アルコールのプラスボタンを押したとき用の詳細データ
    drinkDetails: {
        cat_beer: [
            { id: 'alc1', name: '生ビール (グラス)', price: 600 },
            { id: 'alc2', name: '生ビール (中)', price: 760 }
        ],
        cat_binbeer: [
            { id: 'alc3', name: 'アサヒスーパードライ (中瓶)', price: 780 },
            { id: 'alc4', name: 'エビスビール (中瓶)', price: 810 },
            { id: 'alc5', name: 'サッポロ赤ラベル (中瓶)', price: 810 },
            { id: 'alc6', name: 'プレミアムモルツ (中瓶)', price: 830 }
        ],
        cat_nonalc: [
            { id: 'alc7', name: 'アサヒドライゼロ (ノンアルコール)', price: 620 }
        ],
        cat_sour: [
            { id: 'alc8', name: 'チューハイ', price: 670 },
            { id: 'alc9', name: 'ウメサワー', price: 670 },
            { id: 'alc10', name: 'レモンサワー', price: 670 },
            { id: 'alc11', name: '青リンゴサワー', price: 670 },
            { id: 'alc12', name: 'カルピスサワー', price: 670 },
            { id: 'alc13', name: 'ブルーサワー (カルピス＋青リンゴ)', price: 670 },
            { id: 'alc14', name: 'ライムサワー', price: 670 },
            { id: 'alc15', name: 'シークァーサーサワー', price: 670 },
            { id: 'alc16', name: '生レモンサワー', price: 680 },
            { id: 'alc17', name: '生オレンジサワー', price: 680 },
            { id: 'alc18', name: '生グレープフルーツサワー', price: 700 },
            { id: 'alc19', name: 'ラムネサワー', price: 730 },
            { id: 'alc20', name: 'クリームソーダハイ', price: 760 },
            { id: 'alc21', name: 'ウーロンハイ (いいちこ)', price: 720 },
            { id: 'alc22', name: '緑茶ハイ (いいちこ)', price: 720 },
            { id: 'alc23', name: 'ジャスミンハイ (いいちこ)', price: 720 }
        ],
        cat_whiskey: [
            { id: 'alc24', name: 'トリスハイボール', price: 560 },
            { id: 'alc25', name: 'ブラックニッカハイボール', price: 560 },
            { id: 'alc26', name: 'ジムビームハイボール', price: 620 },
            { id: 'alc27', name: '角ハイボール', price: 700 },
            { id: 'alc28', name: 'ターキー8年 (バーボン)', price: 740 },
            { id: 'alc29', name: 'コークハイ', price: 740 },
            { id: 'alc30', name: 'ジンジャーハイ', price: 740 },
            { id: 'alc31', name: 'サントリーリザーブ', price: 740 }
        ],
        cat_cocktail: [
            { id: 'alc32', name: '梅酒', price: 720 },
            { id: 'alc33', name: '杏ソーダ割', price: 670 },
            { id: 'alc34', name: '梅酒ソーダ割', price: 670 },
            { id: 'alc35', name: '桃ソーダ割', price: 670 },
            { id: 'alc36', name: 'ライチソーダ割', price: 670 },
            { id: 'alc37', name: 'ゆずレモンはちみつソーダ割', price: 670 },
            { id: 'alc38', name: 'ジントニック', price: 670 },
            { id: 'alc39', name: 'カシスソーダ', price: 670 },
            { id: 'alc40', name: 'カシスウーロン', price: 670 },
            { id: 'alc41', name: 'カシスオレンジ', price: 720 }
        ],
        cat_wine: [
            { id: 'alc42', name: 'グラスワイン (赤・白)', price: 650 },
            { id: 'alc43', name: 'チリ フランスワイン (赤・白) フルボトル', price: 3800 }
        ],
        cat_sake: [
            { id: 'alc44', name: '松竹梅 一合', price: 620 },
            { id: 'alc45', name: '松竹梅 二合', price: 1080 },
            { id: 'alc46', name: '菊水辛口 (冷酒)', price: 1120 }
        ],
        cat_shochu: [
            { id: 'alc47', name: '黒霧島 〈芋〉', price: 700 },
            { id: 'alc48', name: '白霧島 〈芋〉', price: 700 },
            { id: 'alc49', name: '黒伊佐錦 〈芋〉', price: 700 },
            { id: 'alc50', name: 'いいちこ 〈麦〉', price: 700 },
            { id: 'alc51', name: '二階堂 〈麦〉', price: 720 },
            { id: 'alc52', name: '赤霧島 〈芋〉', price: 760 },
            { id: 'alc53', name: '鍛高譚 〈しそ〉', price: 760 },
            { id: 'alc54', name: '琉球 〈泡盛新酒〉', price: 760 },
            { id: 'alc55', name: '瑞泉 〈泡盛古酒〉', price: 760 },
            { id: 'alc56', name: '奄美の杜 〈黒糖〉', price: 760 },
            { id: 'alc57', name: '吉四六 〈麦〉', price: 790 },
            { id: 'alc58', name: '大魔王 〈芋〉', price: 790 }
        ],
        cat_bottle: [
            { id: 'alc59', name: 'ジンロ ボトル', price: 3000 },
            { id: 'alc60', name: 'いいちこシルエット ボトル', price: 3900 },
            { id: 'alc61', name: '黒霧島 ボトル', price: 3900 },
            { id: 'alc62', name: '黒伊佐錦 900ml ボトル', price: 4700 },
            { id: 'alc63', name: '吉四六 瓶 ボトル', price: 4700 },
            { id: 'alc64', name: '吉四六 陶器 ボトル', price: 4800 },
            { id: 'alc65', name: 'マッコリ ボトル', price: 2600 }
        ],
        cat_makkoli: [
            { id: 'alc66', name: 'マッコリ グラス', price: 500 }
        ],
        cat_set: [
            { id: 'alc67', name: 'ロックセット', price: 250 },
            { id: 'alc68', name: 'お湯割セット', price: 250 },
            { id: 'alc69', name: 'ミネラルセット', price: 480 },
            { id: 'alc70', name: '炭酸セット', price: 580 },
            { id: 'alc71', name: 'ウーロンセット', price: 600 },
            { id: 'alc72', name: '緑茶セット', price: 600 },
            { id: 'alc73', name: 'ジャスミン茶セット', price: 600 },
            { id: 'alc74', name: '梅干し (1ヶ)', price: 160 },
            { id: 'alc75', name: '高級梅干し', price: 270 }
        ]
    }
};