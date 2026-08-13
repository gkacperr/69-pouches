CLICK FIX

Problem:
The repository already contained berry-blast.html and the new navigation code,
but index.html still loaded script.js with the old cache key ?v=5full.
A browser could therefore keep using the previous JavaScript.

Fix:
1. index.html now loads script.js?v=berry-product-2
2. The ENTIRE Berry Blast product card is clickable (image, name, price, empty area).
3. Add + remains a separate cart action.
4. Keyboard Enter/Space also opens the product page.

Upload ONLY index.html and script.js from this ZIP to the ROOT of the repository
and overwrite the existing files. Then wait for GitHub Pages deployment and refresh once.
