let _csrf;

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
            </div>
        );
    });

    return (
        <div className="shopperList">
            {shopperNodes}
        </div>
    );
};


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

