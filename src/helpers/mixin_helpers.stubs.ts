import { mixed } from '@/helpers/mixin_helpers';
import type { Use } from '@/types/index';

export abstract class BaseClass<Secret> {

    public static planet = 'Earth';

    public baseSecret?: Secret;

    public id: number = 23;

    public getId(): string {
        return `id: ${this.id}`;
    }

    public abstract concrete(): void;

}

export class MixinA {

    public name: string = 'John';

    public getName(): string {
        return `name: ${this.name}`;
    }

}

export interface MixinAA<BaseSecret> extends MixinA, BaseClass<BaseSecret> {}
export class MixinAA<BaseSecret> extends MixinA implements Use<BaseSecret> {

    public surname: string = 'Doe';

    public identifyWithName(): string {
        return `identify: [${this.id}] ${this.name} ${this.surname}`;
    }

    public getSurname(): string {
        return `surname: ${this.surname}`;
    }

}

export interface MixinB<Secret, BaseSecret> extends BaseClass<BaseSecret>, Use<Secret> {}
export class MixinB<Secret, BaseSecret> implements Use<BaseSecret> {

    public age: number = 42;

    public mixinSecret?: Secret;

    public identifyWithAge(): string {
        return `identify: [${this.id}] ${this.age}`;
    }

    public getAge(): string {
        return `age: ${this.age}`;
    }

}

// TODO fix types without any.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Mixed = mixed(BaseClass, [MixinAA, MixinB]) as any;

export default interface TargetClass<BaseSecret, MixinSecret>
    extends
        BaseClass<BaseSecret>,
        MixinAA<BaseSecret>,
        MixinB<MixinSecret, BaseSecret> {}
export default class TargetClass<BaseSecret, MixinSecret> extends Mixed {

    public specificId: number = 32;

    public static getPlanet(): string {
        return `lives in planet ${this.planet}`;
    }

    public static(): typeof TargetClass {
        return this.constructor as typeof TargetClass;
    }

    public getSpecificId(): string {
        return `specific id: ${this.specificId}`;
    }

    public getSecrets(): [BaseSecret?, MixinSecret?] {
        return [this.baseSecret, this.mixinSecret];
    }

    public concrete(): void {
        //
    }

    public describe(): string {
        return [
            this.getId(),
            this.getSpecificId(),
            this.getName(),
            this.getSurname(),
            this.getAge(),
            this.static().getPlanet(),
        ].join(', ');
    }

}
