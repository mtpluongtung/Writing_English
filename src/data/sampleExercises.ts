import type { ExerciseSet } from '../types';

export const INITIAL_EXERCISE_SETS: ExerciseSet[] = [
  {
    id: 'set-remote-work',
    title: 'Work & Modern Society',
    topic: 'Work & Society',
    topicVi: 'Việc làm & Xã hội hiện đại',
    band: 8.0,
    createdAt: new Date().toISOString(),
    items: [
      {
        id: 'remote-1',
        order: 1,
        vietnameseText: 'làm việc từ xa đang trở thành vấn đề ngày càng được quan tâm trong xã hội hiện đại. Nhiều chuyên gia cho rằng đây là một trong những thách thức quan trọng nhất mà chúng ta phải đối mặt. Cần có sự hợp tác chặt chẽ giữa chính phủ, doanh nghiệp và cộng đồng để giải quyết vấn đề này một cách hiệu quả.',
        englishAnswer: 'Remote working is becoming an increasingly important topic in modern society. Many experts believe that it is one of the most significant challenges we face today. Close collaboration between governments, businesses, and communities is needed to address this issue effectively.',
        tokens: [
          'Remote', 'working', 'is', 'becoming', 'an', 'increasingly', 'important', 'topic', 'in', 
          'modern', 'society.', 'Many', 'experts', 'believe', 'that', 'it', 'is', 'one', 'of', 'the', 
          'most', 'significant', 'challenges', 'we', 'face', 'today.', 'Close', 'collaboration', 
          'between', 'governments,', 'businesses,', 'and', 'communities', 'is', 'needed', 'to', 
          'address', 'this', 'issue', 'effectively.'
        ],
        vocabHints: [
          { word: 'Remote working', meaning: 'làm việc từ xa', type: 'Collocation' },
          { word: 'increasingly important', meaning: 'ngày càng quan trọng/được quan tâm', type: 'Collocation' },
          { word: 'significant challenges', meaning: 'những thách thức quan trọng/đáng kể', type: 'Noun phrase' },
          { word: 'Close collaboration', meaning: 'sự hợp tác chặt chẽ', type: 'Collocation' },
          { word: 'address this issue', meaning: 'giải quyết vấn đề này', type: 'Verb phrase' },
          { word: 'effectively', meaning: 'một cách hiệu quả', type: 'Adverb' }
        ],
        grammarNotes: [
          'Hiện tại tiếp diễn miêu tả xu hướng: "is becoming an increasingly..."',
          'Mệnh đề quan hệ rút gọn: "challenges (that) we face today"',
          'Cấu trúc bị động thể hiện sự cần thiết: "...is needed to address..."'
        ],
        alternativeAnswers: [
          {
            band: 7.0,
            text: 'Working from home is becoming more popular in today society. Many specialists think this is one of the biggest challenges we must deal with. There should be good cooperation among government, companies and people to solve this problem well.',
            highlight: 'Dùng cấu trúc đơn giản hơn như "working from home", "deal with", "solve this problem well".'
          },
          {
            band: 8.5,
            text: 'Telecommuting has emerged as a subject of heightened scrutiny in contemporary society. Numerous scholars contend that it constitutes one of the paramount hurdles confronting our era. Synergistic partnerships among governmental authorities, corporate entities, and civic spheres are imperative to tackle this dilemma effectively.',
            highlight: 'Dùng từ vựng C2 (telecommuting, heightened scrutiny, paramount hurdles, synergistic partnerships).'
          }
        ],
        userAnswer: '',
        isCompleted: false,
        accuracyScore: 0
      },
      {
        id: 'tech-1',
        order: 2,
        vietnameseText: 'Công nghệ tái tạo năng lượng từ sóng biển và thủy triều đang được phát triển như nguồn năng lượng tái tạo bổ sung cho điện mặt trời và điện gió. Các vùng ven biển và hải đảo có thể đặc biệt hưởng lợi từ nguồn năng lượng đại dương ổn định này. Mặc dù chi phí còn cao và thách thức kỹ thuật còn nhiều, tiềm năng của năng lượng đại dương là rất đáng kể.',
        englishAnswer: 'Technology for generating energy from ocean waves and tides is being developed as a renewable energy supplement to solar and wind power. Coastal regions and islands could particularly benefit from this stable ocean energy source. Although costs are still high and technical challenges remain, the potential of ocean energy is very considerable.',
        tokens: [
          'Technology', 'for', 'generating', 'energy', 'from', 'ocean', 'waves', 'and', 'tides', 
          'is', 'being', 'developed', 'as', 'a', 'renewable', 'energy', 'supplement', 'to', 
          'solar', 'and', 'wind', 'power.', 'Coastal', 'regions', 'and', 'islands', 'could', 
          'particularly', 'benefit', 'from', 'this', 'stable', 'ocean', 'energy', 'source.', 
          'Although', 'costs', 'are', 'still', 'high', 'and', 'technical', 'challenges', 
          'remain,', 'the', 'potential', 'of', 'ocean', 'energy', 'is', 'very', 'considerable.'
        ],
        vocabHints: [
          { word: 'supplement to', meaning: 'phần bổ sung cho', type: 'Noun phrase' },
          { word: 'renewable energy', meaning: 'năng lượng tái tạo', type: 'Collocation' },
          { word: 'benefit from', meaning: 'hưởng lợi từ', type: 'Verb phrase' },
          { word: 'technical challenges', meaning: 'thách thức kỹ thuật', type: 'Collocation' },
          { word: 'considerable', meaning: 'rất đáng kể, to lớn', type: 'Adjective' }
        ],
        grammarNotes: [
          'Hiện tại tiếp diễn bị động: "is being developed"',
          'Mệnh đề nhượng bộ: "Although + S + V, ..."',
          'Cụm danh từ học thuật: "stable ocean energy source"'
        ],
        alternativeAnswers: [
          {
            band: 7.0,
            text: 'Technologies that produce energy from sea waves and tides are being created to support solar and wind power. Coastal areas and islands can especially get benefits from this stable source of energy. Even though costs remain high and there are technical issues, ocean energy has great potential.',
            highlight: 'Dùng từ phổ thông hơn như "produce energy", "get benefits", "even though".'
          },
          {
            band: 8.5,
            text: 'Harnessing energy from ocean waves and tidal currents is emerging as a viable renewable complement to solar and wind power. Littoral zones and archipelagoes stand to benefit immensely from such dependable marine energy supplies. Despite prohibitive initial capital expenditures and enduring engineering bottlenecks, the long-term potential of ocean-based energy remains immense.',
            highlight: 'Dùng cấu trúc danh từ hóa (Harnessing energy), từ vựng C2 (littoral zones, archipelagoes, bottlenecks).'
          }
        ],
        userAnswer: '',
        isCompleted: false,
        accuracyScore: 0
      }
    ]
  },
  {
    id: 'set-env-75',
    title: 'Environment & Climate Change',
    topic: 'Environment',
    topicVi: 'Môi trường & Khí hậu',
    band: 7.5,
    createdAt: new Date().toISOString(),
    items: [
      {
        id: 'env-1',
        order: 1,
        vietnameseText: 'Các chính phủ trên khắp thế giới cần thực thi những quy định nghiêm ngặt hơn đối với lượng khí thải công nghiệp nhằm giảm thiểu tác động tiêu cực của biến đổi khí hậu toàn cầu.',
        englishAnswer: 'Governments across the world must enforce stricter regulations on industrial emissions in order to mitigate the adverse impacts of global climate change.',
        tokens: [
          'Governments', 'across', 'the', 'world', 'must', 'enforce', 'stricter', 
          'regulations', 'on', 'industrial', 'emissions', 'in', 'order', 'to', 
          'mitigate', 'the', 'adverse', 'impacts', 'of', 'global', 'climate', 'change.'
        ],
        vocabHints: [
          { word: 'enforce regulations', meaning: 'thực thi các quy định', type: 'Collocation' },
          { word: 'industrial emissions', meaning: 'lượng khí thải công nghiệp', type: 'Collocation' },
          { word: 'mitigate', meaning: 'giảm nhẹ, xoa dịu', type: 'Academic Verb' },
          { word: 'adverse impacts', meaning: 'những tác động tiêu cực', type: 'Academic Phrase' }
        ],
        grammarNotes: [
          'Modal verb chỉ nghĩa vụ: "must enforce"',
          'Cụm chỉ mục đích: "in order to mitigate..."'
        ],
        userAnswer: '',
        isCompleted: false,
        accuracyScore: 0
      }
    ]
  }
];

