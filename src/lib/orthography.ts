import { Random } from './Random';

export type OrthoDir = "ltr" | "rtl";

export abstract class Orthography {
    abstract name: string;
    abstract note: string;
    abstract orthoDir: OrthoDir;
    abstract sample: string;
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

export class RomanOrthography extends ConsonantVowelOrthography {
    name = 'Roman';
    note = "The Roman alphabet. Easiest for new players who speak English.";
    sample: string = "REXO RENIV CAPORTEOF QEI";
    orthoDir: OrthoDir = "ltr";
    maxSegments: number = 6;
    consonants = "BCDFGHJKLMNPQRSTVWXYZ".split("");
    followingConsonants = "BCGKLPRSTYZ".split("");
    vowels = "AEIO".split("");
    ligatures = {};
}


export class ShavianOrthography extends ConsonantVowelOrthography {
    name = "Shavian";
    note = "A phonetic, constructed alphabet designed to replace the English alphabet.";
    sample: string = "𐑘𐑧 𐑤𐑗𐑫𐑧𐑞 𐑐𐑱𐑕𐑰 𐑘𐑭𐑑 𐑕𐑱𐑕𐑣𐑲𐑒𐑡𐑪";
    orthoDir: OrthoDir = "ltr";
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
    note = "A dead script used by the Etruscans and other ancient Italian peoples.";
    sample: string = "𐌑𐌀𐌁𐌉𐌖𐌒 𐌆𐌖𐌀𐌌𐌛𐌄𐌕 𐌛𐌖𐌄𐌕 𐌖𐌐𐌏𐌖";
    orthoDir: OrthoDir = "ltr";
    maxSegments: number = 6;
    consonants = "𐌁 𐌂 𐌃 𐌅 𐌆 𐌇 𐌈 𐌊 𐌋 𐌌 𐌍 𐌎 𐌐 𐌑 𐌒 𐌛 𐌔 𐌕 𐌗 𐌘 𐌙 𐌚".split(" ");
    followingConsonants = this.consonants;
    vowels = "𐌀 𐌄 𐌉 𐌏 𐌖".split(" ");
    ligatures = {};
}

export class PheonicianOrthography extends ConsonantVowelOrthography {
    name = "Phoenician";
    note = "An ancient script used by the Phoenicians and other ancient Mediterranean peoples.";
    sample: string = "𐤒𐤃 𐤈𐤎𐤁 𐤉 𐤊𐤎𐤋𐤅";
    orthoDir: OrthoDir = "rtl";
    maxSegments = 8;
    consonants = "𐤀 𐤁 𐤂 𐤃 𐤄 𐤅 𐤆 𐤇 𐤈 𐤉 𐤊 𐤋 𐤌 𐤍 𐤎 𐤏 𐤐 𐤑 𐤒 𐤓 𐤔 𐤕".split(" ");
    followingConsonants = this.consonants;
    vowels = [];
    ligatures = {};

    generateWord(): string {
        const superWord = super.generateWord();
        const RLE_MARK = "\u202B";
        const PDF_MARK = "\u202C";
        return `${RLE_MARK}${superWord}${PDF_MARK}`;
    }
}

export class GreekOrthography extends ConsonantVowelOrthography {
    name = "Greek";
    note = "The greek letters used in ancient times and today.";
    sample: string = "πωδεα λταμεοθωιη ϙιγυρη θητο δμιοͳνυχε";
    orthoDir: OrthoDir = "ltr";
    maxSegments = 10;
    consonants = `β γ δ ζ θ κ λ μ ν ξ π ρ σ τ φ χ ψ ϝ ϙ ͳ`.split(" ");
    followingConsonants = `γ δ θ κ λ μ ν ξ π ρ σ τ φ`.split(" ");
    vowels = "α ε η ι ο υ ω".split(" ");
    ligatures = { "και": "ϗ", "στ": "ϛ" };
}

export class OghamOrthography extends ConsonantVowelOrthography {
    name = "Ogham";
    note = "An Early Medieval alphabet used primarily to write the early Irish language, and later the Old Irish language.";
    sample: string = "᚛ᚂᚓᚌᚌᚄᚇᚂᚓᚌᚓᚄᚉᚐᚇ᚜ ᚛ᚋᚐᚊ ᚉᚑᚏᚏᚁᚏᚔ ᚋᚐᚊ ᚐᚋᚋᚂᚂᚑᚌᚔᚈᚈ᚜";
    orthoDir: OrthoDir = "ltr";
    maxSegments = 6;
    consonants = `ᚁ ᚂ ᚃ ᚄ ᚅ ᚋ ᚌ ᚍ ᚎ ᚏ ᚆ ᚇ ᚈ ᚉ ᚊ`.split(" ");
    followingConsonants = this.consonants;
    vowels = `ᚐ ᚑ ᚒ ᚓ ᚔ`.split(" ");
    ligatures = {};

    generateWord(): string {
        const baseWord = super.generateWord();
        return `᚛${baseWord}᚜`;
    }
}

export const orthographies: Orthography[] = [
    new RomanOrthography(),
    new ShavianOrthography(),
    new OldItalicOrthography(),
    new PheonicianOrthography(),
    new GreekOrthography(),
    new OghamOrthography(),
];