/*
 * @?: *********************************************************************
 * @Author: Weidows
 * @Date: 2021-06-19 17:19:51
 * @LastEditors: Weidows
 * @LastEditTime: 2021-06-19 21:51:29
 * @FilePath: \UI-assignment\src\main\webapp\js\2.js
 * @Description:
 * @!: *********************************************************************
 */

// APlayer
const ap = new APlayer({
  container: document.getElementById("aplayer"),
  autoplay: false,
  theme: "#FADFA3",
  loop: "all",
  audio: [
    {
      name: "In Love",
      artist: "July",
      url: "resources/July - In Love.mp3",
    },
    {
      name: "《蝶语》",
      artist: "MT1990",
      url: "resources/MT1990 - 《蝶语》.mp3",
    },
    {
      name: "Asphyxia",
      artist: "NSZX",
      url: "resources/NSZX - Asphyxia.mp3",
    },
  ],
});

// 日历
// 1.为了获得每个月的日期有多少，我们需要判断 平年闰年[四年一闰，百年不闰，四百年再闰]
const isLeapYear = (year) => {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
};
// 2.获得每个月的日期有多少，注意 month - [0-11]
const getMonthCount = (year, month) => {
  let arr = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let count = arr[month] || (isLeapYear(year) ? 29 : 28);
  return Array.from(new Array(count), (item, value) => value + 1);
};
// 3.获得某年某月的 1号 是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
const getWeekday = (year, month) => {
  let date = new Date(year, month, 1);
  return date.getDay();
};
// 4.获得上个月的天数
const getPreMonthCount = (year, month) => {
  if (month === 0) {
    return getMonthCount(year - 1, 11);
  } else {
    return getMonthCount(year, month - 1);
  }
};
// 5.获得下个月的天数
const getNextMonthCount = (year, month) => {
  if (month === 11) {
    return getMonthCount(year + 1, 0);
  } else {
    return getMonthCount(year, month + 1);
  }
};
// 工具方法 - end
let weekStr = "日一二三四五六";
weekArr = weekStr.split("").map((item) => "星期" + item);
// 插入星期 dom
let weekDomStr = "";
let oFragWeek = document.createDocumentFragment();
weekArr.forEach((item) => {
  let oSpan = document.createElement("span");
  let oText = document.createTextNode(item);
  oSpan.appendChild(oText);
  oSpan.classList.add("week-item");
  oFragWeek.appendChild(oSpan);
});
let weekWrap = document.getElementById("weekLine");
weekWrap.appendChild(oFragWeek);

// 这里获得第一次的 数据 数组
const updateCalendar = (year, month, day) => {
  if (
    typeof year === "undefined" &&
    typeof month === "undefined" &&
    typeof day === "undefined"
  ) {
    let nowDate = new Date();
    year = nowDate.getFullYear();
    month = nowDate.getMonth();
    day = nowDate.getDate();
  }
  // 更新一下顶部的年月显示
  document.getElementById("nowYear").innerHTML = year;
  document.getElementById("nowMonth").innerHTML = month + 1;
  document.getElementById("nowDate").innerHTML = day;
  // 生成日历数据，上个月剩下的的 x 天 + 当月的 28（平年的2月）或者29（闰年的2月）或者30或者31天 + 下个月的 y 天 = 42
  let res = [];
  let currentMonth = getMonthCount(year, month);
  let preMonth = getPreMonthCount(year, month);
  let nextMonth = getNextMonthCount(year, month);
  let whereMonday = getWeekday(year, month);
  if (whereMonday === 0) {
    whereMonday = 7;
  }
  // 这里当 whereMonday 为 0 的时候会截取上月的所有数据
  let preArr = preMonth.slice(-1 * whereMonday);
  let nextArr = nextMonth.slice(0, 42 - currentMonth.length - whereMonday);
  res = [].concat(preArr, currentMonth, nextArr);
  // 更新 dom 的信息的问题
  let hadDom = document.getElementsByClassName("date-item");
  if (hadDom && hadDom.length) {
    let domArr = document.getElementsByClassName("date-item");
    for (let i = 0; i < domArr.length; i++) {
      domArr[i].innerHTML = res.shift();
    }
  } else {
    // 如果之前没有结构的话
    let str = "";
    for (let i = 0; i < 5; i++) {
      str += '<div class="date-line">';
      for (let j = 0; j < 7; j++) {
        str += `<span class='date-item'>${res.shift()}</span>`;
        if (j === 6) {
          str += "</div>";
        }
      }
    }
    document.getElementById("dateWrap").innerHTML = str;
  }
};

