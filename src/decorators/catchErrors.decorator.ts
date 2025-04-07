import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export function CaptureErrors() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                Logger.error(`[${Date.now().toLocaleString('en-US')}]-`, "Captured error: ", error);

                Sentry.captureException(error, {
                    tags: {
                        controller: target.constructor.name,
                        endpoint: propertyKey,
                    },
                });

                throw error;
            }
        };

        return descriptor;
    };
}