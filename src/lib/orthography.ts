import { Random } from './Random';

export abstract class Orthography {
    abstract name: string;
    abstract generateWord(): string;
}

export class LatinOrthography extends Orthography {
    name = 'Latin';

    generateWord(): string {
        const initialConsonants = "bcdfghjklmnpqrstvwxyz".split("");
        const trailingConsonants = "bcgklprstyz".split("");
        const vowels = "aeiou".split("");

        const r = Math.random();
        const length = 1 + Math.floor(r * r * 6);

        let letters: string[] = [];

        const addInitC = () => letters.push(Random.choice(initialConsonants));
        const addTrailC = () => letters.push(Random.choice(trailingConsonants));
        const addV = () => letters.push(Random.choice(vowels));

        while (letters.length < length) {
            if (Math.random() < 0.05) addV();
            if (Math.random() < 1.00) addInitC();
            if (Math.random() < 0.20) addTrailC();
            if (Math.random() < 0.05) addTrailC();
            if (Math.random() < 1.00) addV();
            if (Math.random() < 0.20) addV();
            if (Math.random() < 0.10) addV();
        }
        if (Math.random() < 0.333) addInitC();

        return letters.join("");
    }
}

export class ShavianOrthography extends Orthography {
    name = "Shavian";

    consonants = "𐑐 𐑚 𐑑 𐑛 𐑒 𐑜 𐑓 𐑝 𐑔 𐑞 𐑕 𐑟 𐑖 𐑠 𐑗 𐑡 𐑘 𐑢 𐑙 𐑣 𐑤 𐑮 𐑥 𐑯".split(" ");
    vowels = "𐑦 𐑰 𐑧 𐑱 𐑨 𐑲 𐑩 𐑳 𐑪 𐑴 𐑫 𐑵 𐑬 𐑶 𐑭 𐑷".split(" ");
    ligatures = {
        "𐑭𐑮": "𐑸",
        "𐑷𐑮": "𐑹",
        "𐑧𐑩𐑮": "𐑺",
        "𐑧𐑮": "𐑻",
        "𐑩𐑮": "𐑼",
        "𐑦𐑩𐑮": "𐑽",
        "𐑰𐑩": "𐑾",
        "𐑘𐑵": "𐑿",
    };


    baseWord(): string {
        const r = Math.random();
        const length = 1 + Math.floor(r * r * 6);

        const letters: string[] = [];

        const addC = () => letters.push(Random.choice(this.consonants));
        const addV = () => letters.push(Random.choice(this.vowels));

        while (letters.length < length) {
            if (Math.random() < 0.05) addV();
            if (Math.random() < 1.00) addC();
            if (Math.random() < 0.20) addC();
            if (Math.random() < 0.05) addC();
            if (Math.random() < 1.00) addV();
            if (Math.random() < 0.20) addV();
            if (Math.random() < 0.05) addV();
        }
        if (Math.random() < 0.333) addC();

        return letters.join("");
    }

    generateWord(): string {
        let base = this.baseWord();
        for (const [ligature, replacement] of Object.entries(this.ligatures)) {
            base = base.replaceAll(ligature, replacement);
        }
        return base;
    }
}

export const orthographies: Orthography[] = [
    new LatinOrthography(),
    new ShavianOrthography(),
];