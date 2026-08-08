/* subset-font ships no types. Only the surface generate.ts uses is declared;
   widen it if the build starts leaning on more of the API. */
declare module "subset-font" {
    type AxisRange = { min: number; max: number; default: number };

    interface SubsetOptions {
        targetFormat?: "sfnt" | "woff" | "woff2";
        /* A number pins the axis to one instance; a range keeps a slice of it. */
        variationAxes?: Record<string, number | AxisRange>;
        preserveNameIds?: number[];
    }

    export default function subsetFont(
        font: Buffer,
        chars: string,
        options?: SubsetOptions,
    ): Promise<Buffer>;
}
