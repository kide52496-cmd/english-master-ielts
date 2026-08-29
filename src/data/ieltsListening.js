export const listeningExercises = [
  {
    id: 'l1',
    section: 'Section 1',
    title: 'Joining a Community Library',
    context: 'Một sinh viên gọi điện cho thư viện cộng đồng để hỏi về việc đăng ký thẻ thành viên.',
    xpReward: 40,
    transcript: `Librarian: Good morning, Riverside Community Library. How can I help you today?

Student: Hi, I'm calling because I'd like to join the library. Could you tell me how to register?

Librarian: Of course! We have two types of membership. The first is a standard membership, which is completely free and allows you to borrow up to five books at a time.

Student: Oh, that sounds good. Are there any other options?

Librarian: Yes, we also have a premium membership for just twelve dollars a year. With that, you can borrow up to fifteen items, including DVDs and audiobooks, and you get free access to our online database.

Student: I think the premium one sounds great. What do I need to bring to register?

Librarian: You'll need to bring a valid photo ID, such as a passport or driving licence, and proof of your current address. A recent utility bill or bank statement is fine.

Student: Great. And what are your opening hours?

Librarian: We're open Monday to Friday from nine in the morning until seven in the evening, and on Saturdays from ten to five. We're closed on Sundays and public holidays.

Student: Perfect. One more thing — do you have a children's section?

Librarian: Absolutely. It's on the second floor. We have over three thousand children's books, and we hold a free story time session every Saturday morning at eleven o'clock.

Student: Wonderful. Thank you so much for your help.

Librarian: You're welcome. We look forward to seeing you!`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'How much does the standard membership cost?',
        options: ['$5 per year', '$12 per year', 'Free', '$20 per year'],
        correct: 2,
        explanation: 'The librarian clearly states: "The first is a standard membership, which is completely free."'
      },
      {
        id: 2, type: 'mcq',
        question: 'How many items can a premium member borrow at a time?',
        options: ['5 items', '10 items', '12 items', '15 items'],
        correct: 3,
        explanation: 'The librarian says premium members can "borrow up to fifteen items".'
      },
      {
        id: 3, type: 'mcq',
        question: 'Which document is NOT mentioned as proof of address?',
        options: ['Utility bill', 'Bank statement', 'Employment letter', 'Driving licence'],
        correct: 2,
        explanation: 'The librarian mentions utility bill and bank statement as proof of address. Driving licence is mentioned as photo ID, not proof of address. Employment letter is never mentioned.'
      },
      {
        id: 4, type: 'mcq',
        question: 'What time does the library close on Saturdays?',
        options: ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'],
        correct: 1,
        explanation: 'The librarian says the library is open "on Saturdays from ten to five", meaning it closes at 5:00 PM.'
      },
      {
        id: 5, type: 'mcq',
        question: 'Where is the children\'s section located?',
        options: ['Ground floor', 'First floor', 'Second floor', 'Third floor'],
        correct: 2,
        explanation: 'The librarian says: "It\'s on the second floor."'
      },
      {
        id: 91,
        type: "gap_fill",
        instruction: "Complete the sentence with NO MORE THAN TWO WORDS.",
        question: "The library closes at ____ on weekdays.",
        answer: "9 PM",
        explanation: "The librarian mentions standard hours."
      },
      {
        id: 92,
        type: "form_completion",
        instruction: "Fill the form with NO MORE THAN ONE WORD AND/OR A NUMBER.",
        question: "Membership type: ____",
        answer: "standard",
        explanation: "Standard membership is the basic free option."
      }
    ],
  },
  {
    id: 'l2',
    section: 'Section 2',
    title: 'A Tour of the City Science Museum',
    context: 'Một hướng dẫn viên giới thiệu bảo tàng khoa học cho nhóm khách tham quan.',
    xpReward: 40,
    transcript: `Welcome, everyone, to the Greenfield Science Museum. My name is Sarah, and I'll be your guide this morning.

The museum was founded in 1952, and it originally focused only on natural history. However, since a major renovation in 2005, it has expanded to cover five distinct areas: Earth Sciences, Space Exploration, Human Biology, Technology Through the Ages, and our newest addition — the Climate Action Gallery, which opened just last year.

Today's visit will last approximately two hours. We ask all visitors to keep noise to a minimum, especially in the laboratory areas, and please turn off your mobile phones before entering any of the exhibition halls.

Let me draw your attention to some highlights. On the ground floor, you'll find the popular Earthquake Simulator, where you can experience the sensation of a 6.5 magnitude earthquake in complete safety. It operates every thirty minutes throughout the day.

On the first floor, the Space Exploration wing has a life-sized replica of the Apollo 11 command module. Photography is permitted here, but please do not touch any of the exhibits.

The Climate Action Gallery on the second floor is currently hosting a special exhibition called "Our Changing Seas", which runs until the end of next month. Entry to this exhibition is included in your museum ticket.

Finally, the museum café is located in the east wing on the ground floor. It offers hot and cold food from nine in the morning until five in the afternoon.

If you have any questions during your visit, please don't hesitate to ask any member of staff. Now, shall we begin?`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'In what year was the museum founded?',
        options: ['1925', '1952', '1985', '2005'],
        correct: 1,
        explanation: 'The guide says: "The museum was founded in 1952."'
      },
      {
        id: 2, type: 'mcq',
        question: 'What is the newest addition to the museum?',
        options: ['Space Exploration wing', 'Human Biology section', 'Climate Action Gallery', 'Technology Through the Ages'],
        correct: 2,
        explanation: 'The guide mentions "our newest addition — the Climate Action Gallery, which opened just last year."'
      },
      {
        id: 3, type: 'mcq',
        question: 'How often does the Earthquake Simulator operate?',
        options: ['Every 15 minutes', 'Every 20 minutes', 'Every 30 minutes', 'Every 60 minutes'],
        correct: 2,
        explanation: 'The guide states: "It operates every thirty minutes throughout the day."'
      },
      {
        id: 4, type: 'mcq',
        question: 'What rule applies in the Space Exploration wing?',
        options: ['No photography allowed', 'Photography allowed but no touching exhibits', 'No children under 12', 'No food or drinks'],
        correct: 1,
        explanation: 'The guide says: "Photography is permitted here, but please do not touch any of the exhibits."'
      },
      {
        id: 5, type: 'mcq',
        question: 'Where is the museum café located?',
        options: ['Ground floor, west wing', 'Ground floor, east wing', 'First floor, east wing', 'Second floor, west wing'],
        correct: 1,
        explanation: 'The guide says: "The museum café is located in the east wing on the ground floor."'
      },
    ],
  },
  {
    id: 'l3',
    section: 'Section 3',
    title: 'University Group Project Discussion',
    context: 'Hai sinh viên đang thảo luận về đề án nhóm môn Kinh tế học với giáo sư hướng dẫn.',
    xpReward: 50,
    transcript: `Professor: Come in! Ah, Maya and Daniel — sit down. So how is the group project coming along?

Maya: We've made quite a lot of progress, actually. We've decided to focus on the impact of renewable energy subsidies on small businesses in rural areas.

Professor: That's an interesting angle. What methodology are you planning to use?

Daniel: We're going to use a mixed-methods approach — a survey of fifty small business owners combined with three in-depth case studies.

Professor: Good. And what's your timeline? The submission deadline is the fourteenth of November.

Maya: We've divided the work into three phases. The first phase — data collection — should be finished by the end of next week. Then we'll spend two weeks on analysis, and the final week on writing up.

Professor: That sounds tight but manageable. One concern I have is your sample size. Fifty respondents may not give you statistically reliable results for the quantitative section.

Daniel: We've thought about that. We're also going to include national statistics from the Energy Ministry report published last year, which covers over two thousand businesses.

Professor: Excellent. That will significantly strengthen your argument. What about the literature review?

Maya: We've already reviewed twelve peer-reviewed articles and three government reports. We found that most existing research focuses on large corporations rather than small businesses, which is why we think our study fills an important gap.

Professor: I agree. That's a strong justification for your research. One more thing — make sure you address the ethical considerations around your survey data. Participant anonymity must be guaranteed.

Daniel: Absolutely. We'll include a consent form and anonymise all responses before analysis.

Professor: Perfect. I think you're on the right track. See you at the next supervision meeting on Thursday.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What is the main focus of the students\' project?',
        options: [
          'The effect of taxes on large corporations',
          'The impact of renewable energy subsidies on small rural businesses',
          'Environmental policies in urban areas',
          'Government spending on infrastructure',
        ],
        correct: 1,
        explanation: 'Maya states: "We\'ve decided to focus on the impact of renewable energy subsidies on small businesses in rural areas."',
      },
      {
        id: 2, type: 'mcq',
        question: 'What is the project submission deadline?',
        options: ['End of next week', '14th November', '3rd November', '21st November'],
        correct: 1,
        explanation: 'The professor says: "The submission deadline is the fourteenth of November."',
      },
      {
        id: 3, type: 'mcq',
        question: 'How many peer-reviewed articles have the students already reviewed?',
        options: ['Eight', 'Ten', 'Twelve', 'Fifteen'],
        correct: 2,
        explanation: 'Maya says: "We\'ve already reviewed twelve peer-reviewed articles and three government reports."',
      },
      {
        id: 4, type: 'mcq',
        question: 'What does the professor say will strengthen their argument?',
        options: [
          'Interviewing more participants',
          'Including national statistics from the Energy Ministry report',
          'Focusing on large corporations instead',
          'Extending the submission deadline',
        ],
        correct: 1,
        explanation: 'The professor says including national statistics from the Energy Ministry "will significantly strengthen your argument."',
      },
      {
        id: 5, type: 'mcq',
        question: 'What ethical requirement does the professor mention?',
        options: [
          'All participants must be paid',
          'Data must be stored for ten years',
          'Participant anonymity must be guaranteed',
          'The survey must be approved by the university board',
        ],
        correct: 2,
        explanation: 'The professor states: "Participant anonymity must be guaranteed."',
      },
    ],
  },
  {
    id: 'l4',
    section: 'Section 4',
    title: 'Lecture: The Psychology of Decision-Making',
    context: 'Giảng viên giới thiệu chủ đề tâm lý học trong việc ra quyết định cho sinh viên năm nhất.',
    xpReward: 50,
    transcript: `Good morning, everyone. Today we're going to begin our unit on the psychology of decision-making — a field that sits at the intersection of psychology, economics, and neuroscience.

For most of the twentieth century, economists assumed that human beings make decisions rationally. They believed that when faced with a choice, people would carefully weigh all available information, calculate the potential outcomes, and select the option that maximised their personal benefit. This model is known as rational choice theory.

However, beginning in the 1970s, psychologists Daniel Kahneman and Amos Tversky conducted a series of groundbreaking experiments that challenged this assumption. Their research demonstrated that human decision-making is frequently irrational, predictably biased, and influenced by factors that have nothing to do with logic.

One of their most important findings was the concept of loss aversion. In simple terms, people feel the pain of losing something much more strongly than they feel the pleasure of gaining something of equivalent value. For example, losing twenty dollars feels psychologically more significant than gaining twenty dollars feels positive. Research suggests the pain of loss is roughly twice as powerful as the pleasure of gain.

Another key concept is the anchoring effect. When people make decisions, they tend to rely too heavily on the first piece of information they receive — the so-called "anchor". For instance, in salary negotiations, whoever states a number first tends to significantly influence the final outcome, even when the initial figure is arbitrary.

A third bias is the availability heuristic. People judge the likelihood of events based on how easily examples come to mind. After seeing news coverage of a plane crash, people dramatically overestimate the danger of flying, even though statistically it remains far safer than driving.

Understanding these biases has significant practical applications in areas from public health policy to financial planning. Governments and organisations are increasingly using what is called "nudge theory" — subtly redesigning environments to guide people towards better decisions without restricting their freedom of choice.

In next week's lecture, we'll examine specific case studies of how nudge theory has been applied in healthcare and environmental policy. Please complete the reading on chapters four and five before then.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What is "rational choice theory"?',
        options: [
          'The idea that people make decisions based on emotions',
          'The belief that people carefully weigh information and maximise personal benefit',
          'A theory that decisions are influenced by social pressure',
          'The study of financial decision-making only',
        ],
        correct: 1,
        explanation: 'The lecturer explains rational choice theory as the belief that people "carefully weigh all available information...and select the option that maximised their personal benefit."',
      },
      {
        id: 2, type: 'mcq',
        question: 'When did Kahneman and Tversky begin their research on decision-making?',
        options: ['1950s', '1960s', '1970s', '1980s'],
        correct: 2,
        explanation: 'The lecturer says: "beginning in the 1970s, psychologists Daniel Kahneman and Amos Tversky conducted a series of groundbreaking experiments."',
      },
      {
        id: 3, type: 'mcq',
        question: 'According to the lecture, how much more powerful is the pain of loss compared to the pleasure of gain?',
        options: ['Equal in strength', 'Roughly twice as powerful', 'Three times as powerful', 'Five times as powerful'],
        correct: 1,
        explanation: 'The lecturer states: "Research suggests the pain of loss is roughly twice as powerful as the pleasure of gain."',
      },
      {
        id: 4, type: 'mcq',
        question: 'What is the "anchoring effect"?',
        options: [
          'The tendency to avoid making decisions under pressure',
          'Overestimating the risk of rare events',
          'Relying too heavily on the first piece of information received',
          'Preferring familiar options over new ones',
        ],
        correct: 2,
        explanation: 'The lecturer defines anchoring as when "people make decisions, they tend to rely too heavily on the first piece of information they receive."',
      },
      {
        id: 5, type: 'mcq',
        question: 'What is "nudge theory" described as?',
        options: [
          'Forcing people to make better decisions through strict laws',
          'Subtly redesigning environments to guide people towards better decisions',
          'Educating people about cognitive biases in schools',
          'Using financial penalties to change behaviour',
        ],
        correct: 1,
        explanation: 'The lecturer describes nudge theory as "subtly redesigning environments to guide people towards better decisions without restricting their freedom of choice."',
      },
    ],
  },
  {
    id: 'l5',
    section: 'Section 1',
    title: 'Booking a Holiday Cottage',
    context: 'Một khách hàng gọi điện đặt thuê nhà nghỉ cuối tuần cho gia đình.',
    xpReward: 40,
    transcript: `Agent: Good afternoon, Lakeside Cottages. How may I help you?

Customer: Hello, I'd like to book a cottage for a family holiday next month.

Agent: Certainly. How many people will be staying, and for how long?

Customer: There will be six of us — four adults and two children — and we'd like to stay for four nights, from the fifteenth.

Agent: Let me check. Yes, we have our Maple Cottage available, which sleeps up to eight. It has three bedrooms, a large kitchen, and a garden leading down to the lake.

Customer: That sounds perfect. How much is it per night?

Agent: It's a hundred and forty pounds per night, but for stays of four nights or more we offer a ten per cent discount.

Customer: Great. Is breakfast included?

Agent: No, breakfast isn't included, but the kitchen is fully equipped, and there's a bakery in the village just a five-minute walk away. I should also mention that we require a deposit of fifty pounds to confirm the booking.

Customer: That's fine. Oh, and do you allow pets? We have a small dog.

Agent: We do, but there's an additional charge of fifteen pounds for cleaning. Could I take your name and a contact number?

Customer: Yes, it's Helen Carter, and my number is 0-7-7-double 0-9-three-one-two-four-five.

Agent: Thank you, Mrs Carter. I'll send a confirmation email shortly.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'How many nights does the customer want to stay?',
        options: ['Two nights', 'Three nights', 'Four nights', 'Five nights'],
        correct: 2,
        explanation: 'The customer says they would like to stay "for four nights, from the fifteenth."',
      },
      {
        id: 2, type: 'mcq',
        question: 'How many people does Maple Cottage sleep?',
        options: ['Up to six', 'Up to eight', 'Up to ten', 'Up to four'],
        correct: 1,
        explanation: 'The agent says Maple Cottage "sleeps up to eight."',
      },
      {
        id: 3, type: 'mcq',
        question: 'Why is the customer offered a discount?',
        options: [
          'Because they have children',
          'Because they are staying four nights or more',
          'Because they are repeat customers',
          'Because they booked online',
        ],
        correct: 1,
        explanation: 'The agent offers "for stays of four nights or more...a ten per cent discount."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The cottage costs £____ per night before any discount.',
        answer: '140',
        explanation: 'The agent states it is "a hundred and forty pounds per night."',
      },
      {
        id: 5, type: 'form_completion',
        instruction: 'Complete the form with NO MORE THAN TWO WORDS AND/OR A NUMBER.',
        question: 'Extra charge for bringing a pet: £____',
        answer: '15',
        explanation: 'There is "an additional charge of fifteen pounds for cleaning" for pets.',
      },
    ],
  },
  {
    id: 'l6',
    section: 'Section 2',
    title: 'Welcome to the National Park',
    context: 'Một kiểm lâm giới thiệu thông tin cho du khách tại trung tâm thông tin của vườn quốc gia.',
    xpReward: 40,
    transcript: `Good morning, everyone, and welcome to Brackenwood National Park. My name is Tom, and I'm one of the rangers here.

Before you set off, let me share some important information. The park covers over four hundred square kilometres and contains three main walking trails. The Blue Trail is the easiest — it's flat, about three kilometres long, and suitable for families with young children. The Red Trail is more challenging, climbing up to the ridge, and takes around four hours to complete. The Green Trail is for experienced hikers only, as parts of it are steep and unmarked.

A few safety reminders. Please carry plenty of water, especially in summer, as there are no shops once you leave the visitor centre. The weather can change quickly in the mountains, so bring a waterproof jacket even on a sunny day.

We're also very proud of our wildlife. If you're lucky, you may spot red deer in the early morning, and the park is home to a rare colony of golden eagles, which nest on the northern cliffs. Please do not feed any animals, as this harms their health and makes them dependent on humans.

Finally, the café next to the car park is open until five o'clock, and the last shuttle bus back to the town centre leaves at half past five. Guided tours depart from this desk every hour on the hour. Enjoy your visit!`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which trail is recommended for families with young children?',
        options: ['The Blue Trail', 'The Red Trail', 'The Green Trail', 'The Northern Trail'],
        correct: 0,
        explanation: 'The Blue Trail is "the easiest...suitable for families with young children."',
      },
      {
        id: 2, type: 'mcq',
        question: 'Why should visitors bring a waterproof jacket even on a sunny day?',
        options: [
          'It is a park rule',
          'The weather can change quickly in the mountains',
          'There is no café',
          'The trails cross rivers',
        ],
        correct: 1,
        explanation: '"The weather can change quickly in the mountains, so bring a waterproof jacket even on a sunny day."',
      },
      {
        id: 3, type: 'mcq',
        question: 'Where do the golden eagles nest?',
        options: ['By the visitor centre', 'On the northern cliffs', 'Near the café', 'Along the Blue Trail'],
        correct: 1,
        explanation: 'The park\'s golden eagles "nest on the northern cliffs."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The Red Trail takes about ____ hours to complete.',
        answer: '4',
        explanation: 'The Red Trail "takes around four hours to complete."',
      },
      {
        id: 5, type: 'gap_fill',
        instruction: 'Complete the sentence with A TIME.',
        question: 'The last shuttle bus to the town centre leaves at ____.',
        answer: '5.30',
        explanation: '"The last shuttle bus back to the town centre leaves at half past five" (5.30).',
      },
    ],
  },
  {
    id: 'l7',
    section: 'Section 3',
    title: 'Discussing a Research Project',
    context: 'Hai sinh viên thảo luận với giảng viên về dự án nghiên cứu nhóm của họ.',
    xpReward: 45,
    transcript: `Tutor: So, Mai and James, how is your research project on urban green spaces coming along?

Mai: Quite well, I think. We've collected survey responses from about two hundred residents, which is more than we expected.

Tutor: That's a strong sample. And what method did you use to distribute the survey?

James: We originally planned to do face-to-face interviews, but they took far too long, so we switched to an online questionnaire instead. It was much more efficient.

Tutor: A sensible decision. However, you should acknowledge in your report that online surveys may exclude older residents who are less comfortable with technology.

Mai: That's a good point. We'll add that as a limitation.

Tutor: Now, what have your early findings shown?

James: The most surprising result is that people value green spaces more for mental relaxation than for physical exercise. We'd assumed exercise would be the main reason.

Tutor: Interesting. That challenges a lot of the existing literature. Make sure you highlight it. What's your next step?

Mai: We need to analyse the data statistically. Neither of us is very confident with the software, though.

Tutor: I'd recommend booking a session with the data support centre. They run workshops every Thursday afternoon. And remember, your first draft is due in three weeks, not four — the deadline was moved forward.

James: Thanks for reminding us. We'll get started right away.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Why did the students change their data collection method?',
        options: [
          'The interviews were too expensive',
          'Face-to-face interviews took far too long',
          'They could not find enough residents',
          'The tutor told them to',
        ],
        correct: 1,
        explanation: 'They switched because face-to-face interviews "took far too long."',
      },
      {
        id: 2, type: 'mcq',
        question: 'What limitation of online surveys does the tutor point out?',
        options: [
          'They are less accurate',
          'They may exclude older residents less comfortable with technology',
          'They cost more money',
          'They take longer to analyse',
        ],
        correct: 1,
        explanation: 'Online surveys "may exclude older residents who are less comfortable with technology."',
      },
      {
        id: 3, type: 'mcq',
        question: 'What was the most surprising finding?',
        options: [
          'People rarely use green spaces',
          'People value green spaces more for relaxation than for exercise',
          'Older people use green spaces most',
          'Green spaces are too crowded',
        ],
        correct: 1,
        explanation: 'The surprising result was that people "value green spaces more for mental relaxation than for physical exercise."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The students collected survey responses from about ____ residents.',
        answer: '200',
        explanation: 'Mai says they collected responses "from about two hundred residents."',
      },
      {
        id: 5, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The first draft is now due in ____ weeks.',
        answer: '3',
        explanation: 'The tutor says "your first draft is due in three weeks, not four — the deadline was moved forward."',
      },
    ],
  },
  {
    id: 'l8',
    section: 'Section 4',
    title: 'Lecture: The History of Coffee',
    context: 'Một bài giảng học thuật về lịch sử và quá trình lan rộng của cà phê trên thế giới.',
    xpReward: 45,
    transcript: `Today's lecture explores the remarkable journey of coffee from a wild plant to a global commodity.

The story begins in the highlands of Ethiopia, where, according to legend, a goat herder noticed his animals became unusually energetic after eating the red berries of a certain shrub. While this tale is almost certainly a myth, there is solid evidence that coffee was first cultivated on the Arabian Peninsula, in what is now Yemen, by the fifteenth century.

From there, coffee spread rapidly through the Islamic world. The first coffee houses, known as qahveh khaneh, appeared in cities such as Mecca and Cairo. These establishments became important centres of social and intellectual life, so much so that authorities occasionally tried to close them, fearing they encouraged dissent.

Coffee reached Europe in the seventeenth century. Initially viewed with suspicion, it soon gained acceptance, and coffee houses sprang up across the continent. In London, these venues earned the nickname "penny universities", because for the price of a cup, one could join in stimulating conversation with scholars and merchants.

The global spread of coffee had a darker side, however. To meet rising demand, European powers established vast plantations in their colonies, relying heavily on forced labour. By the eighteenth century, coffee had become one of the most valuable traded commodities in the world.

Today, coffee is grown in over seventy countries, and the industry supports an estimated one hundred million people. Yet many small farmers still struggle with unstable prices, a problem that fair-trade movements continue to address.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Where is there solid evidence that coffee was first cultivated?',
        options: [
          'In the highlands of Ethiopia',
          'On the Arabian Peninsula, in modern Yemen',
          'In Mecca and Cairo',
          'In London',
        ],
        correct: 1,
        explanation: 'There is "solid evidence that coffee was first cultivated on the Arabian Peninsula, in what is now Yemen."',
      },
      {
        id: 2, type: 'mcq',
        question: 'Why did authorities sometimes try to close early coffee houses?',
        options: [
          'They were unprofitable',
          'They feared the houses encouraged dissent',
          'They were unhygienic',
          'They competed with mosques',
        ],
        correct: 1,
        explanation: 'Authorities tried to close them "fearing they encouraged dissent."',
      },
      {
        id: 3, type: 'mcq',
        question: 'Why were London coffee houses nicknamed "penny universities"?',
        options: [
          'They were run by universities',
          'They charged a penny for lectures',
          'For the price of a cup you could join stimulating conversation with scholars',
          'They sold cheap books',
        ],
        correct: 2,
        explanation: 'The nickname arose "because for the price of a cup, one could join in stimulating conversation with scholars and merchants."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with ONE WORD.',
        question: 'To meet demand, European powers ran large plantations that relied heavily on forced ____.',
        answer: 'labour',
        explanation: 'The plantations relied "heavily on forced labour." (Accepts the British spelling "labour".)',
      },
      {
        id: 5, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'Coffee is now grown in over ____ countries.',
        answer: '70',
        explanation: '"Today, coffee is grown in over seventy countries."',
      },
    ],
  },
  {
    id: 'l9',
    section: 'Section 1',
    title: 'Registering for a Gym Membership',
    context: 'Một người gọi điện đến phòng tập để hỏi thông tin và đăng ký hội viên.',
    xpReward: 40,
    transcript: `Receptionist: Good evening, FitLife Gym. How can I help you?

Caller: Hi, I'm interested in joining the gym. Could you tell me about your membership options?

Receptionist: Of course. We have three plans. The Basic plan costs twenty-five pounds a month and gives you access to the gym floor and changing rooms. The Standard plan is forty pounds and adds unlimited group classes. The Premium plan, at fifty-five pounds, includes everything plus access to the swimming pool and sauna.

Caller: I think the Standard plan would suit me. Are there any joining fees?

Receptionist: There's normally a twenty-pound registration fee, but we're running a promotion this month, so it's waived if you sign up before the end of the week.

Caller: That's good timing. What are your opening hours?

Receptionist: We're open from six in the morning until eleven at night on weekdays, and from eight to eight at weekends.

Caller: Great. And do I need to bring anything to register?

Receptionist: Just a form of photo identification and your bank details for the monthly payment. It also helps to bring a towel and indoor trainers if you'd like to use the facilities on the same day.

Caller: Perfect. Could I book an induction session with a trainer as well?

Receptionist: Absolutely. Inductions are free for all new members and take about forty-five minutes. I can book you in for Thursday at six o'clock if that works.

Caller: That's ideal. Thank you very much.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which plan includes access to the swimming pool?',
        options: ['Basic', 'Standard', 'Premium', 'All of them'],
        correct: 2,
        explanation: 'The Premium plan "includes everything plus access to the swimming pool and sauna."',
      },
      {
        id: 2, type: 'mcq',
        question: 'Why might the caller avoid paying the registration fee?',
        options: [
          'They are a student',
          'There is a promotion if they sign up before the end of the week',
          'It is included in the Standard plan',
          'They booked an induction',
        ],
        correct: 1,
        explanation: 'The fee "is waived if you sign up before the end of the week" due to a promotion.',
      },
      {
        id: 3, type: 'mcq',
        question: 'What does the caller need to bring to register?',
        options: [
          'A towel and trainers only',
          'Photo ID and bank details',
          'A medical certificate',
          'Cash for the first month',
        ],
        correct: 1,
        explanation: 'They need "a form of photo identification and your bank details for the monthly payment."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The Standard plan costs £____ per month.',
        answer: '40',
        explanation: '"The Standard plan is forty pounds and adds unlimited group classes."',
      },
      {
        id: 5, type: 'form_completion',
        instruction: 'Complete the form with A NUMBER.',
        question: 'Induction session length: about ____ minutes',
        answer: '45',
        explanation: 'Inductions "take about forty-five minutes."',
      },
    ],
  },
  {
    id: 'l10',
    section: 'Section 2',
    title: 'Information About a Music Festival',
    context: 'Ban tổ chức cung cấp thông tin cho khách tham dự một lễ hội âm nhạc ngoài trời.',
    xpReward: 40,
    transcript: `Hello, everyone, and thank you for attending this briefing about the Riverside Music Festival.

The festival runs over three days, from Friday to Sunday. Gates open at midday each day, and the final performances finish at eleven at night. Please note that no entry is permitted after nine in the evening, for security reasons.

There are four stages in total. The Main Stage hosts the biggest acts and is located in the central field. The Acoustic Tent, near the east entrance, features quieter, unplugged performances. The Dance Arena is at the far end of the site, and finally, the brand-new Discovery Stage showcases up-and-coming local artists.

A few practical points. Camping is available in the designated field to the north, but you must display your camping pass at all times. Please do not bring glass bottles or any food from outside, as these are not permitted. However, there are over twenty food stalls offering a wide range of options, including vegetarian and vegan choices.

For those travelling by car, parking costs ten pounds per day and is located a short walk from the main gate. We strongly encourage the use of the free shuttle bus from the train station, which runs every fifteen minutes.

Finally, in case of emergency, the first aid tent is clearly marked and located beside the Main Stage. Lost property can be collected from the information desk at the main entrance.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What time is the latest visitors can enter the festival?',
        options: ['Midday', 'Nine in the evening', 'Eleven at night', 'Eight in the morning'],
        correct: 1,
        explanation: '"No entry is permitted after nine in the evening, for security reasons."',
      },
      {
        id: 2, type: 'mcq',
        question: 'Which stage features up-and-coming local artists?',
        options: ['The Main Stage', 'The Acoustic Tent', 'The Dance Arena', 'The Discovery Stage'],
        correct: 3,
        explanation: 'The Discovery Stage "showcases up-and-coming local artists."',
      },
      {
        id: 3, type: 'mcq',
        question: 'What are visitors NOT allowed to bring?',
        options: [
          'Camping passes',
          'Glass bottles or outside food',
          'Vegetarian food',
          'Train tickets',
        ],
        correct: 1,
        explanation: '"Please do not bring glass bottles or any food from outside, as these are not permitted."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'Car parking costs £____ per day.',
        answer: '10',
        explanation: '"Parking costs ten pounds per day."',
      },
      {
        id: 5, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The free shuttle bus runs every ____ minutes.',
        answer: '15',
        explanation: 'The shuttle bus "runs every fifteen minutes."',
      },
    ],
  },
  {
    id: 'l11',
    section: 'Section 4',
    title: 'Lecture: The Origins of Writing',
    context: 'Một bài giảng học thuật về nguồn gốc và sự phát triển của chữ viết.',
    xpReward: 45,
    transcript: `In today's lecture, we'll trace the origins of one of humanity's most transformative inventions: writing.

Writing appears to have been invented independently in at least three different parts of the world. The earliest known system emerged in Mesopotamia, in present-day Iraq, around 3,400 BC. Interestingly, it did not begin as a way of recording language or literature, but as a practical tool for accounting. Early clay tablets recorded transactions — how much grain was stored, or how many sheep were traded.

This first script is known as cuneiform, named after the wedge-shaped marks made by pressing a reed stylus into wet clay. Over time, the symbols became more abstract and began to represent sounds rather than objects, allowing far more complex ideas to be expressed.

Independently, the ancient Egyptians developed their famous hieroglyphics, and much later, writing also arose in China and, separately, in Central America among the Maya.

The development of the alphabet was a later and crucial step. Rather than using hundreds of symbols, an alphabet represents individual sounds with a small set of letters. The first alphabet is generally credited to the Phoenicians, a trading people whose system spread around the Mediterranean and formed the basis of Greek and, eventually, the Latin alphabet we use today.

The consequences of writing were profound. It allowed knowledge to be stored and transmitted across generations, made complex administration possible, and ultimately laid the foundation for science, law, and recorded history.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What was the earliest writing in Mesopotamia originally used for?',
        options: [
          'Recording literature',
          'Religious ceremonies',
          'Accounting and recording transactions',
          'Sending letters',
        ],
        correct: 2,
        explanation: 'It began "as a practical tool for accounting" recording transactions like grain and sheep.',
      },
      {
        id: 2, type: 'mcq',
        question: 'Why is the earliest script called "cuneiform"?',
        options: [
          'It was invented by a man named Cuneo',
          'It was named after the wedge-shaped marks made in clay',
          'It means "picture writing"',
          'It was used only by priests',
        ],
        correct: 1,
        explanation: 'Cuneiform is "named after the wedge-shaped marks made by pressing a reed stylus into wet clay."',
      },
      {
        id: 3, type: 'mcq',
        question: 'Who is generally credited with the first alphabet?',
        options: ['The Egyptians', 'The Greeks', 'The Maya', 'The Phoenicians'],
        correct: 3,
        explanation: '"The first alphabet is generally credited to the Phoenicians."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The earliest known writing system emerged around ____ BC.',
        answer: '3400',
        explanation: 'The earliest system emerged in Mesopotamia "around 3,400 BC."',
      },
      {
        id: 5, type: 'form_completion',
        instruction: 'Complete the note with ONE WORD.',
        question: 'An alphabet represents individual ____ with a small set of letters.',
        answer: 'sounds',
        explanation: '"An alphabet represents individual sounds with a small set of letters."',
      },
    ],
  },
  {
    id: 'l12',
    section: 'Section 3',
    title: 'Choosing a Dissertation Topic',
    context: 'Một sinh viên trao đổi với giảng viên hướng dẫn về việc chọn đề tài luận văn.',
    xpReward: 45,
    transcript: `Supervisor: Come in, Daniel. So, have you given more thought to your dissertation topic?

Daniel: Yes, I have a few ideas, but I'm finding it hard to narrow them down. My main interest is renewable energy, but it feels too broad.

Supervisor: That's a very common problem. A broad topic is difficult to research in depth within the word limit. You need to find a specific angle.

Daniel: I was thinking about looking at solar power adoption in rural communities.

Supervisor: That's much better — it's focused and manageable. Do you have access to data on that?

Daniel: That's my concern, actually. I'm not sure I can collect enough primary data myself in the time available.

Supervisor: In that case, you could base your study on existing data sets, which are freely available from several government agencies. A well-conducted analysis of secondary data is perfectly acceptable at this level.

Daniel: That's reassuring. How many sources should I be aiming for in my literature review?

Supervisor: For a dissertation of this length, I'd recommend reviewing at least thirty academic sources, though quality matters more than quantity.

Daniel: Understood. And when should I submit my proposal?

Supervisor: The proposal deadline is the end of October, but I'd encourage you to send me a draft two weeks before that, so I have time to give feedback.

Daniel: Great, I'll aim for mid-October. Thank you so much.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Why does the supervisor say Daniel\'s original idea is problematic?',
        options: [
          'It is not interesting enough',
          'Renewable energy is too broad to research in depth',
          'There is no data available',
          'Another student chose it',
        ],
        correct: 1,
        explanation: 'A broad topic "is difficult to research in depth within the word limit."',
      },
      {
        id: 2, type: 'mcq',
        question: 'What solution does the supervisor suggest for the data problem?',
        options: [
          'Collecting more primary data',
          'Changing the topic completely',
          'Using existing secondary data from government agencies',
          'Extending the deadline',
        ],
        correct: 2,
        explanation: 'He suggests basing the study "on existing data sets, which are freely available from several government agencies."',
      },
      {
        id: 3, type: 'mcq',
        question: 'What does the supervisor emphasise about literature sources?',
        options: [
          'Quantity matters more than quality',
          'Quality matters more than quantity',
          'Only recent sources count',
          'Sources must be primary data',
        ],
        correct: 1,
        explanation: '"Quality matters more than quantity."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The supervisor recommends reviewing at least ____ academic sources.',
        answer: '30',
        explanation: 'He recommends "reviewing at least thirty academic sources."',
      },
      {
        id: 5, type: 'form_completion',
        instruction: 'Complete the note with TWO WORDS.',
        question: 'Daniel will focus his study on solar power adoption in ____.',
        answer: 'rural communities',
        explanation: 'Daniel decides to look at "solar power adoption in rural communities."',
      },
    ],
  },
  {
    id: 'l13',
    section: 'Section 1',
    title: 'Enrolling in an Evening Course',
    context: 'Một người gọi điện đến trung tâm giáo dục cộng đồng để đăng ký khóa học buổi tối.',
    xpReward: 40,
    transcript: `Receptionist: Good afternoon, Eastside Community College. How can I help?

Caller: Hello, I'd like to enrol in one of your evening courses. I'm interested in photography.

Receptionist: Lovely. We actually run two photography courses. There's a beginners' course on Tuesday evenings, and an intermediate one on Thursdays. Which would suit you?

Caller: I'm a complete beginner, so the Tuesday one, please. How long does the course last?

Receptionist: It runs for ten weeks, with each session lasting two hours, from seven to nine in the evening.

Caller: And how much is the course?

Receptionist: The full fee is one hundred and eighty pounds, but if you're a student or over sixty-five, there's a reduced rate of one hundred and twenty.

Caller: I'm afraid I don't qualify for the discount. Do I need to bring my own camera?

Receptionist: Ideally, yes, although we do have a few cameras available to borrow for the first couple of weeks if you're not ready to buy one. You will need to bring a notebook and a memory card, though.

Caller: That's helpful. When does the course start?

Receptionist: The next course begins on the fourth of March. I'd recommend enrolling soon, as places are limited to twelve students per class.

Caller: Great, I'll sign up today. Could you send me the enrolment form by email?

Receptionist: Certainly. Could I take your email address?`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which course does the caller choose?',
        options: [
          'The intermediate course on Thursdays',
          'The beginners\' course on Tuesdays',
          'A weekend course',
          'An online course',
        ],
        correct: 1,
        explanation: 'The caller is "a complete beginner," so chooses "the Tuesday one."',
      },
      {
        id: 2, type: 'mcq',
        question: 'Who qualifies for the reduced rate?',
        options: [
          'Everyone who enrols early',
          'Students or people over sixty-five',
          'Only beginners',
          'People who own a camera',
        ],
        correct: 1,
        explanation: 'The reduced rate is for "a student or over sixty-five."',
      },
      {
        id: 3, type: 'mcq',
        question: 'What must the caller bring to the course?',
        options: [
          'A laptop and printer',
          'A notebook and a memory card',
          'Nothing at all',
          'A tripod',
        ],
        correct: 1,
        explanation: 'They "will need to bring a notebook and a memory card."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The full course fee is £____.',
        answer: '180',
        explanation: '"The full fee is one hundred and eighty pounds."',
      },
      {
        id: 5, type: 'form_completion',
        instruction: 'Complete the note with A NUMBER.',
        question: 'Maximum class size: ____ students',
        answer: '12',
        explanation: 'Places "are limited to twelve students per class."',
      },
    ],
  },
  {
    id: 'l14',
    section: 'Section 4',
    title: 'Lecture: Why We Yawn',
    context: 'Một bài giảng học thuật về hiện tượng ngáp và các giả thuyết khoa học giải thích nó.',
    xpReward: 45,
    transcript: `In today's session, we'll examine a behaviour that everyone experiences but few truly understand: yawning.

Yawning is remarkably widespread in the animal kingdom. It is observed not only in humans but also in mammals, birds, reptiles, and even fish, which suggests it is a very ancient and fundamental behaviour. Yet despite how common it is, scientists still cannot fully agree on why we do it.

For many years, the most popular explanation was that yawning increases oxygen levels in the blood. However, this theory has largely been discredited, as studies have found no significant difference in yawning rates when people breathe air with different oxygen concentrations.

A more recent and widely supported hypothesis is that yawning helps to cool the brain. According to this view, the deep intake of air and the stretching of the jaw increase blood flow and bring cooler air into the body, helping to regulate brain temperature. Supporting this idea, researchers have found that people yawn more when the surrounding temperature is moderate than when it is very hot or very cold.

Perhaps the most intriguing aspect of yawning is that it is contagious. Simply seeing, hearing, or even reading about yawning can trigger it — as some of you may be discovering right now. Scientists believe that contagious yawning is linked to empathy, as it occurs more frequently between individuals who are emotionally close, and it is less common in young children and in people with certain social difficulties.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What does the wide range of animals that yawn suggest?',
        options: [
          'Yawning is a recent behaviour',
          'Yawning is an ancient and fundamental behaviour',
          'Only mammals yawn',
          'Yawning is harmful',
        ],
        correct: 1,
        explanation: 'Yawning across many animals "suggests it is a very ancient and fundamental behaviour."',
      },
      {
        id: 2, type: 'mcq',
        question: 'Why has the oxygen theory of yawning been discredited?',
        options: [
          'Yawning was found to reduce oxygen',
          'No difference was found in yawning rates with different oxygen levels',
          'People stopped yawning in experiments',
          'It was never tested',
        ],
        correct: 1,
        explanation: 'Studies "found no significant difference in yawning rates when people breathe air with different oxygen concentrations."',
      },
      {
        id: 3, type: 'mcq',
        question: 'According to the brain-cooling hypothesis, when do people yawn most?',
        options: [
          'When it is very hot',
          'When it is very cold',
          'When the temperature is moderate',
          'Only when tired',
        ],
        correct: 2,
        explanation: 'People "yawn more when the surrounding temperature is moderate than when it is very hot or very cold."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with ONE WORD.',
        question: 'Contagious yawning is believed to be linked to ____.',
        answer: 'empathy',
        explanation: '"Contagious yawning is linked to empathy."',
      },
      {
        id: 5, type: 'form_completion',
        instruction: 'Complete the note with ONE WORD.',
        question: 'A recent hypothesis: yawning helps to ____ the brain.',
        answer: 'cool',
        explanation: 'The hypothesis is that "yawning helps to cool the brain."',
      },
    ],
  },
  {
    id: 'l15',
    section: 'Section 2',
    title: 'Volunteer Programme Briefing',
    context: 'Điều phối viên giới thiệu chương trình tình nguyện cho những người mới tham gia.',
    xpReward: 40,
    transcript: `Hello, everyone, and welcome to the volunteer induction for the Green City Project. I'm Sophie, the volunteer coordinator, and I'll explain how everything works.

Our project has three main areas of activity. The first is tree planting, which takes place in the city's parks every Saturday morning. The second is the community garden, where volunteers grow vegetables that are donated to local food banks. The third, and newest, is the recycling education team, which visits schools to teach children about reducing waste.

You can volunteer for as many or as few sessions as you like — there's no minimum commitment, although we do ask that you let us know in advance if you can't attend a session you've signed up for, so we can plan properly.

All equipment, such as gloves, tools, and high-visibility vests, is provided, so you don't need to bring anything except suitable outdoor clothing and sturdy footwear. We also recommend bringing a refillable water bottle, as it can get quite warm in summer.

In terms of training, no experience is necessary. Each new volunteer is paired with an experienced team member for their first three sessions. We also run a free first-aid workshop once a month, which is optional but highly recommended.

Finally, to thank our volunteers, we hold a celebration event at the end of each year, and anyone who completes more than fifty hours receives a certificate. If you have any questions, please come and see me at the front desk after this talk.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What does the community garden team do with the vegetables they grow?',
        options: [
          'Sell them at a market',
          'Donate them to local food banks',
          'Use them for cooking classes',
          'Give them to volunteers',
        ],
        correct: 1,
        explanation: 'They grow vegetables "that are donated to local food banks."',
      },
      {
        id: 2, type: 'mcq',
        question: 'What does the coordinator ask volunteers to do if they cannot attend?',
        options: [
          'Find a replacement',
          'Let the team know in advance',
          'Pay a small fee',
          'Nothing at all',
        ],
        correct: 1,
        explanation: 'Volunteers should "let us know in advance if you can\'t attend a session you\'ve signed up for."',
      },
      {
        id: 3, type: 'mcq',
        question: 'What should volunteers bring themselves?',
        options: [
          'Gloves and tools',
          'High-visibility vests',
          'Suitable outdoor clothing and sturdy footwear',
          'First-aid kits',
        ],
        correct: 2,
        explanation: 'Equipment is provided, so volunteers only need "suitable outdoor clothing and sturdy footwear."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'Each new volunteer is paired with an experienced member for their first ____ sessions.',
        answer: '3',
        explanation: 'Each new volunteer "is paired with an experienced team member for their first three sessions."',
      },
      {
        id: 5, type: 'form_completion',
        instruction: 'Complete the note with A NUMBER.',
        question: 'Volunteers who complete more than ____ hours receive a certificate.',
        answer: '50',
        explanation: '"Anyone who completes more than fifty hours receives a certificate."',
      },
    ],
  },
  {
    id: 'l16',
    section: 'Section 3',
    title: 'Preparing a Group Presentation',
    context: 'Ba sinh viên thảo luận về việc phân chia công việc cho bài thuyết trình nhóm.',
    xpReward: 45,
    transcript: `Lena: Right, so we need to plan our presentation on renewable energy. It's due in two weeks, and it has to be twenty minutes long.

Tom: Twenty minutes between the three of us — that's not too bad. Shall we each take a section?

Lena: Good idea. I'm happy to cover the introduction and the background on why renewable energy matters.

Priya: I could do the middle section on the different types — solar, wind, and hydro. I've already read quite a lot about that.

Tom: That leaves me with the final part. I'll look at the challenges and the future outlook, and I can also handle the conclusion.

Lena: Perfect. What about visuals? I think we should keep the slides simple — too much text is a common mistake.

Priya: Agreed. Maybe a maximum of five or six words per slide, and lots of clear images and graphs.

Tom: Should we rehearse together beforehand?

Lena: Definitely. Presentations always go better with practice, and it helps with timing. How about we meet on the Wednesday before, so we've got a few days to fix any problems?

Priya: That works for me. Oh, and we mustn't forget to cite our sources — last time we lost marks for that.

Tom: Good point. I'll create a shared document where we can all add our references as we go.

Lena: Excellent. Let's aim to have our individual sections drafted by next Monday.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which part of the presentation will Priya prepare?',
        options: [
          'The introduction and background',
          'The different types of renewable energy',
          'The challenges and conclusion',
          'The references only',
        ],
        correct: 1,
        explanation: 'Priya offers to "do the middle section on the different types — solar, wind, and hydro."',
      },
      {
        id: 2, type: 'mcq',
        question: 'What common mistake do they want to avoid with their slides?',
        options: [
          'Using too many images',
          'Having too much text',
          'Making slides too colourful',
          'Using no graphs',
        ],
        correct: 1,
        explanation: 'Lena says "too much text is a common mistake."',
      },
      {
        id: 3, type: 'mcq',
        question: 'Why do they decide to rehearse together?',
        options: [
          'It is required by the tutor',
          'It helps with timing and fixing problems',
          'To memorise the slides',
          'To reduce the length',
        ],
        correct: 1,
        explanation: 'Practice "helps with timing" and gives time "to fix any problems."',
      },
      {
        id: 4, type: 'gap_fill',
        instruction: 'Complete the sentence with A NUMBER.',
        question: 'The presentation must be ____ minutes long.',
        answer: '20',
        explanation: '"It has to be twenty minutes long."',
      },
      {
        id: 5, type: 'form_completion',
        instruction: 'Complete the note with ONE WORD.',
        question: 'They lost marks last time for failing to cite their ____.',
        answer: 'sources',
        explanation: '"We mustn\'t forget to cite our sources — last time we lost marks for that."',
      },
    ],
  },
]
