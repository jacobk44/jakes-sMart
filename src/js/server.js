// const express = require("express");
// const Stripe = require("stripe");
// const cors = require("cors"); // Add this
// const app = express();

// // Initialize Stripe with your secret key
// // const stripe = Stripe("sk_test_51S9BFlBJ9M6MHM4906ByqS3el5SMAwYzTgsYZU0jJREQwJxGhcP1Od1dSh6Nwgay5HQyKeUgJb01juKKKRQwueWB00rnpuu4LM"); // Replace with your actual Stripe test key

// app.use(cors()); // Add this to allow cross-origin requests
// app.use(express.json());
// app.use(express.static("src")); // Serve static files from src directory

// // Endpoint to create a Checkout session
// app.post("/create-checkout-session", async (req, res) => {
//     try {
//         const { cart, shipping } = req.body;

//         // Validate input
//         if (!cart || !Array.isArray(cart) || cart.length === 0) {
//             return res.status(400).json({ error: "Invalid or empty cart" });
//         }
//         if (!shipping || !shipping.firstName || !shipping.lastName || !shipping.street) {
//             return res.status(400).json({ error: "Incomplete shipping information" });
//         }

//         // Map cart items to Stripe line_items
//         const line_items = cart.map(item => {
//             const price = Number(item.price) || 0;
//             const quantity = Number(item.quantity) || 1;
//             if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
//                 return null; // Skip invalid items
//             }
//             return {
//                 price_data: {
//                     currency: "usd",
//                     product_data: {
//                         name: item.title || "Unnamed Product",
//                         description: item.description || "No description",
//                         images: item.image ? [item.image] : [],
//                     },
//                     unit_amount: Math.round(price * 100), // Convert to cents
//                 },
//                 quantity,
//             };
//         }).filter(item => item !== null); // Remove null entries

//         if (line_items.length === 0) {
//             return res.status(400).json({ error: "No valid items in cart" });
//         }

//         // Calculate subtotal for verification
//         const subtotal = line_items.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0);

//         // Add shipping as a line item if cart is not empty
//         let totalInCents = subtotal;
//         if (line_items.length > 0) {
//             line_items.push({
//                 price_data: {
//                     currency: "usd",
//                     product_data: {
//                         name: "Shipping",
//                         description: "Flat rate shipping",
//                     },
//                     unit_amount: 500, // $5.00 in cents
//                 },
//                 quantity: 1,
//             });
//             totalInCents += 500; // Add shipping to total
//         }

//         // Add tax (8%) as a separate line item
//         const taxAmount = Math.round(subtotal * 0.08); // 8% tax
//         if (taxAmount > 0) {
//             line_items.push({
//                 price_data: {
//                     currency: "usd",
//                     product_data: {
//                         name: "Tax",
//                         description: "8% Sales Tax",
//                     },
//                     unit_amount: taxAmount,
//                 },
//                 quantity: 1,
//             });
//             totalInCents += taxAmount;
//         }

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items,
//             mode: "payment",
//             success_url: "http://localhost:3000/checkout/success.html?session_id={CHECKOUT_SESSION_ID}",
//             cancel_url: "http://localhost:3000/checkout/cancel.html",
//             shipping_address_collection: {
//                 allowed_countries: ["US"],
//             },
//             metadata: {
//                 firstName: shipping.firstName,
//                 lastName: shipping.lastName,
//                 street: shipping.street,
//                 city: shipping.city,
//                 state: shipping.state,
//                 zip: shipping.zip,
//             },
//         });

//         if (session.amount_total !== totalInCents) {
//             // No console warning, but you can add validation logic if needed
//         }
//         res.json({ url: session.url });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(5173, () => { });