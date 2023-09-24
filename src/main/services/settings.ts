import storage from 'node-persist';
import { validateNVMPath } from './nvm';
import { filterTruthy } from '../func/filterTruthy';

export const getSettings = async (): Promise<TSettings> => {
    return {
        nvmPath: await storage.getItem('nvmPath'),
        debugMode: await storage.getItem('debugMode'),
    };
};

export const setSettings = async (settings: TSettings) => {
    const promises = [];
    try {
        const validation = await validateSettings(settings);
        for (const key in validation) {
            if (validation[key as keyof TSettings]) {
                return { error: `${key}: ${validation[key as keyof TSettings]}` };
            }
        }
    
        for (const key in settings) {
            promises.push(storage.setItem(key, settings[key as keyof TSettings]));
        }
        await Promise.all(promises);
        return {};    
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Unknown error.' };
    }
};

export const validateSettings = async (settings: TSettings): Promise<TSettingsValidation> => {
    return filterTruthy({
        nvmPath: await validateNVMPath(settings.nvmPath),
    });
};