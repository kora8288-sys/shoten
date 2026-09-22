/* ============================================================
   SHOP PRODUCTS — edit this file to add, remove, rename or
   reprice pieces. js/shop.js reads it and builds the grid on
   shop.html.

   Each entry is just 5 things:
     id     unique slug — keep it stable once it's live
     name   shown under the image (PLACEHOLDER — rename these)
     price  a number (renders as $45.00) or a string ('POA')
     img1   the FIRST image — what shows normally
     img2   the SECOND image — what shows on hover (or tap, on phone)

   To change a product's photos, just change its img1 / img2 path
   below and put a matching file in assets/shop/ — nothing else in
   the site needs to change. Every product already has its own
   pair of files (assets/shop/<id>-1.jpg and <id>-2.jpg), so
   replacing one product's photos never affects another product's.
   ============================================================ */
window.SK_PRODUCTS = [
  {
    id: 'mentaliti-tee',
    name: 'MENTALITI TEE',
    price: 45,
    img1: 'assets/shop/mentaliti-tee-1.jpg',
    img2: 'assets/shop/mentaliti-tee-2.jpg'
  },
  {
    id: 'dreams-tee',
    name: 'I HAVE A LOT OF DREAMS TEE',
    price: 38,
    img1: 'assets/shop/dreams-tee-1.jpg',
    img2: 'assets/shop/dreams-tee-2.jpg'
  },
  {
    id: 'polaroid-tee',
    name: 'ARCHIVE TEE',
    price: 42,
    img1: 'assets/shop/polaroid-tee-1.jpg',
    img2: 'assets/shop/polaroid-tee-2.jpg'
  },
  {
    id: 'vamp-tee',
    name: 'NIGHT TEE',
    price: 42,
    img1: 'assets/shop/vamp-tee-1.jpg',
    img2: 'assets/shop/vamp-tee-2.jpg'
  },
  {
    id: 'restrained-tee',
    name: 'DECAY INC. 04 TEE',
    price: 42,
    img1: 'assets/shop/restrained-tee-1.jpg',
    img2: 'assets/shop/restrained-tee-2.jpg'
  },
  {
    id: 'rhinestone-set',
    name: 'RHINESTONE HOODIE SET',
    price: 128,
    img1: 'assets/shop/rhinestone-set-1.jpg',
    img2: 'assets/shop/rhinestone-set-2.jpg'
  },
  {
    id: 'crewneck-teal',
    name: 'BALACLAVA CREWNECK',
    price: 58,
    img1: 'assets/shop/crewneck-teal-1.jpg',
    img2: 'assets/shop/crewneck-teal-2.jpg'
  }
];