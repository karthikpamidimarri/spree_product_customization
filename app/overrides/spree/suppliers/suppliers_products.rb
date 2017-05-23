
Deface::Override.new(:virtual_path => 'spree/suppliers/_products',
                     :name => "add_order_number_hidden_field",
                     :insert_top => "div.panel.panel-default",
                     :text => "
                     <input type='hidden' id='orderNumber' value='<%= simple_current_order.number%>'/>
    "
)

Deface::Override.new(:virtual_path => 'spree/suppliers/_products',
                     :name => "add_orderGuestToken_hidden_field",
                     :insert_bottom => "div.panel.panel-default",
                     :text => "
                     <input type='hidden' id='orderGuestToken' value='<%= simple_current_order.guest_token%>'/>
    "
)

Deface::Override.new(:virtual_path => 'spree/suppliers/_products',
                     :name => "accesing_product_master_id_instead_of_product_id",
                     :replace => "erb[loud]:contains('product.id')",
                     :text => "<div id='supplier-product-<%= product.master.id %>' class='col-md-3 col-sm-6 product-list-item'
                               data-hook='products-list-item' itemscope itemtype='http://schema.org/Product'>"
)

Deface::Override.new(:virtual_path => 'spree/suppliers/_products',
                     :name => "display_cart_items_quantity",
                     :insert_top => "div.panel.panel-default",
                     :text => "
                     <div class='item-quantity' id='supplier-selected-product-<%= product.master.id %>'>
					              <span class='item-quantity-amount'>
                            <span class='item-qty'><%= get_variant_quantity(product.master.id)%></span>
					              </span>
                        <% if !get_variant_quantity(product.master.id).nil? %>
                            <span class='item-quantity-label'>in cart</span>
                        <% else %>
                            <span class='item-quantity-label'></span>
                        <%end%>
                     </div>"
)
Deface::Override.new(:virtual_path => 'spree/suppliers/_products',
                     :name => "add_remove_buttons",
                     :insert_after => "div.panel-footer.text-center",
                     :text => "
                     <% if !product.can_supply? %>
								<button disabled onclick='addToCartItems(<%= product.master.id %>,1)' id='add-product-<%= product.master.id %>'><div class='add-to-cart-item btn btn-success btn-sm'>+</div></button>
<% else %>
								<button onclick='addToCartItems(<%= product.master.id %>,1)' id='add-product-<%= product.master.id %>'><div class='add-to-cart-item btn btn-success btn-sm'>+</div></button>
<%end%>

    <% if !get_variant_quantity(product.master.id).nil? %>
						    <button id='remove-product-<%= product.master.id %>' onclick='removeItemsFromCart(<%= product.master.id %>,1)'><div class='remove-cart-item btn btn-success btn-sm'>-</div></button>
<% else %>
									<button id='remove-product-<%= product.master.id %>' style='display: none' onclick='removeItemsFromCart(<%= product.master.id %>,1)'><div class='remove-cart-item btn btn-success btn-sm'>-</div></button>
<%end%>
    ")