export function Profile(name?: string): MethodDecorator {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            console.profile(name || propertyKey);
            const result = originalMethod.apply(this, args);
            console.profileEnd();
            return result;
        };

        return descriptor;
    };
}

export function CallCount(name?: string): MethodDecorator {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            console.count(name || propertyKey);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export function Log(name?: string): MethodDecorator {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            console.groupCollapsed(name || propertyKey);
            console.log('context:', this);
            if (args.length) {
                console.log('args:', ...args);
            }

            const result = originalMethod.apply(this, args);

            if (typeof result !== 'undefined') {
                console.log('result:', result);
            }

            console.groupEnd();
            return result;
        };

        return descriptor;
    };
}
