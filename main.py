from PIL import Image, ImageDraw

lineWidth = 20
nHorizontal = 5
nVertical = 4

if __name__ == '__main__':
    image = Image.open("field_2022.png")
    width, height = image.size

    # Draw some lines
    draw = ImageDraw.Draw(image)

    # add a grid to the image
    for x in range(0, width, int(width/nHorizontal)):
        draw.rectangle((x - int(lineWidth/2), 0, x + int(lineWidth/2), int(height)), fill=(0, 0, 0))
    for y in range(0, height, int(height/nVertical)):
        draw.rectangle((0, y - int(lineWidth/2), int(width), y + int(lineWidth/2)), fill=(0, 0, 0))

    # create a border around the image with a width of 20
    draw.rectangle((0, 0, int(width), int(lineWidth)), fill=(0, 0, 0))
    draw.rectangle((0, 0, int(lineWidth), int(height)), fill=(0, 0, 0))

    draw.rectangle((0, int(height - lineWidth), int(width), int(height)), fill=(0, 0, 0))
    draw.rectangle((int(width - lineWidth), 0, int(width), int(height)), fill=(0, 0, 0))

    # Save the image
    image.save("field_2022_lines.png")