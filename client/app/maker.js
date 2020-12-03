let _csrf;

const categories = ['Shirts', 'Pants', 'Accesssories'];
    const shirts = [{name:'White T-Shirt', price:20, src:'/assets/img/white-t.png', alt:'White T-Shirt'}, 
                    {name:'Black T-Shirt', price:20, src:'/assets/img/black-t.png', alt:'Black T-Shirt'}, 
                    {name:'Red T-Shirt', price:20, src:'/assets/img/red-t.png', alt:'Red T-Shirt'},
                    {name:'White Cotton Hoodie', price:50, src:'/assets/img/white-hoodie.png', alt:'White Cotton Hoodie'},
                    {name:'Black Cotton Hoodie', price:50, src:'/assets/img/black-hoodie.png', alt:'Black Cotton Hoodie'},
                    {name:'Red Cotton Hoodie', price:50, src:'/assets/img/red-hoodie.png', alt:'Red Cotton Hoodie'},
                    {name:'White Jacket', price:100, src:'/assets/img/white-jacket.png', alt:'White Jacket'},
                    {name:'Black Jacket', price:100, src:'/assets/img/black-jacket.png', alt:'Black Jacket'},
                    {name:'Red Jacket', price:100, src:'/assets/img/red-jacket.png', alt:'Red Jacket'}];
    const pants = [{name:'Black Cargo Pants', price:50, src:'/assets/img/black-cargo-pants.png', alt:'Black Cargo Pants'}, 
                   {name:'Red Cargo Pants', price:50, src:'/assets/img/red-cargo-pants.png', alt:'Red Cargo Pants'},
                  {name:'Gray Joggers', price:50, src:'/assets/img/gray-jogger.png', alt:'Gray Joggers'}];
    const accessories = [{name:'Necklace', price:1500, src:'/assets/img/necklace.png', alt:'Necklace'}, 
                         {name:'Bracelet', price:1200, src:'/assets/img/bracelet.png', alt:'Bracelet'}, 
                         {name:'Ring', price:1000, src:'/assets/img/ring.png', alt:'Ring'}];

const handleShopper = (e) => {
    e.preventDefault();
    
    $("#shopperMessage").animate({width:'hide'},350);

    if($("#shopperName").val() == '' || $("#shopperAge").val()=='' || $("#shopperMoney").val() =='') {
        handleError("RAWR! All fields are required");
        return false;
    }
    sendAjax('POST', $("#shopperForm").attr("action"), $("#shopperForm").serialize(), function() {
        
        loadShoppersFromServer();
    });
    
    return false;
};

const MoneyUpShopper = (e) => {
    e.preventDefault();
    
    let shopperData = {
        id: e.target.dataset.shopperid,
        _csrf: _csrf,
    }
    
    sendAjax('POST', '/moneyUp', shopperData, loadShoppersFromServer);
    return false;
};

const ShopperForm = (props) => {
    return (
        <form id="shopperForm" 
            onSubmit={handleShopper}
            name="shopperForm"
            action="/maker"
            method="POST"
            className="shopperForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="shopperName" type="text" name="name" placeholder="Shopper Name"/>
            <label htmlFor="age">Age: </label>
            <input id="shopperAge" type="text" name="age" placeholder="Shopper Age"/>
            <label htmlFor="money">Money: </label>
            <input id="shopperMoney" type="text" name="money" placeholder="Shopper Money"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeShopperSubmit" type="submit" value="Make Shopper" />
        </form>
    );  
};

const ShopperList = function(props) {
    if(props.shoppers.length===0) {
        return (
            <div className="shopperList">
                <h3 className="emptyShopper">No Shoppers yet</h3>
            </div>
        );
    } 

    const shopperNodes = props.shoppers.map(function(shopper) {
        return (
            <div key={shopper._id} className="shopper">
                <img src="/assets/img/shopperface.jpeg" alt="shopper face" className="shopperFace" />
                <h3 className="shopperName">Name: {shopper.name}</h3>
                <h3 className="shopperAge">Age: {shopper.age}</h3>
                <h3 className="shopperMoney">Money: {shopper.money}</h3>
                <input className="moneyUpShopper" type="submit" value="Money Up" onClick={MoneyUpShopper} data-shopperid={shopper._id} csrf={_csrf} />
                <input className="startShopping" type="submit" value="Start Shopping"  onClick={StartShopping} data-shopperid={shopper._id} csrf={_csrf} />
                
            </div>
        );
    });

    return (
        <div className="shopperList">
            {shopperNodes}
        </div>
    );
};



