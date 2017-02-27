/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var Liqpay= require('./liqPay.js');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
    var allPiza="";
    var amount=0;
    for(var i=0;i<order_info.Cart.length;i+=1){
        allPiza+=order_info.Cart[i].quantity+" "+order_info.Cart[i].size+" "+order_info.Cart[i].pizza.title+", ";
        amount+=(order_info.Cart[i].pizza[order_info.Cart[i].size].price)*order_info.Cart[i].quantity;
    }
    var LIQPAY_PUBLIC_KEY = 'i56166407707';
        var LIQPAY_PRIVATE_KEY = 'Wsih6qojE5ZJftNkEiuAd34mgYiAlXOXh8LGoETB';
        var order	=	{
            version:	3,
            public_key:	LIQPAY_PUBLIC_KEY,
            action:	"pay",
            amount:	amount,
            currency:	"UAH",
            description:order_info.name+", Адреса доставки: "+order_info.address+", номер телефону: "+order_info.phone+". "+allPiza+"Разом: "+amount+" грн",
            order_id:	Math.random(),
            //!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
            sandbox:	1
        };
        
        
        var data	=	Liqpay.base64(JSON.stringify(order));
        var signature	=	Liqpay.sha1(LIQPAY_PRIVATE_KEY	+	data	+	LIQPAY_PRIVATE_KEY);
    
    res.send({
        success: true,
        data: data,
        signature: signature
    });
};