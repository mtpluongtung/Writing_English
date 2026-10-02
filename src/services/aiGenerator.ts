import type { ExerciseItem, ExerciseSet, GenerationOptions } from '../types';

// Helper to tokenize an English sentence into word tokens
export function tokenizeSentence(sentence: string): string[] {
  // Split words while keeping punctuation attached to word or clean tokens
  return sentence.trim().split(/\s+/).filter(Boolean);
}

// Built-in intelligent dataset for instant generation without API key
const TOPIC_TEMPLATES: Record<string, Array<{
  vi: string;
  en: string;
  vocab: Array<{ word: string; meaning: string; type: string }>;
  grammar: string[];
  band: number;
}>> = {
  Technology: [
    {
      vi: 'Việc áp dụng công nghệ tự động hóa trong các dây chuyền sản xuất đang làm giảm đáng kể nhu cầu đối với lao động thủ công truyền thống.',
      en: 'The adoption of automation technology in manufacturing assembly lines is significantly reducing the demand for traditional manual labor.',
      vocab: [
        { word: 'adoption of', meaning: 'việc áp dụng/tiếp nhận', type: 'Collocation' },
        { word: 'manufacturing assembly lines', meaning: 'dây chuyền sản xuất lắp ráp', type: 'Noun phrase' },
        { word: 'manual labor', meaning: 'lao động thủ công', type: 'Collocation' }
      ],
      grammar: ['Hiện tại tiếp diễn: "is significantly reducing"', 'Cụm giới từ: "for traditional manual labor"'],
      band: 7.5
    },
    {
      vi: 'Các nền tảng mạng xã hội đã định hình lại hoàn toàn phương thức con người tương tác, nhưng đồng thời cũng làm gia tăng cảm giác cô lập xã hội ở giới trẻ.',
      en: 'Social media platforms have completely reshaped how humans interact, yet simultaneously heightened feelings of social isolation among teenagers.',
      vocab: [
        { word: 'reshaped', meaning: 'định hình lại', type: 'C1 Verb' },
        { word: 'simultaneously', meaning: 'đồng thời, cùng lúc', type: 'Adverb' },
        { word: 'social isolation', meaning: 'sự cô lập xã hội', type: 'Collocation' }
      ],
      grammar: ['Hiện tại hoàn thành: "have completely reshaped"', 'Mệnh đề danh ngữ: "how humans interact"'],
      band: 8.0
    },
    {
      vi: 'An ninh mạng đang trở thành mối bận tâm cấp bách của các tập đoàn đa quốc gia trước làn sóng tấn công mã độc tống tiền ngày càng tinh vi.',
      en: 'Cybersecurity is emerging as a pressing concern for multinational corporations amidst the increasingly sophisticated wave of ransomware attacks.',
      vocab: [
        { word: 'pressing concern', meaning: 'mối bận tâm cấp bách', type: 'Collocation' },
        { word: 'multinational corporations', meaning: 'các tập đoàn đa quốc gia', type: 'Noun phrase' },
        { word: 'sophisticated', meaning: 'tinh vi, phức tạp', type: 'C1 Adjective' }
      ],
      grammar: ['Cụm giới từ chỉ hoàn cảnh: "amidst the increasingly sophisticated..."'],
      band: 8.5
    }
  ],
  Environment: [
    {
      vi: 'Sự gia tăng nhiệt độ toàn cầu đang đẩy nhanh tốc độ tan chảy của các tảng băng ở hai cực, gây ra nguy cơ ngập lụt nghiêm trọng cho các đô thị ven biển.',
      en: 'Rising global temperatures are accelerating the melting rate of polar ice caps, posing severe flood hazards to low-lying coastal metropolises.',
      vocab: [
        { word: 'accelerating', meaning: 'đẩy nhanh, gia tốc', type: 'Academic Verb' },
        { word: 'polar ice caps', meaning: 'các chỏm băng vùng cực', type: 'Collocation' },
        { word: 'low-lying metropolises', meaning: 'các đô thị vùng trũng thấp', type: 'Academic Noun' }
      ],
      grammar: ['Hiện tại tiếp diễn', 'Mệnh đề phân từ: "posing severe flood hazards..."'],
      band: 8.0
    },
    {
      vi: 'Việc chuyển dịch từ nhiên liệu hóa thạch sang các nguồn năng lượng bền vững đòi hỏi sự đầu tư vốn khổng lồ và ý chí chính trị kiên định.',
      en: 'Transitioning from fossil fuels to sustainable energy sources necessitates colossal capital investments and steadfast political will.',
      vocab: [
        { word: 'transitioning from', meaning: 'chuyển dịch từ', type: 'Gerund phrase' },
        { word: 'necessitates', meaning: 'đòi hỏi, bắt buộc phải có', type: 'C2 Formal Verb' },
        { word: 'steadfast political will', meaning: 'ý chí chính trị kiên định', type: 'Collocation' }
      ],
      grammar: ['Danh động từ làm chủ ngữ: "Transitioning..."', 'Động từ học thuật cao cấp: "necessitates"'],
      band: 8.5
    }
  ],
  Education: [
    {
      vi: 'Phương pháp giáo dục lấy người học làm trung tâm tạo điều kiện cho học sinh phát huy tính chủ động và kỹ năng giải quyết vấn đề thực tế.',
      en: 'Student-centered pedagogy enables learners to foster autonomous initiative and practical problem-solving capabilities.',
      vocab: [
        { word: 'student-centered pedagogy', meaning: 'phương pháp sư phạm lấy học sinh làm trung tâm', type: 'Specialized Noun' },
        { word: 'autonomous initiative', meaning: 'tính chủ động độc lập', type: 'Collocation' },
        { word: 'problem-solving capabilities', meaning: 'khả năng giải quyết vấn đề', type: 'Collocation' }
      ],
      grammar: ['Cấu trúc: "enable someone to do something"', 'Tính từ kép ghép danh từ'],
      band: 8.0
    },
    {
      vi: 'Việc tích hợp công nghệ thực tế ảo vào giảng dạy giúp trừu tượng hóa các khái niệm khoa học phức tạp thành trải nghiệm trực quan sinh động.',
      en: 'Integrating virtual reality into pedagogical practices demystifies complex scientific concepts into vivid experiential learning.',
      vocab: [
        { word: 'pedagogical practices', meaning: 'các phương pháp/thực hành giảng dạy', type: 'Academic Noun' },
        { word: 'demystifies', meaning: 'làm sáng tỏ, giải mã sự phức tạp', type: 'C2 Verb' },
        { word: 'experiential learning', meaning: 'học tập thông qua trải nghiệm', type: 'Collocation' }
      ],
      grammar: ['Gerund chủ ngữ: "Integrating..."', 'Động từ ngoại động từ chuyển hóa'],
      band: 8.5
    }
  ],
  Health: [
    {
      vi: 'Lối sống ít vận động kết hợp với chế độ ăn giàu thực phẩm chế biến sẵn đang làm gia tăng đột biến tỷ lệ mắc bệnh tim mạch và tiểu đường.',
      en: 'A sedentary lifestyle combined with a diet high in processed foods is causing an alarming surge in cardiovascular diseases and diabetes.',
      vocab: [
        { word: 'sedentary lifestyle', meaning: 'lối sống ít vận động, ngồi nhiều', type: 'Collocation' },
        { word: 'alarming surge', meaning: 'sự gia tăng đột biến đáng báo động', type: 'Collocation' },
        { word: 'cardiovascular diseases', meaning: 'các bệnh về tim mạch', type: 'Medical Term' }
      ],
      grammar: ['Cụm phân từ bổ nghĩa: "combined with..."', 'Chủ ngữ ngôi thứ ba số ít hòa hợp với "is causing"'],
      band: 7.5
    },
    {
      vi: 'Sức khỏe tinh thần cần được coi trọng tương đương với thể chất trong các chính sách phúc lợi y tế cộng đồng.',
      en: 'Psychological well-being ought to be accorded equal prominence to physical health within public healthcare welfare policies.',
      vocab: [
        { word: 'psychological well-being', meaning: 'sức khỏe/hạnh phúc tâm lý', type: 'Formal Noun' },
        { word: 'accorded prominence', meaning: 'được dành cho sự coi trọng/ưu tiên', type: 'C2 Collocation' },
        { word: 'public healthcare welfare', meaning: 'phúc lợi y tế công cộng', type: 'Noun phrase' }
      ],
      grammar: ['Modal verb dạng bị động: "ought to be accorded"', 'So sánh ngang bằng'],
      band: 8.5
    }
  ],
  Work: [
    {
      vi: 'Mô hình làm việc linh hoạt từ xa không chỉ tiết kiệm thời gian di chuyển mà còn giúp nhân viên cân bằng tốt hơn giữa sự nghiệp và đời sống cá nhân.',
      en: 'The hybrid remote working model not only conserves commuting time but also facilitates a healthier equilibrium between career aspirations and personal life.',
      vocab: [
        { word: 'hybrid remote working model', meaning: 'mô hình làm việc kết hợp từ xa', type: 'Noun phrase' },
        { word: 'conserves', meaning: 'tiết kiệm, gìn giữ', type: 'C1 Verb' },
        { word: 'equilibrium', meaning: 'sự cân bằng, trạng thái cân bằng', type: 'C2 Noun' }
      ],
      grammar: ['Cấu trúc tương quan: "not only ... but also ..."', 'Hòa hợp thì và động từ song hành'],
      band: 8.0
    }
  ],
  Society: [
    {
      vi: 'Tốc độ đô thị hóa nhanh chóng đang tạo ra những áp lực chưa từng có lên cơ sở hạ tầng giao thông và nhà ở giá rẻ tại các siêu đô thị.',
      en: 'Rapid urban sprawl is exerting unprecedented strain on transportation infrastructure and affordable housing availability in megacities.',
      vocab: [
        { word: 'urban sprawl', meaning: 'sự mở rộng/đô thị hóa tràn lan', type: 'Collocation' },
        { word: 'exerting unprecedented strain', meaning: 'gây ra áp lực chưa từng có', type: 'C2 Collocation' },
        { word: 'affordable housing availability', meaning: 'sự sẵn có của nhà ở giá phải chăng', type: 'Noun phrase' }
      ],
      grammar: ['Hiện tại tiếp diễn với collocation mạnh', 'Cụm danh từ ghép phức hợp'],
      band: 8.5
    }
  ],
  Programming: [
    {
      vi: 'Nguyên lý Dependency Injection giúp giảm sự phụ thuộc trực tiếp giữa các module và tăng khả năng kiểm thử đơn vị trong các ứng dụng doanh nghiệp.',
      en: 'The Dependency Injection principle decouples direct dependencies between modules and significantly improves unit testability in enterprise software applications.',
      vocab: [
        { word: 'Dependency Injection', meaning: 'kỹ thuật tiêm phụ thuộc', type: 'Design Pattern' },
        { word: 'decouples dependencies', meaning: 'giảm bớt/tách rời sự phụ thuộc', type: 'Collocation' },
        { word: 'unit testability', meaning: 'khả năng kiểm thử đơn vị', type: 'Technical Term' }
      ],
      grammar: ['Hiện tại đơn miêu tả nguyên lý kỹ thuật', 'Động từ song hành: "decouples ... and improves ..."'],
      band: 8.0
    },
    {
      vi: 'Cơ chế Garbage Collection tự động thu hồi bộ nhớ không còn được sử dụng để ngăn ngừa hiện tượng rò rỉ bộ nhớ trong các hệ thống hiệu năng cao.',
      en: 'The Garbage Collection mechanism automatically reclaims unreferenced memory to effectively prevent memory leaks in high-performance computing systems.',
      vocab: [
        { word: 'Garbage Collection', meaning: 'bộ thu gom rác bộ nhớ', type: 'Technical Term' },
        { word: 'reclaims memory', meaning: 'thu hồi/giải phóng bộ nhớ', type: 'Collocation' },
        { word: 'memory leaks', meaning: 'rò rỉ bộ nhớ', type: 'Technical Term' }
      ],
      grammar: ['Cụm trạng từ bổ nghĩa: "automatically reclaims..."', 'Mệnh đề chỉ mục đích: "to effectively prevent..."'],
      band: 8.0
    },
    {
      vi: 'Lập trình bất đồng bộ với async và await cho phép ứng dụng xử lý các tác vụ truy xuất dữ liệu mà không làm nghẽn luồng xử lý giao diện người dùng.',
      en: 'Asynchronous programming utilizing async and await enables applications to execute data retrieval tasks without blocking the primary user interface thread.',
      vocab: [
        { word: 'Asynchronous programming', meaning: 'lập trình bất đồng bộ', type: 'Technical Term' },
        { word: 'data retrieval tasks', meaning: 'các tác vụ truy xuất dữ liệu', type: 'Noun phrase' },
        { word: 'blocking the primary thread', meaning: 'làm nghẽn luồng xử lý chính', type: 'Collocation' }
      ],
      grammar: ['Cụm phân từ bổ nghĩa: "utilizing async and await"', 'Cấu trúc: "enable someone to do something"'],
      band: 8.5
    }
  ]
};

