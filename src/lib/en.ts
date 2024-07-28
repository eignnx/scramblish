import { Grammar, NT, Ts } from './grammar';

const NOUN = new Ts(["cat", "dog", "paw", "tail", "ear", "aardvark"]);
const ADJ = new Ts(["big", "little", "black", "strange", "old"]);
const V2 = new Ts(["sees", "hears", "licks", "chases"]);
const V1 = new Ts(["runs", "jumps", "sleeps", "waits"]);
const V_ADJ = new Ts(["is", "seems", "feels", "looks"]);
const DET = new Ts(["the", "a", "my", "every"]);
const PREP = new Ts(["of", "near"]);

export const En = new Grammar()
    .addRule("S", [new NT("NP"), new NT("VP")])
    .addRuleChoice("NP", [
        [3, [new NT("DET"), new NT("N1")]],
        [1, [new NT("NP"), new NT("PP")]],
    ])
    .addRule("PP", [new NT("PREP"), new NT("NP")])
    .addRule("PREP", [PREP])
    .addRuleChoice("N1", [
        [4, [new NT("N")]],
        [1, [new NT("ADJ"), new NT("N1")]],
    ])
    .addRuleChoice("VP", [
        [1, [new NT("V1")]],
        [2, [new NT("V2"), new NT("NP")]],
        [1, [new NT("V-ADJ"), new NT("ADJ")]],
    ])
    .addRule("DET", [DET])
    .addRule("N", [NOUN])
    .addRule("ADJ", [ADJ])
    .addRule("V1", [V1])
    .addRule("V2", [V2])
    .addRule("V-ADJ", [V_ADJ]);
