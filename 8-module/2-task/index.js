import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  elem = null
  filteredProducts = []
  #inner = null
  

  constructor(products) {
    this.products = products;
    this.filteredProducts = this.products;
    this.filters = {};

    this.#render();
    
  }

  updateFilter = filters => {
    Object.entries(filters).map(filter => {
      this.filters[filter[0]] = filter[1];
    });

    this.filteredProducts = this.products;

    if (this.filters.noNuts) {
      this.filteredProducts = this.filteredProducts.filter(product => product.nuts === false || !('nuts' in product));
    } 
    
    if (this.filters.vegeterianOnly) {
      this.filteredProducts = this.filteredProducts.filter(product => product.vegeterian);
    } 
    
    if ('maxSpiciness' in this.filters) {
      this.filteredProducts = this.filteredProducts.filter(product => product.spiciness <= this.filters.maxSpiciness);
    } 
    
    if ('category' in this.filters && this.filters.category !== '') {
      this.filteredProducts = this.filteredProducts.filter(product => product.category === this.filters.category);
    }

    this.#renderProducts();
  }

  #html() {
    return `
    <div class="products-grid">
      <div class="products-grid__inner">
        <!--ВОТ ТУТ БУДУТ КАРТОЧКИ ТОВАРОВ-->
      </div>
    </div>
    `;
  }

  #render() {
    this.elem = createElement(this.#html());
    this.#inner = this.elem.querySelector('.products-grid__inner');

    this.#renderProducts();
  }

  #renderProducts = () => {
    this.#inner.innerHTML = '';

    this.filteredProducts.forEach(product => {
      let card = new ProductCard(product);
      this.#inner.append(card.elem);
    });
  }
}