// Fallback generator for custom topics when offline
function generateLocalExercises(options: GenerationOptions): ExerciseItem[] {
  let topicKey = options.topic || 'Technology';
  
  // Smart detection of programming or interview keywords if user typed a custom topic
  const customLower = (options.customTopic || '').toLowerCase();
  if (
    customLower.includes('lập trình') ||
    customLower.includes('.net') ||
    customLower.includes('code') ||
    customLower.includes('developer') ||
    customLower.includes('phỏng vấn') ||
    customLower.includes('software') ||
    customLower.includes('c#')
  ) {
    topicKey = 'Programming';
  }

  const templates = TOPIC_TEMPLATES[topicKey] || TOPIC_TEMPLATES['Technology'];
  const targetBand = options.band || 7.0;
  
  const count = Math.min(options.sentenceCount || 3, 5);
  const items: ExerciseItem[] = [];

  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    
    const viText = template.vi;
    const enText = template.en;
    const vocab = [...template.vocab];
    const grammar = [...template.grammar];

    const tokens = tokenizeSentence(enText);

    items.push({
      id: `gen-item-${Date.now()}-${i + 1}`,
      order: i + 1,
      vietnameseText: viText,
      englishAnswer: enText,
      tokens: tokens,
      vocabHints: vocab,
      grammarNotes: grammar,
      alternativeAnswers: [
        {
          band: Math.max(6.0, targetBand - 1.0),
          text: `A more conversational or straightforward phrasing: ${enText.replace(/necessitates/g, 'requires').replace(/unprecedented/g, 'great')}`,
          highlight: 'Cấu trúc câu đơn giản hơn, dễ tiếp cận.'
        },
        {
          band: Math.min(9.0, targetBand + 0.5),
          text: enText,
          highlight: `Phiên bản chuẩn chỉnh đạt Band ${targetBand} với từ vựng học thuật cao cấp.`
        }
      ],
      userAnswer: '',
      isCompleted: false,
      accuracyScore: 0
    });
  }

  return items;
}

