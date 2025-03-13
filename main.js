(function () {
    $(document).ready(function () {
        if (!$('.product-detail').length) return;

        const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
        const STORAGE_KEY = "product_list";
        const FAVORITES_KEY = "favorite_products";

        let favoriteProducts = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        let products = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!products) {
            $.getJSON(API_URL, function (data) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                renderCarousel(data);
            });
        } else {
            renderCarousel(products);
        }

        function renderCarousel(products) {
            let container = $('<div class="product-carousel">').append('<h2>Benzer Ürünler</h2>');

            // Ürünleri taşıyan bir dış div oluşturuyoruz
            let carouselWrapper = $('<div class="carousel-wrapper">');
            let carousel = $('<div class="carousel-inner">');

            products.forEach(product => {
                let isFavorite = favoriteProducts.includes(product.id);
                let productItem = $(
                    `<div class="product-item">
                        <a href="${product.url}" target="_blank">
                            <img src="${product.img}" alt="${product.name}" />
                        </a>
                        <p>${product.name}</p>
                        <span>${product.price.toFixed(2)} TRY</span>
                        <div class="heart ${isFavorite ? 'favorite' : ''}" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#d3d3d3" stroke-width="2"/>
                            </svg>
                        </div>
                    </div>`
                );
                carousel.append(productItem);
            });

            carouselWrapper.append(carousel);

            // Sağ ve sol oklar ekleyin
            let leftArrow = $('<button class="carousel-control prev"><</button>');
            let rightArrow = $('<button class="carousel-control next">></button>');

            // Sağ ve sol okların işlevlerini tanımlayın
            leftArrow.on('click', function () {
                carousel.scrollLeft(carousel.scrollLeft() - 200); // 200px sola kaydır
            });
            rightArrow.on('click', function () {
                carousel.scrollLeft(carousel.scrollLeft() + 200); // 200px sağa kaydır
            });

            // Okları, carouselWrapper'ın yanına ekleyin
            carouselWrapper.append(leftArrow, rightArrow);
            container.append(carouselWrapper);

            $('.product-detail').after(container);

            // Kalp ikonunun işlevselliği
            $('.heart').on('click', function () {
                let id = $(this).data('id');
                let svgPath = $(this).find('svg path');

                if (favoriteProducts.includes(id)) {
                    favoriteProducts = favoriteProducts.filter(favId => favId !== id);
                    $(this).removeClass('favorite');
                    svgPath.css('stroke', '#d3d3d3');  // Gri çizgi
                } else {
                    favoriteProducts.push(id);
                    $(this).addClass('favorite');
                    svgPath.css('stroke', 'rgb(25, 61, 176)');  // Mavi çizgi
                    svgPath.css('fill', 'rgb(25, 61, 176)'); // İçini mavi yap
                }

                localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteProducts));
            });
        }

        // Stil eklemesi
        const styles = `
            <style>
                .product-carousel {
                    padding: 40px;
                    text-align: left;
                    position: relative;
                }

                .product-carousel h2 {
                    font-size: 20px;
                    margin-bottom: 10px;
                    text-align: left;
                    padding-left: 10px;
                }

                .carousel-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }

                .carousel-inner {
                    display: flex;
                    overflow-x: auto;
                    gap: 15px;
                    padding: 10px;
                    scroll-behavior: smooth;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    justify-content: flex-start;
                }

                .carousel-inner::-webkit-scrollbar {
                    display: none;
                }

                .product-item {
                    flex: 0 0 auto;
                    width: 210px;
                    text-align: left;
                    position: relative;
                    height: 400px;
                }

                .product-item img {
                    width: 100%;
                    border-radius: 8px;
                }

                .product-item p {
                    color: black;
                    text-decoration: none !important;
                }

                .product-item span {
                    color: blue;
                    text-decoration: none !important;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    text-align: left;
                }

                .heart {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    cursor: pointer;
                    font-size: 24px;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.3s ease;
                }

                .heart svg {
                    width: 70%;
                    height: 70%;
                    fill: none;
                    stroke-width: 2;
                    background-color: white;
                    border-radius: 3px;
                }

                .heart.favorite svg {
                    stroke: rgb(25, 61, 176);
                    fill: rgb(25, 61, 176);
                }

                .carousel-control {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: transparent;
                    color: black;
                    border: none;
                    padding: 10px;
                    cursor: pointer;
                    font-size: 24px;
                    z-index: 10;
                }

                .prev {
                    left: -35px;
                }

                .next {
                    right: -35px;
                }

                @media (max-width: 768px) {
                    .product-item {
                        width: 150px; /* Daha küçük ekranlar için ürün genişliği */
                        height: 350px; /* Ürün yüksekliği daha küçük ekranlar için */
                    }

                    .carousel-control {
                        font-size: 18px; /* Okların boyutlarını küçültüyoruz */
                        padding: 8px;
                    }

                    .product-carousel {
                        padding: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .product-item {
                        width: 120px; /* Daha da küçük ekranlar için */
                        height: 300px;
                    }

                    .carousel-control {
                        font-size: 16px;
                        padding: 6px;
                    }

                    .product-carousel {
                        padding: 10px;
                    }
                }

            </style>
        `;
        $('head').append(styles);
    });
})();