updateCalendar();
// 添加上一月，下一月事件
let oPreButton = document.getElementById("preMonth");
let oNextButton = document.getElementById("nextMonth");
oPreButton.addEventListener("click", function () {
  let currentYear = +document.getElementById("nowYear").textContent;
  let currentMonth = +document.getElementById("nowMonth").textContent - 1;
  let currentDate = +document.getElementById("nowDate").textContent;
  if (currentMonth === 0) {
    updateCalendar(currentYear - 1, 11, currentDate);
  } else {
    updateCalendar(currentYear, currentMonth - 1, currentDate);
  }
});
oNextButton.addEventListener("click", function () {
  let currentYear = +document.getElementById("nowYear").textContent;
  let currentMonth = +document.getElementById("nowMonth").textContent - 1;
  let currentDate = +document.getElementById("nowDate").textContent;
  if (currentMonth === 11) {
    updateCalendar(currentYear + 1, 0, currentDate);
  } else {
    updateCalendar(currentYear, currentMonth + 1, currentDate);
  }
});

// 时钟
var canvas = document.getElementById("clock");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var r = width / 2;
/*canvas绘制环境*/
function drawBackGround(ctx) {
  /*绘制圆框，60点，数字*/
  ctx.save();
  ctx.translate(r, r);
  ctx.beginPath();
  ctx.arc(0, 0, r - 5, 0, Math.PI * 2);
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();
  ctx.font = "18px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  var hoursNumber = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
  /*传入的number为数组值，i为数组索引*/
  hoursNumber.forEach(function (number, i) {
    var rad = ((2 * Math.PI) / 12) * i;
    var x = Math.cos(rad) * (r - 30);
    /*cos与sin传入的是弧度值，包括rotate也是弧度，但是css中为deg*/
    var y = Math.sin(rad) * (r - 30);
    ctx.fillText(number, x, y);
  });
  for (var i = 0; i < 60; i++) {
    var radDot = ((2 * Math.PI) / 60) * i;
    var x = Math.cos(radDot) * (r - 18);
    var y = Math.sin(radDot) * (r - 18);
    ctx.beginPath();
    /*必须在这里beginpath?   不然出现被灰圈遮住*/
    if (i % 5 === 0) {
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
    } else {
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "gray";
    }
    ctx.fill();
  }
}
function drawHour(hour, minnue) {
  ctx.save();
  ctx.beginPath();
  var rad = ((Math.PI * 2) / 12) * hour;
  var mrad = ((Math.PI * 2) / 12 / 60) * minnue;
  /*分针会导致时针的运动，需要加上分针引起的弧度，每分钟会导致时针变化的弧度*/
  ctx.rotate(rad + mrad);
  ctx.moveTo(0, 10);
  ctx.lineTo(0, -r + 48);
  ctx.lineCap = "round";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();
}
function drawMinute(minute) {
  ctx.save();
  ctx.beginPath();
  var rad = ((Math.PI * 2) / 60) * minute;
  ctx.rotate(rad);
  ctx.moveTo(0, 10);
  ctx.lineTo(0, -r + 36);
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}
function drawSecond(second) {
  ctx.save();
  ctx.beginPath();
  var rad = ((Math.PI * 2) / 60) * second;
  ctx.rotate(rad);
  ctx.moveTo(-2, 20);
  ctx.lineTo(2, 20);
  ctx.lineTo(1, -r + 40);
  ctx.lineTo(-1, -r + 40);
  ctx.fillStyle = "#c14543";
  ctx.fill();
  ctx.restore();
}
function drawDot() {
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  /*中间的白点*/
}
function draw() {
  ctx.clearRect(0, 0, width, height);
  /*每秒进行一次重绘*/
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  drawBackGround(ctx);
  drawHour(hour, minute);
  drawMinute(minute);
  drawSecond(second);
  drawDot();
  ctx.restore();
}
draw();
setInterval(draw, 1000);

