/*
 * Super Rex 英文：動物表（Yorkland Tutorial 工作紙）
 * - word：英文字（字母要喺 fonts/andika-subset.woff2 入面）
 * - sound：動物叫聲
 * - legs：幾多隻腳（0 = 唔參加數腳）
 * 亦會被 sw.js importScripts，所以用 `self`。
 */
(function (root) {
  root.ANIMAL_UNIT = {
    id: 'animals',
    title: 'Animals',
    animals: [
      { id: 'dog',  word: 'dog',  sound: 'Woof woof!',   legs: 4 },
      { id: 'cat',  word: 'cat',  sound: 'Meow!',        legs: 4 },
      { id: 'cow',  word: 'cow',  sound: 'Moo!',         legs: 4 },
      { id: 'pig',  word: 'pig',  sound: 'Oink oink!',   legs: 4 },
      { id: 'frog', word: 'frog', sound: 'Ribbit!',      legs: 4 },
      { id: 'duck', word: 'duck', sound: 'Quack quack!', legs: 2 },
      { id: 'hen',  word: 'hen',  sound: 'Cluck cluck!', legs: 2 },
      { id: 'fish', word: 'fish', sound: 'Blub blub!',   legs: 0 }
    ]
  };
})(typeof self !== 'undefined' ? self : this);
