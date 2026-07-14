export interface TypingEngineExports {
  calculate_wpm(correctCharacters: number, elapsedSeconds: number): number;
  calculate_raw_wpm(totalCharacters: number, elapsedSeconds: number): number;
  calculate_accuracy(correctCharacters: number, totalCharacters: number): number;
  calculate_xp(wpm: number, accuracy: number, duration: number, difficulty: number): number;
  calculate_level(xp: number): number;
  is_personal_best(wpm: number, bestWpm: number): number;
}

let engine: TypingEngineExports | null = null;

export const initializeTypingEngine = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}typing-engine.wasm`);
    if (!response.ok) throw new Error(`WASM request failed with ${response.status}`);

    const bytes = await response.arrayBuffer();
    const result = await WebAssembly.instantiate(bytes);
    engine = result.instance.exports as unknown as TypingEngineExports;
    return true;
  } catch (error) {
    console.warn('C++ typing engine unavailable; using TypeScript fallback.', error);
    return false;
  }
};

export const getTypingEngine = (): TypingEngineExports | null => engine;
