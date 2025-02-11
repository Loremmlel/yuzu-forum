const getAssetsFile = (name: string) => `/alert/${name}.webp`

const number = randomNum(0, 3)

let loli = ''
let name = ''

switch (number) {
    case 0:
        name = 'あーちゃん'
        break
    case 1:
        name = 'こじかひわ'
        break
    case 2:
        name = '雪々'
        break
    case 3:
        name = '琥珀'
        break
}
loli = getAssetsFile(name)

export default {loli, name}