const StartShopping = (e) => {
    e.preventDefault();
    
    let shopperData = {
        id: e.target.dataset.shopperid,
        _csrf: _csrf,
    }
    
    let category = 'Shirts'; //default it to shirts
    
    
    sendAjax('POST', '/shop', shopperData, () => {
        loadShoppingOptions(shopperData.id, category)
    });
    return false;
};

const ChangeCategory = (newCategory, shopperId) => {
    //e.preventDefault();
    let shopperData = {
        id: shopperId,
        _csrf: _csrf,
    }
    
    let category = newCategory; 
    
    
    sendAjax('POST', '/shop', shopperData, () => {
        loadShoppingOptions(shopperId, category)
    });
    return false;
}

const GetCurrentShopper = (shopperId, category) => {
    //e.preventDefault();
    let shopperData = {
        id: shopperId,
        _csrf: _csrf,
    }
    
    sendAjax('GET', '/getCurrentShopper', shopperData, (data) => {
        ReactDOM.render(
            <ShoppingOptions shopperData={data.shopper} category={category} />, document.querySelector("#shoppingOptions")
        ); 
        
        //for now load all the reactDOMs to screen just to see
        //ReactDOM.render(
        //    <ShoppingCart shopperData={data.shopper} category={category} />, document.querySelector("#shoppingCart")
        //); 
        //ReactDOM.render(
        //    <PaymentPage shopperData={data.shopper} category={category} />, document.querySelector("#paymentPage")
        //); 
        
    });
    
    
    return false;
}

const ShoppingOptions = function(props) {
    let currentCategory = props.category; 
    let currentShopperInfo;
    let shopperInfoDisplay;
    let categorySelect;
    let display; 
    
    let insideShopperInfo = [];
    
    currentShopperInfo = props.shopperData;
    //console.log(props.shopperData);
    
    //console.log(currentShopperInfo);
    
    const ChangeToShoppingCart = () => {
        loadShoppingCart(currentShopperInfo._id, currentCategory)
    }
    
    insideShopperInfo.push(<h2 className="shopperInfoText">{currentShopperInfo.name}</h2>);
    insideShopperInfo.push(<h2 className="shopperInfoText">Available Money: {currentShopperInfo.money}</h2>);
    insideShopperInfo.push(<img className="shopperInfoText" src="/assets/img/shopping-bag.png" alt="shopping bag" onClick={ChangeToShoppingCart}></img>);
    shopperInfoDisplay = (
        <div id="currentShopper">
           <div id="currentShopperFloatBox">
               {insideShopperInfo}
           </div>
        </div>
    );
    //console.log(props.shopperData._id);
    let insideCategorySelect = [];
    insideCategorySelect.push(<h2>Shopping Category</h2>);
    for(let i = 0; i < categories.length; i++){
        const CallChange = () => {
            ChangeCategory(categories[i], props.shopperData._id)
        }
        
        insideCategorySelect.push(<a className="shoppingCategory" href="#" onClick={CallChange}>{categories[i]}</a>);
    }
    categorySelect = (
        <div id="shopCategories">
            {insideCategorySelect}
        </div>
    );
    
    if(currentCategory == 'Shirts'){
        let insideDisplay = [];
        
        for(let i = 0; i < shirts.length; i++){
            const CallChange = () => {
                AddToCart(currentShopperInfo, currentCategory, shirts[i])
            }
            
            insideDisplay.push(<div className="itemDisplay shirt">
                <img src={shirts[i].src} alt={shirts[i].alt}/>
                <h3>{shirts[i].name}</h3>
                <h3>Price: {shirts[i].price}</h3>
                <input type="submit" className="addToCart" value="Add to Cart" onClick={CallChange} data-shopperid={shopper._id} csrf={_csrf} />
            </div>)
        }
        
        display = (
            <div className="shopItems">
                <div id='shirts'>
                    {insideDisplay}
                </div>
            </div>
        );
    }else if(currentCategory == 'Pants'){
        let insideDisplay = [];
        
        for(let i = 0; i < pants.length; i++){
            const CallChange = () => {
                AddToCart(currentShopperInfo, currentCategory, pants[i])
            }
            
            insideDisplay.push(<div className="itemDisplay pant">
                <img src={pants[i].src} alt={pants[i].alt}/>
                <h3>{pants[i].name}</h3>
                <h3>Price: {pants[i].price}</h3>
                <input type="submit" className="addToCart" value="Add to Cart" onClick={CallChange} data-shopperid={shopper._id} csrf={_csrf} />
            </div>)
        }
        
        display = (
            <div className="shopItems">
                <div id='pants'>
                    {insideDisplay}
                </div>
            </div>
        );
    }else if(currentCategory == 'Accesssories'){
        let insideDisplay = [];
        
        for(let i = 0; i < accessories.length; i++){
            const CallChange = () => {
                AddToCart(currentShopperInfo, currentCategory, accessories[i])
            }
            
            insideDisplay.push(<div className="itemDisplay accessory">
                <img src={accessories[i].src} alt={accessories[i].alt}/>
                <h3>{accessories[i].name}</h3>
                <h3>Price: {accessories[i].price}</h3>
                <input type="submit" className="addToCart" value="Add to Cart" onClick={CallChange} data-shopperid={shopper._id} csrf={_csrf} />
            </div>)
        }
        
        display = (
            <div className="shopItems">
                <div id='accessories'>
                    {insideDisplay}
                </div>
            </div>
        );
    }
    
    const shoppingPage = (
        <div id="ShopScreen">
            {shopperInfoDisplay}
            {categorySelect}
            {display}
        </div>
        
        //if chosen category is shirts
        //<div id="shirts">
        //    //for each shirt index
        //    <div class="shirt">
        //        <img src="" alt=""/> //put image of the shirt
        //        <h3>{shirts[0]}</h3> //name of the shirt
        //        <input type="text" className="addToCart" value="Add to Cart" data-shopperid={shopper._id} csrf={_csrf}/> // will need an onclick that adds the shirt to an array for the shopping cart
        //    </div>
        //</div>
    );
    
    return (
        <div className="shoppingOptions">
            {shoppingPage}
        </div>
    );
};

