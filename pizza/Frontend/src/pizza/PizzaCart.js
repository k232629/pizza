/**
 * Created by chaika on 02.02.16.
 */
var localStorage = require('../localStorage');
var Templates = require('../Templates');
var API=require('../API');
//var LiqPay=require('../liqPay.js');
var SAVED_PIZZA_KEY="savedPizza";
var map;
var directionDisplay;
var check = true;
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#right-cart");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
console.log('in add');
    //Приклад реалізації, можна робити будь-яким іншим способом
    
    
    var contain = false;
    for(var i =0; i < Cart.length; i++){
        if(Cart[i].pizza.title===pizza.title&&Cart[i].size===size){Cart[i].quantity++;
            contain=true;
        }
    }

    if(!contain){
        Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1
    });
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
      var index = Cart.indexOf(cart_item);
      Cart.splice(index,1);
      updateCart();

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    var savedPizza=localStorage.get("savedPizza");
    if(savedPizza){
        Cart = savedPizza;
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    var price=0;
    var priceForOne=0;
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    localStorage.set(SAVED_PIZZA_KEY,Cart);
    //Очищаємо старі піци в кошику
    $cart.html("");
    if(Cart.length==0){
        $(".sum-number").text("0 грн");
    }
    
    

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        
        var $node = $(html_code);
        
        price+=(cart_item.pizza[cart_item.size].price)*cart_item.quantity;
        priceForOne=0;
        priceForOne+=(cart_item.pizza[cart_item.size].price)*cart_item.quantity;

       $node.find('#plu').click(function(){
           console.log("plus");
            cart_item.quantity++;
            updateCart();
        });

        $node.find('#min').click(function(){
            console.log("mines");
            if(cart_item.quantity>1){
            cart_item.quantity--;
            updateCart();
            }
            else if(cart_item.quantity>0){
                removeFromCart(cart_item);
            }


        });

        $node.find('#remove').click(function(){
            console.log("remove");
            removeFromCart(cart_item);

        });
        
        $("#clear").click(function(){
            console.log("clear");
            clearAll();
        });
        
        $(".sum-number").text(price+"грн");
        $node.find(".price").text(priceForOne+"грн");
        $cart.append($node);
    }

    $("#order-count").text(Cart.length);
    Cart.forEach(showOnePizzaInCart);
    
    
    
    //кнопка далі
    //var public key='';
    //var private key='';
    
    //var order перед цим
    
    //var data = liqpay.base64  var signature
    //liqpay checjin init
    
} 
$("#data-submit").click(function(){
    //console.log("Order=" ,Cart);  
    check=true;
    validate_name();
    validate_phone();
    if(form.address.value.length==0){
            $(".address-help-block").css("display","block");
            check=false;
    }
    if(form.name.value.length==0){
            $(".address-help-block").css("display","block");
            check=false;
    }
    if(form.phone.value.length==0){
            $(".address-help-block").css("display","block");
            check=false;
    }
    
    var name = form.name.value;
        var phone = form.phone.value;
        var address =form.address.value; 
        var data	=	{
            Cart: Cart,
            name: name,
            phone:phone, 
            address: address
};
    if (check){
     API.createOrder(data,function(err,data){
                if(err){
                    console.log("err")
                }else{
                    console.log(data);
                    LiqPayCheckout.init({
                        data:	data.data,
                        signature:	data.signature,
                        embedTo:	"#liqpay",
                        mode:	"popup"	//	embed	||	popup
                    }).on("liqpay.callback",	function(data){
                        console.log(data.status);
                        console.log(data);
                    }).on("liqpay.ready",	function(data){
                        //	ready
                    }).on("liqpay.close",	function(data){
                        //	close
                    });
                }
         //alert("Все вірно")
});
    }else{
        //alert("Введіть коректно дані");
    }
});