// Call Google Gemini API
async function generateWithGemini(options: GenerationOptions): Promise<ExerciseItem[]> {
  const apiKey = options.apiKey?.trim();
  if (!apiKey) {
    throw new Error('Chưa cung cấp Google Gemini API Key.');
  }

  const topicPrompt = options.customTopic?.trim() || options.topicVi || options.topic;
  const band = options.band || 7.5;
  const count = options.sentenceCount || 3;

  const prompt = `Bạn là chuyên gia khảo thí IELTS Writing Task 2 hàng đầu. Hãy tạo một bộ bài tập luyện dịch câu tiếng Việt sang tiếng Anh chuẩn phong cách học thuật IELTS.

Yêu cầu cụ thể:
1. Chủ đề: "${topicPrompt}" (Topic in English: "${options.topic}")
2. Mục tiêu band điểm: Band ${band}
3. Số lượng câu: ${count} câu (mỗi câu có thể là câu phức học thuật hoặc đoạn ngắn 2-3 câu liên kết chặt chẽ giống như trong bài viết IELTS Task 2).
4. Câu tiếng Việt: Đi thẳng trực tiếp vào nội dung chuyên đề cần dịch, TUYỆT ĐỐI KHÔNG thêm lời dẫn dắt hay tiền tố như 'Liên quan đến chủ đề...', 'Chủ đề: ...'. Câu tiếng Việt và câu tiếng Anh phải tương đương chính xác từng ý một!
5. Câu tiếng Anh mẫu: Chuẩn xác tuyệt đối, cấu trúc câu tinh tế (inversion, participle clauses, passive voice, nominalization, advanced collocations) tương ứng chính xác với Band ${band}.
6. Danh sách từ vựng gợi ý (vocabHints): 3-5 từ/cụm từ then chốt với nghĩa tiếng Việt và loại từ.
7. Ghi chú ngữ pháp (grammarNotes): 2-3 điểm ngữ pháp quan trọng trong câu.
8. Các phiên bản thay thế (alternativeAnswers): 1 phiên bản band thấp hơn (khoảng Band 6.5) và 1 phiên bản band cao cấp (Band 8.5+).

QUAN TRỌNG: Bạn BẮT BUỘC phải trả về kết quả là một JSON ARRAY hợp lệ duy nhất, KHÔNG có văn bản giải thích thừa ngoài JSON:
[
  {
    "vietnameseText": "...",
    "englishAnswer": "...",
    "vocabHints": [
      { "word": "...", "meaning": "...", "type": "..." }
    ],
    "grammarNotes": [ "..." ],
    "alternativeAnswers": [
      { "band": 6.5, "text": "...", "highlight": "..." },
      { "band": 8.5, "text": "...", "highlight": "..." }
    ]
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Lỗi gọi Gemini API (HTTP ${response.status})`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini không phản hồi dữ liệu.');
  }

  // Robust JSON parsing
  let cleanJson = rawText.trim();
  const firstBracket = cleanJson.indexOf('[');
  const lastBracket = cleanJson.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
  } else {
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }
  }

  let parsedItems: any;
  try {
    parsedItems = JSON.parse(cleanJson);
  } catch {
    // Fallback: strip markdown blocks
    const stripped = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    parsedItems = JSON.parse(stripped);
  }

  if (!Array.isArray(parsedItems)) {
    if (Array.isArray(parsedItems?.items)) {
      parsedItems = parsedItems.items;
    } else if (Array.isArray(parsedItems?.exercises)) {
      parsedItems = parsedItems.exercises;
    } else {
      throw new Error('Định dạng JSON từ Gemini không đúng mảng bài tập.');
    }
  }

  return (parsedItems as any[]).map((item: any, idx: number) => ({
    id: `gemini-item-${Date.now()}-${idx + 1}`,
    order: idx + 1,
    vietnameseText: item.vietnameseText || '',
    englishAnswer: item.englishAnswer || '',
    tokens: tokenizeSentence(item.englishAnswer || ''),
    vocabHints: item.vocabHints || [],
    grammarNotes: item.grammarNotes || [],
    alternativeAnswers: item.alternativeAnswers || [],
    userAnswer: '',
    isCompleted: false,
    accuracyScore: 0
  }));
}

