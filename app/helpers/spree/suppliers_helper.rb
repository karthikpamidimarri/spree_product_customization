module Spree
  module SuppliersHelper
    def get_variant_quantity(variant_id)
      @current_order = current_order
      if @current_order
        line_item = @current_order.line_items.select{| line_item | line_item.variant_id == variant_id}
        if line_item.count > 0
          line_item[0].quantity
        end
      end
    end
  end
end