const AddToCart = (shopperData, category, item) => {
    //adds the selected item to cart of the shopper
    //let tempShopper = shopperData;
    //tempShopper.cart.push(item);
    //tempShopper._csrf = _csrf;
    
    let shopperCart = shopperData.cart;
    shopperCart.push(item);
    
    //console.log(shopperCart);
    //console.log(shopperData);
    
    let tempShopper = {
        id:shopperData._id,
        cart:shopperCart,
        _csrf:_csrf,
    }
    
    
    //console.log(tempShopper);
    
    //reload the same shopperoptions
    sendAjax('POST', '/addToCart', tempShopper, (data) => {
        GetCurrentShopper(tempShopper.id, category);
    });
    return false;
};

const loadShoppingCart = (shopperId, category) => {
    let shopperData = {
        id:shopperId,
        _csrf:_csrf
    } 
    
    sendAjax('GET', '/getCurrentShopper', shopperData, (data) => {
        
        ReactDOM.unmountComponentAtNode(document.querySelector("#shoppingOptions"));
        
        ReactDOM.render(
            <ShoppingCart shopperData={data.shopper} category={category} />, document.querySelector("#shoppingCart")
        ); 
    });
}

const ShoppingCart = function(props) {
    let shoppingList;
    let insideShoppingList =[];
    let totalPrice = 0;
    //get the shopping cart list from the shopper object
    
    let currentCart = props.shopperData.cart;
    
    for(let i = 0; i < currentCart.length; i++){
        insideShoppingList.push(
            <div className="shoppingCartItem">
                <img className="shoppingCartItemIMG" src={currentCart[i].src} alt={currentCart[i].alt}></img>
                <div className="shoppingCartItemTextHolder">
                    <h3 className="shoppingCartItemName" >{currentCart[i].name}</h3>
                <h3 className="shoppingCartItemPrice" >Price: {currentCart[i].price}</h3>
                </div>
            </div>
        );
        totalPrice += parseInt(currentCart[i].price);
    }
    
    const ChangeToPayment = () => {
        loadPaymentPage(props.shopperData);
    }
    
    insideShoppingList.push(
        <div className="shoppingCartPurchaseSection">
            <h3>Total Price: {totalPrice}</h3>
            <input type="submit" className="purchase" value="Purchase" onClick={ChangeToPayment} data-shopperid={shopper._id} csrf={_csrf} />
        </div>    
    );
    
    return (
        <div className="shoppingCart">
            {insideShoppingList}
        </div>
    )
}

