/*
 * @?: *********************************************************************
 * @Author: Weidows
 * @Date: 2021-06-18 18:20:14
 * @LastEditors: Weidows
 * @LastEditTime: 2021-06-18 18:20:55
 * @FilePath: \UI-assignment\src\main\webapp\js\about.js
 * @Description:
 * @!: *********************************************************************
 */
//   <!--验证用户名-->
var uname = document.querySelector(".uname>input");
var namePtxt = document.querySelector(".uname>span>b");
uname.onfocus = function () {
  //获取焦点时
  namePtxt.innerHTML = "请输入您的用户名(2-18个中文字)";
  namePtxt.style.color = "red";
};
//失去焦点 函数
function unameBlur() {
  var reg = /^[\u4e00-\u9fa5]{2,18}$/; //\u4e00-\u9fa5 （汉字）  _(拼接)
  if (reg.test(uname.value)) {
    namePtxt.innerHTML = "OK";
    namePtxt.style.color = "#6cbe1f";
    uname.style.border = "solid 1px #6cbe1f";
    return true; //验证通过返回 一个true  给最后点击提交时做准备  最后都返回true（通过）才通过
  } else {
    namePtxt.innerHTML = "格式错误";
    namePtxt.style.color = "red";
    return false; //验证不通过返回 一个false  给最后点击提交时做准备
  }
}
uname.onblur = function () {
  //失去焦点时执行函数 键盘松开
  unameBlur();
};

//验证密码
var pwd = document.querySelector(".pwd>input");
var pwdPtxt = document.querySelector(".pwd>span>b");
// 二次验证密码
var confirmPwd = document.querySelector(".confirmPwd>input");
var confirmPwdPtxt = document.querySelector(".confirmPwd>span>b");

function pwdOnfocus(ptxt) {
  ptxt.innerHTML = "请输入密码(2-18位数字/英文字符)";
  ptxt.style.color = "red";
}

function pwdBlur(pwd, pwdPtxt) {
  var reg = /^[0-9a-zA-Z]{2,18}$/;
  if (reg.test(pwd.value)) {
    pwdPtxt.innerHTML = "OK";
    pwdPtxt.style.color = "#6cbe1f";
    pwd.style.border = "solid 1px #6cbe1f";
    return true; //验证通过返回 一个true  给最后点击提交时做准备  最后都返回true（通过）才通过
  } else {
    pwdPtxt.innerHTML = "请输入正确的密码";
    pwdPtxt.style.color = "red";
    return false; //验证不通过返回 一个false  给最后点击提交时做准备
  }
}

pwd.onfocus = function () {
  pwdOnfocus(pwdPtxt);
};
confirmPwd.onfocus = function () {
  pwdOnfocus(confirmPwdPtxt);
};
pwd.onblur = function () {
  pwdBlur(pwd, pwdPtxt);
};
confirmPwd.onblur = function () {
  pwdBlur(confirmPwd, confirmPwdPtxt);
};

// 提交
document.querySelector(".about_form_submit").onclick = function () {
  if (
    !unameBlur() ||
    !pwdBlur(confirmPwd, confirmPwdPtxt) ||
    !pwdBlur(confirmPwd, confirmPwdPtxt) ||
    pwd.value != confirmPwd.value
  ) {
    alert("请确认信息是否完好");
    return false;
  } else {
    alert("提交成功");
    location.href = "index.html";
  }
};

//选择框列表
var checkList = document.getElementsByClassName("check");
//全选
document.getElementById("checkAll").onclick = function () {
  for (var i = 0; i < checkList.length; i++) {
    checkList[i].checked = true;
  }
};
//全不选
document.getElementById("unCheckAll").onclick = function () {
  for (var i = 0; i < checkList.length; i++) {
    checkList[i].checked = false;
  }
};
//反选
document.getElementById("reverseCheck").onclick = function () {
  for (var i = 0; i < checkList.length; i++) {
    checkList[i].checked = !checkList[i].checked; //逻辑非取反
  }
};

// 省市联动
var city = {
  beijing: ["大兴区", "海淀区", "顺义区", "朝阳区"],
  hebei: ["邢台市", "廊坊市", "唐山市", "承德市", "衡水市", "张家口市"],
};

function addCities(newProvince, cityElement) {
  var cities = city[newProvince];
  for (var i = 0; i < cities.length; i++) {
    var op = document.createElement("option");
    op.innerHTML = cities[i];
    op.setAttribute("class", "city");
    cityElement.append(op);
  }
}

function removeCities() {
  var cityNodes = document.getElementsByClassName("city");
  for (var i = cityNodes.length - 1; i >= 0; i--) {
    cityNodes[i].parentNode.removeChild(cityNodes[i]);
  }
}

window.onload = function () {
  var root = document.getElementById("root");
  var provinceElement = document.getElementById("province");
  var cityElement = document.getElementById("city");

  addCities(provinceElement.value, cityElement);

  provinceElement.addEventListener("change", function (e) {
    removeCities();
    addCities(e.target.value, cityElement);
  });
};