// Master function to generate an ExerciseSet
export async function createNewExerciseSet(options: GenerationOptions): Promise<ExerciseSet> {
  let items: ExerciseItem[];

  if (options.useGeminiApiKey && options.apiKey) {
    try {
      items = await generateWithGemini(options);
    } catch (err: any) {
      console.warn('Gemini generation failed, falling back to built-in generator:', err);
      // If user provided key was invalid or quota exceeded, fallback to smart built-in
      items = generateLocalExercises(options);
      // Attach an informative warning
      items[0].grammarNotes.push(`(Lưu ý: Đã chuyển sang bộ dữ liệu dự phòng do lỗi API: ${err.message})`);
    }
  } else {
    // Artificial small delay to simulate generation feel
    await new Promise((resolve) => setTimeout(resolve, 800));
    items = generateLocalExercises(options);
  }

  const topicName = options.customTopic?.trim() || options.topic;
  const topicViName = options.customTopic?.trim() || options.topicVi || options.topic;

  return {
    id: `set-${Date.now()}`,
    title: `${topicName} (Band ${options.band})`,
    topic: topicName,
    topicVi: topicViName,
    band: options.band,
    createdAt: new Date().toISOString(),
    items: items
  };
}

// Compare user translation to target answer
export interface EvaluationResult {
  accuracy: number;
  matchedWordsCount: number;
  totalTargetWords: number;
  isPerfect: boolean;
  matchedTokens: string[];
  missingTokens: string[];
  feedbackMessage: string;
}