// 时钟
function getLangDate() {
  var dateObj = new Date(); //表示当前系统时间的Date对象
  var year = dateObj.getFullYear(); //当前系统时间的完整年份值
  var month = dateObj.getMonth() + 1; //当前系统时间的月份值
  var date = dateObj.getDate(); //当前系统时间的月份中的日
  var day = dateObj.getDay(); //当前系统时间中的星期值
  const weeks = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  var week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
  var hour = dateObj.getHours(); //当前系统时间的小时值
  var minute = dateObj.getMinutes(); //当前系统时间的分钟值
  var second = dateObj.getSeconds(); //当前系统时间的秒钟值
  //当前时间属于上午、晚上还是下午
  var timeValue = "" + (hour >= 12 ? (hour >= 18 ? "晚上" : "下午") : "上午");

  var dateFilter = function (date) {
    //值小于10时，在前面补0
    if (date < 10) {
      return "0" + date;
    }
    return date;
  };

  newDate =
    dateFilter(year) +
    "-" +
    dateFilter(month) +
    "-" +
    dateFilter(date) +
    " " +
    dateFilter(hour) +
    ":" +
    dateFilter(minute) +
    ":" +
    dateFilter(second);
  document.getElementById("nowTime").innerHTML =
    "当前时间： " + newDate + "　" + week;
  setTimeout(getLangDate, 1000);
}
// 全局变量(循环时不被清除)
var newDate = "";
getLangDate();

// 狗屁生成器
let _hmt = window._hmt || [];
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-BM8WXEWW3P");

function track(eventName, title, seed) {
  gtag("event", eventName, {
    event_label: title,
    seed: seed,
    title_seed: title + "_" + seed,
  });
  _hmt.push(["_trackEvent", eventName, "title", title]);
  _hmt.push(["_trackEvent", eventName, "title_seed", title + "_" + seed]);
}

window.$ = function (selector) {
  return document.querySelector(selector);
};

function 获取网址参数(参数) {
  return new URL(window.location.href).searchParams.get(参数);
}

let 论述 = [
  "现在，解决主题的问题，是非常非常重要的。 所以， ",
  "我们不得不面对一个非常尴尬的事实，那就是， ",
  "主题的发生，到底需要如何做到，不主题的发生，又会如何产生。 ",
  "而这些并不是完全重要，更加重要的问题是， ",
  "主题，到底应该如何实现。 ",
  "带着这些问题，我们来审视一下主题。 ",
  "所谓主题，关键是主题需要如何写。 ",
  "我们一般认为，抓住了问题的关键，其他一切则会迎刃而解。 ",
  "问题的关键究竟为何？ ",
  "主题因何而发生？ ",
  "每个人都不得不面对这些问题。 在面对这种问题时， ",
  "一般来讲，我们都必须务必慎重的考虑考虑。 ",
  "要想清楚，主题，到底是一种怎么样的存在。 ",
  "了解清楚主题到底是一种怎么样的存在，是解决一切问题的关键。 ",
  "就我个人来说，主题对我的意义，不能不说非常重大。 ",
  "本人也是经过了深思熟虑，在每个日日夜夜思考这个问题。 ",
  "主题，发生了会如何，不发生又会如何。 ",
  "在这种困难的抉择下，本人思来想去，寝食难安。 ",
  "生活中，若主题出现了，我们就不得不考虑它出现了的事实。 ",
  "这种事实对本人来说意义重大，相信对这个世界也是有一定意义的。 ",
  "我们都知道，只要有意义，那么就必须慎重考虑。 ",
  "既然如此， ",
  "那么， ",
  "我认为， ",
  "一般来说， ",
  "总结的来说， ",
  "既然如何， ",
  "经过上述讨论， ",
  "这样看来， ",
  "从这个角度来看， ",
  "可是，即使是这样，主题的出现仍然代表了一定的意义。 ",
  "对我个人而言，主题不仅仅是一个重大的事件，还可能会改变我的人生。 ",
];

