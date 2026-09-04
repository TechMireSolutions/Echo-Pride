const fs = require('fs');
const files = [
  'src/pages/Shop.jsx',
  'src/pages/ProductDetail.jsx',
  'src/pages/Home.jsx',
  'src/pages/CheckoutPage.jsx',
  'src/pages/Blog.jsx',
  'src/pages/About.jsx',
  'src/components/CategoryCarousel.jsx'
];
for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/src=\{\`\/\$\{([a-zA-Z0-9_.]+)\}\`\}/g, "src={getImageUrl($1)}");
    
    if (content.includes('getImageUrl(') && !content.includes('getImageUrl')) {
       // Just insert the import if needed, but actually we can just use the simpler conditional fallback
    }
    
    // Instead of using getImageUrl, let's just do a string replacement inline
    // Because importing getImageUrl everywhere requires parsing imports.
    // Let's re-run with inline fallback:
    content = fs.readFileSync(file, 'utf8');
    content = content.replace(/src=\{\`\/\$\{([a-zA-Z0-9_.]+)\}\`\}/g, "src={$1 ? ($1.startsWith('/') ? $1 : `/${$1}`) : ''}");
    
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  }
}
