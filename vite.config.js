import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/cart.html"),
        checkout: resolve(__dirname, "src/checkout/checkout.html"),
        success: resolve(__dirname, "src/checkout/success.html"),
      },
    },
  },
});
