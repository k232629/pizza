/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = [];
var API=require('../API');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});
        var orderCount=0;
        var $node = $(html_code);
        //console.log(list);
        $node.find(".buy-button-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-button-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });
        
        $pizza_list.append($node);
    }
        
        

       // console.log(list);

        list.forEach(showOnePizza);
}

function filterPizza(filter) {
//Масив куди потраплять піци які треба показати
var pizza_shown = [];

if(filter==="all"){
    Pizza_List.forEach(function(pizza){
        pizza_shown.push(pizza);
        $("#pizzas-count").text("8");
    });
}   
    else {
        var count=0;
        Pizza_List.forEach(function(pizza){
            if(pizza.content.hasOwnProperty(filter)){
                pizza_shown.push(pizza);
                count++;
                $("#pizzas-count").text(count);
                
            }
        });
    }
showPizzaList(pizza_shown);


} 
function initialiseMenu() {
    
    //Показуємо усі піци
    
    API.getPizzaList(function(err,data){
        if(err){
            Pizza_List=[];
        }else{
            Pizza_List=data;
            //console.log(Pizza_List);
            showPizzaList(Pizza_List);
            
        }
                     
    });
      
    
    $("#all").click(function(){
            console.log("all");
            $("#type-pizza-text").text("Усі Піци");
            filterPizza("all");

            });
        $("#meat").click(function(){
            $("#type-pizza-text").text("З М'ясом");
            filterPizza("meat");
        });
        $("#pineapple").click(function(){
            $("#type-pizza-text").text("З Ананасами");
            filterPizza("pineapple");
        });
        $("#ocean").click(function(){
            $("#type-pizza-text").text("З Морепродуктами");
            filterPizza("ocean");
        });
        $("#tomato").click(function(){
            $("#type-pizza-text").text("Вега");
            filterPizza("tomato");
        });
        $("#mushroom").click(function(){
            $("#type-pizza-text").text("З Грибами");
            filterPizza("mushroom");
        });
    
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;