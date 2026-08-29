export const situations = [
  {
    id: 'airport',
    title: 'Sân Bay',
    titleEn: 'At the Airport',
    icon: '✈️',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'border-sky-200 dark:border-sky-800',
    description: 'Check-in, hải quan, lên máy bay',
    phrases: [
      { en: "I'd like to check in for my flight.", vi: "Tôi muốn làm thủ tục cho chuyến bay của mình.", note: "Khi đến quầy check-in" },
      { en: "Here is my passport and booking confirmation.", vi: "Đây là hộ chiếu và xác nhận đặt vé của tôi.", note: "" },
      { en: "I have one bag to check in.", vi: "Tôi có một túi cần ký gửi.", note: "" },
      { en: "Is the flight on time?", vi: "Chuyến bay có đúng giờ không?", note: "" },
      { en: "Which gate do I go to?", vi: "Tôi đến cổng số mấy?", note: "" },
      { en: "Where is the boarding gate?", vi: "Cổng lên máy bay ở đâu?", note: "" },
      { en: "My luggage is lost.", vi: "Hành lý của tôi bị mất.", note: "Báo nhân viên" },
      { en: "I need to declare these items.", vi: "Tôi cần khai báo những đồ này.", note: "Tại hải quan" },
      { en: "I have nothing to declare.", vi: "Tôi không có gì cần khai báo.", note: "" },
      { en: "How long is the layover?", vi: "Thời gian quá cảnh là bao lâu?", note: "" },
      { en: "Can I have a window seat?", vi: "Tôi có thể ngồi chỗ cạnh cửa sổ không?", note: "" },
      { en: "Is there a shuttle to the terminal?", vi: "Có xe đưa đón đến nhà ga không?", note: "" },
    ],
  },
  {
    id: 'hotel',
    title: 'Khách Sạn',
    titleEn: 'At the Hotel',
    icon: '🏨',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    description: 'Đặt phòng, check-in/out, yêu cầu dịch vụ',
    phrases: [
      { en: "I have a reservation under the name Duong.", vi: "Tôi có đặt phòng dưới tên Dương.", note: "" },
      { en: "I'd like to check in, please.", vi: "Tôi muốn nhận phòng.", note: "" },
      { en: "What time is check-out?", vi: "Giờ trả phòng là mấy giờ?", note: "" },
      { en: "Can I have a room with a city view?", vi: "Tôi có thể có phòng nhìn ra thành phố không?", note: "" },
      { en: "The air conditioning is not working.", vi: "Điều hòa không hoạt động.", note: "Báo sự cố" },
      { en: "Could you bring extra towels, please?", vi: "Phiền bạn mang thêm khăn tắm được không?", note: "" },
      { en: "I'd like to extend my stay by one night.", vi: "Tôi muốn ở thêm một đêm.", note: "" },
      { en: "Is breakfast included?", vi: "Bữa sáng có được bao gồm không?", note: "" },
      { en: "Can I leave my luggage here after check-out?", vi: "Tôi có thể để hành lý ở đây sau khi trả phòng không?", note: "" },
      { en: "Where is the nearest restaurant?", vi: "Nhà hàng gần nhất ở đâu?", note: "" },
      { en: "I'd like to check out now.", vi: "Tôi muốn trả phòng bây giờ.", note: "" },
      { en: "Could I have the Wi-Fi password?", vi: "Bạn có thể cho tôi mật khẩu Wi-Fi không?", note: "" },
    ],
  },
  {
    id: 'restaurant',
    title: 'Nhà Hàng',
    titleEn: 'At the Restaurant',
    icon: '🍽️',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800',
    description: 'Gọi món, thanh toán, phản hồi',
    phrases: [
      { en: "A table for two, please.", vi: "Một bàn cho hai người, xin vui lòng.", note: "" },
      { en: "Could I see the menu, please?", vi: "Cho tôi xem thực đơn được không?", note: "" },
      { en: "I'd like to order the grilled chicken.", vi: "Tôi muốn gọi món gà nướng.", note: "" },
      { en: "What do you recommend?", vi: "Bạn có thể gợi ý món gì không?", note: "" },
      { en: "I'm allergic to seafood.", vi: "Tôi bị dị ứng với hải sản.", note: "Quan trọng!" },
      { en: "Could you make it less spicy?", vi: "Bạn có thể làm ít cay hơn không?", note: "" },
      { en: "I'll have the same.", vi: "Tôi cũng gọi món đó.", note: "" },
      { en: "This is not what I ordered.", vi: "Đây không phải món tôi đã gọi.", note: "" },
      { en: "The food is delicious!", vi: "Thức ăn rất ngon!", note: "" },
      { en: "Could I have the bill, please?", vi: "Cho tôi hóa đơn được không?", note: "" },
      { en: "Is service charge included?", vi: "Phí phục vụ có được bao gồm không?", note: "" },
      { en: "Can I pay by card?", vi: "Tôi có thể trả bằng thẻ không?", note: "" },
    ],
  },
  {
    id: 'hospital',
    title: 'Bệnh Viện',
    titleEn: 'At the Hospital / Pharmacy',
    icon: '🏥',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    description: 'Khám bệnh, mô tả triệu chứng, mua thuốc',
    phrases: [
      { en: "I need to see a doctor.", vi: "Tôi cần gặp bác sĩ.", note: "" },
      { en: "I have a bad headache.", vi: "Tôi đau đầu dữ dội.", note: "" },
      { en: "I have a fever and a sore throat.", vi: "Tôi bị sốt và đau họng.", note: "" },
      { en: "I've had this pain for two days.", vi: "Tôi bị đau này được hai ngày rồi.", note: "" },
      { en: "I feel dizzy and nauseous.", vi: "Tôi cảm thấy chóng mặt và buồn nôn.", note: "" },
      { en: "I'm allergic to penicillin.", vi: "Tôi bị dị ứng với penicillin.", note: "Luôn nhớ nói với bác sĩ" },
      { en: "Do I need a prescription for this?", vi: "Thuốc này có cần đơn không?", note: "Tại hiệu thuốc" },
      { en: "How many times a day should I take this?", vi: "Tôi nên uống thuốc này mấy lần một ngày?", note: "" },
      { en: "Is it serious?", vi: "Nó có nghiêm trọng không?", note: "" },
      { en: "Where is the nearest pharmacy?", vi: "Hiệu thuốc gần nhất ở đâu?", note: "" },
      { en: "I have travel insurance.", vi: "Tôi có bảo hiểm du lịch.", note: "" },
      { en: "I need a medical certificate.", vi: "Tôi cần giấy chứng nhận y tế.", note: "" },
    ],
  },
  {
    id: 'interview',
    title: 'Phỏng Vấn',
    titleEn: 'Job Interview',
    icon: '💼',
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    description: 'Tự giới thiệu, trả lời câu hỏi phỏng vấn',
    phrases: [
      { en: "I'm very interested in this position.", vi: "Tôi rất hứng thú với vị trí này.", note: "" },
      { en: "I have three years of experience in marketing.", vi: "Tôi có ba năm kinh nghiệm trong lĩnh vực marketing.", note: "" },
      { en: "My greatest strength is my ability to work under pressure.", vi: "Điểm mạnh lớn nhất của tôi là khả năng làm việc dưới áp lực.", note: "" },
      { en: "I consider myself a quick learner.", vi: "Tôi tự đánh giá mình là người học nhanh.", note: "" },
      { en: "I'm a team player but also work well independently.", vi: "Tôi làm việc tốt theo nhóm nhưng cũng độc lập tốt.", note: "" },
      { en: "My weakness is that I sometimes focus too much on details.", vi: "Điểm yếu của tôi là đôi khi tôi chú ý quá nhiều vào chi tiết.", note: "Điểm yếu mang tính tích cực" },
      { en: "Why did you leave your previous job?", vi: "Tại sao bạn rời công việc trước?", note: "Câu hỏi thường gặp" },
      { en: "I'm looking for a new challenge and opportunity to grow.", vi: "Tôi đang tìm kiếm thử thách mới và cơ hội phát triển.", note: "" },
      { en: "What are the opportunities for advancement?", vi: "Có cơ hội thăng tiến như thế nào?", note: "Hỏi ngược lại nhà tuyển dụng" },
      { en: "Could you tell me more about the company culture?", vi: "Bạn có thể nói thêm về văn hóa công ty không?", note: "" },
      { en: "What is the starting salary for this position?", vi: "Mức lương khởi điểm cho vị trí này là bao nhiêu?", note: "" },
      { en: "I look forward to hearing from you.", vi: "Tôi mong nhận được hồi âm từ bạn.", note: "Kết thúc phỏng vấn" },
    ],
  },
  {
    id: 'shopping',
    title: 'Mua Sắm',
    titleEn: 'Shopping',
    icon: '🛍️',
    color: 'from-fuchsia-500 to-purple-600',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
    border: 'border-fuchsia-200 dark:border-fuchsia-800',
    description: 'Hỏi giá, thử đồ, đổi trả hàng',
    phrases: [
      { en: "How much does this cost?", vi: "Cái này giá bao nhiêu?", note: "" },
      { en: "Do you have this in a smaller size?", vi: "Bạn có cái này size nhỏ hơn không?", note: "" },
      { en: "Can I try this on?", vi: "Tôi có thể thử cái này không?", note: "" },
      { en: "Where are the fitting rooms?", vi: "Phòng thử đồ ở đâu?", note: "" },
      { en: "This doesn't fit. Do you have a larger size?", vi: "Cái này không vừa. Bạn có size lớn hơn không?", note: "" },
      { en: "Is this on sale?", vi: "Cái này đang giảm giá không?", note: "" },
      { en: "I'll take this one.", vi: "Tôi sẽ lấy cái này.", note: "" },
      { en: "Can I get a discount?", vi: "Tôi có thể được giảm giá không?", note: "" },
      { en: "I'd like to return this item.", vi: "Tôi muốn trả lại món này.", note: "" },
      { en: "I have the receipt.", vi: "Tôi có hóa đơn.", note: "" },
      { en: "Can I exchange this for a different color?", vi: "Tôi có thể đổi cái này sang màu khác không?", note: "" },
      { en: "Do you accept credit cards?", vi: "Bạn có chấp nhận thẻ tín dụng không?", note: "" },
    ],
  },
  {
    id: 'phone',
    title: 'Gọi Điện',
    titleEn: 'On the Phone',
    icon: '📞',
    color: 'from-teal-500 to-cyan-600',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-200 dark:border-teal-800',
    description: 'Gọi điện thoại, để lại tin nhắn, đặt lịch',
    phrases: [
      { en: "Hello, this is Duong speaking.", vi: "Xin chào, tôi là Dương.", note: "Giới thiệu bản thân khi gọi" },
      { en: "Could I speak to Mr. Smith, please?", vi: "Tôi có thể nói chuyện với ông Smith không?", note: "" },
      { en: "I'm calling to make an appointment.", vi: "Tôi gọi để đặt lịch hẹn.", note: "" },
      { en: "Could you call me back later?", vi: "Bạn có thể gọi lại cho tôi sau không?", note: "" },
      { en: "I'm afraid he's not available right now.", vi: "Xin lỗi, hiện tại anh ấy không có mặt.", note: "" },
      { en: "Can I leave a message?", vi: "Tôi có thể để lại tin nhắn không?", note: "" },
      { en: "Could you speak more slowly, please?", vi: "Bạn có thể nói chậm hơn một chút không?", note: "" },
      { en: "I'm sorry, the line is bad.", vi: "Xin lỗi, đường truyền kém quá.", note: "" },
      { en: "I'll put you on hold for a moment.", vi: "Tôi sẽ chuyển bạn chờ một chút.", note: "" },
      { en: "Could you repeat that, please?", vi: "Bạn có thể nhắc lại được không?", note: "" },
      { en: "I'll transfer your call to the right department.", vi: "Tôi sẽ chuyển cuộc gọi của bạn đến bộ phận phù hợp.", note: "" },
      { en: "Thank you for calling. Have a good day!", vi: "Cảm ơn bạn đã gọi. Chúc bạn một ngày tốt lành!", note: "Kết thúc cuộc gọi" },
    ],
  },
  {
    id: 'bank',
    title: 'Ngân Hàng',
    titleEn: 'At the Bank',
    icon: '🏦',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    description: 'Mở tài khoản, giao dịch, đổi tiền',
    phrases: [
      { en: "I'd like to open a bank account.", vi: "Tôi muốn mở tài khoản ngân hàng.", note: "" },
      { en: "I'd like to exchange some currency.", vi: "Tôi muốn đổi một ít ngoại tệ.", note: "" },
      { en: "What is the exchange rate today?", vi: "Tỷ giá hôm nay là bao nhiêu?", note: "" },
      { en: "I'd like to make a deposit.", vi: "Tôi muốn gửi tiền vào tài khoản.", note: "" },
      { en: "I'd like to withdraw some cash.", vi: "Tôi muốn rút một ít tiền mặt.", note: "" },
      { en: "I need to transfer money to another account.", vi: "Tôi cần chuyển tiền sang tài khoản khác.", note: "" },
      { en: "My card has been blocked.", vi: "Thẻ của tôi đã bị khóa.", note: "" },
      { en: "I've lost my ATM card.", vi: "Tôi đã mất thẻ ATM.", note: "" },
      { en: "Is there a transaction fee?", vi: "Có phí giao dịch không?", note: "" },
      { en: "I'd like to apply for a loan.", vi: "Tôi muốn xin vay vốn.", note: "" },
      { en: "Can I check my account balance?", vi: "Tôi có thể kiểm tra số dư tài khoản không?", note: "" },
      { en: "Where can I find the nearest ATM?", vi: "Máy ATM gần nhất ở đâu?", note: "" },
    ],
  },
  {
    "id": "transport",
    "title": "Giao Thong",
    "titleEn": "Transport & Taxi",
    "icon": "🚕",
    "color": "from-cyan-500 to-blue-600",
    "bg": "bg-cyan-50 dark:bg-cyan-900/20",
    "border": "border-cyan-200 dark:border-cyan-800",
    "description": "Taxi, xe buyt, tau dien, hoi duong",
    "phrases": [
      {
        "en": "Could you take me to the airport, please?",
        "vi": "Bạn chở tôi ra sân bay được không?",
        "note": ""
      },
      {
        "en": "How much is the fare to the city centre?",
        "vi": "Giá đi vào trung tâm thành phố là bao nhiêu?",
        "note": ""
      },
      {
        "en": "Please turn on the meter.",
        "vi": "Làm ơn bật đồng hồ tính tiền.",
        "note": "Tranh bi chat chem"
      },
      {
        "en": "Can you stop here, please?",
        "vi": "Bạn dừng ở đây được không?",
        "note": ""
      },
      {
        "en": "Which bus goes to the train station?",
        "vi": "Xe buýt nào đi đến nhà ga?",
        "note": ""
      },
      {
        "en": "How often do the buses run?",
        "vi": "Bao lâu thì có một chuyến xe buýt?",
        "note": ""
      },
      {
        "en": "Does this train stop at Central Station?",
        "vi": "Tàu này có dừng ở ga Trung Tâm không?",
        "note": ""
      },
      {
        "en": "I would like a return ticket, please.",
        "vi": "Tôi muốn mua vé khứ hồi.",
        "note": ""
      },
      {
        "en": "Is this seat taken?",
        "vi": "Chỗ này có ai ngồi chưa?",
        "note": ""
      },
      {
        "en": "Could you tell me when to get off?",
        "vi": "Bạn báo tôi khi nào xuống xe nhé?",
        "note": ""
      },
      {
        "en": "I think I left something in the taxi.",
        "vi": "Tôi nghĩ tôi để quên đồ trên taxi.",
        "note": ""
      },
      {
        "en": "How long does the journey take?",
        "vi": "Chuyến đi mất bao lâu?",
        "note": ""
      }
    ]
  },
  {
    "id": "smalltalk",
    "title": "Giao Tiep Xa Giao",
    "titleEn": "Small Talk",
    "icon": "💬",
    "color": "from-amber-500 to-yellow-500",
    "bg": "bg-amber-50 dark:bg-amber-900/20",
    "border": "border-amber-200 dark:border-amber-800",
    "description": "Lam quen, thoi tiet, cuoi tuan",
    "phrases": [
      {
        "en": "Lovely weather today, isn't it?",
        "vi": "Thời tiết hôm nay đẹp nhỉ?",
        "note": "Mo dau"
      },
      {
        "en": "How was your weekend?",
        "vi": "Cuối tuần của bạn thế nào?",
        "note": ""
      },
      {
        "en": "What do you do for a living?",
        "vi": "Bạn làm nghề gì?",
        "note": ""
      },
      {
        "en": "Have you been here before?",
        "vi": "Bạn đã từng đến đây chưa?",
        "note": ""
      },
      {
        "en": "It's nice to finally meet you.",
        "vi": "Rất vui cuối cùng cũng được gặp bạn.",
        "note": ""
      },
      {
        "en": "Do you have any plans for the holidays?",
        "vi": "Bạn có kế hoạch gì cho kỳ nghỉ không?",
        "note": ""
      },
      {
        "en": "That sounds really interesting.",
        "vi": "Nghe thú vị thật đấy.",
        "note": ""
      },
      {
        "en": "I completely agree with you.",
        "vi": "Tôi hoàn toàn đồng ý với bạn.",
        "note": ""
      },
      {
        "en": "How is your family doing?",
        "vi": "Gia đình bạn dạo này thế nào?",
        "note": ""
      },
      {
        "en": "It was great talking to you.",
        "vi": "Rất vui được trò chuyện với bạn.",
        "note": "Ket thuc"
      },
      {
        "en": "Let's keep in touch.",
        "vi": "Hãy giữ liên lạc nhé.",
        "note": ""
      },
      {
        "en": "Take care and see you soon!",
        "vi": "Giữ gìn sức khỏe, hẹn sớm gặp lại!",
        "note": ""
      }
    ]
  },
  {
    "id": "emergency",
    "title": "Khan Cap",
    "titleEn": "Emergencies",
    "icon": "🆘",
    "color": "from-red-500 to-rose-600",
    "bg": "bg-red-50 dark:bg-red-900/20",
    "border": "border-red-200 dark:border-red-800",
    "description": "Y te, mat do, can giup do gap",
    "phrases": [
      {
        "en": "Help! I need a doctor.",
        "vi": "Cứu với! Tôi cần bác sĩ.",
        "note": "Khan cap"
      },
      {
        "en": "Please call an ambulance.",
        "vi": "Làm ơn gọi xe cấp cứu.",
        "note": ""
      },
      {
        "en": "I have lost my passport.",
        "vi": "Tôi bị mất hộ chiếu.",
        "note": ""
      },
      {
        "en": "My wallet has been stolen.",
        "vi": "Ví của tôi bị trộm.",
        "note": ""
      },
      {
        "en": "Where is the nearest hospital?",
        "vi": "Bệnh viện gần nhất ở đâu?",
        "note": ""
      },
      {
        "en": "I don't feel well.",
        "vi": "Tôi thấy không khỏe.",
        "note": ""
      },
      {
        "en": "I am allergic to penicillin.",
        "vi": "Tôi bị dị ứng với penicillin.",
        "note": "Quan trong"
      },
      {
        "en": "Could you help me, please?",
        "vi": "Bạn có thể giúp tôi không?",
        "note": ""
      },
      {
        "en": "I need to contact my embassy.",
        "vi": "Tôi cần liên hệ đại sứ quán.",
        "note": ""
      },
      {
        "en": "Is there a pharmacy nearby?",
        "vi": "Gần đây có nhà thuốc không?",
        "note": ""
      },
      {
        "en": "Please call the police.",
        "vi": "Làm ơn gọi cảnh sát.",
        "note": ""
      },
      {
        "en": "It's an emergency!",
        "vi": "Đây là tình huống khẩn cấp!",
        "note": ""
      }
    ]
  },
  {
    "id": "tech",
    "title": "Cong Nghe",
    "titleEn": "Tech Support",
    "icon": "💻",
    "color": "from-slate-500 to-gray-600",
    "bg": "bg-slate-50 dark:bg-slate-900/20",
    "border": "border-slate-200 dark:border-slate-800",
    "description": "Wi-Fi, may tinh, dien thoai, su co",
    "phrases": [
      {
        "en": "Could I have the Wi-Fi password, please?",
        "vi": "Cho tôi xin mật khẩu Wi-Fi nhé?",
        "note": ""
      },
      {
        "en": "My internet connection is very slow.",
        "vi": "Kết nối mạng của tôi rất chậm.",
        "note": ""
      },
      {
        "en": "The Wi-Fi keeps disconnecting.",
        "vi": "Wi-Fi cứ bị ngắt liên tục.",
        "note": ""
      },
      {
        "en": "My laptop won't turn on.",
        "vi": "Máy tính của tôi không khởi động được.",
        "note": ""
      },
      {
        "en": "Could you help me reset my password?",
        "vi": "Bạn giúp tôi đặt lại mật khẩu được không?",
        "note": ""
      },
      {
        "en": "The app keeps crashing.",
        "vi": "Ứng dụng cứ bị tắt đột ngột.",
        "note": ""
      },
      {
        "en": "How do I install this software?",
        "vi": "Làm sao để cài đặt phần mềm này?",
        "note": ""
      },
      {
        "en": "Can I charge my phone here?",
        "vi": "Tôi sạc điện thoại ở đây được không?",
        "note": ""
      },
      {
        "en": "My screen has frozen.",
        "vi": "Màn hình của tôi bị đứng.",
        "note": ""
      },
      {
        "en": "I forgot my login details.",
        "vi": "Tôi quên thông tin đăng nhập.",
        "note": ""
      },
      {
        "en": "Is there a charging port nearby?",
        "vi": "Gần đây có ổ sạc không?",
        "note": ""
      },
      {
        "en": "Could you back up my files?",
        "vi": "Bạn có thể sao lưu dữ liệu giúp tôi không?",
        "note": ""
      }
    ]
  }
]

export const totalPhrases = situations.reduce((sum, s) => sum + s.phrases.length, 0)
