// Entry kecil untuk script buildHanziAssets.mjs:
// di-bundle via esbuild supaya dataset TS (dengan import extensionless) bisa dibaca Node.
import { FULL_HSK_DATASET } from '../src/services/chinese/dataset';

export default FULL_HSK_DATASET;