export function evaluateTranslation(userText: string, targetText: string): EvaluationResult {
  const cleanTargetWords = targetText
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const cleanUserWords = userText
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (cleanUserWords.length === 0) {
    return {
      accuracy: 0,
      matchedWordsCount: 0,
      totalTargetWords: cleanTargetWords.length,
      isPerfect: false,
      matchedTokens: [],
      missingTokens: cleanTargetWords,
      feedbackMessage: 'Hãy nhập bản dịch của bạn để kiểm tra!'
    };
  }

  const targetSet = new Set(cleanTargetWords);
  const userSet = new Set(cleanUserWords);

  let matchCount = 0;
  const matchedTokens: string[] = [];
  const missingTokens: string[] = [];

  targetSet.forEach((word) => {
    if (userSet.has(word)) {
      matchCount++;
      matchedTokens.push(word);
    } else {
      missingTokens.push(word);
    }
  });

  const accuracy = Math.min(100, Math.round((matchCount / targetSet.size) * 100));
  const isPerfect = accuracy >= 90;

  let feedback = '';
  if (accuracy >= 95) {
    feedback = 'Xuất sắc! Bạn đã dịch gần như hoàn hảo cả về từ vựng lẫn cấu trúc!';
  } else if (accuracy >= 80) {
    feedback = 'Rất tốt! Bản dịch chính xác phần lớn ý tưởng và từ vựng then chốt.';
  } else if (accuracy >= 60) {
    feedback = 'Khá tốt! Bạn đã nắm được ý chính, hãy chú ý thêm các liên từ và cấu trúc ngữ pháp nâng cao.';
  } else {
    feedback = 'Đã ghi nhận bản dịch! Hãy đối chiếu với đáp án mẫu bên dưới để học thêm từ vựng và mẫu câu nhé.';
  }

  return {
    accuracy,
    matchedWordsCount: matchCount,
    totalTargetWords: targetSet.size,
    isPerfect,
    matchedTokens,
    missingTokens,
    feedbackMessage: feedback
  };
}
