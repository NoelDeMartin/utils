import Main from './main';

declare global {
    declare type ClosureArgs = Main.ClosureArgs;
    declare type Closure<Args extends ClosureArgs = ClosureArgs, Result = unknown> = Main.Closure<Args, Result>;
    declare type ClassInstance<Class> = Main.ClassInstance<Class>;
    declare type Falsy = Main.Falsy;
}
