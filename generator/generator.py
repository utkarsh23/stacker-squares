from PIL import Image

def main():
    counter = 0
    for i in range(1111, 1123):
        for j in range(1101, 1111):
            for k in range(1091, 1101):
                counter += 1
                emoji = Image.open(f"./assets/EMOJI/IMG_{k}.PNG")
                img = Image.open(f"./assets/CUBE/IMG_{j}.PNG")
                background = Image.open(f"./assets/BG/IMG_{i}.PNG")
                background.paste(img, (0, 0), img)
                background.paste(emoji, (0, 0), emoji)
                background.save(f'./collection/{counter}.png',"PNG")

if __name__ == '__main__':
    main()
