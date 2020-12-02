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
    }), /*#__PURE__*/React.createElement("input", {
      className: "startShopping",
      type: "submit",
      value: "Start Shopping",
      onClick: StartShopping,
      "data-shopperid": shopper._id,
      csrf: _csrf
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "shopperList"
  }, shopperNodes);
};

var AddToCart = function AddToCart(e) {//adds the selected item to cart of the shopper
  //reload the same shopperoptions
};

var StartShopping = function StartShopping(e) {
  e.preventDefault();
  var shopperData = {
    id: e.target.dataset.shopperid,
    _csrf: _csrf
  };
  sendAjax('POST', '/shop', shopperData, loadShoppingOptions);
  return false;
};

var ShoppingOptions = function ShoppingOptions(props) {
  var categories = ['Shirts', 'Pants', 'Accesssories'];
  var shirts = [{
    name: 'White T-Shirt',
    price: 200
  }, {
    name: 'Black T-Shirt',
    price: 250
  }, {
    name: 'Red T-Shirt',
    price: 300
  }];
  var pants = [{
    name: 'Black Cargo',
    price: 200
  }, {
    name: 'White Cargo',
    price: 250
  }, {
    name: 'Red Cargo',
    price: 300
  }];
  var accessories = [{
    name: 'Necklace',
    price: 200
  }, {
    name: 'Bracelet',
    price: 250
  }, {
    name: 'Ring',
    price: 300
  }];
  var currentCategory = 'Shirts'; //change this when category is changed

  var display;

  if (currentCategory == 'Shirts') {
    var insideDisplay = [];

    for (var i = 0; i < shirts.length; i++) {
      insideDisplay.push( /*#__PURE__*/React.createElement("div", {
        "class": "shirt"
      }, /*#__PURE__*/React.createElement("img", {
        src: "",
        alt: ""
      }), "//will add later", /*#__PURE__*/React.createElement("h3", null, shirts[i].name), /*#__PURE__*/React.createElement("h3", null, "Price: ", shirts[i].price), /*#__PURE__*/React.createElement("input", {
        type: "submit",
        className: "addToCart",
        value: "Add to Cart",
        onClick: AddToCart,
        "data-shopperid": shopper._id,
        csrf: _csrf
      })));
    }

    display = /*#__PURE__*/React.createElement("div", {
      id: "shirts"
    }, insideDisplay);
  } else if (currentCategory == 'Pants') {
    var _insideDisplay = [];

    for (var _i = 0; _i < pants.length; _i++) {
      _insideDisplay.push( /*#__PURE__*/React.createElement("div", {
        "class": "pant"
      }, /*#__PURE__*/React.createElement("img", {
        src: "",
        alt: ""
      }), "//will add later", /*#__PURE__*/React.createElement("h3", null, pants[_i].name), /*#__PURE__*/React.createElement("h3", null, "Price: ", pants[_i].price), /*#__PURE__*/React.createElement("input", {
        type: "submit",
        className: "addToCart",
        value: "Add to Cart",
        onClick: AddToCart,
        "data-shopperid": shopper._id,
        csrf: _csrf
      })));
    }

    display = /*#__PURE__*/React.createElement("div", {
      id: "pants"
    }, _insideDisplay);
  } else if (currentCategory == 'Accesssories') {
    var _insideDisplay2 = [];

    for (var _i2 = 0; _i2 < accessories.length; _i2++) {
      _insideDisplay2.push( /*#__PURE__*/React.createElement("div", {
        "class": "accessory"
      }, /*#__PURE__*/React.createElement("img", {
        src: "",
        alt: ""
      }), "//will add later", /*#__PURE__*/React.createElement("h3", null, accessories[_i2].name), /*#__PURE__*/React.createElement("h3", null, "Price: ", accessories[_i2].price), /*#__PURE__*/React.createElement("input", {
        type: "submit",
        className: "addToCart",
        value: "Add to Cart",
        onClick: AddToCart,
        "data-shopperid": shopper._id,
        csrf: _csrf
      })));
    }

    display = /*#__PURE__*/React.createElement("div", {
      id: "accessories"
    }, _insideDisplay2);
  }

  var shoppingPage = /*#__PURE__*/React.createElement("div", {
    id: "shopCategories"
  }, " //put to left side of screen", display) //if chosen category is shirts
  //<div id="shirts">
  //    //for each shirt index
  //    <div class="shirt">
  //        <img src="" alt=""/> //put image of the shirt
  //        <h3>{shirts[0]}</h3> //name of the shirt
  //        <input type="text" className="addToCart" value="Add to Cart" data-shopperid={shopper._id} csrf={_csrf}/> // will need an onclick that adds the shirt to an array for the shopping cart
  //    </div>
  //</div>
  ;
  return /*#__PURE__*/React.createElement("div", {
    className: "shoppingOptions"
  }, shoppingPage);
};

var loadShoppingOptions = function loadShoppingOptions() {
  sendAjax('GET', '/getShopper', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ShoppingOptions, {
      shoppers: data.shoppers
    }), document.querySelector("#shoppingOptions"));
  });
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
