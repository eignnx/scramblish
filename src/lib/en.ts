import { Grammar, NT, Ts } from './grammar.ts';

const NOUN = new Ts(["cat", "dog", "paw", "tail", "ear", "aardvark"]);
const ADJ = new Ts(["big", "little", "black", "strange", "old"]);
const V2 = new Ts(["sees", "hears", "licks", "chases"]);
const V1 = new Ts(["runs", "jumps", "sleeps", "waits"]);
const V_ADJ = new Ts(["is", "seems", "feels", "looks"]);
const DET = new Ts(["the", "a", "my", "every"]);
const PREP = new Ts(["of", "near"]);

export const En = new Grammar()
    .addRule(1, "S", [new NT("NP"), new NT("VP")])
    .addRule(3, "NP", [new NT("DET"), new NT("N1")])
    .addRule(1, "NP", [new NT("NP"), new NT("PP")])
    .addRule(1, "PP", [new NT("PREP"), new NT("NP")])
    .addRule(1, "PREP", [PREP])
    .addRule(4, "N1", [new NT("N")])
    .addRule(1, "N1", [new NT("ADJ"), new NT("N1")])
    .addRule(1, "VP", [new NT("V1")])
    .addRule(2, "VP", [new NT("V2"), new NT("NP")])
    .addRule(1, "VP", [new NT("V-ADJ"), new NT("ADJ")])
    .addRule(1, "DET", [DET])
    .addRule(1, "N", [NOUN])
    .addRule(1, "ADJ", [ADJ])
    .addRule(1, "V1", [V1])
    .addRule(1, "V2", [V2])
    .addRule(1, "V-ADJ", [V_ADJ]);
