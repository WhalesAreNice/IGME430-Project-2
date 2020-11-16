"use strict";

var _csrf;

var handleShopper = function handleShopper(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadShoppersFromServer();
  });
  return false;
};

var LevelUpShopper = function LevelUpShopper(e) {
  e.preventDefault(); //console.log(_csrf);
  //console.log("test");
  //let newLevel = e.target.dataset.level + 1;
  //
  //let domoData = Domo.find(e.target.dataset.domoid);
  //let domoData = {
  //    id: e.target.dataset.domoid,
  //    name: e.target.dataset.name,
  //    age: e.target.dataset.age,
  //    level: newLevel,
  //};
  //console.log(domoData);

  var domoData = {
    id: e.target.dataset.domoid,
    _csrf: _csrf
  };
  sendAjax('POST', '/levelUp', domoData, loadShoppersFromServer);
  return false;
};

var ShopperForm = function ShopperForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: handleShopper,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Shopper Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeholder: "Shopper Age"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "level"
  }, "Level: "), /*#__PURE__*/React.createElement("input", {
    id: "domoLevel",
    type: "text",
    name: "level",
    placeholder: "Shopper Level"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Shopper"
  }));
};

var ShopperList = function ShopperList(props) {
  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Shoppers yet"));
  }

  var domoNodes = props.domos.map(function (domo) {
    return /*#__PURE__*/React.createElement("div", {
      key: domo._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", domo.name), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Age: ", domo.age), /*#__PURE__*/React.createElement("h3", {
      className: "domoLevel"
    }, "Level: ", domo.level), /*#__PURE__*/React.createElement("input", {
      className: "levelUpDomo",
      type: "submit",
      value: "Level Up",
      onClick: LevelUpShopper,
      "data-domoid": domo._id,
      csrf: _csrf
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadShoppersFromServer = function loadShoppersFromServer() {
  sendAjax('GET', '/getShopper', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ShopperList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  _csrf = csrf;
  ReactDOM.render( /*#__PURE__*/React.createElement(ShopperForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ShopperList, {
    domos: []
  }), document.querySelector("#domos"));
  loadShoppersFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
