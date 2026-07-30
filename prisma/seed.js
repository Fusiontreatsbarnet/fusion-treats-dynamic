const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const menuItems = [
  { name: "New Rice Bowl", category: "mains", badge: "POPULAR", price: "£8.99", description: "Tender, saucy chicken bites served over fluffy white rice with crisp shredded lettuce, carrots, cucumbers, and red onions." },
  { name: "Double Bacon Cheeseburger", category: "mains", price: "£9.99", description: "Two juicy beef patties with melted cheese, crispy bacon, lettuce, red onion, pickles & signature sauce." },
  { name: "Signature Bacon Sarni", category: "mains", price: "£5.99", description: "Crispy, thick-cut bacon topped with a perfectly fried runny egg and rich brown sauce on thick toasted bread." },
  { name: "Brisket Burger", category: "brisket", badge: "NEW", price: "£9.99", description: "Spicy BBQ sauce, crispy onions, 2oz smashed beef patty, cheese slice & 100g slow-cooked brisket." },
  { name: "Triple Down Brisket Sandwich", category: "brisket", badge: "NEW", price: "£10.99", description: "Spicy BBQ sauce, crispy onion, 2oz smashed beef patty with mozzarella cheese & 100g brisket." },
  { name: "Brisket Loaded Fries / Tots", category: "brisket", badge: "NEW", price: "£10.99", description: "Golden fries or tots topped with spicy BBQ, mozzarella cheese, 100g brisket, crispy onion & jalapeños." },
  { name: "Flaming Nachos Burger", category: "burgers", price: "£7.99", description: "Crunchy premium nachos, rich cheese sauce, and a spicy signature kick." },
  { name: "Volcano Cheese Burger", category: "burgers", price: "£7.99", description: "Oozing with an extra layer of premium, rich molten cheese sauce." },
  { name: "Shroom Stack Burger", category: "burgers", price: "£7.99", description: "Savoury, juicy sautéed mushrooms and premium melted cheese." },
  { name: "Smashed Beef Burger", category: "burgers", price: "£6.99", description: "Our classic smashed beef patty burger." },
  { name: "Grilled Chicken Burger", category: "burgers", price: "£6.99", description: "Char-grilled chicken burger." },
  { name: "Fried Chicken Burger", category: "burgers", price: "£6.99", description: "Crispy fried chicken burger." },
  { name: "Loaded Fries", category: "burgers", price: "£7.99", description: "Grilled chicken, fried chicken or beef, loaded on golden fries." },
  { name: "Loaded Tots", category: "burgers", price: "£7.99", description: "Grilled chicken, fried chicken or beef, loaded on tater tots." },
  { name: "Beef Double Down Sandwich", category: "sandwiches", price: "£7.99", description: "Our famous double-stacked sandwich, beef." },
  { name: "Fried Chicken Double Down Sandwich", category: "sandwiches", price: "£7.99", description: "Our famous double-stacked sandwich, fried chicken." },
  { name: "Grilled Chicken Double Down Sandwich", category: "sandwiches", price: "£7.99", description: "Our famous double-stacked sandwich, grilled chicken." },
  { name: "Wings or Tenders — 3 Pieces", category: "wings", price: "£4.99", description: "Crispy fried chicken wings or golden tenders, served hot." },
  { name: "Wings or Tenders — 5 Pieces", category: "wings", price: "£6.99", description: "Crispy fried chicken wings or golden tenders, served hot." },
  { name: "Wings or Tenders — 8 Pieces", category: "wings", price: "£8.99", description: "Crispy fried chicken wings or golden tenders, served hot." },
  { name: "Classic Burger Fries Meal", category: "combos", price: "£9.99", description: "Any Classic Burger + golden fries or tater tots + a cold drink." },
  { name: "Classic Burger Wings Meal", category: "combos", price: "£10.99", description: "Any Classic Burger + 3 wings or 3 tenders + a cold drink." },
  { name: "Special Burger / Sandwich Fries Meal", category: "combos", price: "£10.99", description: "Any Special Burger or Double Down Sandwich + fries/tots + a cold drink." },
  { name: "Special Burger / Sandwich Wings Meal", category: "combos", price: "£11.99", description: "Any Special Burger or Double Down Sandwich + 3 wings/tenders + a cold drink." },
  { name: "Egg Muffin", category: "breakfast", price: "£3.50", description: "Classic egg muffin, all day." },
  { name: "Egg and Sausage Muffin", category: "breakfast", price: "£4.50", description: "Egg and sausage muffin, all day." },
  { name: "Tater Tots Breakfast Muffin", category: "breakfast", price: "£5.50", description: "Breakfast muffin loaded with tater tots." },
  { name: "Plain Fries", category: "sides", price: "£2.99", description: "Crispy, salted, always fresh." },
  { name: "Plain Tots", category: "sides", price: "£3.99", description: "Golden tater tots." },
  { name: "Cheesy Fries / Tots", category: "sides", price: "£4.40", description: "Fries or tots topped with rich cheese." },
  { name: "Spicy BBQ Fries / Tots", category: "sides", price: "£4.50", description: "Fries or tots with spicy BBQ sauce." },
  { name: "Chilli Cheese Bites (6pcs)", category: "sides", price: "£4.99", description: "Six chilli cheese bites." },
  { name: "Mac n Cheese Bites (6pcs)", category: "sides", price: "£4.99", description: "Six mac and cheese bites." },
  { name: "Chicken Popcorn", category: "sides", price: "£4.99", description: "Bite-sized crispy popcorn chicken." },
  { name: "Grilled Chicken Wrap", category: "sides", price: "£5.99", description: "Grilled chicken or beef wrap." },
  { name: "Grilled Chicken Salad Box", category: "sides", price: "£5.99", description: "Fresh salad box with grilled chicken." },
  { name: "Pistachio Kunafa Pancake", category: "desserts", price: "£5.99", description: "Fluffy pancake stack with premium pistachio sauce & crunchy toasted kunafa." },
  { name: "Dubai Chocolate Strawberries", category: "desserts", price: "£5.99", description: "Fresh strawberries with rich chocolate & signature Dubai-style pistachio filling." },
  { name: "Strawberry Kunafa Delight", category: "desserts", price: "£6.99", description: "Decadent pancake stack with fresh strawberries, chocolate drizzle & kunafa." },
  { name: "Berry Banana Bliss", category: "desserts", price: "£4.99", description: "Fluffy pancake stack with fresh strawberries, banana slices & fine icing sugar." },
  { name: "Berry Fresh Cooler", category: "drinks", price: "£3.99", description: "Fruity strawberry refresher with cooling mint." },
  { name: "Classic Cuban Cooler", category: "drinks", price: "£3.99", description: "Zesty mojito with fresh mint leaves & lime." },
  { name: "Lychee Glow Cooler", category: "drinks", price: "£3.99", description: "Refreshing aromatic lychee cooler with a fizzy twist." },
  { name: "Blue Ocean Cooler", category: "drinks", price: "£3.99", description: "Cool, crisp, beautifully vibrant & refined." },
  { name: "Cold Drink Can", category: "drinks", price: "£1.49", description: "Choice of cold canned soft drink." },
  { name: "Still Water (Evian)", category: "drinks", price: "£0.99", description: "Bottled still water." },
];

const reviews = [
  { name: "Kian", rating: 5, content: "The staff are incredibly friendly and helpful, offering discounts for students and public sector workers. Every item I've tried has been outstanding." },
  { name: "Yasmin Saadat", rating: 5, content: "My favourite place to eat after studying. The hygiene is excellent, the menu offers plenty of choice, and the staff are incredibly kind." },
  { name: "Paige Goodenough", rating: 5, content: "We've ordered twice now and the food and service have been absolutely amazing. Highly recommend the Smash Burgers and Loaded Fries." },
  { name: "Yumna Chaudhry", rating: 5, content: "The grilled chicken and beef burgers were outstanding — fresh, juicy and full of flavour. Everything prepared with genuine care." },
  { name: "CCSAS", rating: 5, content: "Fresh flavours with quality ingredients. The Beef Double Down Sandwich was my favourite. Highly recommended." },
];

async function main() {
  console.log("Seeding menu items...");
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  console.log("Seeding reviews...");
  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@fusiontreats.uk";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  console.log(`Creating admin user: ${adminEmail}`);
  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPassword, 10),
    },
  });

  console.log("Done. IMPORTANT: log in and change the admin password if you used the default.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
