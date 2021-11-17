//   <!--验证用户名-->
var email = document.querySelector("#email");
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
    var data = {
      email: email.value,
      uname: uname.value,
      pwd: pwd.value,
      timestamp: Date.parse(new Date()),
    };

    var dataSet = localStorage.getItem("dataSet");
    if (dataSet) {
      dataSet = JSON.parse(dataSet);
      dataSet.push(data);
    } else {
      dataSet = [data];
    }
    localStorage.setItem("dataSet", JSON.stringify(dataSet));

    alert("注册成功");
  }
};

document.querySelector("#check").onclick = function () {
  var dataSet = localStorage.getItem("dataSet");
  if (dataSet) {
    dataSet = JSON.parse(dataSet);
    var str = "";
    for (var i = 0; i < dataSet.length; i++) {
      str +=
        "邮箱：" +
        dataSet[i].email +
        " 用户名：" +
        dataSet[i].uname +
        " 密码：" +
        dataSet[i].pwd +
        " 时间：" +
        dataSet[i].timestamp +
        "<br>";
    }
    document.querySelector("#check-data").innerHTML = str;
  }
};

document.querySelector("#clear").onclick = function () {
  localStorage.clear();
  document.querySelector("#check-data").innerHTML = "";
}
