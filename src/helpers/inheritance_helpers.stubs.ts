import { mixinFor, withMixins } from '@/helpers/inheritance_helpers';

export class BaseClass {

    public id: number = 23;

    public getId(): string {
        return `id: ${this.id}`;
    }

}

export class MixinA {

    public name: string = 'John';

    public getName(): string {
        return `name: ${this.name}`;
    }

}

export class MixinAA extends withMixins(MixinA, [mixinFor(BaseClass)]) {

    public surname: string = 'Doe';

    public identifyWithName(): string {
        return `identify: [${this.id}] ${this.name} ${this.surname}`;
    }

    public getSurname(): string {
        return `surname: ${this.surname}`;
    }

}

export class MixinB extends mixinFor(BaseClass) {

    public age: number = 42;

    public identifyWithAge(): string {
        return `identify: [${this.id}] ${this.age}`;
    }

    public getAge(): string {
        return `age: ${this.age}`;
    }

}

export default class TargetClass extends withMixins(BaseClass, [MixinAA, MixinB]) {

    public specificId: number = 32;

    public getSpecificId(): string {
        return `specific id: ${this.specificId}`;
    }

    public describe(): string {
        return [
            this.getId(),
            this.getSpecificId(),
            this.getName(),
            this.getSurname(),
            this.getAge(),
        ].join(', ');
    }

}
