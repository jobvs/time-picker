export function createEditableValue<T>(
    value: T,
    readOnly: boolean,
    validation: string[]
): PluginWidget.EditableValue<T> {
    const obj = {
        value,
        displayValue: "display",
        status: PluginWidget.ValueStatus.Available,
        validation,
        readOnly,
        formatter: null,
        universe: [],
        setValue: (newValue: T) => (obj.value = newValue),
        setTextValue: () => null,
        setFormatting: () => null,
        setValidation: (message?: string) => (obj.validation = message ? [message] : [])
    };
    return obj;
}

export function createDynamicValue<T>(value: T): PluginWidget.DynamicValue<T> {
    return {
        value,
        status: PluginWidget.ValueStatus.Available
    };
}

export function createActionValue(execute: () => void): PluginWidget.ActionValue {
    return {
        canExecute: true,
        isExecuting: false,
        execute
    };
}
