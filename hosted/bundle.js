"use strict";

var _csrf;

var categories = ['Shirts', 'Pants', 'Accesssories'];
var shirts = [{
  name: 'White T-Shirt',
  price: 20,
  src: '/assets/img/white-t.png',
  alt: 'White T-Shirt'
}, {
  name: 'Black T-Shirt',
  price: 20,
  src: '/assets/img/black-t.png',
  alt: 'Black T-Shirt'
}, {
  name: 'Red T-Shirt',
  price: 20,
  src: '/assets/img/red-t.png',
  alt: 'Red T-Shirt'
}, {
  name: 'White Cotton Hoodie',
  price: 50,
  src: '/assets/img/white-hoodie.png',
  alt: 'White Cotton Hoodie'
}, {
  name: 'Black Cotton Hoodie',
  price: 50,
  src: '/assets/img/black-hoodie.png',
  alt: 'Black Cotton Hoodie'
}, {
  name: 'Red Cotton Hoodie',
  price: 50,
  src: '/assets/img/red-hoodie.png',
  alt: 'Red Cotton Hoodie'
}, {
  name: 'White Jacket',
  price: 100,
  src: '/assets/img/white-jacket.png',
  alt: 'White Jacket'
}, {
  name: 'Black Jacket',
  price: 100,
  src: '/assets/img/black-jacket.png',
  alt: 'Black Jacket'
}, {
  name: 'Red Jacket',
  price: 100,
  src: '/assets/img/red-jacket.png',
  alt: 'Red Jacket'
}];
var pants = [{
  name: 'Black Cargo',
  price: 20
}, {
  name: 'White Cargo',
  price: 20
}, {
  name: 'Red Cargo',
  price: 20
}];
var accessories = [{
  name: 'Necklace',
  price: 20
}, {
  name: 'Bracelet',
  price: 20
}, {
  name: 'Ring',
  price: 20
}];

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
  var category = 'Shirts'; //default it to shirts

  sendAjax('POST', '/shop', shopperData, function () {
    loadShoppingOptions(shopperData.id, category);
  });
  return false;
};

var ChangeCategory = function ChangeCategory(newCategory, shopperId) {
  //e.preventDefault();
  var shopperData = {
    id: shopperId,
    _csrf: _csrf
  };
  var category = newCategory;
  sendAjax('POST', '/shop', shopperData, function () {
    loadShoppingOptions(shopperId, category);
  });
  return false;
};

var GetCurrentShopper = function GetCurrentShopper(shopperId, category) {
  //e.preventDefault();
  var shopperData = {
    id: shopperId,
    _csrf: _csrf
  };
  sendAjax('GET', '/getCurrentShopper', shopperData, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ShoppingOptions, {
      shopperData: data.shopper,
      category: category
    }), document.querySelector("#shoppingOptions")); //for now load all the reactDOMs to screen just to see

    ReactDOM.render( /*#__PURE__*/React.createElement(ShoppingCart, {
      shopperData: data.shopper,
      category: category
    }), document.querySelector("#shoppingCart"));
    ReactDOM.render( /*#__PURE__*/React.createElement(PaymentPage, {
      shopperData: data.shopper,
      category: category
    }), document.querySelector("#paymentPage"));
  });
  return false;
};

