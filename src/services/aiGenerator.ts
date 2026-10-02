import type { ExerciseItem, ExerciseSet, GenerationOptions } from '../types';

// Helper to tokenize an English sentence into word tokens
export function tokenizeSentence(sentence: string): string[] {
  // Split words while keeping punctuation attached to word or clean tokens
  return sentence.trim().split(/\s+/).filter(Boolean);
}

// Built-in intelligent dataset with 10 high-standard IELTS sentences per topic
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
    },
    {
      vi: 'Thuật toán trí tuệ nhân tạo đang nâng cao đáng kể độ chính xác trong chẩn đoán y khoa và cá nhân hóa phác đồ điều trị cho bệnh nhân.',
      en: 'Artificial intelligence algorithms are significantly augmenting clinical diagnostic precision and personalizing therapeutic regimens for vulnerable patients.',
      vocab: [
        { word: 'augmenting', meaning: 'gia tăng, nâng cao', type: 'Academic Verb' },
        { word: 'diagnostic precision', meaning: 'độ chính xác trong chẩn đoán', type: 'Collocation' },
        { word: 'therapeutic regimens', meaning: 'phác đồ điều trị trị liệu', type: 'Medical Term' }
      ],
      grammar: ['Hiện tại tiếp diễn: "are significantly augmenting"', 'Danh động từ song hành: "and personalizing"'],
      band: 8.0
    },
    {
      vi: 'Sự hiện diện tràn ngập của điện thoại thông minh đang làm suy giảm khả năng tập trung sâu và kỹ năng giao tiếp trực tiếp của thế hệ trẻ.',
      en: 'The ubiquitous presence of smartphones is eroding interpersonal communication faculties and curtailing the capacity for prolonged cognitive focus.',
      vocab: [
        { word: 'ubiquitous presence', meaning: 'sự hiện diện khắp mọi nơi', type: 'C2 Collocation' },
        { word: 'eroding', meaning: 'bào mòn, làm xói mòn', type: 'Academic Verb' },
        { word: 'curtailing', meaning: 'cắt giảm, hạn chế', type: 'Formal Verb' }
      ],
      grammar: ['Hiện tại tiếp diễn: "is eroding... and curtailing"', 'Cụm danh từ học thuật'],
      band: 8.5
    },
    {
      vi: 'Công nghệ điện toán lượng tử hứa hẹn sẽ cách mạng hóa khả năng mã hóa dữ liệu và giải quyết những bài toán khoa học phức tạp nhất.',
      en: 'Quantum computing technology holds the promise of revolutionizing data cryptography and resolving intractable computational dilemmas facing contemporary science.',
      vocab: [
        { word: 'holds the promise of', meaning: 'hứa hẹn sẽ mang lại', type: 'Idiomatic Phrase' },
        { word: 'data cryptography', meaning: 'mật mã học dữ liệu', type: 'Specialized Noun' },
        { word: 'intractable dilemmas', meaning: 'những nan đề nan giải', type: 'C2 Collocation' }
      ],
      grammar: ['Mệnh đề phân từ: "facing contemporary science"', 'Danh động từ sau giới từ "of"'],
      band: 8.5
    },
    {
      vi: 'Hạ tầng điện toán đám mây cho phép các doanh nghiệp vận hành linh hoạt mà không cần đầu tư nguồn vốn ban đầu quá lớn vào máy chủ vật lý.',
      en: 'Cloud computing infrastructure empowers commercial enterprises to operate seamlessly without incurring exorbitant upfront capital expenditures on physical servers.',
      vocab: [
        { word: 'empowers', meaning: 'trao quyền, tạo điều kiện', type: 'Academic Verb' },
        { word: 'exorbitant', meaning: 'đắt đỏ, quá mức', type: 'C2 Adjective' },
        { word: 'capital expenditures', meaning: 'chi phí đầu tư vốn', type: 'Business Term' }
      ],
      grammar: ['Cấu trúc: "empower someone to do something"', 'Giới từ theo sau bởi V-ing: "without incurring"'],
      band: 8.0
    },
    {
      vi: 'Phương tiện tự hành được kỳ vọng sẽ giảm thiểu đáng kể tai nạn giao thông xuất phát từ sự bất cẩn và mệt mỏi của con người.',
      en: 'Autonomous vehicles are anticipated to dramatically diminish vehicular collisions attributable to human negligence and driving fatigue.',
      vocab: [
        { word: 'Autonomous vehicles', meaning: 'xe tự hành, phương tiện tự lái', type: 'Collocation' },
        { word: 'diminish collisions', meaning: 'giảm bớt tai nạn/va chạm', type: 'Collocation' },
        { word: 'attributable to', meaning: 'quy cho là do', type: 'Formal Phrase' }
      ],
      grammar: ['Dạng bị động tương lai: "are anticipated to diminish"', 'Tính từ theo sau danh từ: "attributable to"'],
      band: 8.0
    },
    {
      vi: 'Phân tích dữ liệu lớn mở ra cơ hội tối ưu hóa tiếp thị nhưng đồng thời cũng làm dấy lên những tranh cãi nghiêm trọng về quyền riêng tư cá nhân.',
      en: 'Big data analytics facilitates targeted consumer marketing while simultaneously igniting contentious ethical debates surrounding personal digital privacy.',
      vocab: [
        { word: 'facilitates', meaning: 'tạo điều kiện thuận lợi', type: 'Academic Verb' },
        { word: 'igniting contentious debates', meaning: 'châm ngòi cho các tranh luận gay gắt', type: 'C2 Collocation' },
        { word: 'ethical debates', meaning: 'các tranh cãi đạo đức', type: 'Collocation' }
      ],
      grammar: ['Mệnh đề phân từ rút gọn: "surrounding personal digital privacy"', 'Liên từ đối lập: "while simultaneously"'],
      band: 8.5
    },
    {
      vi: 'Chuyển đổi số toàn diện đang định hình lại lợi thế cạnh tranh của các doanh nghiệp trong nền kinh tế tri thức hiện đại.',
      en: 'Comprehensive digital transformation is fundamentally reshaping competitive advantages for forward-thinking enterprises in the contemporary knowledge-based economy.',
      vocab: [
        { word: 'digital transformation', meaning: 'chuyển đổi số', type: 'Collocation' },
        { word: 'competitive advantages', meaning: 'lợi thế cạnh tranh', type: 'Business Term' },
        { word: 'knowledge-based economy', meaning: 'nền kinh tế dựa trên tri thức', type: 'Academic Noun' }
      ],
      grammar: ['Hiện tại tiếp diễn nhấn mạnh xu hướng', 'Tính từ ghép: "forward-thinking", "knowledge-based"'],
      band: 8.0
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
    },
    {
      vi: 'Kiến trúc Microservices tạo điều kiện cho các đội ngũ phát triển mở rộng từng dịch vụ độc lập và triển khai phần mềm liên tục.',
      en: 'A microservices architecture facilitates independent service scalability and empowers multidisciplinary engineering teams to maintain continuous software deployment pipelines.',
      vocab: [
        { word: 'microservices architecture', meaning: 'kiến trúc vi dịch vụ', type: 'Technical Term' },
        { word: 'scalability', meaning: 'khả năng mở rộng quy mô', type: 'Noun' },
        { word: 'continuous software deployment', meaning: 'triển khai phần mềm liên tục', type: 'Collocation' }
      ],
      grammar: ['Cấu trúc: "facilitate something and empower someone to do something"'],
      band: 8.0
    },
    {
      vi: 'Việc áp dụng chiến lược lưu bộ nhớ đệm thông minh có thể cắt giảm đáng kể độ trễ phản hồi từ cơ sở dữ liệu khi lưu lượng truy cập tăng vọt.',
      en: 'Implementing sophisticated distributed caching strategies can drastically diminish database query latency during unexpected spikes in concurrent user traffic.',
      vocab: [
        { word: 'distributed caching', meaning: 'bộ nhớ đệm phân tán', type: 'Technical Term' },
        { word: 'query latency', meaning: 'độ trễ của truy vấn', type: 'Technical Term' },
        { word: 'concurrent user traffic', meaning: 'lưu lượng người dùng đồng thời', type: 'Collocation' }
      ],
      grammar: ['Danh động từ làm chủ ngữ: "Implementing..."', 'Modal verb chỉ tiềm năng: "can drastically diminish"'],
      band: 8.5
    },
    {
      vi: 'Các nguyên lý lập trình hướng đối tượng như tính đóng gói và tính đa hình giúp thúc đẩy khả năng tái sử dụng mã nguồn và bảo trì lâu dài.',
      en: 'Fundamental object-oriented principles such as encapsulation and polymorphism foster extensive code reusability and simplify long-term software maintainability.',
      vocab: [
        { word: 'encapsulation', meaning: 'tính đóng gói dữ liệu', type: 'OOP Concept' },
        { word: 'polymorphism', meaning: 'tính đa hình', type: 'OOP Concept' },
        { word: 'code reusability', meaning: 'khả năng tái sử dụng mã nguồn', type: 'Collocation' }
      ],
      grammar: ['Cấu trúc đưa ví dụ: "such as..."', 'Động từ song hành: "foster ... and simplify ..."'],
      band: 8.0
    },
    {
      vi: 'Quy trình tích hợp liên tục tự động giúp phát hiện kịp thời các lỗi hồi quy trước khi sản phẩm được phát hành tới tay khách hàng.',
      en: 'Automated continuous integration workflows facilitate the prompt detection of software regressions well before artifacts are released into production environments.',
      vocab: [
        { word: 'continuous integration', meaning: 'tích hợp liên tục (CI)', type: 'DevOps Term' },
        { word: 'software regressions', meaning: 'lỗi hồi quy phần mềm', type: 'Collocation' },
        { word: 'production environments', meaning: 'môi trường thực tế (production)', type: 'Technical Term' }
      ],
      grammar: ['Mệnh đề thời gian: "well before artifacts are released..."', 'Dạng bị động: "are released"'],
      band: 8.5
    },
    {
      vi: 'Đánh chỉ mục cơ sở dữ liệu giúp tăng tốc độ tìm kiếm nhưng lại làm phát sinh chi phí dung lượng lưu trữ và làm chậm thao tác ghi dữ liệu.',
      en: 'Database indexing significantly accelerates record retrieval speeds, though it incurs additional storage overhead and slightly degrades data write throughput.',
      vocab: [
        { word: 'indexing', meaning: 'đánh chỉ mục dữ liệu', type: 'Database Term' },
        { word: 'storage overhead', meaning: 'phụ phí dung lượng lưu trữ', type: 'Noun phrase' },
        { word: 'write throughput', meaning: 'thông lượng ghi dữ liệu', type: 'Technical Term' }
      ],
      grammar: ['Liên từ nhượng bộ: "though it incurs..."', 'Từ vựng chuyên ngành cơ sở dữ liệu chính xác'],
      band: 8.0
    },
    {
      vi: 'Tái cấu trúc mã nguồn thường xuyên là biện pháp hiệu quả nhằm xóa bỏ nợ kỹ thuật mà không làm biến đổi hành vi bên ngoài của hệ thống.',
      en: 'Systematic code refactoring serves as an effective mechanism to eliminate technical debt without modifying the observable external behavior of the application.',
      vocab: [
        { word: 'code refactoring', meaning: 'tái cấu trúc mã nguồn', type: 'Software Term' },
        { word: 'technical debt', meaning: 'nợ kỹ thuật', type: 'Collocation' },
        { word: 'observable external behavior', meaning: 'hành vi bên ngoài quan sát được', type: 'Noun phrase' }
      ],
      grammar: ['Cụm thành ngữ học thuật: "serves as an effective mechanism to..."', 'Giới từ "without" + V-ing'],
      band: 8.5
    },
    {
      vi: 'Công nghệ đóng gói container đảm bảo phần mềm chạy ổn định và đồng nhất trên mọi môi trường phát triển và máy chủ đám mây.',
      en: 'Containerization technology guarantees that software applications execute with predictable consistency across divergent operating systems and cloud computing platforms.',
      vocab: [
        { word: 'Containerization', meaning: 'công nghệ container hóa (Docker)', type: 'Technical Term' },
        { word: 'predictable consistency', meaning: 'tính nhất quán có thể dự đoán được', type: 'Collocation' },
        { word: 'divergent operating systems', meaning: 'các hệ điều hành khác biệt nhau', type: 'Noun phrase' }
      ],
      grammar: ['Mệnh đề danh ngữ: "guarantees that..."', 'Tính từ học thuật: "divergent"'],
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
    },
    {
      vi: 'Nạn phá rừng nhiệt đới không chỉ hủy hoại môi trường sống tự nhiên mà còn làm suy giảm nghiêm trọng khả năng hấp thụ khí carbon của Trái Đất.',
      en: 'Deforestation in tropical rainforests not only devastates endemic wildlife habitats but also severely impairs global atmospheric carbon sequestration capacities.',
      vocab: [
        { word: 'endemic wildlife habitats', meaning: 'môi trường sống của sinh vật đặc hữu', type: 'Academic Noun' },
        { word: 'carbon sequestration', meaning: 'sự cô lập/hấp thụ carbon', type: 'Scientific Term' },
        { word: 'impairs', meaning: 'làm suy giảm, tổn hại', type: 'Academic Verb' }
      ],
      grammar: ['Cấu trúc đảo hoặc tương quan: "not only ... but also ..."', 'Từ vựng sinh thái cao cấp'],
      band: 8.5
    },
    {
      vi: 'Chất thải nhựa dùng một lần đang gây ra những tổn thất sinh thái khó có thể đảo ngược đối với các sinh vật và hệ sinh thái đại dương.',
      en: 'Single-use plastic refuse is inflicting irreversible ecological degradation upon fragile marine fauna and oceanic ecosystems worldwide.',
      vocab: [
        { word: 'plastic refuse', meaning: 'rác thải nhựa', type: 'Formal Noun' },
        { word: 'inflicting degradation', meaning: 'gây ra sự suy thoái', type: 'Collocation' },
        { word: 'irreversible', meaning: 'không thể đảo ngược', type: 'C1 Adjective' }
      ],
      grammar: ['Hiện tại tiếp diễn với collocation mạnh', 'Cụm danh từ: "fragile marine fauna"'],
      band: 8.0
    },
    {
      vi: 'Việc áp dụng mức thuế carbon nghiêm ngặt sẽ thúc đẩy các tập đoàn công nghiệp đẩy mạnh đổi mới công nghệ sạch và cắt giảm phát thải.',
      en: 'Imposing stringent carbon taxation schemes incentivizes industrial conglomerates to accelerate green technological innovation and curtail emissions.',
      vocab: [
        { word: 'stringent carbon taxation', meaning: 'đánh thuế carbon nghiêm ngặt', type: 'Collocation' },
        { word: 'incentivizes', meaning: 'khuyến khích, tạo động lực', type: 'Academic Verb' },
        { word: 'industrial conglomerates', meaning: 'các tập đoàn công nghiệp', type: 'Noun phrase' }
      ],
      grammar: ['Danh động từ làm chủ ngữ: "Imposing..."', 'Động từ theo sau bởi to-infinitive'],
      band: 8.5
    },
    {
      vi: 'Sự suy giảm đa dạng sinh học đang làm lung lay nền tảng của các hệ sinh thái và đe dọa trực tiếp đến an ninh lương thực toàn cầu.',
      en: 'The unprecedented erosion of biological diversity destabilizes foundational ecological webs and directly jeopardizes worldwide agricultural security.',
      vocab: [
        { word: 'erosion of biological diversity', meaning: 'sự suy giảm đa dạng sinh học', type: 'Collocation' },
        { word: 'destabilizes', meaning: 'làm mất ổn định/lung lay', type: 'Academic Verb' },
        { word: 'jeopardizes', meaning: 'đe dọa, gây nguy hiểm', type: 'C1 Verb' }
      ],
      grammar: ['Hiện tại đơn thể hiện quy luật khách quan', 'Các động từ học thuật mạnh'],
      band: 8.5
    },
    {
      vi: 'Khai thác quá mức các tầng chứa nước ngầm đang khiến nhiều vùng nông nghiệp đối mặt với nguy cơ hạn hán nghiêm trọng.',
      en: 'The relentless overexploitation of subterranean aquifers is leaving vital agricultural territories vulnerable to acute hydrological crises.',
      vocab: [
        { word: 'overexploitation', meaning: 'sự khai thác cạn kiệt/quá mức', type: 'Academic Noun' },
        { word: 'subterranean aquifers', meaning: 'các tầng chứa nước ngầm', type: 'Specialized Term' },
        { word: 'hydrological crises', meaning: 'khủng hoảng nguồn nước', type: 'Academic Phrase' }
      ],
      grammar: ['Cấu trúc: "leave someone/something vulnerable to..."', 'Hiện tại tiếp diễn'],
      band: 8.5
    },
    {
      vi: 'Năng lượng mặt trời và điện gió đang dần trở nên rẻ hơn, tạo tiền đề cho quá trình từ bỏ nhiệt điện than gây ô nhiễm.',
      en: 'Solar photovoltaics and onshore wind energy have become remarkably cost-effective, accelerating the permanent phaseout of polluting coal-fired power stations.',
      vocab: [
        { word: 'photovoltaics', meaning: 'quang điện mặt trời', type: 'Technical Term' },
        { word: 'cost-effective', meaning: 'tiết kiệm chi phí, hiệu quả kinh tế', type: 'Adjective' },
        { word: 'phaseout of', meaning: 'sự loại bỏ dần từng bước', type: 'Collocation' }
      ],
      grammar: ['Hiện tại hoàn thành: "have become remarkably..."', 'Mệnh đề phân từ rút gọn: "accelerating..."'],
      band: 8.0
    },
    {
      vi: 'Các hiệp ước môi trường quốc tế cần có chế tài cưỡng chế ràng buộc để bảo đảm các quốc gia thành viên thực hiện đúng cam kết cắt giảm.',
      en: 'Multilateral environmental treaties require legally binding enforcement mechanisms to guarantee that participating nations fulfill their emission reduction pledges.',
      vocab: [
        { word: 'Multilateral treaties', meaning: 'các hiệp ước đa phương', type: 'Diplomatic Term' },
        { word: 'legally binding', meaning: 'ràng buộc về mặt pháp lý', type: 'Collocation' },
        { word: 'emission reduction pledges', meaning: 'cam kết cắt giảm phát thải', type: 'Noun phrase' }
      ],
      grammar: ['Mệnh đề danh ngữ: "to guarantee that..."', 'Cụm tính từ ghép: "legally binding"'],
      band: 8.5
    },
    {
      vi: 'Các dự án phủ xanh đô thị đóng vai trò thiết yếu trong việc hạ nhiệt độ không khí và thanh lọc ô nhiễm bụi mịn tại các đại đô thị.',
      en: 'Urban afforestation initiatives play an indispensable role in mitigating microclimatic heat islands and filtering hazardous airborne particulate matter.',
      vocab: [
        { word: 'Urban afforestation', meaning: 'việc trồng rừng/phủ xanh đô thị', type: 'Academic Term' },
        { word: 'heat islands', meaning: 'hiện tượng đảo nhiệt đô thị', type: 'Scientific Term' },
        { word: 'particulate matter', meaning: 'bụi mịn trong không khí', type: 'Environmental Term' }
      ],
      grammar: ['Cụm collocation cố định: "play an indispensable role in..." + V-ing'],
      band: 8.0
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
    },
    {
      vi: 'Hệ thống thi cử quá nặng tính lý thuyết thường làm triệt tiêu khả năng sáng tạo độc lập và tư duy phản biện của học sinh.',
      en: 'Overreliance on standardized rote-memorization examinations frequently stifles independent creativity and discourages robust critical thinking faculties.',
      vocab: [
        { word: 'Overreliance on', meaning: 'sự phụ thuộc thái quá vào', type: 'Collocation' },
        { word: 'stifles creativity', meaning: 'làm thui chột/dập tắt sự sáng tạo', type: 'C2 Collocation' },
        { word: 'critical thinking faculties', meaning: 'năng lực tư duy phản biện', type: 'Academic Phrase' }
      ],
      grammar: ['Danh từ ghép làm chủ ngữ: "Overreliance on..."', 'Động từ biểu cảm mạnh'],
      band: 8.5
    },
    {
      vi: 'Nhà nước cần đầu tư nâng cấp hạ tầng số tại các trường học vùng sâu vùng xa để thu hẹp khoảng cách tiếp cận tri thức giữa các tầng lớp.',
      en: 'Governments ought to allocate substantial subsidies toward digital educational infrastructure in remote provinces to bridge the educational attainment divide.',
      vocab: [
        { word: 'allocate substantial subsidies', meaning: 'phân bổ ngân sách trợ cấp đáng kể', type: 'Collocation' },
        { word: 'remote provinces', meaning: 'các tỉnh vùng sâu vùng xa', type: 'Noun phrase' },
        { word: 'attainment divide', meaning: 'khoảng cách về trình độ đạt được', type: 'Academic Phrase' }
      ],
      grammar: ['Modal verb đạo đức: "ought to allocate"', 'Cụm chỉ mục đích: "to bridge the divide"'],
      band: 8.0
    },
    {
      vi: 'Mô hình học tập theo dự án nhóm rèn luyện cho sinh viên kỹ năng làm việc tập thể và giải quyết bất đồng một cách hòa bình.',
      en: 'Collaborative project-based learning paradigms cultivate indispensable teamwork competencies and foster constructive dispute resolution skills.',
      vocab: [
        { word: 'project-based learning', meaning: 'học tập theo dự án', type: 'Educational Term' },
        { word: 'cultivate competencies', meaning: 'bồi dưỡng/rèn luyện năng lực', type: 'Collocation' },
        { word: 'dispute resolution', meaning: 'giải quyết mâu thuẫn/bất đồng', type: 'Collocation' }
      ],
      grammar: ['Chủ ngữ số nhiều hòa hợp động từ', 'Tính từ ghép bổ nghĩa'],
      band: 8.5
    },
    {
      vi: 'Tinh thần học tập suốt đời đang trở thành yếu tố quyết định sự tồn tại của người lao động trong thời đại trí tuệ nhân tạo phát triển vũ bão.',
      en: 'The ethos of lifelong learning has emerged as an indispensable prerequisite for professional survival amid rapid technological disruption.',
      vocab: [
        { word: 'ethos of lifelong learning', meaning: 'tinh thần học tập suốt đời', type: 'Academic Phrase' },
        { word: 'indispensable prerequisite', meaning: 'tiền đề không thể thiếu', type: 'C2 Collocation' },
        { word: 'technological disruption', meaning: 'sự gián đoạn/biến chuyển công nghệ', type: 'Collocation' }
      ],
      grammar: ['Hiện tại hoàn thành: "has emerged as..."', 'Giới từ quan hệ: "amid..."'],
      band: 8.5
    },
    {
      vi: 'Giáo dục song ngữ từ lứa tuổi mầm non giúp nâng cao sự linh hoạt trong tư duy nhận thức và khả năng đồng cảm văn hóa của trẻ nhỏ.',
      en: 'Early immersion in bilingual education enhances cognitive malleability and nurtures genuine intercultural empathy among young learners.',
      vocab: [
        { word: 'Early immersion', meaning: 'sự tiếp cận sớm thông qua hòa nhập', type: 'Educational Term' },
        { word: 'cognitive malleability', meaning: 'tính linh hoạt/mềm dẻo trong nhận thức', type: 'C2 Academic Term' },
        { word: 'intercultural empathy', meaning: 'sự đồng cảm giữa các nền văn hóa', type: 'Collocation' }
      ],
      grammar: ['Hiện tại đơn miêu tả kết quả nghiên cứu khoa học', 'Cặp động từ song hành'],
      band: 8.5
    },
    {
      vi: 'Một nền giáo dục toàn diện phải quan tâm đến sức khỏe tâm thần và cảm xúc của học sinh thay vì chỉ chú trọng vào điểm số bài kiểm tra.',
      en: 'A holistic educational philosophy must prioritize emotional equilibrium alongside scholastic achievements rather than fixating solely on examination scores.',
      vocab: [
        { word: 'holistic educational philosophy', meaning: 'triết lý giáo dục toàn diện', type: 'Academic Noun' },
        { word: 'emotional equilibrium', meaning: 'sự cân bằng cảm xúc', type: 'Formal Phrase' },
        { word: 'scholastic achievements', meaning: 'thành tích học thuật', type: 'Formal Noun' }
      ],
      grammar: ['Modal verb nghĩa vụ: "must prioritize"', 'Cụm giới từ đối lập: "rather than fixating..."'],
      band: 8.5
    },
    {
      vi: 'Áp lực học tập quá mức từ phía gia đình và xã hội đang gây ra tình trạng kiệt quệ tâm lý và trầm cảm ở thanh thiếu niên.',
      en: 'Excessive academic expectations imposed by parents and society often precipitate severe psychological exhaustion and clinical depression among adolescents.',
      vocab: [
        { word: 'Excessive expectations', meaning: 'kỳ vọng thái quá', type: 'Collocation' },
        { word: 'precipitate', meaning: 'làm khởi phát/dẫn đến nhanh chóng', type: 'C2 Academic Verb' },
        { word: 'psychological exhaustion', meaning: 'sự kiệt quệ tâm lý', type: 'Medical/Academic Collocation' }
      ],
      grammar: ['Mệnh đề phân từ bị động rút gọn: "imposed by parents..."', 'Động từ quan hệ nhân quả mạnh'],
      band: 8.0
    },
    {
      vi: 'Việc đưa kiến thức quản lý tài chính cá nhân vào chương trình học phổ thông giúp trang bị cho học sinh kỹ năng sinh tồn thực tế khi trưởng thành.',
      en: 'Incorporating personal financial literacy into secondary curricula equips adolescents with indispensable pragmatic competencies for adult self-sufficiency.',
      vocab: [
        { word: 'financial literacy', meaning: 'hiểu biết/kỹ năng quản lý tài chính', type: 'Collocation' },
        { word: 'secondary curricula', meaning: 'chương trình giáo dục trung học', type: 'Academic Term' },
        { word: 'pragmatic competencies', meaning: 'các năng lực thực dụng/thực tế', type: 'Formal Collocation' }
      ],
      grammar: ['Gerund chủ ngữ: "Incorporating..."', 'Cấu trúc: "equip someone with something"'],
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
    },
    {
      vi: 'Đầu tư vào y tế phòng ngừa mang lại hiệu quả kinh tế xã hội lâu dài vượt trội so với việc chỉ tập trung chi trả cho điều trị bệnh tật.',
      en: 'Investing heavily in preventative healthcare yields superior socioeconomic dividends compared to solely financing reactive clinical treatments.',
      vocab: [
        { word: 'preventative healthcare', meaning: 'y tế phòng ngừa/dự phòng', type: 'Medical Collocation' },
        { word: 'yields dividends', meaning: 'mang lại lợi ích/quả ngọt', type: 'C2 Idiomatic Collocation' },
        { word: 'reactive treatments', meaning: 'các biện pháp điều trị bị động khi đã phát bệnh', type: 'Medical Term' }
      ],
      grammar: ['Danh động từ làm chủ ngữ: "Investing heavily..."', 'Cụm so sánh: "compared to + V-ing"'],
      band: 8.5
    },
    {
      vi: 'Hiện tượng lạm dụng thuốc kháng sinh bừa bãi đang đẩy nhanh tốc độ kháng thuốc của vi khuẩn và tạo ra những siêu vi khuẩn nguy hiểm.',
      en: 'The indiscriminate overprescription of antibiotics is accelerating antimicrobial resistance, spawning lethal superbugs that resist conventional treatments.',
      vocab: [
        { word: 'indiscriminate overprescription', meaning: 'kê đơn bừa bãi không chọn lọc', type: 'Collocation' },
        { word: 'antimicrobial resistance', meaning: 'kháng thuốc kháng sinh', type: 'Medical Term' },
        { word: 'conventional treatments', meaning: 'phương pháp điều trị thông thường', type: 'Noun phrase' }
      ],
      grammar: ['Mệnh đề phân từ nguyên nhân kết quả: "spawning lethal superbugs..."', 'Mệnh đề quan hệ xác định'],
      band: 8.5
    },
    {
      vi: 'Quy định dán nhãn dinh dưỡng bắt buộc trên bao bì thực phẩm giúp người tiêu dùng đưa ra những lựa chọn lành mạnh hơn cho sức khỏe.',
      en: 'Mandatory nutritional labeling on packaged foodstuffs empowers consumers to make well-informed dietary choices and curtail excessive sugar intake.',
      vocab: [
        { word: 'Mandatory nutritional labeling', meaning: 'dán nhãn dinh dưỡng bắt buộc', type: 'Collocation' },
        { word: 'packaged foodstuffs', meaning: 'thực phẩm đóng gói', type: 'Formal Noun' },
        { word: 'curtail intake', meaning: 'cắt giảm lượng nạp vào', type: 'Collocation' }
      ],
      grammar: ['Cấu trúc: "empowers someone to do something and do something"'],
      band: 8.0
    },
    {
      vi: 'Thiếu ngủ kinh niên làm suy yếu nghiêm trọng hệ miễn dịch tự nhiên và làm giảm sút năng suất lao động trí óc hàng ngày.',
      en: 'Chronic sleep deprivation severely compromises innate immune defenses and substantially diminishes day-to-day cognitive productivity.',
      vocab: [
        { word: 'sleep deprivation', meaning: 'tình trạng thiếu ngủ', type: 'Medical Term' },
        { word: 'compromises defenses', meaning: 'làm suy yếu/tổn hại hàng rào phòng thủ', type: 'C2 Academic Collocation' },
        { word: 'cognitive productivity', meaning: 'năng suất nhận thức/lao động trí óc', type: 'Noun phrase' }
      ],
      grammar: ['Cặp động từ song hành ở ngôi thứ 3 số ít: "compromises ... and diminishes ..."'],
      band: 8.0
    },
    {
      vi: 'Hệ thống bảo hiểm y tế toàn dân đóng vai trò như chiếc lưới an sinh bảo vệ các gia đình nghèo khỏi nguy cơ khánh kiệt vì viện phí.',
      en: 'Universal healthcare coverage functions as a crucial social safety net that shields impoverished households from catastrophic medical impoverishment.',
      vocab: [
        { word: 'Universal healthcare coverage', meaning: 'bảo hiểm y tế toàn dân', type: 'Policy Term' },
        { word: 'social safety net', meaning: 'lưới an sinh xã hội', type: 'Collocation' },
        { word: 'catastrophic impoverishment', meaning: 'sự bần cùng hóa thảm khốc', type: 'C2 Collocation' }
      ],
      grammar: ['Mệnh đề quan hệ: "that shields... from..."', 'Động từ mang sắc thái học thuật'],
      band: 8.5
    },
    {
      vi: 'Ứng dụng khám chữa bệnh từ xa giúp người dân ở các vùng hải đảo xa xôi có thể tiếp cận được ý kiến tư vấn của các bác sĩ đầu ngành.',
      en: 'Telemedicine platforms dramatically democratize medical accessibility by connecting residents in isolated archipelagoes with specialized clinical consultants.',
      vocab: [
        { word: 'Telemedicine platforms', meaning: 'nền tảng y tế từ xa', type: 'Medical Tech Term' },
        { word: 'democratize accessibility', meaning: 'bình dân hóa/mở rộng sự tiếp cận cho mọi người', type: 'C2 Academic Phrase' },
        { word: 'isolated archipelagoes', meaning: 'các quần đảo cô lập xa xôi', type: 'Geographical Noun' }
      ],
      grammar: ['Giới từ phương thức: "by connecting A with B"', 'Từ vựng C2 đắt giá'],
      band: 8.5
    },
    {
      vi: 'Việc tập luyện thể dục nhịp điệu đều đặn được chứng minh là có thể giải phóng hormone endorphin giúp thuyên giảm các triệu chứng lo âu kéo dài.',
      en: 'Engaging in habitual aerobic exercise is scientifically validated to stimulate endorphin release, thereby alleviating persistent symptoms of generalized anxiety.',
      vocab: [
        { word: 'habitual aerobic exercise', meaning: 'bài tập aerobic đều đặn', type: 'Collocation' },
        { word: 'scientifically validated', meaning: 'được chứng minh bằng khoa học', type: 'Collocation' },
        { word: 'alleviating symptoms', meaning: 'làm thuyên giảm các triệu chứng', type: 'Medical Collocation' }
      ],
      grammar: ['Bị động dạng: "is scientifically validated to..."', 'Trạng từ liên kết phân từ: "thereby alleviating..."'],
      band: 8.5
    },
    {
      vi: 'Căng thẳng tinh thần kéo dài nơi công sở có thể kích hoạt các phản ứng viêm trong cơ thể và đẩy nhanh quá trình lão hóa sinh học.',
      en: 'Protracted psychological stress in corporate workplaces can trigger systemic bodily inflammation and accelerate premature biological aging.',
      vocab: [
        { word: 'Protracted stress', meaning: 'căng thẳng kéo dài', type: 'C2 Collocation' },
        { word: 'systemic inflammation', meaning: 'viêm toàn thân', type: 'Medical Term' },
        { word: 'premature biological aging', meaning: 'lão hóa sinh học sớm', type: 'Scientific Collocation' }
      ],
      grammar: ['Modal verb chỉ khả năng: "can trigger ... and accelerate ..."', 'Tính từ học thuật cao cấp'],
      band: 8.0
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
    },
    {
      vi: 'Nền kinh tế việc làm tự do mang lại sự tự chủ về giờ giấc nhưng lại tước đi những phúc lợi cơ bản như bảo hiểm thất nghiệp và lương hưu.',
      en: 'The burgeoning gig economy affords unprecedented schedule autonomy yet deprives freelance contractors of statutory social protections and pension entitlements.',
      vocab: [
        { word: 'burgeoning gig economy', meaning: 'nền kinh tế gig đang bùng nổ', type: 'Collocation' },
        { word: 'schedule autonomy', meaning: 'sự tự chủ về lịch trình', type: 'Noun phrase' },
        { word: 'statutory social protections', meaning: 'các chế độ bảo vệ xã hội theo luật định', type: 'Legal Term' }
      ],
      grammar: ['Động từ đối lập: "affords ... yet deprives ... of ..."', 'Cấu trúc deprive of'],
      band: 8.5
    },
    {
      vi: 'Sự đa dạng về văn hóa và bình đẳng giới tại nơi làm việc kích thích tư duy đổi mới và giúp doanh nghiệp đưa ra quyết định toàn diện hơn.',
      en: 'Workplace cultural diversity and gender parity stimulate innovative perspectives, thereby enabling corporate leadership to make well-rounded strategic decisions.',
      vocab: [
        { word: 'gender parity', meaning: 'sự bình đẳng giới', type: 'Formal Noun' },
        { word: 'stimulate innovative perspectives', meaning: 'kích thích các góc nhìn đổi mới', type: 'Collocation' },
        { word: 'well-rounded strategic decisions', meaning: 'những quyết định chiến lược toàn diện', type: 'Collocation' }
      ],
      grammar: ['Trạng từ phân từ chỉ hệ quả: "thereby enabling..."', 'Tính từ ghép'],
      band: 8.0
    },
    {
      vi: 'Các chương trình đào tạo lại kỹ năng cho người lao động là chìa khóa để ngăn chặn tình trạng thất nghiệp do làn sóng tự động hóa.',
      en: 'Proactive workforce reskilling initiatives represent the paramount mechanism to avert widespread structural unemployment instigated by robotic automation.',
      vocab: [
        { word: 'workforce reskilling', meaning: 'đào tạo lại kỹ năng cho lực lượng lao động', type: 'Business Term' },
        { word: 'avert unemployment', meaning: 'ngăn ngừa tình trạng thất nghiệp', type: 'Academic Collocation' },
        { word: 'instigated by', meaning: 'bị gây ra/khởi xướng bởi', type: 'C2 Participle' }
      ],
      grammar: ['Mệnh đề phân từ bị động rút gọn: "instigated by..."', 'Danh từ trừu tượng học thuật'],
      band: 8.5
    },
    {
      vi: 'Thiết kế văn phòng công thái học giúp giảm thiểu các chứng đau mỏi cơ xương khớp nghề nghiệp và nâng cao tinh thần làm việc của nhân viên.',
      en: 'Ergonomic office workstation designs significantly alleviate occupational musculoskeletal disorders and bolster overall employee morale.',
      vocab: [
        { word: 'Ergonomic designs', meaning: 'thiết kế công thái học', type: 'Specialized Noun' },
        { word: 'musculoskeletal disorders', meaning: 'rối loạn cơ xương khớp', type: 'Medical Term' },
        { word: 'bolster morale', meaning: 'củng cố tinh thần/nhuệ khí', type: 'Collocation' }
      ],
      grammar: ['Hiện tại đơn miêu tả lợi ích thiết kế', 'Động từ nâng cao: "alleviate", "bolster"'],
      band: 8.0
    },
    {
      vi: 'Hệ thống đánh giá năng lực minh bạch dựa trên hiệu quả công việc thực tế là động lực lớn nhất để giữ chân nhân tài gắn bó lâu dài.',
      en: 'A transparent, merit-based performance appraisal system constitutes the most potent catalyst for retaining top-tier talent over the long haul.',
      vocab: [
        { word: 'merit-based appraisal', meaning: 'đánh giá dựa trên năng lực thực chất', type: 'HR Collocation' },
        { word: 'potent catalyst', meaning: 'chất xúc tác/động lực mạnh mẽ', type: 'C2 Collocation' },
        { word: 'top-tier talent', meaning: 'nhân tài hàng đầu', type: 'Noun phrase' }
      ],
      grammar: ['Động từ học thuật cao cấp: "constitutes..."', 'So sánh nhất với danh từ hoa mỹ'],
      band: 8.5
    },
    {
      vi: 'Văn hóa làm thêm giờ triền miên đang dẫn đến tình trạng kiệt sức và tỷ lệ nghỉ việc cao đáng báo động tại các công ty khởi nghiệp.',
      en: 'A pervasive culture of chronic overtime work frequently culminates in severe employee burnout and alarming employee turnover rates across startups.',
      vocab: [
        { word: 'chronic overtime work', meaning: 'làm việc tăng ca triền miên', type: 'Collocation' },
        { word: 'culminates in', meaning: 'dẫn đến kết cục là', type: 'C2 Phrasal Verb' },
        { word: 'employee burnout', meaning: 'sự kiệt sức của nhân viên', type: 'HR Term' }
      ],
      grammar: ['Động từ cụm: "culminates in..."', 'Danh từ ghép kết hợp'],
      band: 8.5
    },
    {
      vi: 'Chương trình cố vấn nghề nghiệp giữa các thế hệ giúp truyền thụ kinh nghiệm quý báu và thu hẹp khoảng cách hiểu biết trong doanh nghiệp.',
      en: 'Intergenerational mentorship initiatives facilitate the cross-transfer of invaluable tacit knowledge and effectively bridge communication chasms within enterprises.',
      vocab: [
        { word: 'tacit knowledge', meaning: 'tri thức ngầm/kinh nghiệm thực tế tích lũy', type: 'Business Concept' },
        { word: 'communication chasms', meaning: 'hố sâu khoảng cách giao tiếp', type: 'Metaphorical Phrase' },
        { word: 'mentorship initiatives', meaning: 'các sáng kiến cố vấn', type: 'Noun phrase' }
      ],
      grammar: ['Danh từ ghép với tiền tố inter-: "Intergenerational"', 'Động từ song hành'],
      band: 8.5
    },
    {
      vi: 'Xóa bỏ khoảng cách thu nhập giữa nam và nữ là điều kiện tiên quyết để xây dựng một môi trường làm việc công bằng và nhân văn.',
      en: 'Eradicating the systemic gender wage gap serves as an indispensable prerequisite for cultivating an equitable and humane professional environment.',
      vocab: [
        { word: 'Eradicating', meaning: 'xóa bỏ tận gốc', type: 'C2 Verb' },
        { word: 'gender wage gap', meaning: 'khoảng cách tiền lương theo giới tính', type: 'Collocation' },
        { word: 'equitable and humane', meaning: 'công bằng và nhân văn', type: 'Collocation' }
      ],
      grammar: ['Gerund chủ ngữ: "Eradicating..."', 'Cụm diễn đạt: "serves as an indispensable prerequisite for..."'],
      band: 8.5
    },
    {
      vi: 'Chính sách nghỉ thai sản bình đẳng cho cả cha và mẹ giúp các cặp vợ chồng san sẻ trách nhiệm chăm sóc con cái trong những tháng đầu đời.',
      en: 'Equal parental leave entitlements empower couples to equitably distribute domestic childcare obligations during the formative early months of infancy.',
      vocab: [
        { word: 'parental leave entitlements', meaning: 'chế độ nghỉ phép của cha mẹ khi sinh con', type: 'Formal Noun' },
        { word: 'equitably distribute', meaning: 'phân bổ một cách công bằng', type: 'Collocation' },
        { word: 'formative months', meaning: 'những tháng phát triển định hình đầu đời', type: 'Collocation' }
      ],
      grammar: ['Cấu trúc: "empower someone to do something"', 'Trạng từ đi kèm động từ'],
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
    },
    {
      vi: 'Sự khác biệt về thế giới quan giữa các thế hệ đang định hình lại các chuẩn mực xã hội và cấu trúc gia đình truyền thống.',
      en: 'Intergenerational divergences in fundamental values are profoundly reshaping contemporary social norms and traditional familial paradigms.',
      vocab: [
        { word: 'Intergenerational divergences', meaning: 'sự khác biệt giữa các thế hệ', type: 'Academic Noun' },
        { word: 'social norms', meaning: 'các chuẩn mực xã hội', type: 'Sociological Term' },
        { word: 'familial paradigms', meaning: 'các mô hình/cấu trúc gia đình', type: 'Formal Term' }
      ],
      grammar: ['Hiện tại tiếp diễn nhấn mạnh sự biến chuyển', 'Từ vựng xã hội học tinh tế'],
      band: 8.5
    },
    {
      vi: 'Khoảng cách giàu nghèo ngày càng nới rộng có nguy cơ làm xói mòn khối đại đoàn kết dân tộc và gia tăng xung đột giai tầng.',
      en: 'The widening socioeconomic divide threatens to erode societal cohesion and aggravate simmering animosities between divergent economic strata.',
      vocab: [
        { word: 'widening divide', meaning: 'khoảng cách ngày càng mở rộng', type: 'Collocation' },
        { word: 'societal cohesion', meaning: 'sự gắn kết xã hội', type: 'Sociological Term' },
        { word: 'economic strata', meaning: 'các tầng lớp kinh tế', type: 'C2 Academic Noun' }
      ],
      grammar: ['Cấu trúc: "threatens to do something"', 'Từ vựng C2 chỉ xung đột ngầm: "simmering animosities"'],
      band: 8.5
    },
    {
      vi: 'Hoạt động thiện nguyện và tinh thần tương thân tương ái là nền tảng vững chắc để xây dựng một cộng đồng ấm áp và văn minh.',
      en: 'Widespread civic engagement and community altruism constitute the bedrock of a compassionate, cohesive, and resilient modern society.',
      vocab: [
        { word: 'civic engagement', meaning: 'sự tham gia vào đời sống công dân', type: 'Collocation' },
        { word: 'altruism', meaning: 'lòng vị tha, tinh thần vì cộng đồng', type: 'C2 Noun' },
        { word: 'bedrock of', meaning: 'nền tảng cơ bản, trụ cột vững chắc', type: 'Metaphorical Phrase' }
      ],
      grammar: ['Danh từ ghép làm chủ ngữ: "civic engagement and altruism"', 'Bộ ba tính từ bổ nghĩa song hành'],
      band: 8.5
    },
    {
      vi: 'Bảo tồn ngôn ngữ bản địa và di sản truyền thống là yếu tố sống còn để bảo vệ bản sắc văn hóa trước làn sóng toàn cầu hóa.',
      en: 'Preserving indigenous languages and vernacular traditions remains paramount to safeguarding cultural identities against homogenization fueled by globalization.',
      vocab: [
        { word: 'indigenous languages', meaning: 'ngôn ngữ bản địa', type: 'Collocation' },
        { word: 'homogenization', meaning: 'sự đồng nhất hóa văn hóa', type: 'C2 Sociological Term' },
        { word: 'safeguarding', meaning: 'bảo vệ, gìn giữ an toàn', type: 'Academic Verb' }
      ],
      grammar: ['Gerund chủ ngữ: "Preserving..."', 'Mệnh đề phân từ bị động rút gọn: "fueled by globalization"'],
      band: 8.5
    },
    {
      vi: 'Hiện tượng già hóa dân số nhanh chóng đang đặt gánh nặng khổng lồ lên hệ thống quỹ hưu trí và các dịch vụ chăm sóc người cao tuổi.',
      en: 'Accelerating demographic aging places colossal fiscal pressures upon public pension reserves and elderly social welfare support systems.',
      vocab: [
        { word: 'demographic aging', meaning: 'sự già hóa dân số', type: 'Demographic Term' },
        { word: 'colossal fiscal pressures', meaning: 'những áp lực tài chính khổng lồ', type: 'Collocation' },
        { word: 'pension reserves', meaning: 'quỹ dự trữ hưu trí', type: 'Financial Term' }
      ],
      grammar: ['Cụm phân từ bổ nghĩa: "Accelerating demographic aging"', 'Động từ chỉ áp lực: "places ... upon ..."'],
      band: 8.0
    },
    {
      vi: 'Các thuật toán mạng xã hội đang vô tình tạo ra các buồng vang thông tin làm chia rẽ dư luận và suy giảm sự thấu hiểu giữa các quan điểm đối lập.',
      en: 'Algorithmic echo chambers on social platforms inadvertently polarize public sentiment and undermine constructive civil discourse among opposing ideological factions.',
      vocab: [
        { word: 'Algorithmic echo chambers', meaning: 'buồng vang thông tin thuật toán', type: 'Modern Concept' },
        { word: 'polarize public sentiment', meaning: 'phân cực cảm xúc/dư luận xã hội', type: 'Collocation' },
        { word: 'civil discourse', meaning: 'đối thoại công dân văn minh', type: 'Formal Phrase' }
      ],
      grammar: ['Hiện tại đơn thể hiện sự thật khách quan', 'Từ vựng C2 chỉ phe phái: "ideological factions"'],
      band: 8.5
    },
    {
      vi: 'Các sáng kiến từ thiện của doanh nghiệp giúp bổ trợ đắc lực cho những lỗ hổng trong hệ thống an sinh xã hội của nhà nước.',
      en: 'Corporate philanthropic endeavors serve as valuable supplements to fill critical fissures within state-sponsored social safety apparatuses.',
      vocab: [
        { word: 'philanthropic endeavors', meaning: 'các nỗ lực từ thiện bác ái', type: 'Formal Noun' },
        { word: 'fissures', meaning: 'vết nứt, lỗ hổng', type: 'Academic Noun' },
        { word: 'social safety apparatuses', meaning: 'bộ máy an sinh xã hội', type: 'Formal Phrase' }
      ],
      grammar: ['Thành ngữ học thuật: "serve as valuable supplements to..."'],
      band: 8.5
    },
    {
      vi: 'Lối sống tiêu dùng phung phí đang cổ xúy các giá trị vật chất giả tạo và làm kiệt quệ tài nguyên thiên nhiên của các thế hệ mai sau.',
      en: 'Unbridled consumerism champions superficial materialistic values while relentlessly depleting ecological endowments rightfully owed to future generations.',
      vocab: [
        { word: 'Unbridled consumerism', meaning: 'chủ nghĩa tiêu dùng không kiềm chế', type: 'C2 Collocation' },
        { word: 'superficial materialistic values', meaning: 'những giá trị vật chất nông cạn', type: 'Collocation' },
        { word: 'depleting ecological endowments', meaning: 'làm cạn kiệt nguồn vốn sinh thái', type: 'C2 Phrase' }
      ],
      grammar: ['Liên từ đối lập: "while relentlessly depleting"', 'Mệnh đề phân từ bị động rút gọn: "rightfully owed to..."'],
      band: 8.5
    },
    {
      vi: 'Bình đẳng giới thực chất đòi hỏi phải dỡ bỏ những định kiến vô hình đã ăn sâu vào tiềm thức gia đình và xã hội suốt nhiều thế hệ.',
      en: 'Genuine gender egalitarianism necessitates dismantling subconscious stereotypes that have been deeply entrenched across institutional spheres for generations.',
      vocab: [
        { word: 'gender egalitarianism', meaning: 'chủ nghĩa bình đẳng giới', type: 'Academic Term' },
        { word: 'dismantling stereotypes', meaning: 'tháo dỡ/xóa bỏ định kiến', type: 'Collocation' },
        { word: 'deeply entrenched', meaning: 'ăn sâu bén rễ', type: 'C2 Collocation' }
      ],
      grammar: ['Động từ: "necessitates + V-ing"', 'Mệnh đề quan hệ thì hiện tại hoàn thành bị động'],
      band: 8.5
    }
  ],
  Urbanization: [
    {
      vi: 'Làn sóng di cư ồ ạt từ nông thôn ra thành thị đang tạo gánh nặng quá tải lên mạng lưới giao thông công cộng và hạ tầng xử lý nước thải.',
      en: 'Unprecedented rural-to-urban migration is exerting severe strain upon metropolitan public transit networks and municipal wastewater sanitation facilities.',
      vocab: [
        { word: 'rural-to-urban migration', meaning: 'di cư từ nông thôn ra thành thị', type: 'Collocation' },
        { word: 'metropolitan public transit', meaning: 'giao thông công cộng đô thị', type: 'Noun phrase' },
        { word: 'wastewater sanitation facilities', meaning: 'cơ sở xử lý nước thải', type: 'Technical Term' }
      ],
      grammar: ['Hiện tại tiếp diễn: "is exerting severe strain upon..."'],
      band: 8.0
    },
    {
      vi: 'Phát triển hệ thống tàu điện ngầm và đường sắt đô thị là giải pháp căn cơ nhất để giải quyết nạn kẹt xe kéo dài tại các thành phố lớn.',
      en: 'Expanding subterranean subway systems and mass rapid rail corridors represents the most sustainable panacea for chronic vehicular gridlock in megacities.',
      vocab: [
        { word: 'subterranean subway systems', meaning: 'hệ thống tàu điện ngầm dưới lòng đất', type: 'Noun phrase' },
        { word: 'sustainable panacea', meaning: 'giải pháp vạn năng/căn cơ bền vững', type: 'C2 Collocation' },
        { word: 'chronic vehicular gridlock', meaning: 'nạn tắc nghẽn giao thông kinh niên', type: 'C2 Collocation' }
      ],
      grammar: ['Danh động từ làm chủ ngữ: "Expanding..."', 'So sánh nhất trong cấu trúc danh từ'],
      band: 8.5
    },
    {
      vi: 'Việc quy hoạch các tuyến phố đi bộ tại trung tâm thành phố không chỉ kích cầu thương mại mà còn tạo không gian sinh hoạt văn hóa cho người dân.',
      en: 'Designating pedestrian-only boulevards in downtown districts not only stimulates retail commerce but also fosters vibrant civic cultural interactions.',
      vocab: [
        { word: 'pedestrian-only boulevards', meaning: 'đại lộ/phố chỉ dành cho người đi bộ', type: 'Urban Term' },
        { word: 'stimulates commerce', meaning: 'kích thích thương mại', type: 'Collocation' },
        { word: 'civic interactions', meaning: 'tương tác cộng đồng công dân', type: 'Noun phrase' }
      ],
      grammar: ['Cấu trúc tương quan: "not only ... but also ..."', 'Danh động từ làm chủ ngữ'],
      band: 8.0
    },
    {
      vi: 'Mô hình quy hoạch đô thị nén chiều dọc giúp tiết kiệm diện tích đất nông nghiệp quý giá xung quanh các vành đai thành phố.',
      en: 'Vertical high-density urban planning models conserve invaluable arable agricultural land located along peri-urban greenbelt perimeters.',
      vocab: [
        { word: 'Vertical high-density planning', meaning: 'quy hoạch đô thị nén chiều dọc mật độ cao', type: 'Urban Planning Term' },
        { word: 'arable agricultural land', meaning: 'đất nông nghiệp có thể canh tác được', type: 'Collocation' },
        { word: 'greenbelt perimeters', meaning: 'vành đai xanh bao quanh đô thị', type: 'Specialized Noun' }
      ],
      grammar: ['Mệnh đề phân từ rút gọn bị động: "located along..."'],
      band: 8.5
    },
    {
      vi: 'Việc bắt buộc trồng cây xanh trên sân thượng các tòa cao ốc giúp làm giảm hiệu ứng hấp thụ nhiệt từ bê tông vào mùa hè.',
      en: 'Mandating rooftop gardens on commercial skyscrapers significantly reduces solar radiation absorption and mitigates microclimatic urban warming.',
      vocab: [
        { word: 'Mandating rooftop gardens', meaning: 'quy định bắt buộc vườn trên mái', type: 'Collocation' },
        { word: 'solar radiation absorption', meaning: 'hấp thụ bức xạ mặt trời', type: 'Scientific Phrase' },
        { word: 'urban warming', meaning: 'sự nóng lên ở đô thị', type: 'Collocation' }
      ],
      grammar: ['Danh động từ làm chủ ngữ', 'Cặp động từ song hành'],
      band: 8.0
    },
    {
      vi: 'Việc xả nước thải công nghiệp chưa qua xử lý thẳng ra sông hồ đang đe dọa nghiêm trọng tới nguồn cung cấp nước sinh hoạt của cư dân đô thị.',
      en: 'Discharging untreated industrial effluents into local watercourses poses a perilous threat to the municipal potable water supply of urban dwellers.',
      vocab: [
        { word: 'untreated industrial effluents', meaning: 'nước thải công nghiệp chưa qua xử lý', type: 'Environmental Term' },
        { word: 'potable water supply', meaning: 'nguồn cung cấp nước uống/sinh hoạt', type: 'C2 Formal Collocation' },
        { word: 'perilous threat', meaning: 'mối đe dọa hiểm nghèo', type: 'Collocation' }
      ],
      grammar: ['Cấu trúc: "poses a perilous threat to..."', 'Từ vựng C2 chỉ nước uống: "potable"'],
      band: 8.5
    },
    {
      vi: 'Hiện tượng chỉnh trang đô thị thường vô tình đẩy các hộ dân nghèo gắn bó lâu đời ra khỏi khu vực trung tâm vì giá nhà tăng vọt.',
      en: 'Urban gentrification frequently displaces marginalized longtime residents from downtown neighborhoods due to skyrocketing residential rental valuations.',
      vocab: [
        { word: 'gentrification', meaning: 'hiện tượng chỉnh trang đô thị hóa tầng lớp', type: 'Sociological Term' },
        { word: 'displaces residents', meaning: 'làm di dời cư dân', type: 'Academic Collocation' },
        { word: 'skyrocketing valuations', meaning: 'giá trị định giá tăng chóng mặt', type: 'Economic Collocation' }
      ],
      grammar: ['Cụm giới từ chỉ nguyên nhân: "due to skyrocketing..."'],
      band: 8.5
    },
    {
      vi: 'Hệ thống cảm biến thành phố thông minh giúp điều phối đèn giao thông theo thời gian thực và giảm thiểu lãng phí điện năng chiếu sáng công cộng.',
      en: 'Smart city sensor grids optimize real-time traffic signal synchronization and substantially curtail energy wastage across public streetlighting networks.',
      vocab: [
        { word: 'Smart city sensor grids', meaning: 'mạng lưới cảm biến thành phố thông minh', type: 'Tech Term' },
        { word: 'traffic signal synchronization', meaning: 'đồng bộ hóa tín hiệu đèn giao thông', type: 'Collocation' },
        { word: 'curtail energy wastage', meaning: 'cắt giảm lãng phí năng lượng', type: 'Collocation' }
      ],
      grammar: ['Động từ song hành: "optimize ... and curtail ..."'],
      band: 8.0
    },
    {
      vi: 'Ô nhiễm tiếng ồn từ các trục đường giao thông huyết mạch đang ảnh hưởng tiêu cực tới chất lượng giấc ngủ và thính lực của người dân đô thị.',
      en: 'Pervasive noise pollution emanating from major arterial roadways severely degrades sleep quality and impairs acoustic health among urban populations.',
      vocab: [
        { word: 'emanating from', meaning: 'phát ra/bắt nguồn từ', type: 'Formal Verb' },
        { word: 'arterial roadways', meaning: 'các trục đường giao thông huyết mạch', type: 'Urban Transit Term' },
        { word: 'acoustic health', meaning: 'sức khỏe thính giác/âm học', type: 'Academic Phrase' }
      ],
      grammar: ['Mệnh đề phân từ hiện tại: "emanating from..."', 'Động từ nâng cao: "degrades", "impairs"'],
      band: 8.5
    },
    {
      vi: 'Việc quy hoạch các công viên bách thảo công cộng tạo ra không gian thư giãn tinh thần thiết yếu cho cư dân sau những giờ làm việc mệt mỏi.',
      en: 'Integrating sprawling public botanical parks into urban masterplans affords residents indispensable psychological respite amidst the clamor of city life.',
      vocab: [
        { word: 'urban masterplans', meaning: 'quy hoạch tổng thể đô thị', type: 'Planning Term' },
        { word: 'psychological respite', meaning: 'khoảng thời gian nghỉ ngơi tĩnh tâm', type: 'C2 Collocation' },
        { word: 'clamor of city life', meaning: 'sự hối hả ồn ào của nhịp sống đô thị', type: 'Literary/Formal Phrase' }
      ],
      grammar: ['Danh động từ làm chủ ngữ: "Integrating..."', 'Cấu trúc: "affords someone something"'],
      band: 8.5
    }
  ],
  Crime: [
    {
      vi: 'Các biện pháp trừng phạt tù đày khắc nghiệt thường không chứng minh được hiệu quả trong việc làm giảm tỷ lệ tái phạm tội của phạm nhân.',
      en: 'Draconian punitive incarceration regimens have demonstrated dubious efficacy in curtailing habitual recidivism rates among convicted offenders.',
      vocab: [
        { word: 'Draconian punitive incarceration', meaning: 'chế độ phạt tù hà khắc tàn nhẫn', type: 'C2 Legal Phrase' },
        { word: 'dubious efficacy', meaning: 'hiệu quả đáng ngờ/không rõ ràng', type: 'Collocation' },
        { word: 'habitual recidivism', meaning: 'tình trạng tái phạm tội quen thói', type: 'C2 Criminology Term' }
      ],
      grammar: ['Hiện tại hoàn thành: "have demonstrated"', 'Thuật ngữ tội phạm học chuẩn xác'],
      band: 8.5
    },
    {
      vi: 'Mô hình cảnh sát gắn bó với cộng đồng giúp xây dựng lòng tin tương hỗ giữa người dân và lực lượng bảo vệ pháp luật.',
      en: 'Proactive community policing frameworks foster mutual trust and collaboration between local residents and law enforcement agencies.',
      vocab: [
        { word: 'community policing', meaning: 'mô hình cảnh sát cộng đồng', type: 'Criminology Term' },
        { word: 'mutual trust', meaning: 'lòng tin lẫn nhau', type: 'Collocation' },
        { word: 'law enforcement agencies', meaning: 'các cơ quan thực thi pháp luật', type: 'Formal Noun' }
      ],
      grammar: ['Động từ collocation: "foster mutual trust and collaboration"'],
      band: 8.0
    },
    {
      vi: 'Các chương trình dạy nghề trong trại giam tạo điều kiện cho người mãn hạn tù tái hòa nhập cộng đồng và tìm được công việc chân chính.',
      en: 'Inmate vocational training programs facilitate seamless societal reintegration for released offenders, deterring them from relapsing into unlawful conduct.',
      vocab: [
        { word: 'Inmate vocational training', meaning: 'đào tạo nghề cho phạm nhân', type: 'Collocation' },
        { word: 'societal reintegration', meaning: 'tái hòa nhập xã hội', type: 'Formal Phrase' },
        { word: 'deterring from relapsing', meaning: 'ngăn ngừa việc tái phạm', type: 'C2 Collocation' }
      ],
      grammar: ['Mệnh đề phân từ chỉ hệ quả: "deterring them from..."'],
      band: 8.5
    },
    {
      vi: 'Tội phạm mạng và các đường dây lừa đảo tài chính qua mạng đang ngày càng tinh vi và khó truy vết do tính ẩn danh xuyên biên giới.',
      en: 'Cybercrime syndicates and digital financial fraud schemes are becoming increasingly sophisticated, exploiting cross-border anonymity to elude prosecution.',
      vocab: [
        { word: 'Cybercrime syndicates', meaning: 'các nghiệp đoàn/băng nhóm tội phạm mạng', type: 'Collocation' },
        { word: 'cross-border anonymity', meaning: 'tính ẩn danh xuyên biên giới', type: 'Noun phrase' },
        { word: 'elude prosecution', meaning: 'lẩn tránh sự truy tố của pháp luật', type: 'C2 Collocation' }
      ],
      grammar: ['Hiện tại tiếp diễn miêu tả xu thế: "are becoming increasingly sophisticated"', 'Mệnh đề phân từ: "exploiting... to elude..."'],
      band: 8.5
    },
    {
      vi: 'Giải quyết triệt để nạn nghèo đói và bất bình đẳng cơ hội giáo dục là giải pháp bền vững nhất để ngăn chặn nguồn gốc của tội phạm.',
      en: 'Eradicating socioeconomic destitution and educational inequality directly addresses the root structural catalysts that fuel criminal behavior.',
      vocab: [
        { word: 'socioeconomic destitution', meaning: 'tình cảnh bần cùng hóa kinh tế xã hội', type: 'C2 Formal Noun' },
        { word: 'root structural catalysts', meaning: 'những chất xúc tác/căn nguyên cấu trúc gốc rễ', type: 'Academic Phrase' },
        { word: 'fuel criminal behavior', meaning: 'thổi bùng/tiếp tay cho hành vi phạm tội', type: 'Collocation' }
      ],
      grammar: ['Danh động từ làm chủ ngữ: "Eradicating..."', 'Mệnh đề quan hệ: "that fuel..."'],
      band: 8.5
    },
    {
      vi: 'Án tử hình vẫn là đề tài gây tranh cãi gay gắt về mặt đạo đức liên quan đến quyền con người và tính không thể sửa chữa nếu có sai sót.',
      en: 'Capital punishment remains an intensely contentious ethical dilemma concerning fundamental human rights and the irreversible risk of wrongful execution.',
      vocab: [
        { word: 'Capital punishment', meaning: 'án tử hình', type: 'Legal Term' },
        { word: 'contentious dilemma', meaning: 'nan đề gây tranh cãi kịch liệt', type: 'Collocation' },
        { word: 'wrongful execution', meaning: 'việc hành quyết oan sai', type: 'Legal Collocation' }
      ],
      grammar: ['Từ vựng triết học pháp lý C2', 'Cụm phân từ bổ nghĩa: "concerning fundamental..."'],
      band: 8.5
    },
    {
      vi: 'Các biện pháp giáo dưỡng thay thế án tù giúp chuyển hướng thanh thiếu niên lầm lỡ trước khi các em bị lôi kéo vào các băng đảng tội phạm.',
      en: 'Juvenile diversionary programs steer wayward adolescents away from judicial prosecution and prevent induction into organized criminal syndicates.',
      vocab: [
        { word: 'Juvenile diversionary programs', meaning: 'các chương trình chuyển hướng thanh thiếu niên phạm pháp', type: 'Legal Term' },
        { word: 'wayward adolescents', meaning: 'những thanh thiếu niên ngỗ ngược/lầm đường', type: 'Literary/Formal Phrase' },
        { word: 'judicial prosecution', meaning: 'sự truy tố trước tòa án', type: 'Legal Term' }
      ],
      grammar: ['Cặp động từ song hành: "steer ... and prevent ..."'],
      band: 8.5
    },
    {
      vi: 'Hệ thống camera giám sát dày đặc tại các khu phố công cộng giúp răn đe tội phạm đường phố nhưng lại vấp phải lo ngại về quyền tự do cá nhân.',
      en: 'Pervasive closed-circuit surveillance camera networks deter street offenses yet provoke legitimate public anxieties regarding unwarranted state surveillance.',
      vocab: [
        { word: 'closed-circuit surveillance', meaning: 'giám sát camera an ninh (CCTV)', type: 'Collocation' },
        { word: 'deter street offenses', meaning: 'răn đe các hành vi phạm tội đường phố', type: 'Collocation' },
        { word: 'unwarranted surveillance', meaning: 'sự giám sát bất hợp lý/không có căn cứ', type: 'C2 Collocation' }
      ],
      grammar: ['Liên từ đối lập: "deter ... yet provoke ..."', 'Cụm giới từ: "regarding unwarranted..."'],
      band: 8.0
    },
    {
      vi: 'Việc siết chặt luật kiểm soát súng đạn được chứng minh là có thể làm giảm mạnh các vụ xả súng hàng loạt và án mạng bạo lực.',
      en: 'Enacting stringent firearm control statutes has been empirically demonstrated to substantially curtail mass shootings and violent homicides.',
      vocab: [
        { word: 'firearm control statutes', meaning: 'các đạo luật kiểm soát súng đạn', type: 'Legal Term' },
        { word: 'empirically demonstrated', meaning: 'được chứng minh bằng thực nghiệm', type: 'Academic Collocation' },
        { word: 'violent homicides', meaning: 'các vụ án mạng bạo lực', type: 'Collocation' }
      ],
      grammar: ['Gerund chủ ngữ: "Enacting..."', 'Hiện tại hoàn thành bị động: "has been empirically demonstrated to..."'],
      band: 8.5
    },
    {
      vi: 'Mô hình tư pháp phục hồi nhấn mạnh vào trách nhiệm của người phạm tội trong việc bồi thường thiệt hại và hàn gắn nỗi đau cho nạn nhân.',
      en: 'Restorative justice models prioritize offender accountability by requiring meaningful restitution and fostering reconciliation with aggrieved victims.',
      vocab: [
        { word: 'Restorative justice', meaning: 'tư pháp phục hồi', type: 'Legal Theory' },
        { word: 'offender accountability', meaning: 'trách nhiệm giải trình của người phạm tội', type: 'Legal Phrase' },
        { word: 'restitution', meaning: 'sự bồi thường thiệt hại', type: 'C2 Legal Term' },
        { word: 'aggrieved victims', meaning: 'những nạn nhân chịu tổn thương', type: 'Formal Collocation' }
      ],
      grammar: ['Giới từ phương thức: "by requiring ... and fostering ..."', 'Thuật ngữ tư pháp nâng cao'],
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
  } else if (
    customLower.includes('môi trường') ||
    customLower.includes('khí hậu') ||
    customLower.includes('environment')
  ) {
    topicKey = 'Environment';
  } else if (
    customLower.includes('giáo dục') ||
    customLower.includes('học') ||
    customLower.includes('education')
  ) {
    topicKey = 'Education';
  } else if (
    customLower.includes('sức khỏe') ||
    customLower.includes('y tế') ||
    customLower.includes('health')
  ) {
    topicKey = 'Health';
  } else if (
    customLower.includes('việc làm') ||
    customLower.includes('công sở') ||
    customLower.includes('work')
  ) {
    topicKey = 'Work';
  } else if (
    customLower.includes('đô thị') ||
    customLower.includes('giao thông') ||
    customLower.includes('urban')
  ) {
    topicKey = 'Urbanization';
  } else if (
    customLower.includes('tội phạm') ||
    customLower.includes('luật') ||
    customLower.includes('crime')
  ) {
    topicKey = 'Crime';
  }

  const templates = TOPIC_TEMPLATES[topicKey] || TOPIC_TEMPLATES['Technology'];
  const targetBand = options.band || 7.5;
  
  // RESPECT THE EXACT SENTENCE COUNT (no clamp to 5!)
  const requestedCount = options.sentenceCount || 3;
  const items: ExerciseItem[] = [];

  for (let i = 0; i < requestedCount; i++) {
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
    throw new Error('Chưa cung cấp Google Gemini API Key. Vui lòng nhập API Key để tạo đề trực tiếp với Gemini, hoặc chọn "⚡ AI Tức thì (Built-in)" để làm ngay.');
  }

  const topicPrompt = options.customTopic?.trim() || options.topicVi || options.topic;
  const band = options.band || 7.5;
  const count = options.sentenceCount || 3;

  const prompt = `Bạn là chuyên gia khảo thí IELTS Writing Task 2 hàng đầu. Hãy tạo một bộ bài tập luyện dịch câu tiếng Việt sang tiếng Anh chuẩn phong cách học thuật IELTS.

Yêu cầu cụ thể:
1. Chủ đề: "${topicPrompt}" (Topic in English: "${options.topic}")
2. Mục tiêu band điểm: Band ${band}
3. Số lượng câu: ĐÚNG CHÍNH XÁC ${count} CÂU (từ câu 1 đến câu ${count}). QUAN TRỌNG: Bạn BẮT BUỘC phải tạo ĐỦ CHÍNH XÁC ${count} phần tử trong mảng JSON, tuyệt đối không được bớt hay thiếu câu!
4. Câu tiếng Việt: Đi thẳng trực tiếp vào nội dung chuyên đề cần dịch, TUYỆT ĐỐI KHÔNG thêm lời dẫn dắt hay tiền tố như 'Liên quan đến chủ đề...', 'Chủ đề: ...'. Câu tiếng Việt và câu tiếng Anh phải tương đương chính xác từng ý một!
5. Câu tiếng Anh mẫu: Chuẩn xác tuyệt đối, cấu trúc câu tinh tế (inversion, participle clauses, passive voice, nominalization, advanced collocations) tương ứng chính xác với Band ${band}.
6. Danh sách từ vựng gợi ý (vocabHints): 3-5 từ/cụm từ then chốt với nghĩa tiếng Việt và loại từ.
7. Ghi chú ngữ pháp (grammarNotes): 2-3 điểm ngữ pháp quan trọng trong câu.
8. Các phiên bản thay thế (alternativeAnswers): 1 phiên bản band thấp hơn (khoảng Band 6.5) và 1 phiên bản band cao cấp (Band 8.5+).

QUAN TRỌNG: Bạn BẮT BUỘC phải trả về kết quả là một JSON ARRAY hợp lệ duy nhất chứa ĐỦ CHÍNH XÁC ${count} đối tượng bài tập, KHÔNG có văn bản giải thích thừa ngoài JSON:
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
    const message = errorData.error?.message || `Lỗi kết nối Gemini API (HTTP ${response.status})`;
    throw new Error(message);
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
  let generatorType: 'gemini' | 'builtin' = 'builtin';

  if (options.useGeminiApiKey) {
    if (!options.apiKey?.trim()) {
      throw new Error('Bạn đang chọn động cơ Google Gemini API nhưng chưa nhập API Key. Vui lòng nhập API Key để tạo đề trực tiếp với Gemini, hoặc chọn "⚡ AI Tức thì (Built-in)" để tạo ngay.');
    }
    // Call Gemini directly. If it fails, throw the error directly to the user so they know what happened!
    items = await generateWithGemini(options);
    generatorType = 'gemini';
  } else {
    // Artificial small delay to simulate generation feel
    await new Promise((resolve) => setTimeout(resolve, 600));
    items = generateLocalExercises(options);
    generatorType = 'builtin';
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
    generatorType,
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
