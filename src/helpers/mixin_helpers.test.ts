import { describe, expect, it } from 'vitest';

import { tt } from '@noeldemartin/testing';
import type { Equals, Expect } from '@noeldemartin/testing';

import TargetClass, { BaseClass, MixinAA } from './mixin_helpers.stubs';
import { usesMixin } from './mixin_helpers';

describe('Inheritance helpers', () => {

    it('mixes methods', () => {
        const instance = new TargetClass<string, number>();

        instance.id = 1;
        instance.specificId = 2;
        instance.name = '3';
        instance.age = 4;
        instance.baseSecret = '5';
        instance.mixinSecret = 6;

        expect(instance.getId()).toEqual('id: 1');
        expect(instance.getSpecificId()).toEqual('specific id: 2');
        expect(instance.getName()).toEqual('name: 3');
        expect(instance.getAge()).toEqual('age: 4');
        expect(instance.getSecrets()).toEqual(['5', 6]);
    });

    it('works with instanceof', () => {
        const instance = new TargetClass();

        expect(instance).toBeInstanceOf(BaseClass);
        expect(instance).toBeInstanceOf(TargetClass);
    });

    it('uses default attribute values', () => {
        const instance = new TargetClass();

        expect(instance.getId()).toEqual('id: 23');
        expect(instance.getSpecificId()).toEqual('specific id: 32');
        expect(instance.getName()).toEqual('name: John');
        expect(instance.getAge()).toEqual('age: 42');
    });

    it('supports mixins inheritance', () => {
        const instance = new TargetClass();

        expect(instance.getSurname()).toEqual('surname: Doe');
    });

    it('supports inferring this for mixins', () => {
        const instance = new TargetClass();

        expect(instance.identifyWithName()).toEqual('identify: [23] John Doe');
        expect(instance.identifyWithAge()).toEqual('identify: [23] 42');
    });

    it('uses mixin methods within final class', () => {
        const instance = new TargetClass();

        expect(instance.describe()).toEqual(
            'id: 23, specific id: 32, name: John, surname: Doe, age: 42, lives in planet Earth',
        );
    });

    it('detects mixins in use', () => {
        expect(usesMixin(TargetClass, MixinAA)).toBe(true);
        expect(usesMixin(new TargetClass(), MixinAA)).toBe(true);
        expect(usesMixin({}, MixinAA)).toBe(false);
    });

    it.todo('disallows using mixins for unsupported classes');

});

describe('Inheritance helpers types', () => {

    let instance: TargetClass<string, number>;

    it(
        'has proper types',
        tt<
            | Expect<Equals<typeof instance.name, string>>
            | Expect<Equals<typeof instance.age, number>>
            | Expect<Equals<typeof instance.getName, () => string>>
            | Expect<Equals<typeof instance.getAge, () => string>>
            | Expect<Equals<typeof instance.getSecrets, () => [string?, number?]>>
            | true
        >(),
    );

});