let 名人名言 = [
  "伏尔泰曾经说过，不经巨大的困难，不会有伟大的事业。这不禁令我深思",
  "富勒曾经说过，苦难磨炼一些人，也毁灭另一些人。这不禁令我深思",
  "文森特·皮尔曾经说过，改变你的想法，你就改变了自己的世界。这不禁令我深思",
  "拿破仑·希尔曾经说过，不要等待，时机永远不会恰到好处。这不禁令我深思",
  "塞涅卡曾经说过，生命如同寓言，其价值不在与长短，而在与内容。这不禁令我深思",
  "奥普拉·温弗瑞曾经说过，你相信什么，你就成为什么样的人。这不禁令我深思",
  "吕凯特曾经说过，生命不可能有两次，但许多人连一次也不善于度过。这不禁令我深思",
  "莎士比亚曾经说过，人的一生是短的，但如果卑劣地过这一生，就太长了。这不禁令我深思",
  "笛卡儿曾经说过，我的努力求学没有得到别的好处，只不过是愈来愈发觉自己的无知。这不禁令我深思",
  "左拉曾经说过，生活的道路一旦选定，就要勇敢地走到底，决不回头。这不禁令我深思",
  "米歇潘曾经说过，生命是一条艰险的峡谷，只有勇敢的人才能通过。这不禁令我深思",
  "吉姆·罗恩曾经说过，要么你主宰生活，要么你被生活主宰。这不禁令我深思",
  "日本谚语曾经说过，不幸可能成为通向幸福的桥梁。这不禁令我深思",
  "海贝尔曾经说过，人生就是学校。在那里，与其说好的教师是幸福，不如说好的教师是不幸。这不禁令我深思",
  "杰纳勒尔·乔治·S·巴顿曾经说过，接受挑战，就可以享受胜利的喜悦。这不禁令我深思",
  "德谟克利特曾经说过，节制使快乐增加并使享受加强。这不禁令我深思",
  "裴斯泰洛齐曾经说过，今天应做的事没有做，明天再早也是耽误了。这不禁令我深思",
  "歌德曾经说过，决定一个人的一生，以及整个命运的，只是一瞬之间。这不禁令我深思",
  "卡耐基曾经说过，一个不注意小事情的人，永远不会成就大事业。这不禁令我深思",
  "卢梭曾经说过，浪费时间是一桩大罪过。这不禁令我深思",
  "康德曾经说过，既然我已经踏上这条道路，那么，任何东西都不应妨碍我沿着这条路走下去。这不禁令我深思",
  "克劳斯·莫瑟爵士曾经说过，教育需要花费钱，而无知也是一样。这不禁令我深思",
  "伏尔泰曾经说过，坚持意志伟大的事业需要始终不渝的精神。这不禁令我深思",
  "亚伯拉罕·林肯曾经说过，你活了多少岁不算什么，重要的是你是如何度过这些岁月的。这不禁令我深思",
  "韩非曾经说过，内外相应，言行相称。这不禁令我深思",
  "富兰克林曾经说过，你热爱生命吗？那么别浪费时间，因为时间是组成生命的材料。这不禁令我深思",
  "马尔顿曾经说过，坚强的信心，能使平凡的人做出惊人的事业。这不禁令我深思",
  "笛卡儿曾经说过，读一切好书，就是和许多高尚的人谈话。这不禁令我深思",
  "塞涅卡曾经说过，真正的人生，只有在经过艰难卓绝的斗争之后才能实现。这不禁令我深思",
  "易卜生曾经说过，伟大的事业，需要决心，能力，组织和责任感。这不禁令我深思",
  "歌德曾经说过，没有人事先了解自己到底有多大的力量，直到他试过以后才知道。这不禁令我深思",
  "达尔文曾经说过，敢于浪费哪怕一个钟头时间的人，说明他还不懂得珍惜生命的全部价值。这不禁令我深思",
  "佚名曾经说过，感激每一个新的挑战，因为它会锻造你的意志和品格。这不禁令我深思",
  "奥斯特洛夫斯基曾经说过，共同的事业，共同的斗争，可以使人们产生忍受一切的力量。　这不禁令我深思",
  "苏轼曾经说过，古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。这不禁令我深思",
  "王阳明曾经说过，故立志者，为学之心也；为学者，立志之事也。这不禁令我深思",
  "歌德曾经说过，读一本好书，就如同和一个高尚的人在交谈。这不禁令我深思",
  "乌申斯基曾经说过，学习是劳动，是充满思想的劳动。这不禁令我深思",
  "别林斯基曾经说过，好的书籍是最贵重的珍宝。这不禁令我深思",
  "富兰克林曾经说过，读书是易事，思索是难事，但两者缺一，便全无用处。这不禁令我深思",
  "鲁巴金曾经说过，读书是在别人思想的帮助下，建立起自己的思想。这不禁令我深思",
  "培根曾经说过，合理安排时间，就等于节约时间。这不禁令我深思",
  "屠格涅夫曾经说过，你想成为幸福的人吗？但愿你首先学会吃得起苦。这不禁令我深思",
  "莎士比亚曾经说过，抛弃时间的人，时间也抛弃他。这不禁令我深思",
  "叔本华曾经说过，普通人只想到如何度过时间，有才能的人设法利用时间。这不禁令我深思",
  "博曾经说过，一次失败，只是证明我们成功的决心还够坚强。 维这不禁令我深思",
  "拉罗什夫科曾经说过，取得成就时坚持不懈，要比遭到失败时顽强不屈更重要。这不禁令我深思",
  "莎士比亚曾经说过，人的一生是短的，但如果卑劣地过这一生，就太长了。这不禁令我深思",
  "俾斯麦曾经说过，失败是坚忍的最后考验。这不禁令我深思",
  "池田大作曾经说过，不要回避苦恼和困难，挺起身来向它挑战，进而克服它。这不禁令我深思",
  "莎士比亚曾经说过，那脑袋里的智慧，就像打火石里的火花一样，不去打它是不肯出来的。这不禁令我深思",
  "希腊曾经说过，最困难的事情就是认识自己。这不禁令我深思",
  "黑塞曾经说过，有勇气承担命运这才是英雄好汉。这不禁令我深思",
  "非洲曾经说过，最灵繁的人也看不见自己的背脊。这不禁令我深思",
  "培根曾经说过，阅读使人充实，会谈使人敏捷，写作使人精确。这不禁令我深思",
  "斯宾诺莎曾经说过，最大的骄傲于最大的自卑都表示心灵的最软弱无力。这不禁令我深思",
  "西班牙曾经说过，自知之明是最难得的知识。这不禁令我深思",
  "塞内加曾经说过，勇气通往天堂，怯懦通往地狱。这不禁令我深思",
  "赫尔普斯曾经说过，有时候读书是一种巧妙地避开思考的方法。这不禁令我深思",
  "笛卡儿曾经说过，阅读一切好书如同和过去最杰出的人谈话。这不禁令我深思",
  "邓拓曾经说过，越是没有本领的就越加自命不凡。这不禁令我深思",
  "爱尔兰曾经说过，越是无能的人，越喜欢挑剔别人的错儿。这不禁令我深思",
  "老子曾经说过，知人者智，自知者明。胜人者有力，自胜者强。这不禁令我深思",
  "歌德曾经说过，意志坚强的人能把世界放在手中像泥块一样任意揉捏。这不禁令我深思",
  "迈克尔·F·斯特利曾经说过，最具挑战性的挑战莫过于提升自我。这不禁令我深思",
  "爱迪生曾经说过，失败也是我需要的，它和成功对我一样有价值。这不禁令我深思",
  "罗素·贝克曾经说过，一个人即使已登上顶峰，也仍要自强不息。这不禁令我深思",
  "马云曾经说过，最大的挑战和突破在于用人，而用人最大的突破在于信任人。这不禁令我深思",
  "雷锋曾经说过，自己活着，就是为了使别人过得更美好。这不禁令我深思",
  "布尔沃曾经说过，要掌握书，莫被书掌握；要为生而读，莫为读而生。这不禁令我深思",
  "培根曾经说过，要知道对好事的称颂过于夸大，也会招来人们的反感轻蔑和嫉妒。这不禁令我深思",
  "莫扎特曾经说过，谁和我一样用功，谁就会和我一样成功。这不禁令我深思",
  "马克思曾经说过，一切节省，归根到底都归结为时间的节省。这不禁令我深思",
  "莎士比亚曾经说过，意志命运往往背道而驰，决心到最后会全部推倒。这不禁令我深思",
  "卡莱尔曾经说过，过去一切时代的精华尽在书中。这不禁令我深思",
  "培根曾经说过，深窥自己的心，而后发觉一切的奇迹在你自己。这不禁令我深思",
  "罗曼·罗兰曾经说过，只有把抱怨环境的心情，化为上进的力量，才是成功的保证。这不禁令我深思",
  "孔子曾经说过，知之者不如好之者，好之者不如乐之者。这不禁令我深思",
  "达·芬奇曾经说过，大胆和坚定的决心能够抵得上武器的精良。这不禁令我深思",
  "叔本华曾经说过，意志是一个强壮的盲人，倚靠在明眼的跛子肩上。这不禁令我深思",
  "黑格尔曾经说过，只有永远躺在泥坑里的人，才不会再掉进坑里。这不禁令我深思",
  "普列姆昌德曾经说过，希望的灯一旦熄灭，生活刹那间变成了一片黑暗。这不禁令我深思",
  "维龙曾经说过，要成功不需要什么特别的才能，只要把你能做的小事做得好就行了。这不禁令我深思",
  "郭沫若曾经说过，形成天才的决定因素应该是勤奋。这不禁令我深思",
  "洛克曾经说过，学到很多东西的诀窍，就是一下子不要学很多。这不禁令我深思",
  "西班牙曾经说过，自己的鞋子，自己知道紧在哪里。这不禁令我深思",
  "拉罗什福科曾经说过，我们唯一不会改正的缺点是软弱。这不禁令我深思",
  "亚伯拉罕·林肯曾经说过，我这个人走得很慢，但是我从不后退。这不禁令我深思",
  "美华纳曾经说过，勿问成功的秘诀为何，且尽全力做你应该做的事吧。这不禁令我深思",
  "俾斯麦曾经说过，对于不屈不挠的人来说，没有失败这回事。这不禁令我深思",
  "阿卜·日·法拉兹曾经说过，学问是异常珍贵的东西，从任何源泉吸收都不可耻。这不禁令我深思",
  "白哲特曾经说过，坚强的信念能赢得强者的心，并使他们变得更坚强。 这不禁令我深思",
  "查尔斯·史考伯曾经说过，一个人几乎可以在任何他怀有无限热忱的事情上成功。 这不禁令我深思",
  "贝多芬曾经说过，卓越的人一大优点是：在不利与艰难的遭遇里百折不饶。这不禁令我深思",
  "莎士比亚曾经说过，本来无望的事，大胆尝试，往往能成功。这不禁令我深思",
  "卡耐基曾经说过，我们若已接受最坏的，就再没有什么损失。这不禁令我深思",
  "德国曾经说过，只有在人群中间，才能认识自己。这不禁令我深思",
  "史美尔斯曾经说过，书籍把我们引入最美好的社会，使我们认识各个时代的伟大智者。这不禁令我深思",
  "冯学峰曾经说过，当一个人用工作去迎接光明，光明很快就会来照耀着他。这不禁令我深思",
  "吉格·金克拉曾经说过，如果你能做梦，你就能实现它。这不禁令我深思",
];

