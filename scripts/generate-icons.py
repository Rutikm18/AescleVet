#!/usr/bin/env python3
"""
Generate PWA icons for Medicine Management app
Requires: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw
    import os
    import sys
except ImportError:
    print("Error: Pillow is not installed.")
    print("Please install it by running: pip install Pillow")
    sys.exit(1)

def generate_icon(size):
    """Generate a medicine-themed icon"""
    # Create image with gradient background
    img = Image.new('RGB', (size, size), color='#0ea5e9')
    draw = ImageDraw.Draw(img)
    
    # Create gradient effect (simplified - solid color with darker bottom)
    for y in range(size):
        ratio = y / size
        r = int(14 + (2 - 14) * ratio)  # 0x0e to 0x02
        g = int(165 + (132 - 165) * ratio)  # 0xa5 to 0x84
        b = int(233 + (199 - 233) * ratio)  # 0xe9 to 0xc7
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # Draw pill shape (white)
    center_x = size // 2
    center_y = size // 2
    pill_width = int(size * 0.5)
    pill_height = int(size * 0.3)
    
    # Calculate pill coordinates
    left = center_x - pill_width // 2
    right = center_x + pill_width // 2
    top = center_y - pill_height // 2
    bottom = center_y + pill_height // 2
    radius = pill_height // 2
    
    # Draw rounded rectangle (pill)
    draw.rounded_rectangle(
        [(left, top), (right, bottom)],
        radius=radius,
        fill='white',
        outline=None
    )
    
    # Draw division line
    line_width = max(int(size * 0.02), 2)
    draw.line(
        [(center_x, top), (center_x, bottom)],
        fill='#0ea5e9',
        width=line_width
    )
    
    # Draw dots (medicine details)
    dot_radius = max(int(size * 0.03), 3)
    dot_color = '#0ea5e9'
    
    # Left side dots
    draw.ellipse(
        [(center_x - pill_width // 4 - dot_radius, center_y - pill_height // 4 - dot_radius),
         (center_x - pill_width // 4 + dot_radius, center_y - pill_height // 4 + dot_radius)],
        fill=dot_color
    )
    draw.ellipse(
        [(center_x - pill_width // 4 - dot_radius, center_y + pill_height // 4 - dot_radius),
         (center_x - pill_width // 4 + dot_radius, center_y + pill_height // 4 + dot_radius)],
        fill=dot_color
    )
    
    # Right side dots
    draw.ellipse(
        [(center_x + pill_width // 4 - dot_radius, center_y - pill_height // 4 - dot_radius),
         (center_x + pill_width // 4 + dot_radius, center_y - pill_height // 4 + dot_radius)],
        fill=dot_color
    )
    draw.ellipse(
        [(center_x + pill_width // 4 - dot_radius, center_y + pill_height // 4 - dot_radius),
         (center_x + pill_width // 4 + dot_radius, center_y + pill_height // 4 + dot_radius)],
        fill=dot_color
    )
    
    return img

def main():
    # Get the project root directory (parent of scripts)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    public_dir = os.path.join(project_root, 'public')
    
    # Create public directory if it doesn't exist
    os.makedirs(public_dir, exist_ok=True)
    
    # Generate icons
    sizes = [192, 512]
    for size in sizes:
        icon = generate_icon(size)
        output_path = os.path.join(public_dir, f'icon-{size}.png')
        icon.save(output_path, 'PNG')
        print(f'✅ Generated icon-{size}.png ({size}x{size})')
    
    print(f'\n🎉 All icons generated successfully in {public_dir}/')

if __name__ == '__main__':
    main()

