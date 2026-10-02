import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LeftPromptCard } from './components/LeftPromptCard';
import { RightAnswerCard } from './components/RightAnswerCard';
import { CreateExerciseModal } from './components/CreateExerciseModal';
import { SettingsModal } from './components/SettingsModal';
import { ExerciseSummaryModal } from './components/ExerciseSummaryModal';
import type { ExerciseSet } from './types';
import { 
  loadSavedExerciseSets, 
  saveExerciseSets, 
  loadActiveSetId, 
  saveActiveSetId 
} from './services/storage';
import { INITIAL_EXERCISE_SETS } from './data/sampleExercises';
import { evaluateTranslation } from './services/aiGenerator';
import { getActiveTokenIndex, evaluateTokens } from './utils/tokenMatcher';
import confetti from 'canvas-confetti';

export function App() {
  const [sets, setSets] = useState<ExerciseSet[]>(() => loadSavedExerciseSets());
  const [activeSetId, setActiveSetId] = useState<string>(() => loadActiveSetId());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [hintTokenIndex, setHintTokenIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState<number | undefined>(undefined);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Active set
  const currentSet = sets.find(s => s.id === activeSetId) || sets[0] || INITIAL_EXERCISE_SETS[0];
  
  // Guard against out of bounds index
  const safeIndex = Math.min(Math.max(0, currentIndex), currentSet.items.length - 1);
  const currentExercise = currentSet.items[safeIndex];

  // Keep userAnswer synced when switching exercise and focus textarea
  useEffect(() => {
    if (currentExercise) {
      setUserAnswer(currentExercise.userAnswer || '');
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [currentExercise?.id]);

  // Save changes to storage whenever sets change
  useEffect(() => {
    saveExerciseSets(sets);
  }, [sets]);

  useEffect(() => {
    saveActiveSetId(activeSetId);
  }, [activeSetId]);

  // Handle word token click -> smart insert or replace into textarea
  const handleTokenClick = (tokenWord: string) => {
    const cleanWord = tokenWord.trim();
    if (!cleanWord) return;

    setUserAnswer(prev => {
      const rawWords = prev.trim().split(/\s+/).filter(Boolean);
      const endsWithWhitespace = /\s$/.test(prev);

      if (!endsWithWhitespace && rawWords.length > 0) {
        // Replace current incomplete/errored word with correct token
        rawWords[rawWords.length - 1] = cleanWord;
        return rawWords.join(' ') + ' ';
      } else {
        return (prev.trim() ? prev.trim() + ' ' : '') + cleanWord + ' ';
      }
    });

    // Refocus textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Complete exercise
  const handleCompleteCurrent = () => {
    if (!currentExercise) return;

    // If current exercise was already completed, advance to next question
    if (currentExercise.isCompleted) {
      if (safeIndex < currentSet.items.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setHintTokenIndex(null);
      } else {
        const nextUncompletedIdx = currentSet.items.findIndex(i => !i.isCompleted);
        if (nextUncompletedIdx !== -1) {
          setCurrentIndex(nextUncompletedIdx);
          setHintTokenIndex(null);
        } else {
          setIsSummaryModalOpen(true);
        }
      }
      return;
    }

    // Strict guard: ensure every token is completed without error
    const tokens = evaluateTokens(currentExercise.tokens, userAnswer, false, null);
    const hasUncompleted = tokens.some(t => t.status !== 'completed');
    if (hasUncompleted) {
      return;
    }

    const evalResult = evaluateTranslation(userAnswer, currentExercise.englishAnswer);

    const updatedItems = currentSet.items.map((item, idx) => {
      if (idx === safeIndex) {
        return {
          ...item,
          userAnswer: userAnswer,
          isCompleted: true,
          accuracyScore: evalResult.accuracy
        };
      }
      return item;
    });

    const updatedSet: ExerciseSet = {
      ...currentSet,
      items: updatedItems
    };

    setSets(prev => prev.map(s => s.id === currentSet.id ? updatedSet : s));

    // Celebratory mini confetti
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });

    // Check if entire set is finished
    const allDone = updatedItems.every(i => i.isCompleted);
    if (allDone) {
      setTimeout(() => {
        setIsSummaryModalOpen(true);
      }, 700);
    } else if (safeIndex < currentSet.items.length - 1) {
      // Auto-advance to the next exercise after a short pleasant pause
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setHintTokenIndex(null);
      }, 400);
    } else {
      // If was at the last index, but earlier questions were skipped
      const firstUncompleted = updatedItems.findIndex(i => !i.isCompleted);
      if (firstUncompleted !== -1) {
        setTimeout(() => {
          setCurrentIndex(firstUncompleted);
          setHintTokenIndex(null);
        }, 400);
      }
    }
  };

  // Reset current question
  const handleResetCurrent = () => {
    setUserAnswer('');
    const updatedItems = currentSet.items.map((item, idx) => {
      if (idx === safeIndex) {
        return {
          ...item,
          userAnswer: '',
          isCompleted: false,
          accuracyScore: 0
        };
      }
      return item;
    });

    const updatedSet: ExerciseSet = {
      ...currentSet,
      items: updatedItems
    };

    setSets(prev => prev.map(s => s.id === currentSet.id ? updatedSet : s));
  };

  // Switch to new or different set
  const handleSelectSet = (set: ExerciseSet) => {
    setActiveSetId(set.id);
    setCurrentIndex(0);
    setUserAnswer(set.items[0]?.userAnswer || '');
  };

  // When user creates a new set from AI
  const handleExerciseCreated = (newSet: ExerciseSet) => {
    setSets(prev => [newSet, ...prev]);
    setActiveSetId(newSet.id);
    setCurrentIndex(0);
    setUserAnswer('');
    setIsCreateModalOpen(false);
  };

  // Reset all to default sample sets
  const handleResetAllData = () => {
    setSets(INITIAL_EXERCISE_SETS);
    setActiveSetId(INITIAL_EXERCISE_SETS[0].id);
    setCurrentIndex(0);
    setUserAnswer('');
  };

  // Trigger word hint for current active token (Ctrl + Space)
  const handleTriggerHint = () => {
    const currentPos = textareaRef.current?.selectionStart ?? cursorPos;
    const activeIdx = getActiveTokenIndex(userAnswer, currentPos);
    setHintTokenIndex(activeIdx);
  };

  // Insert hinted word into textarea
  const handleInsertHint = (cleanWord: string) => {
    handleTokenClick(cleanWord);
    setHintTokenIndex(null);
  };

  const completedCount = currentSet.items.filter(i => i.isCompleted).length;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentSet={currentSet}
        currentIndex={safeIndex}
        totalItems={currentSet.items.length}
        completedCount={completedCount}
        onSelectIndex={(idx) => {
          setCurrentIndex(idx);
          setHintTokenIndex(null);
        }}
        onResetCurrent={handleResetCurrent}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        allSets={sets}
        onSelectSet={(s) => {
          handleSelectSet(s);
          setHintTokenIndex(null);
        }}
      />

      {/* Fallback notification if Gemini API had an issue */}
      {currentSet.fallbackNotice && (
        <div className="max-w-[1850px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-4">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-amber-900 text-xs shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded text-[11px] flex-shrink-0">
                Thông báo AI Engine
              </span>
              <span>{currentSet.fallbackNotice}</span>
            </div>
            <button
              onClick={() => {
                setSets(prev => prev.map(s => s.id === currentSet.id ? { ...s, fallbackNotice: undefined } : s));
              }}
              className="text-amber-700 hover:text-amber-900 font-bold px-2 py-1 rounded hover:bg-amber-100 flex-shrink-0"
            >
              Đã hiểu ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace (Split Screen 2 Columns with spacious cards) */}
      <main className="flex-1 max-w-[1850px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 items-stretch w-full">
          
          {/* Left Column: Vietnamese Prompt, Tokens & Hints */}
          {currentExercise && (
            <LeftPromptCard
              exercise={currentExercise}
              topic={currentSet.topicVi || currentSet.topic}
              band={currentSet.band}
              allExercises={currentSet.items}
              currentIndex={safeIndex}
              onSelectIndex={(idx) => {
                setCurrentIndex(idx);
                setHintTokenIndex(null);
              }}
              onTokenClick={handleTokenClick}
              userText={userAnswer}
              hintTokenIndex={hintTokenIndex}
              cursorPos={cursorPos}
              generatorType={currentSet.generatorType}
              aiModel={currentSet.aiModel}
            />
          )}

          {/* Right Column: User Translation & Model Evaluation */}
          {currentExercise && (
            <RightAnswerCard
              exercise={currentExercise}
              band={currentSet.band}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onCompleteExercise={handleCompleteCurrent}
              onPrev={() => {
                setCurrentIndex(i => Math.max(0, i - 1));
                setHintTokenIndex(null);
              }}
              onNext={() => {
                setCurrentIndex(i => Math.min(currentSet.items.length - 1, i + 1));
                setHintTokenIndex(null);
              }}
              hasPrev={safeIndex > 0}
              hasNext={safeIndex < currentSet.items.length - 1}
              onReset={handleResetCurrent}
              textareaRef={textareaRef}
              hintTokenIndex={hintTokenIndex}
              onTriggerHint={handleTriggerHint}
              onInsertHint={handleInsertHint}
              onCursorChange={(pos) => setCursorPos(pos)}
            />
          )}

        </div>
      </main>

      {/* Creation Modal */}
      <CreateExerciseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleExerciseCreated}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetAllData={handleResetAllData}
      />

      {/* Exercise Summary Completion Modal */}
      <ExerciseSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        set={currentSet}
        onRestart={() => {
          // Reset answers in this set for re-practicing
          const resetItems = currentSet.items.map(item => ({
            ...item,
            userAnswer: '',
            isCompleted: false,
            accuracyScore: 0
          }));
          const resetSet = { ...currentSet, items: resetItems };
          setSets(prev => prev.map(s => s.id === currentSet.id ? resetSet : s));
          setCurrentIndex(0);
          setUserAnswer('');
        }}
        onCreateNew={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
}

export default App;