const loadPurchaseComplete = (shopperData, paymentInformation) => {
    let tempShopper = {
        id:shopperData._id,
        _csrf:_csrf,
    }
    
    sendAjax('POST', '/emptyCart', tempShopper, (data) => {
        ReactDOM.unmountComponentAtNode(document.querySelector("#paymentPage"));
    
        ReactDOM.render(
            <PurchaseCompletePage shopperData={shopperData} paymentInformation={paymentInformation} />, document.querySelector("#purchaseComplete")
        ); 
        
    });
    return false;
    
    
}

const PurchaseCompletePage = function(props) {
    let insidePurchaseComplete = [];
    
    let itemsList = [];
    
    for(let i = 0; i < props.shopperData.cart.length; i++){
        itemsList.push(
            <li>{props.shopperData.cart[i].name}</li>
        );
    }
    
    const BackToShoppersList = () => {
        ReactDOM.unmountComponentAtNode(document.querySelector("#purchaseComplete"));
        
        setup(_csrf);
    }
    
    insidePurchaseComplete.push(
        <div id="purchaseCompletePage">
            <h1>Thank You for your purchase!</h1>
            <h2>Your order of</h2>
            <ol>
                {itemsList}
            </ol>
            
            <h2>These Items will be delivered to {props.paymentInformation.address} in {props.paymentInformation.deliveryTime}</h2>
            
            <input type="submit" className="returnToShoppers" value="Return to Shopper's List" onClick={BackToShoppersList} data-shopperid={shopper._id} csrf={_csrf} />
        </div>
    );
    
    return(
        <div>
            {insidePurchaseComplete}
        </div>
    )
}

const loadPaymentPage = (shopperData) => {
    ReactDOM.unmountComponentAtNode(document.querySelector("#shoppingCart"));
    
    ReactDOM.render(
        <PaymentPage shopperData={shopperData} />, document.querySelector("#paymentPage")
    ); 
}

const PaymentPage = function(props) {
    let insidePaymentInfo = [];
    
    let paymentInformation = {
        address: 'Middle of the Ocean',
        deliveryTime: '50 years',
    }
    
    const ChangeToPurchaseComplete = () => {
        loadPurchaseComplete(props.shopperData, paymentInformation);
    }
    
    insidePaymentInfo.push(
        <div className="shoppersInformation">
            <h2>Name: {props.shopperData.name}</h2>
            <h2>Money: {props.shopperData.money}</h2>
            <h2>Age: {props.shopperData.age}</h2>
            <h2>Address: {paymentInformation.address}</h2>
            <h2>Time of Delivery: {paymentInformation.deliveryTime}</h2>
            <input type="submit" className="paymentComplete" value="Confirm Payment" onClick={ChangeToPurchaseComplete} data-shopperid={shopper._id} csrf={_csrf} />
        </div>
    );
    
    return(
        <div className="paymentInformation">
            {insidePaymentInfo}
        </div>
    )
}

const paymentComplete = () => {
    //some send ajax call
}

const loadShoppingOptions = (shopperId, category) => {
    sendAjax('GET', '/getShopper', null, (data) => {
        GetCurrentShopper(shopperId, category);
        //ReactDOM.render(
        //    <ShoppingOptions shopperId={shopperId} category={category} />, document.querySelector("#shoppingOptions")
        //); 
        
        ReactDOM.unmountComponentAtNode(document.querySelector("#makeShopper"));
        ReactDOM.unmountComponentAtNode(document.querySelector("#shoppers"));
        
    });
}


const loadShoppersFromServer = () => {
    sendAjax('GET', '/getShopper', null, (data) => {
        ReactDOM.render(
            <ShopperList shoppers={data.shoppers} />, document.querySelector("#shoppers")
        ); 
    });
};

const setup = function(csrf) {
    _csrf = csrf;
    
    ReactDOM.render(
        <ShopperForm csrf={csrf} />, document.querySelector("#makeShopper")
    );
    
    ReactDOM.render(
        <ShopperList shoppers={[]} />, document.querySelector("#shoppers")
    );
    
    loadShoppersFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
}); 

