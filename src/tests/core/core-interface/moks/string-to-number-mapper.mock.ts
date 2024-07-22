// mapper-impl.spec.ts
import { Mapper } from '@interface-core/mapper'; // Ajusta la ruta según la ubicación de tu archivo

export class StringToNumberMapper extends Mapper<string, number> {
    mapFrom(param: string): number {
        return parseFloat(param);
    }

    mapTo(param: number): string {
        return param.toString();
    }
}
