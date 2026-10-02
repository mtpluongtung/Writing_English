export interface TokenChar {
  char: string;
  isError: boolean;
  isMasked: boolean;
  isRevealed: boolean;
}

export interface EvaluatedToken {
  index: number;
  rawTarget: string;        // e.g. "society."
  cleanTarget: string;      // e.g. "society"
  leadingPunct: string;     // e.g. ""
  trailingPunct: string;    // e.g. "."
  status: 'completed' | 'error' | 'active' | 'pending';
  chars: TokenChar[];
  userWord?: string;
  isCorrect: boolean;
  isHintRevealed?: boolean;
}

/**
 * Separate punctuation from core word.
 * e.g. "society." -> { core: "society", leading: "", trailing: "." }
 * e.g. "governments," -> { core: "governments", leading: "", trailing: "," }
 */
export function splitWordAndPunct(token: string): { core: string; leading: string; trailing: string } {
  // Extract leading non-alphanumeric punctuation (like quotes)
  // and trailing punctuation (like . , ! ? : ; " )
  const match = token.match(/^([.,!?;:()""''“”—\s]*)(.*?)([.,!?;:()""''“”—\s]*)$/);
  if (!match) {
    return { core: token, leading: '', trailing: '' };
  }
  return {
    leading: match[1] || '',
    core: match[2] || token,
    trailing: match[3] || ''
  };
}

/**
 * Clean a word for comparison (lowercase, strip surrounding punctuation)
 */
export function cleanWord(word: string): string {
  return word.toLowerCase().replace(/^[.,!?;:()""''“”—\s]+|[.,!?;:()""''“”—\s]+$/g, '');
}

/**
 * Determine the EXACT single active token index that the user is currently typing
 */
export function getActiveTokenIndex(userAnswer: string, cursorPos?: number): number {
  if (!userAnswer.trim()) {
    return 0;
  }

  // If cursor position in textarea is available, find which word cursor is currently touching
  if (cursorPos !== undefined && cursorPos >= 0) {
    const textUpToCursor = userAnswer.substring(0, cursorPos);
    const wordsBefore = textUpToCursor.trim().split(/\s+/).filter(Boolean);
    const endsWithSpace = /\s$/.test(textUpToCursor);
    if (endsWithSpace) {
      return wordsBefore.length;
    } else {
      return Math.max(0, wordsBefore.length - 1);
    }
  }

  // Default: based on the end of the user answer
  const endsWithWhitespace = /\s$/.test(userAnswer);
  const rawWords = userAnswer.trim().split(/\s+/).filter(Boolean);
  if (endsWithWhitespace) {
    return rawWords.length;
  } else {
    return Math.max(0, rawWords.length - 1);
  }
}

/**
 * Match user typed words against target tokens
 */
