export const Random = {
    weightedChoice<T>(arr: [number, T][]): [number, T] {
        const total = arr.reduce((acc, [weight]) => acc + weight, 0);
        let choice = Math.random() * total;
        for (const [index, [weight, item]] of arr.entries()) {
            if (choice < weight) {
                return [index, item];
            }
            choice -= weight;
        }
        const index = arr.length - 1;
        return [index, arr[index][1]];
    },

    choice<T>(arr: T[]): T {
        return arr[Random.select(arr)];
    },

    select<T>(arr: T[]): number {
        return Math.floor(Math.random() * arr.length);
    },

    shuffled<T>(arr: T[]): T[] {
        let copy = [...arr];
        let shuffled: T[] = [];
        while (copy.length > 0) {
            const idx = Random.select(copy);
            const lastIdx = copy.length - 1;
            // Swap-remove
            [copy[lastIdx], copy[idx]] = [copy[idx], copy[lastIdx]];
            shuffled.push(copy.pop()!);
        }
        return shuffled;
    },

    int(upperBound: number): number {
        return Math.floor(Math.random() * upperBound);
    }
};