export const PRESET_TOPICS = [
  { id: 'Programming', nameVi: 'Lập trình & CNTT', nameEn: 'Software & IT', icon: 'Code' },
  { id: 'Work', nameVi: 'Việc làm & Xã hội', nameEn: 'Work & Society', icon: 'Briefcase' },
  { id: 'Technology', nameVi: 'Công nghệ & Đổi mới', nameEn: 'Technology & Innovation', icon: 'Cpu' },
  { id: 'Environment', nameVi: 'Môi trường & Khí hậu', nameEn: 'Environment & Climate', icon: 'Leaf' },
  { id: 'Education', nameVi: 'Giáo dục & Học đường', nameEn: 'Education & Learning', icon: 'GraduationCap' },
  { id: 'Health', nameVi: 'Sức khỏe & Y tế', nameEn: 'Health & Medicine', icon: 'HeartPulse' },
  { id: 'Society', nameVi: 'Xã hội & Đời sống', nameEn: 'Society & Culture', icon: 'Users' },
  { id: 'Urbanization', nameVi: 'Đô thị & Giao thông', nameEn: 'Urbanization & Transport', icon: 'Building2' },
  { id: 'Crime', nameVi: 'Tội phạm & Pháp luật', nameEn: 'Crime & Justice', icon: 'Scale' },
];

