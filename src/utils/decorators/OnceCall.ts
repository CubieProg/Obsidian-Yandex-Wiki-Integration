
function onceCall(state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
        if (state) { return; }
        setState(true);

        const method = descriptor.value;

        try {
            descriptor.value = function (...args: any[]) {
                const result = method?.apply(this, args);
                return result;
            };
        } catch (err: any) {
            throw err
        } finally {
            setState(false);
        }
    };
}