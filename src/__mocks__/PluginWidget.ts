export function createEditableValue<T>(
    value: T,
    readOnly: boolean,
    validation: string[]
): PluginWidget.EditableValue<T> {
    return {
        value,
        displayValue: "display",
        status: PluginWidget.ValueStatus.Available,
        validation,
        readOnly,
        formatter: null,
        universe: [],
        setValue: () => null,
        setTextValue: () => null,
        setFormatting: () => null,
        setValidation: () => null
    };
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
