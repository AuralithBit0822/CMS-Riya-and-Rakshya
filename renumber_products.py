import re

# Read the file
with open(r'C:\Users\supriya\OneDrive\Desktop\rnr-food-products\rnr-website\src\data\products.js', 'r') as f:
    content = f.read()

# Find the PRODUCTS array
pattern = r'(export const PRODUCTS = \[)([\s\S]*?)(\];)'
match = re.search(pattern, content)

if match:
    prefix = match.group(1)
    products_content = match.group(2)
    suffix = match.group(3)
    
    # Extract individual product objects
    # Split by }, but keep the braces
    product_pattern = r'(\{[^{]*(?:\{[^{]*\}[^{]*)*\})'
    products = re.findall(product_pattern, products_content)
    
    # Renumber products sequentially
    new_products = []
    for i, product in enumerate(products, 1):
        # Replace the id field
        updated_product = re.sub(r'id:\s*\d+', f'id: {i}', product)
        new_products.append(updated_product)
    
    # Join products with proper formatting
    new_products_content = ',\n\n   '.join(new_products)
    
    # Reconstruct the content
    new_content = content[:match.start(1)] + prefix + '\n\n   ' + new_products_content + '\n' + suffix + content[match.end(3):]
    
    # Write back to file
    with open(r'C:\Users\supriya\OneDrive\Desktop\rnr-food-products\rnr-website\src\data\products.js', 'w') as f:
        f.write(new_content)
    
    print(f"Renumbered {len(new_products)} products sequentially from 1 to {len(new_products)}")
else:
    print("Could not find PRODUCTS array")