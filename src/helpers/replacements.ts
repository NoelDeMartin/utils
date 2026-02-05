import { stringMatch, stringMatchAll } from '@noeldemartin/utils/helpers/string_helpers';
import { toString } from '@noeldemartin/utils/helpers/object_helpers';

import * as replacementsScope from './replacements-scope';
import type { ReplacementsScope } from './replacements-scope';

function renderReplacement(script: string, scope: ReplacementsScope): string {
    try {
        return Function(`with (this) { return (${script}).toString() }`).bind({
            ...replacementsScope,
            ...scope,
        })();
    } catch (error) {
        const undefinedVariable = stringMatch<2>(toString(error), /([^\s]+) is not defined/)?.[1];

        if (!undefinedVariable) {
            throw error;
        }

        return renderReplacement(script, {
            ...scope,
            [undefinedVariable]: undefined,
        });
    }
}

const REPLACEMENTS_REGEX = /{{([^}]+)}}/gm;

function reduce<TItem, TResult>(
    items: IterableIterator<TItem>,
    initial: TResult,
    callback: (result: TResult, item: TItem) => TResult,
) {
    let result = initial;

    for (const item of items) {
        result = callback(result, item);
    }

    return result;
}

export type Replacements = Record<string, unknown>;

export function applyReplacements(text: string, replacements: Replacements = {}): string {
    const matches = stringMatchAll<2>(text, REPLACEMENTS_REGEX);

    return reduce(matches, text, (renderedText, match) => {
        return renderedText.replace(match[0], renderReplacement(match[1], replacements));
    });
}
