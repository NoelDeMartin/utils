import type { Closure, ClosureArgs } from '@/types/index';

export function once<P extends ClosureArgs, R>(operation: Closure<P, R>): Closure<P, R> {
    const memo: { result?: R } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...params) => 'result' in memo ? memo.result : (memo.result = operation(...params)) as any;
}
