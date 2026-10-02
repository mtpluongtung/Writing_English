import type { ExerciseSet } from '../types';
import { INITIAL_EXERCISE_SETS } from '../data/sampleExercises';

const STORAGE_KEYS = {
  EXERCISE_SETS: 'ielts_translate_sets_v1',
  ACTIVE_SET_ID: 'ielts_translate_active_set_id',
  API_KEY: 'ielts_gemini_api_key',
  GEMINI_MODEL: 'ielts_gemini_model',
  FONT_PREFERENCE: 'ielts_font_preference',
};

export function loadSavedExerciseSets(): ExerciseSet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXERCISE_SETS);
    if (!raw) {
      // Save initial sets
      saveExerciseSets(INITIAL_EXERCISE_SETS);
      return INITIAL_EXERCISE_SETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EXERCISE_SETS;
  } catch (e) {
    console.error('Failed to load saved exercises:', e);
    return INITIAL_EXERCISE_SETS;
  }
}

export function saveExerciseSets(sets: ExerciseSet[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXERCISE_SETS, JSON.stringify(sets));
  } catch (e) {
    console.error('Failed to save exercise sets:', e);
  }
}

export function loadActiveSetId(): string {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_SET_ID) || INITIAL_EXERCISE_SETS[0].id;
}

export function saveActiveSetId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SET_ID, id);
}

export function loadApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function saveApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
}

export function loadGeminiModel(): string {
  const saved = localStorage.getItem(STORAGE_KEYS.GEMINI_MODEL);
  return saved || 'gemini-3.8-flash';
}

export function saveGeminiModel(model: string): void {
  localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, model.trim());
}