var ShoppingOptions = function ShoppingOptions(props) {
  var currentCategory = props.category;
  var currentShopperInfo;
  var shopperInfoDisplay;
  var categorySelect;
  var display;
  var insideShopperInfo = [];
  currentShopperInfo = props.shopperData;
  console.log(props);
  insideShopperInfo.push( /*#__PURE__*/React.createElement("h2", {
    className: "shopperInfoText"
  }, "Shopper's Name"));
  insideShopperInfo.push( /*#__PURE__*/React.createElement("h2", {
    className: "shopperInfoText"
  }, "Shopper's Money"));
  insideShopperInfo.push( /*#__PURE__*/React.createElement("h2", {
    className: "shopperInfoText"
  }, "Shopper's Cart"));
  shopperInfoDisplay = /*#__PURE__*/React.createElement("div", {
    id: "currentShopper"
  }, insideShopperInfo);
  var insideCategorySelect = [];
  insideCategorySelect.push( /*#__PURE__*/React.createElement("h2", null, "Shopping Category"));

  var _loop = function _loop(i) {
    var CallChange = function CallChange() {
      ChangeCategory(categories[i], props.shopperId);
    };

    insideCategorySelect.push( /*#__PURE__*/React.createElement("a", {
      className: "shoppingCategory",
      href: "#",
      onClick: CallChange
    }, categories[i]));
  };

  for (var i = 0; i < categories.length; i++) {
    _loop(i);
  }

  categorySelect = /*#__PURE__*/React.createElement("div", {
    id: "shopCategories"
  }, insideCategorySelect);

  if (currentCategory == 'Shirts') {
    var insideDisplay = [];

    for (var _i = 0; _i < shirts.length; _i++) {
      insideDisplay.push( /*#__PURE__*/React.createElement("div", {
        className: "itemDisplay shirt"
      }, /*#__PURE__*/React.createElement("img", {
        src: shirts[_i].src,
        alt: shirts[_i].alt
      }), /*#__PURE__*/React.createElement("h3", null, shirts[_i].name), /*#__PURE__*/React.createElement("h3", null, "Price: ", shirts[_i].price), /*#__PURE__*/React.createElement("input", {
        type: "submit",
        className: "addToCart",
        value: "Add to Cart",
        onClick: AddToCart,
        "data-shopperid": shopper._id,
        csrf: _csrf
      })));
    }

    display = /*#__PURE__*/React.createElement("div", {
      className: "shopItems"
    }, /*#__PURE__*/React.createElement("div", {
      id: "shirts"
    }, insideDisplay));
  } else if (currentCategory == 'Pants') {
    var _insideDisplay = [];

    for (var _i2 = 0; _i2 < pants.length; _i2++) {
      _insideDisplay.push( /*#__PURE__*/React.createElement("div", {
        className: "itemDisplay pant"
      }, /*#__PURE__*/React.createElement("img", {
        src: "",
        alt: ""
      }), "//will add later", /*#__PURE__*/React.createElement("h3", null, pants[_i2].name), /*#__PURE__*/React.createElement("h3", null, "Price: ", pants[_i2].price), /*#__PURE__*/React.createElement("input", {
        type: "submit",
        className: "addToCart",
        value: "Add to Cart",
        onClick: AddToCart,
        "data-shopperid": shopper._id,
        csrf: _csrf
      })));
    }

    display = /*#__PURE__*/React.createElement("div", {
      className: "shopItems"
    }, /*#__PURE__*/React.createElement("div", {
      id: "pants"
    }, _insideDisplay));
  } else if (currentCategory == 'Accesssories') {
    var _insideDisplay2 = [];

    for (var _i3 = 0; _i3 < accessories.length; _i3++) {
      _insideDisplay2.push( /*#__PURE__*/React.createElement("div", {
        className: "itemDisplay accessory"
      }, /*#__PURE__*/React.createElement("img", {
        src: "",
        alt: ""
      }), "//will add later", /*#__PURE__*/React.createElement("h3", null, accessories[_i3].name), /*#__PURE__*/React.createElement("h3", null, "Price: ", accessories[_i3].price), /*#__PURE__*/React.createElement("input", {
        type: "submit",
        className: "addToCart",
        value: "Add to Cart",
        onClick: AddToCart,
        "data-shopperid": shopper._id,
        csrf: _csrf
      })));
    }

    display = /*#__PURE__*/React.createElement("div", {
      className: "shopItems"
    }, /*#__PURE__*/React.createElement("div", {
      id: "accessories"
    }, _insideDisplay2));
  }

  var shoppingPage = /*#__PURE__*/React.createElement("div", {
    id: "ShopScreen"
  }, shopperInfoDisplay, categorySelect, display) //if chosen category is shirts
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

var loadShoppingCart = function loadShoppingCart() {};

var ShoppingCart = function ShoppingCart(props) {
  var shoppingList;
  var insideShoppingList = [];
  var totalPrice = 0; //get the shopping cart list from the shopper object
  //for now just push all shirts to display

  for (var i = 0; i < shirts.length; i++) {
    insideShoppingList.push( /*#__PURE__*/React.createElement("div", {
      className: "shoppingCartItem"
    }, /*#__PURE__*/React.createElement("img", {
      className: "shoppingCartItemIMG",
      src: shirts[i].src,
      alt: shirts[i].alt
    }), /*#__PURE__*/React.createElement("div", {
      className: "shoppingCartItemTextHolder"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "shoppingCartItemName"
    }, shirts[i].name), /*#__PURE__*/React.createElement("h3", {
      className: "shoppingCartItemPrice"
    }, "Price: ", shirts[i].price))));
    totalPrice += shirts[i].price;
  }

  insideShoppingList.push( /*#__PURE__*/React.createElement("div", {
    className: "shoppingCartPurchaseSection"
  }, /*#__PURE__*/React.createElement("h3", null, "Total Price: ", totalPrice), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "purchase",
    value: "Purchase",
    onclick: purchaseItems,
    "data-shopperid": shopper._id,
    csrf: _csrf
  })));
  return /*#__PURE__*/React.createElement("div", {
    className: "shoppingCart"
  }, insideShoppingList);
};

var purchaseItems = function purchaseItems() {//some send ajax call
};

var loadPaymentPage = function loadPaymentPage() {};

var PaymentPage = function PaymentPage(props) {
  //let shopperInfo = props.shopper; //use this later
  //made up shopperInfo to test
  var shopperInfo = {
    name: 'Shopper1',
    money: 10000,
    age: 4,
    cart: []
  };
  var insidePaymentInfo = [];
  insidePaymentInfo.push( /*#__PURE__*/React.createElement("div", {
    className: "shoppersInformation"
  }, /*#__PURE__*/React.createElement("h2", null, shopperInfo.name), /*#__PURE__*/React.createElement("h2", null, shopperInfo.money), /*#__PURE__*/React.createElement("h2", null, shopperInfo.age), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "paymentComplete",
    value: "Payment Complete",
    onclick: purchaseComplete,
    "data-shopperid": shopper._id,
    csrf: _csrf
  })));
  return /*#__PURE__*/React.createElement("div", {
    className: "paymentInformation"
  }, insidePaymentInfo);
};

var paymentComplete = function paymentComplete() {//some send ajax call
};

var loadShoppingOptions = function loadShoppingOptions(shopperId, category) {
  sendAjax('GET', '/getShopper', null, function (data) {
    GetCurrentShopper(shopperId, category); //ReactDOM.render(
    //    <ShoppingOptions shopperId={shopperId} category={category} />, document.querySelector("#shoppingOptions")
    //); 

    ReactDOM.unmountComponentAtNode(document.querySelector("#makeShopper"));
    ReactDOM.unmountComponentAtNode(document.querySelector("#shoppers"));
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
