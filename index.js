'use strict';

const $images = document.getElementsByClassName('foo');
const $names = document.getElementsByClassName('bar');
const $btnName = document.getElementById('btn_name');
const $number = document.getElementById('number');

let imageNum = $images.length;
let set = true;
let old_randoms = [null, null];
let datums = [null, null];

function button() {
  if (set === false) {
    $btnName.textContent = "質問";

    for (let i = 0; i < imageNum; i++) {
      // ランダム
      let ret = rand_img(old_randoms[i], i);

      old_randoms[i] = ret.random;
      datums[i] = ret.datum;
    }
    set = true;
  } else {
    $btnName.textContent = "結果";

    for (let i = 0; i < imageNum; i++) {
      let name = '<ruby>' + datums[i].name + '<rt>' + datums[i].ruby + '</rt></ruby>';
      $names[i].innerHTML = name;
    }
    set = false;
  }
}

function start() {
  $btnName.textContent = "質問";

  for (let i = 0; i < imageNum; i++) {
    let ret = rand_img(old_randoms[i], i);
    old_randoms[i] = ret.random;
    datums[i] = ret.datum;
  }
}

// img_dataは、data.js
let data = Array.from(img_data); // Shallow Copy

function text1(x) {
  if ($names[x].textContent.length > 0 && 
      !$names[x].textContent.endsWith("◦") &&
      !$names[x].textContent.endsWith("〇")) {
    return;
  }

  let orgText = datums[x].ruby;
  if (orgText == 0) {
    orgText = datums[x].name;
  }

  let text = '<ruby>';
  for (let i = 0; i < orgText.length; i++) {
    let c = orgText.charAt(i);
    if (i == 0) {
      /* noop */
    } else {
      if (c == "・" || c == "ー" || c == "（" || c == "）") {
        console.log("c=", c);
        /* noop */
      } else if (orgText.charAt(i - 1) == "・" ||
                 orgText.charAt(i - 1) == "（") {
        console.log("c=", c);
        /* noop */
      } else {
        if ([
          "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "っ", "ゃ", "ゅ", "ょ",
          "ァ", "ィ", "ゥ", "ェ", "ォ", "ッ", "ャ", "ュ", "ョ",
        ].some((x) => x == c)) {
          c = "◦"; // 小さい円がわからん。。。
        } else {
          c = '〇';
        }
      }
    }
    text += c;
  }
  text += '<rt></rt></ruby>';

  $names[x].innerHTML = text;
}

// ランダム
function rand_img(old_random, i) {
  let random = null;

  do {
    random = Math.floor(Math.random() * data.length);
    // 前回のランダム値が同一であれば、再度、ランダムする
  } while (data.length > 1 && random == old_random);

  $number.textContent = (img_data.length - data.length + 1)
                        + ' / ' + img_data.length;

  // ランダムのデータを抜く
  let [datum] = data.splice(random, 1);
  if (data.length === 0) {
    // データが全て削除していた場合、最初に戻す
    data = Array.from(img_data);
  }

  $images[i].src = './img/' + datum.id + '.jpg'

  $names[i].innerHTML = '<ruby><rt></rt></ruby>';

  //$images[i].ii_id = datum.id;
  //$images[i].ii_length = data.length;
  //$images[i].ii_random = random;
  $images[i].addEventListener('load', (e) => {
    const img = e.srcElement;
    //console.log(`id=${img.ii_id} / random=${img.ii_random} / max=${img.ii_length} / size=${img.naturalWidth}:${img.naturalHeight}`);
  });

  return {
    datum,
    random,
  };
}

start();
