import type { CartItem } from "../types";

interface CartProps {
  cartItems: CartItem[];
  total: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onClear: () => void;
}

export function Cart({
  cartItems,
  total,
  onIncrement,
  onDecrement,
  onClear,
}: CartProps) {
  const isEmpty = cartItems.length === 0;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="cart" aria-label="Shopping cart">
      <div className="cart__header">
        <h2>Cart</h2>
        <span>{itemCount} item(s)</span>
      </div>

      {isEmpty ? (
        <p className="cart__empty">Cart is empty</p>
      ) : (
        <>
          <ul className="cart__list">
            {cartItems.map((item) => {
              const singleItem = item.quantity === 1;

              return (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__details">
                    <span className="cart-item__name">{item.name}</span>
                    <span className="cart-item__line-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="cart-item__controls">
                    <button
                      type="button"
                      aria-label={
                        singleItem
                          ? `Remove ${item.name} from cart`
                          : `Decrease quantity of ${item.name}`
                      }
                      onClick={() => onDecrement(item.id)}
                    >
                      {singleItem ? "🗑" : "−"}
                    </button>
                    <span aria-label={`Quantity ${item.quantity}`}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => onIncrement(item.id)}
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="cart__footer">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <button type="button" className="cart__clear" onClick={onClear}>
            Clear cart
          </button>
        </>
      )}
    </aside>
  );
}
