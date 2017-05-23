// Placeholder manifest file.
// the installer will append this file to the app vendored assets here: vendor/assets/javascripts/spree/frontend/all.js'
//= require spree/frontend
//= require_tree .

$(document).ready(function () {
    $(document).on('click','a.add-to-cart-item',function(){
        var save = $(this);
        var variant_id = save.data('variant-id');
        addToCartItems(variant_id);
        removeItemsFromCart(variant_id,quantity,orderNumber,token);
        return false;
    });
});

enableOrDisabled = function(variant_id,quantity){
    alert(quantity);
    if(quantity<0){
        $('button#remove-product-' + variant_id).hide();
    }
}

addToCartItems = function(variant_id,quantity){
    if(variant_id && quantity) {
        $.ajax({
            type: "POST",
            url: "/orders/populate",
            data: {
                variant_id: variant_id,
                quantity: quantity
            }
        }).done(function (data) {
            handleSuccessResponseOfCartforAdd(data,variant_id);
        }).fail(function (data) {
            flashErrorMessage(data);
        });
    }
}
/*Flash message for 5 sec*/
flashErrorMessage = function (data) {
    setTimeout(function(){
        if ($('div.alert.alert-error').length > 0) {
            $('div.alert.alert-error').remove();
        }
    }, 5000)
    $('div.alert.alert-error').remove()
    $(window).scrollTop($('div#content.col-sm-12').prepend("<div class='alert alert-error'>" + JSON.parse(data.responseText).error_message.replace(/['"]+/g, '') + "</div>").offset().top);
}

handleSuccessResponseOfCartforAdd = function (orderData,variant_id) {
    document.getElementById("orderNumber").value = orderData.number;
    document.getElementById("orderGuestToken").value = orderData.guest_token;
    $.ajax({
        type: "GET",
        url: Spree.url(Spree.routes.get_current_order(orderData))
    }).done(function(data){
        for (var i = 0; i < data.line_items.length; i++) {
            if (data.line_items[i].variant_id === variant_id) {
                $('#supplier-selected-product-' + variant_id + '.item-quantity').html("<span class='item-quantity-amount'><span class='item-qty'>" + data.line_items[i].quantity + "</span></span><span class='item-quantity-label'>in cart</span>");
                if(variant_id && data.line_items[i].quantity > 0){
                    $('button#remove-product-' + variant_id).show();
                }
            }
        }
    });
    $('#link-to-cart').html("<a class='cart-info full' href='/cart'><span class='glyphicon glyphicon-shopping-cart'></span> Cart: (" + orderData.item_count + ") <span class='amount'>&#x20b9; " + orderData.item_total + "</span></a>");
}



removeItemsFromCart = function (variant_id,quantity) {
    var data = {
        number : document.getElementById("orderNumber").value,
        guest_token : document.getElementById("orderGuestToken").value
    }
    $.ajax({
        type: "GET",
        url: Spree.url(Spree.routes.get_current_order(data))
    }).done(function(data){
        //Update Type is "PATCH" so it's expecting only line_item_id and quantity to patch
        var patch_line_items = []
        for (var i = 0; i < data.line_items.length; i++) {
            if (data.line_items[i].variant_id === variant_id) {
                data.line_items[i].quantity = data.line_items[i].quantity-quantity;
            }
            patch_line_items.push({quantity:data.line_items[i].quantity,id:data.line_items[i].id});
        }
        if(variant_id && quantity){
            $.ajax({
                type: "PATCH",
                url: "/cart",
                data: {
                    order:{
                        line_items_attributes: patch_line_items
                    }
                }
            }).done(function (data) {
                handleSuccessResponseOfCartforRemove(data,variant_id,patch_line_items);
            }).fail(function (msg) {
                console.log(msg.error);
            });
        }
    })
}

handleSuccessResponseOfCartforRemove = function (orderData,variant_id,line_items) {
    $.ajax({
        type: "GET",
        url: Spree.url(Spree.routes.get_current_order(orderData))
    }).done(function(data){
        for (var i = 0; i < data.line_items.length; i++) {
            if (data.line_items[i].variant_id === variant_id && data.line_items[i].quantity > 0) {
                $('#supplier-selected-product-' + variant_id + '.item-quantity').html("<span class='item-quantity-amount'><span class='item-qty'>" + data.line_items[i].quantity + "</span></span><span class='item-quantity-label'>in cart</span>");
            }
        }
        for(var i = 0; i < line_items.length; i++) {
            if(line_items[i].quantity < 1) {
                $('#supplier-selected-product-' + variant_id + '.item-quantity').html("<span class='item-quantity-amount'></span><span class='item-quantity-label'></span>");
                $('button#remove-product-' + variant_id).hide();
            }
        }
    });
    if(orderData.item_count>0){
        $('#link-to-cart').html("<a class='cart-info full' href='/cart'><span class='glyphicon glyphicon-shopping-cart'></span> Cart: (" + orderData.item_count + ") <span class='amount'>&#x20b9; " + orderData.item_total + "</span></a>");
    }else {
        $('#link-to-cart').html("<a class='cart-info empty' href='/cart'><span class='glyphicon glyphicon-shopping-cart'></span> Cart: (Empty) </a>");
    }
}