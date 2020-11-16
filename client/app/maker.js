let _csrf;

const handleShopper = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val()=='' || $("#domoLevel").val() =='') {
        handleError("RAWR! All fields are required");
        return false;
    }
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        
        loadShoppersFromServer();
    });
    
    return false;
};

const LevelUpShopper = (e) => {
    e.preventDefault();
    
    //console.log(_csrf);
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
    
    let domoData = {
        id: e.target.dataset.domoid,
        _csrf: _csrf,
    }
    
    sendAjax('POST', '/levelUp', domoData, loadShoppersFromServer);
    return false;
};

const ShopperForm = (props) => {
    return (
        <form id="domoForm" 
            onSubmit={handleShopper}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Shopper Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Shopper Age"/>
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="text" name="level" placeholder="Shopper Level"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Shopper" />
        </form>
    );  
};

const ShopperList = function(props) {
    if(props.domos.length===0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Shoppers yet</h3>
            </div>
        );
    } 

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>
                <input className="levelUpDomo" type="submit" value="Level Up" onClick={LevelUpShopper} data-domoid={domo._id} csrf={_csrf} />
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};


const loadShoppersFromServer = () => {
    sendAjax('GET', '/getShopper', null, (data) => {
        ReactDOM.render(
            <ShopperList domos={data.domos} />, document.querySelector("#domos")
        ); 
    });
};

const setup = function(csrf) {
    _csrf = csrf;
    
    ReactDOM.render(
        <ShopperForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <ShopperList domos={[]} />, document.querySelector("#domos")
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