function	initialize()	{
    console.log("map");
    var markerHome;
    var point;
    //Тут починаємо працювати з картою
    var mapProp =	{
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom:	13
    };
    var html_element =	document.getElementById("googleMap");
    map =	new	google.maps.Map(html_element,	 mapProp);
    point	=	new	google.maps.LatLng(50.464379,30.519131);
    var marker	=	new	google.maps.Marker({
        position:	point,
        animation: google.maps.Animation.DROP,
        map:	map,
        icon:	"assets/images/map-icon.png"
    });
    google.maps.event.addListener(map,	'click',function(me){
        
        if(markerHome){
            markerHome.setMap(null);
            markerHome = null;
        }
        var coordinates	=	me.latLng;
        markerHome	=	new	google.maps.Marker({
            position:	coordinates,
            animation: google.maps.Animation.DROP,
            map:	map,
            icon:	"assets/images/home-icon.png"
        });
        geocodeLatLng(coordinates,	function(err,	adress){
            if(!err)	{
                $("#inputAdress").val(adress);
                $("#myAdress").text(adress);
              
            }
        })
        calculateRoute(point,	 me.latLng,	function(err, time){
           if(!err){
               $("#time").text(time.duration.text);
             
           } 
        });	
});
}
$("#inputAdress").keypress(function(){
        if( $("#inputAdress").val().length>4){
            var coordinates;
            if(markerHome){
                markerHome.setMap(null);
                markerHome = null;
            }
            var address = $("#inputAdress").val();
            geocodeAddress(address, function(err, inputCoordinates){
                if(!err){
                    coordinates	=	inputCoordinates;
                    console.log(coordinates);
                    markerHome	=	new	google.maps.Marker({
                        position:	coordinates,
                        animation: google.maps.Animation.DROP,
                        map:	map,
                        icon:	"assets/images/home-icon.png"
                    });
                    geocodeLatLng(coordinates,	function(err,	adress){
                        if(!err)	{
                            console.log(address);
                            $("#myAdress").text(adress);
                        }
                    });
                    calculateRoute(point,	 coordinates,	function(err, time){
                        if(!err){
                            $("#time").text(time.duration.text);

                        } 
                    });
                } 
            });
            
        }
    });
    
    

    function	geocodeLatLng(latlng,	 callback){
        //Модуль за роботу з адресою
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'location':	latlng},	function(results,	status)	{
            if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
                var adress =	results[1].formatted_address;
                callback(null,	adress) ;
            }	else	{
                callback(new	Error("Can't	find	adress"));
            }
        });
}

    
    function	geocodeAddress(adress,	 callback)	{
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'address':	address},	function(results,	status)	{
            if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
                var coordinates	=	results[0].geometry.location;
               
                callback(null,	coordinates);
            }	else	{
                callback(new	Error("Can	not	find	the	adress"));
            }
        });
    }
    
    function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
        if(directionDisplay){
            directionDisplay.setMap(null);
            directionDisplay=null;
        }
        directionDisplay = new google.maps.DirectionsRenderer();
        var directionService =	new	google.maps.DirectionsService();
        directionService.route({
            origin:	A_latlng,
            destination:	B_latlng,
            travelMode:	google.maps.TravelMode["DRIVING"]
        },	function(response,	status)	{
            if	(	status	==	google.maps.DirectionsStatus.OK )	{
                directionDisplay.setDirections(response);
                var leg	=	response.routes[	0	].legs[	0	];
                callback(null,	{
                    duration:	leg.duration
                });
            }	else	{
                callback(new	Error("Can'	not	find	direction"));
            } 
        });
       directionDisplay.setMap(map);

    }



    //Коли сторінка завантажилась

google.maps.event.addDomListener(window, 'load', initialize);

function clearAll() {
  Cart = [];
   $(".sum-number").text("0 грн");
   updateCart();
}

function validate_name (){
    var name = form.name.value;
    var name_pattern= new RegExp("[a-zA-Z]");
    var check1 = name_pattern.test(name);
       if(check1==false){
            console.log("name false");
            check=false;
           $(".name-help-block").css("display","block");
        }
      
}

function validate_phone(){
    var phone = form.phone.value;
    var phone_pattern=new RegExp(/^\d{10}$/);
    var check2=phone_pattern.test(phone);
    if(check2==false){
             console.log("phone false");
             check=false;
        $(".phone-help-block").css("display","block");
    }
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;