export function evaluateTokens(
  targetTokens: string[],
  userAnswer: string,
  showAll: boolean = false,
  hintTokenIndex: number | null = null,
  cursorPos?: number
): EvaluatedToken[] {
  // Find the single active token index
  const singleActiveIndex = getActiveTokenIndex(userAnswer, cursorPos);

  // Extract user words
  const endsWithWhitespace = /\s$/.test(userAnswer);
  const rawWords = userAnswer.trim().split(/\s+/).filter(Boolean);
  const userWords = endsWithWhitespace && rawWords.length > 0 ? [...rawWords, ''] : rawWords;

  return targetTokens.map((rawTarget, idx) => {
    const { core, leading, trailing } = splitWordAndPunct(rawTarget);
    const userWord = userWords[idx];
    const isUserTyped = userWord !== undefined;
    const cleanTarget = core;
    const cleanTargetLower = cleanTarget.toLowerCase();

    const isCurrentlyActive = idx === singleActiveIndex;
    const isHintRequested = showAll || (hintTokenIndex === idx);

    // If "Show All" or "Hint" is triggered for this token: reveal all characters
    if (isHintRequested) {
      const chars: TokenChar[] = cleanTarget.split('').map(c => ({
        char: c,
        isError: false,
        isMasked: false,
        isRevealed: true
      }));

      // Determine status
      let status: 'completed' | 'error' | 'active' | 'pending' = 'pending';
      const userClean = userWord ? cleanWord(userWord).toLowerCase() : '';
      if (userClean === cleanTargetLower) {
        status = 'completed';
      } else if (isCurrentlyActive) {
        status = 'active';
      }

      return {
        index: idx,
        rawTarget,
        cleanTarget,
        leadingPunct: leading,
        trailingPunct: trailing,
        status: status,
        chars,
        userWord,
        isCorrect: userClean === cleanTargetLower,
        isHintRevealed: true
      };
    }

    // Case 1: User has not reached this token yet
    if (!isUserTyped) {
      const chars: TokenChar[] = [];

      // First character is revealed
      if (cleanTarget.length > 0) {
        chars.push({
          char: cleanTarget[0],
          isError: false,
          isMasked: false,
          isRevealed: true
        });
      }

      // Remaining characters are asterisks '*'
      for (let i = 1; i < cleanTarget.length; i++) {
        chars.push({
          char: '*',
          isError: false,
          isMasked: true,
          isRevealed: false
        });
      }

      return {
        index: idx,
        rawTarget,
        cleanTarget,
        leadingPunct: leading,
        trailingPunct: trailing,
        status: isCurrentlyActive ? 'active' : 'pending',
        chars,
        isCorrect: false
      };
    }

    // Case 2: User has typed or is currently typing this token
    const userClean = cleanWord(userWord);
    const userCleanLower = userClean.toLowerCase();

    // Check if user completed this word correctly
    const isPastWord = idx < userWords.length - 1;
    const isExactMatch = userCleanLower === cleanTargetLower || 
      userCleanLower.replace(/[-_\s]/g, '') === cleanTargetLower.replace(/[-_\s]/g, '');

    if (isExactMatch && (isPastWord || userCleanLower.replace(/[-_\s]/g, '').length === cleanTargetLower.replace(/[-_\s]/g, '').length)) {
      // Fully correct token!
      const chars: TokenChar[] = cleanTarget.split('').map(c => ({
        char: c,
        isError: false,
        isMasked: false,
        isRevealed: true
      }));

      return {
        index: idx,
        rawTarget,
        cleanTarget,
        leadingPunct: leading,
        trailingPunct: trailing,
        status: 'completed',
        chars,
        userWord,
        isCorrect: true
      };
    }

    // Case 3: In progress or error
    let hasError = false;
    const chars: TokenChar[] = [];

    // First char: check match
    if (cleanTarget.length > 0) {
      const firstCharMatches = userCleanLower.length > 0 
        ? userCleanLower[0] === cleanTargetLower[0] 
        : true;

      chars.push({
        char: firstCharMatches ? cleanTarget[0] : 'X',
        isError: !firstCharMatches,
        isMasked: false,
        isRevealed: firstCharMatches
      });

      if (!firstCharMatches) {
        hasError = true;
      }
    }

    // Check characters from 1 to cleanTarget.length - 1
    for (let i = 1; i < cleanTarget.length; i++) {
      if (i < userCleanLower.length) {
        // User typed a character at this position
        if (userCleanLower[i] === cleanTargetLower[i]) {
          chars.push({
            char: cleanTarget[i],
            isError: false,
            isMasked: false,
            isRevealed: true
          });
        } else {
          // WRONG character! Show red 'X'!
          chars.push({
            char: 'X',
            isError: true,
            isMasked: false,
            isRevealed: false
          });
          hasError = true;
        }
      } else {
        // User has not typed this position yet -> '*'
        chars.push({
          char: '*',
          isError: false,
          isMasked: true,
          isRevealed: false
        });
      }
    }

    // Extra typed characters count as error
    if (userCleanLower.length > cleanTarget.length) {
      hasError = true;
    }

    // Moved past this word without completing it
    if (isPastWord && !isExactMatch) {
      hasError = true;
    }

    return {
      index: idx,
      rawTarget,
      cleanTarget,
      leadingPunct: leading,
      trailingPunct: trailing,
      status: hasError ? 'error' : (isCurrentlyActive ? 'active' : 'pending'),
      chars,
      userWord,
      isCorrect: false
    };
  });
}
