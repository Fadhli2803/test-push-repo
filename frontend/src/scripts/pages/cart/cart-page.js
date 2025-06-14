import { generateCartDetailsOrderTemplate, generateCartItemsTemplate } from "../../template";
import CartPresenter from "./cart-presenter"
import Database from "../../database"

export default class CartPage {
  #presenter = null;
  
  async render() {
      return `
        <section id="cart" class="cart background-section">
          <div class="cart-container">
            <h1>Shopping Cart</h1>

            <div class="cart-list-container">
              <div class="cart-list">
                <div class="cart-box cart-item__header">
                  <h3>Daftar Pesanan</h3>
                </div>
              
                <div id="cart-list-display"></div>
              </div>
            
              <div class="cart-box cart-details">
                <h3>Rincian</h3>
                <div id="cart-details-order-container"></div>
                
                <hr />
                <div class="cart-details-order cart-details-total">
                  <p class="cart-details__name">Total</p>
                  <p class="cart-details__price">150K</p>
                </div>
                <hr />
                <button class="button green-button cart-details__button">Beli</button>
              </div>
            </div>
          </div>
        </section>  
      `
  }

  async afterRender() {
    this.#presenter = new CartPresenter({
      view: this,
      dbModel: Database,
    });
    await this.#presenter.initialGalleryAndMap();
    this.#deleteItemFromDatabase();
  }
  
  populateShopItemsList(message, items) {
    const shopItemsHTML = items.reduce((acc, item) => {
      return acc.concat(generateCartItemsTemplate(item));
    }, '');
    
    const cartItemHTML = items.reduce((acc, item) => {
      return acc.concat(generateCartDetailsOrderTemplate(item));
    }, '');

    document.getElementById('cart-list-display').innerHTML = `
      <div class="cart-list-display">${shopItemsHTML}</div>
    `;
    
    document.getElementById('cart-details-order-container').innerHTML = `
      <div class="cart-details-order-container">${cartItemHTML}</div>
    `;
  }

  #deleteItemFromDatabase() {
    const cartList = document.getElementById('cart-list-display');

    cartList.addEventListener('click', async (event) => {
      const closeBtn = event.target.closest('.cart-item__close-button');
      if (!closeBtn) return;

      const itemElement = closeBtn.closest('.cart-item');
      const itemId = itemElement?.dataset.itemid;
      if (!itemId) return;

      const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus pesanan Anda?");
      if (!confirmDelete) return;

      await this.#presenter.removeShopItem(itemId);
      await this.#presenter.initialGalleryAndMap();
    });
  }
}
