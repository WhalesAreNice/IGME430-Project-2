"use strict";

var _csrf;

var handleShopper = function handleShopper(e) {
  e.preventDefault();
  $("#shopperMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#shopperName").val() == '' || $("#shopperAge").val() == '' || $("#shopperMoney").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#shopperForm").attr("action"), $("#shopperForm").serialize(), function () {
    loadShoppersFromServer();
  });
  return false;
};

var MoneyUpShopper = function MoneyUpShopper(e) {
  e.preventDefault();
  var shopperData = {
    id: e.target.dataset.shopperid,
    _csrf: _csrf
  };
  sendAjax('POST', '/moneyUp', shopperData, loadShoppersFromServer);
  return false;
};

var ShopperForm = function ShopperForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "shopperForm",
    onSubmit: handleShopper,
    name: "shopperForm",
    action: "/maker",
    method: "POST",
    className: "shopperForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "shopperName",
    type: "text",
    name: "name",
    placeholder: "Shopper Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "shopperAge",
    type: "text",
    name: "age",
    placeholder: "Shopper Age"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "money"
  }, "Money: "), /*#__PURE__*/React.createElement("input", {
    id: "shopperMoney",
    type: "text",
    name: "money",
    placeholder: "Shopper Money"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeShopperSubmit",
    type: "submit",
    value: "Make Shopper"
  }));
};

var ShopperList = function ShopperList(props) {
  if (props.shoppers.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "shopperList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyShopper"
    }, "No Shoppers yet"));
  }

  var shopperNodes = props.shoppers.map(function (shopper) {
    return /*#__PURE__*/React.createElement("div", {
      key: shopper._id,
      className: "shopper"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/shopperface.jpeg",
      alt: "shopper face",
      className: "shopperFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "shopperName"
    }, "Name: ", shopper.name), /*#__PURE__*/React.createElement("h3", {
      className: "shopperAge"
    }, "Age: ", shopper.age), /*#__PURE__*/React.createElement("h3", {
      className: "shopperMoney"
    }, "Money: ", shopper.money), /*#__PURE__*/React.createElement("input", {
      className: "moneyUpShopper",
      type: "submit",
      value: "Money Up",
      onClick: MoneyUpShopper,
      "data-shopperid": shopper._id,
      csrf: _csrf
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "shopperList"
  }, shopperNodes);
};

var loadShoppersFromServer = function loadShoppersFromServer() {
  sendAjax('GET', '/getShopper', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ShopperList, {
      shoppers: data.shoppers
    }), document.querySelector("#shoppers"));
  });
};

var setup = function setup(csrf) {
  _csrf = csrf;
  ReactDOM.render( /*#__PURE__*/React.createElement(ShopperForm, {
    csrf: csrf
  }), document.querySelector("#makeShopper"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ShopperList, {
    shoppers: []
  }), document.querySelector("#shoppers"));
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
  $("#shopperMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#shopperMessage").animate({
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