let 后面垫话 = [
  "这不禁令我深思。 ",
  "带着这句话，我们还要更加慎重的审视这个问题： ",
  "这启发了我， ",
  "我希望诸位也能好好地体会这句话。 ",
  "这句话语虽然很短，但令我浮想联翩。 ",
  "这似乎解答了我的疑惑。 ",
];

let 前面垫话 = [
  "曾经说过",
  "在不经意间这样说过",
  "曾经提到过",
  "说过一句富有哲理的话",
];

let 初始主题 = [
  "一天掉多少根头发",
  "中午吃什么",
  "学生会退会",
  "好好学习",
  "生活的意义",
  "科学和人文谁更有意义",
];

let 下取整 = Math.floor;

let 同余乘数 = 214013;
let 同余加数 = 2531011;
let 同余模 = Math.pow(2, 32);

let 随机种子 =
  获取网址参数("随机种子") || 下取整(随便取一个数(0, 同余模, Math.random));

let 主题 = 获取网址参数("主题") || 随便取一句(初始主题);

$("#Bullshit-input").value = 主题;

// LCG https://en.wikipedia.org/wiki/Linear_congruential_generator
function 同余发生器() {
  随机种子 = (随机种子 * 同余乘数 + 同余加数) % 同余模;
  return 随机种子 / 同余模;
}

