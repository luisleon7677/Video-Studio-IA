export class Video {
    constructor(
        public readonly id: number | null,
        public name: string,
        public url: string,
    ) {
        this.validate();
    }
    private validate(): void {
        if (!this.name || this.name.length < 3) {
            throw new Error('Title is required');
        }
        if (!this.url || this.url.length < 3) {
            throw new Error('Url is required');
        }

    }
}