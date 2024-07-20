import { Random } from './Random';

export abstract class Orthography {
    abstract name: string;
    abstract generateWord(): string;
}

export abstract class ConsonantVowelOrthography extends Orthography {
    abstract consonants: string[];
    abstract followingConsonants: string[];
    abstract vowels: string[];
    abstract ligatures: { [key: string]: string; };
    abstract maxSegments: number;

    baseWord(): string {
        const r = Math.random();
        const length = 1 + Math.floor(r * r * this.maxSegments);

        const letters: string[] = [];

        const addC = () => letters.push(Random.choice(this.consonants));
        const addCFollow = () => letters.push(Random.choice(this.followingConsonants));
        const addV = () => letters.push(Random.choice(this.vowels));

        while (letters.length < length) {
            if (Math.random() < 0.05) addV();
            if (Math.random() < 1.00) addC();
            if (Math.random() < 0.20) addCFollow();
            if (Math.random() < 0.05) addCFollow();
            if (Math.random() < 1.00) addV();
            if (Math.random() < 0.20) addV();
            if (Math.random() < 0.10) addV();
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

export class LatinOrthography extends ConsonantVowelOrthography {
    name = 'Latin';
    maxSegments: number = 6;
    consonants = "bcdfghjklmnpqrstvwxyz".split("");
    followingConsonants = "bcgklprstyz".split("");
    vowels = "aeiou".split("");
    ligatures = {};
}


export class ShavianOrthography extends ConsonantVowelOrthography {
    name = "Shavian";
    maxSegments: number = 6;
    consonants = "𐑐 𐑚 𐑑 𐑛 𐑒 𐑜 𐑓 𐑝 𐑔 𐑞 𐑕 𐑟 𐑖 𐑠 𐑗 𐑡 𐑘 𐑢 𐑙 𐑣 𐑤 𐑮 𐑥 𐑯".split(" ");
    followingConsonants = this.consonants;
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
}

export class OldItalicOrthography extends ConsonantVowelOrthography {
    name = "Old Italic";
    maxSegments: number = 6;
    consonants = "𐌁 𐌂 𐌃 𐌅 𐌆 𐌇 𐌈 𐌊 𐌋 𐌌 𐌍 𐌎 𐌐 𐌑 𐌒 𐌛 𐌔 𐌕 𐌗 𐌘 𐌙 𐌚".split(" ");
    followingConsonants = this.consonants;
    vowels = "𐌀 𐌄 𐌉 𐌏 𐌖".split(" ");
    ligatures = {};
}

export class PheonicianOrthography extends ConsonantVowelOrthography {
    name = "Phoenician";
    maxSegments = 8;
    consonants = "𐤀 𐤁 𐤂 𐤃 𐤄 𐤅 𐤆 𐤇 𐤈 𐤉 𐤊 𐤋 𐤌 𐤍 𐤎 𐤏 𐤐 𐤑 𐤒 𐤓 𐤔 𐤕".split(" ");
    followingConsonants = this.consonants;
    vowels = [];
    ligatures = {};
}

export class GreekOrthography extends ConsonantVowelOrthography {
    name = "Greek";
    maxSegments = 10;
    consonants = `β γ δ ζ θ κ λ μ ν ξ π ρ σ τ φ χ ψ`.split(" ");
    followingConsonants = `γ δ θ κ λ μ ν ξ π ρ σ τ φ`.split(" ");
    ;
    vowels = "α ε η ι ο υ ω".split(" ");
    ligatures = { "και": "ϗ", "στ": "ϛ" };
}

export const orthographies: Orthography[] = [
    new LatinOrthography(),
    new ShavianOrthography(),
    new OldItalicOrthography(),
    new PheonicianOrthography(),
    new GreekOrthography(),
];