export const BAND_OPTIONS = [
  { value: 5.5, label: 'Band 5.5', desc: 'Từ vựng cơ bản, câu ghép thông dụng' },
  { value: 6.0, label: 'Band 6.0', desc: 'Mạch lạc, câu phức đơn giản' },
  { value: 6.5, label: 'Band 6.5', desc: 'Từ vựng học thuật cơ bản, liên kết tốt' },
  { value: 7.0, label: 'Band 7.0', desc: 'Collocations tốt, đa dạng ngữ pháp' },
  { value: 7.5, label: 'Band 7.5', desc: 'Văn phong học thuật vững vàng, ít lỗi' },
  { value: 8.0, label: 'Band 8.0', desc: 'Từ vựng tinh tế, cấu trúc phức hợp phong phú' },
  { value: 8.5, label: 'Band 8.5', desc: 'Tự nhiên như bản ngữ, danh từ hóa chuẩn xác' },
  { value: 9.0, label: 'Band 9.0', desc: 'Đỉnh cao học thuật, uyển chuyển tuyệt đối' },
];

export interface GeminiModelOption {
  id: string;
  name: string;
  tag: string;
  badgeClass: string;
  desc: string;
}

export const GEMINI_MODELS: GeminiModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    tag: 'Bản 3.8 Flash',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    desc: 'Mô hình Gemini 3.8 Flash hiệu năng cao.'
  },
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    tag: 'Bản 3.7 Flash',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    desc: 'Mô hình Gemini 3.7 Flash tốc độ cao.'
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    tag: 'Bản 3.6 Flash',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    desc: 'Mô hình Gemini 3.6 Flash.'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    tag: 'Bản 2.0 Flash',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    desc: 'Mô hình thế hệ 2.0 Flash của Google.'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    tag: 'Bản 1.5 Flash',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    desc: 'Bản 1.5 Flash thông dụng, ổn định cao.'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    tag: 'Bản 1.5 Pro',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    desc: 'Mô hình 1.5 Pro lý luận sâu sắc, chuẩn văn phong học thuật cao cấp.'
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite',
    tag: 'Bản Lite',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    desc: 'Bản Flash 2.0 rút gọn, tối ưu chi phí và tốc độ phản hồi.'
  }
];

