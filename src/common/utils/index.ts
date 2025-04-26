export const getClassName = <T extends { new(...args: any[]): any }>(cls: T): string => {
    return cls.name;
};