function 随便取一句(列表) {
  let 坐标 = 下取整(同余发生器() * 列表.length);
  return 列表[坐标];
}

function 随便取一个数(最小值 = 0, 最大值 = 100, 随机数函数 = 同余发生器) {
  let 数字 = 随机数函数() * (最大值 - 最小值) + 最小值;
  return 数字;
}

function 来点名人名言() {
  let 名言 = 随便取一句(名人名言);
  名言 = 名言.replace("曾经说过", 随便取一句(前面垫话));
  名言 = 名言.replace("这不禁令我深思", 随便取一句(后面垫话));
  return 名言;
}

function 来点论述() {
  let 句子 = 随便取一句(论述);
  句子 = 句子.replace(RegExp("主题", "g"), 主题);
  return 句子;
}

function 增加段落(段落) {
  if (段落[段落.length - 1] === " ") {
    段落 = 段落.slice(0, -2);
  }
  return "　　" + 段落 + "。 ";
}

function 生成文章() {
  主题 = $("#Bullshit-input").value;
  history.pushState(
    { url: window.location.href },
    null,
    "?主题=" + 主题 + "&随机种子=" + 随机种子
  );
  track("generator", 主题, 随机种子);
  let 文章 = [];
  let 段落 = "";
  let 文章长度 = 0;
  while (文章长度 < 12000) {
    let 随机数 = 随便取一个数();
    if (随机数 < 5 && 段落.length > 200) {
      段落 = 增加段落(段落);
      文章.push(段落);
      段落 = "";
    } else if (随机数 < 20) {
      let 句子 = 来点名人名言();
      文章长度 = 文章长度 + 句子.length;
      段落 = 段落 + 句子;
    } else {
      let 句子 = 来点论述();
      文章长度 = 文章长度 + 句子.length;
      段落 = 段落 + 句子;
    }
  }
  段落 = 增加段落(段落);
  文章.push(段落);

  let 排版 = "<div>" + 文章.join("</div><div>") + "</div>";
  $("#文章").innerHTML = 排版;
}

