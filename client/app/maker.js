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
    const pants = [{name:'Black Cargo', price:20}, 
                   {name:'White Cargo', price:20}, 
                   {name:'Red Cargo', price:20}];
    const accessories = [{name:'Necklace', price:20}, 
                         {name:'Bracelet', price:20}, 
                         {name:'Ring', price:20}];

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

const AddToCart = (e) => {
    //adds the selected item to cart of the shopper
    //reload the same shopperoptions
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
    
    sendAjax('GET', '/getCurrentShopper', null, (data) => {
        ReactDOM.render(
            <ShoppingOptions shopperData={data.shopper} category={category} />, document.querySelector("#shoppingOptions")
        ); 
        
        //for now load all the reactDOMs to screen just to see
        ReactDOM.render(
            <ShoppingCart shopperData={data.shopper} category={category} />, document.querySelector("#shoppingCart")
        ); 
        ReactDOM.render(
            <PaymentPage shopperData={data.shopper} category={category} />, document.querySelector("#paymentPage")
        ); 
        
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
    console.log(props);
    
    insideShopperInfo.push(<h2 className="shopperInfoText">Shopper's Name</h2>);
    insideShopperInfo.push(<h2 className="shopperInfoText">Shopper's Money</h2>);
    insideShopperInfo.push(<h2 className="shopperInfoText">Shopper's Cart</h2>);
    shopperInfoDisplay = (
        <div id="currentShopper">
            {insideShopperInfo}
        </div>
    );
    
    let insideCategorySelect = [];
    insideCategorySelect.push(<h2>Shopping Category</h2>);
    for(let i = 0; i < categories.length; i++){
        const CallChange = () => {
            ChangeCategory(categories[i], props.shopperId)
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
            insideDisplay.push(<div className="itemDisplay shirt">
                <img src={shirts[i].src} alt={shirts[i].alt}/>
                <h3>{shirts[i].name}</h3>
                <h3>Price: {shirts[i].price}</h3>
                <input type="submit" className="addToCart" value="Add to Cart" onClick={AddToCart} data-shopperid={shopper._id} csrf={_csrf} />
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
            insideDisplay.push(<div className="itemDisplay pant">
                <img src="" alt=""/>//will add later
                <h3>{pants[i].name}</h3>
                <h3>Price: {pants[i].price}</h3>
                <input type="submit" className="addToCart" value="Add to Cart" onClick={AddToCart} data-shopperid={shopper._id} csrf={_csrf} />
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
            insideDisplay.push(<div className="itemDisplay accessory">
                <img src="" alt=""/>//will add later
                <h3>{accessories[i].name}</h3>
                <h3>Price: {accessories[i].price}</h3>
                <input type="submit" className="addToCart" value="Add to Cart" onClick={AddToCart} data-shopperid={shopper._id} csrf={_csrf} />
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

const loadShoppingCart = () => {
    
}

const ShoppingCart = function(props) {
    let shoppingList;
    let insideShoppingList =[];
    let totalPrice = 0;
    //get the shopping cart list from the shopper object
    
    //for now just push all shirts to display
    for(let i = 0; i < shirts.length; i++){
        insideShoppingList.push(
            <div className="shoppingCartItem">
                <img className="shoppingCartItemIMG" src={shirts[i].src} alt={shirts[i].alt}></img>
                <div className="shoppingCartItemTextHolder">
                    <h3 className="shoppingCartItemName" >{shirts[i].name}</h3>
                <h3 className="shoppingCartItemPrice" >Price: {shirts[i].price}</h3>
                </div>
            </div>
        );
        totalPrice += shirts[i].price;
    }
    
    insideShoppingList.push(
        <div className="shoppingCartPurchaseSection">
            <h3>Total Price: {totalPrice}</h3>
            <input type="submit" className="purchase" value="Purchase" onclick={purchaseItems} data-shopperid={shopper._id} csrf={_csrf} />
        </div>    
    );
    
    return (
        <div className="shoppingCart">
            {insideShoppingList}
        </div>
    )
}

const purchaseItems = () => {
    //some send ajax call
}

const loadPaymentPage = () => {
    
}

const PaymentPage = function(props) {
    //let shopperInfo = props.shopper; //use this later
    
    //made up shopperInfo to test
    let shopperInfo = {
        name: 'Shopper1',
        money: 10000,
        age: 4,
        cart: []
    };
    
    let insidePaymentInfo = [];
    insidePaymentInfo.push(
        <div className="shoppersInformation">
            <h2>{shopperInfo.name}</h2>
            <h2>{shopperInfo.money}</h2>
            <h2>{shopperInfo.age}</h2>
            <input type="submit" className="paymentComplete" value="Payment Complete" onclick={purchaseComplete} data-shopperid={shopper._id} csrf={_csrf} />
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

