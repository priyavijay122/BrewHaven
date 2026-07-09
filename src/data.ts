import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    description: 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and topped with a caramel drizzle.',
    price: 349,
    category: 'Signature',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviews: 142,
    ingredients: ['Espresso', 'Steamed Milk', 'Vanilla Syrup', 'Caramel Drizzle'],
    region: 'Coorg Estates',
    roast: 'Medium Dark'
  },
  {
    id: 'saffron-cardamom-latte',
    name: 'Saffron Cardamom Latte',
    description: 'An aromatic infusion of Kashmiri saffron strands and ground green cardamom, blended with velvety espresso and steamed milk.',
    price: 299,
    category: 'Signature',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviews: 98,
    ingredients: ['Espresso', 'Steamed Milk', 'Saffron', 'Cardamom', 'Gold Leaf'],
    region: 'Chikmagalur Hills',
    roast: 'Medium'
  },
  {
    id: 'coorg-cold-brew',
    name: 'Coorg Special Cold Brew',
    description: 'Slow-steeped for 18 hours using single-origin Coorg Arabica beans, resulting in an exceptionally smooth, low-acid, bold coffee.',
    price: 259,
    category: 'Cold Brews',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviews: 86,
    ingredients: ['18-hr Cold Brew', 'Ice Cubes', 'Touch of Honey'],
    region: 'Coorg Estates',
    roast: 'Dark'
  },
  {
    id: 'hazelnut-praline-latte',
    name: 'Hazelnut Praline Latte',
    description: 'Rich espresso combined with toasted hazelnut praline syrup, steamed milk, and a dusting of sweet cocoa powder.',
    price: 289,
    category: 'Lattes',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviews: 115,
    ingredients: ['Espresso', 'Steamed Milk', 'Hazelnut Syrup', 'Cocoa Powder'],
    region: 'Nilgiris Valley',
    roast: 'Medium'
  },
  {
    id: 'classic-double-espresso',
    name: 'Classic Double Espresso',
    description: 'An intense, full-bodied double shot extracted to perfection, displaying a rich, hazelnut-colored crema.',
    price: 149,
    category: 'Espresso',
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviews: 210,
    ingredients: ['Double Espresso Shot'],
    region: 'Chikmagalur Hills',
    roast: 'Dark'
  },
  {
    id: 'irish-cream-brew',
    name: 'Irish Cream Cold Brew',
    description: 'Our signature slow-steeped cold brew sweetened with Irish cream syrup, crowned with a thick layer of vanilla sweet cream cold foam.',
    price: 329,
    category: 'Cold Brews',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviews: 73,
    ingredients: ['Cold Brew', 'Irish Cream Syrup', 'Vanilla Cold Foam', 'Cocoa Dusting'],
    region: 'Coorg Estates',
    roast: 'Medium Dark'
  },
  {
    id: 'dark-chocolate-mocha',
    name: 'Dark Chocolate Mocha',
    description: 'Espresso poured over rich, premium dark chocolate sauce, combined with steamed milk and topped with dark chocolate shavings.',
    price: 319,
    category: 'Espresso',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop',
    rating: 4.6,
    reviews: 130,
    ingredients: ['Espresso', 'Dark Chocolate Sauce', 'Steamed Milk', 'Chocolate Shavings'],
    region: 'Chikmagalur Hills',
    roast: 'Dark'
  },
  {
    id: 'vanilla-bean-cappuccino',
    name: 'Vanilla Bean Cappuccino',
    description: 'Espresso topped with a thick, luxurious layer of aerated milk foam, infused with real Madagascar vanilla bean extract.',
    price: 279,
    category: 'Lattes',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviews: 64,
    ingredients: ['Espresso', 'Foamed Milk', 'Madagascar Vanilla Bean'],
    region: 'Nilgiris Valley',
    roast: 'Light'
  }
];

export const CATEGORIES = ['All', 'Signature', 'Espresso', 'Lattes', 'Cold Brews'];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Aishwarya Sen',
    role: 'Connoisseur & Food Critic',
    comment: 'The Saffron Cardamom Latte is a masterclass in culinary fusion. The subtle warmth of saffron combined with the bold Chikmagalur roast is exquisite. Brew Haven is a sanctuary for real coffee lovers.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150'
  },
  {
    id: 't2',
    name: 'Rohan Malhotra',
    role: 'Tech Lead, Bengaluru',
    comment: 'The 18-hour cold brew has the smoothest finish I’ve ever experienced. It’s my absolute daily go-to. Plus, the ambiance and luxury feel of the place makes it a perfect third space.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
  },
  {
    id: 't3',
    name: 'Meera Nair',
    role: 'Lifestyle Blogger',
    comment: 'From the golden typography to the incredibly rich Caramel Macchiato, every detail screams premium craft. Absolutely obsessed with their branding and quality!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'
  }
];