if (获取网址参数("主题")) {
  生成文章();
  track("shared", 主题, 随机种子);
}

// 列表左右选择
let left = null;
let right = null;
const v = ["草莓", "西瓜", "香蕉", "大象", "蜡笔小新"];

function leftChange(e) {
  const value = e.target.value;
  left = value;
  console.log(left);
}

function rightChange() {
  const value = e.target.value;
  right = value;
  console.log(right);
}

function toLeft() {
  var leftCollection = document.getElementById("left");
  var rightCollection = document.getElementById("right");

  for (let i = rightCollection.length - 1; i >= 0; i--) {
    if (rightCollection[i].value === left) {
      leftCollection.appendChild(rightCollection[i]);
      break;
    }
  }
}

function toRight() {
  var leftCollection = document.getElementById("left");
  var rightCollection = document.getElementById("right");

  for (let i = leftCollection.length - 1; i >= 0; i--) {
    if (leftCollection[i].value === left) {
      rightCollection.appendChild(leftCollection[i]);
      break;
    }
  }
}

// 操作DOM
function add() {
  var listElem = document.getElementById("dom-list");
  var li = document.createElement("li");
  li.innerHTML = "追加li";
  li.class = "dom-li";
  li.ondblclick = function () {
    li.ondblclick = this.parentNode.removeChild(this);
  };
  listElem.append(li);
}

function addTo() {
  var lis = document.getElementsByClassName("dom-li");
  var li = document.createElement("li");
  li.innerHTML = "插入li";
  li.class = "dom-li";
  li.ondblclick = function () {
    li.ondblclick = this.parentNode.removeChild(this);
  };
  lis[0].append(li);
}

window.onload = function () {
  var leftCollection = document.getElementById("left");
  var rightCollection = document.getElementById("right");

  // 图片随机移动
  var imgElem = document.getElementById("random-img");
  imgElem.addEventListener(
    "mouseover",
    function () {
      imgElem.style.top = `${Math.random() * 540 - 120}px`;
      imgElem.style.left = `${Math.random() * 1170 - 125}px`;
    },
    false
  );
};
