export const writingTasks = {
  task1: [
    {
      id: 'wt1_1',
      type: 'Line Graph',
      typeVi: 'Biểu đồ đường',
      emoji: '📈',
      title: 'Internet Usage in Vietnam (2005–2020)',
      prompt: 'The line graph below shows the percentage of the population in Vietnam who used the internet between 2005 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      chartDescription: 'Biểu đồ đường cho thấy tỉ lệ dân số Việt Nam dùng Internet (%) giai đoạn 2005–2020:\n• 2005: ~5%\n• 2008: ~10%\n• 2010: ~20%\n• 2013: ~35%\n• 2015: ~45%\n• 2018: ~60%\n• 2020: ~70%\nXu hướng: tăng liên tục, nhanh nhất 2008–2015.',
      xpReward: 60,
      template: `**STRUCTURE (Band 5.5–6.0)**

Paragraph 1 – Introduction (paraphrase)
→ "The line graph illustrates [what] over [time period]."

Paragraph 2 – Overview (2 main trends, NO data)
→ "Overall, [main trend 1]. In addition, [main trend 2]."

Paragraph 3 – Body 1 (early period with data)
→ Describe beginning → mid-point with figures.

Paragraph 4 – Body 2 (later period with data)
→ Continue to end with comparison/peak/trough.

**KEY LANGUAGE:**
• rose / increased / grew (sharply / gradually / steadily)
• fell / decreased / dropped
• remained stable / levelled off
• reached a peak of / stood at / accounted for
• compared to / while / whereas / by contrast`,
      sampleAnswer: `The line graph illustrates the percentage of Vietnam's population who used the internet from 2005 to 2020.

Overall, internet usage in Vietnam increased dramatically over this fifteen-year period. The growth was particularly rapid between 2008 and 2015, before slowing slightly in later years.

In 2005, only approximately 5% of the population used the internet. This figure doubled to around 10% by 2008 and continued to rise, reaching roughly 20% in 2010. Growth then accelerated considerably, with usage climbing to approximately 35% in 2013 and 45% by 2015.

In the final five years of the period, internet usage continued its upward trend, although the rate of growth slowed somewhat. By 2018, around 60% of the population were internet users, and this figure rose further to nearly 70% by 2020.

In conclusion, Vietnam experienced a fourteen-fold increase in internet usage between 2005 and 2020, reflecting the country's rapid digitalisation and widespread adoption of smartphones.

[Word count: ~155]`,
      checklist: [
        { id: 'tr1', category: 'Task Achievement', item: 'Tôi đã viết ít nhất 150 từ' },
        { id: 'tr2', category: 'Task Achievement', item: 'Tôi đã giới thiệu biểu đồ bằng cách paraphrase đề bài (không copy nguyên văn)' },
        { id: 'tr3', category: 'Task Achievement', item: 'Tôi đã nêu overview (xu hướng chung) mà không dùng số liệu cụ thể' },
        { id: 'tr4', category: 'Task Achievement', item: 'Tôi đã đề cập các đặc điểm chính với số liệu cụ thể' },
        { id: 'cc1', category: 'Coherence', item: 'Tôi đã chia đoạn văn hợp lý (intro → overview → body)' },
        { id: 'cc2', category: 'Coherence', item: 'Tôi đã dùng từ nối (Overall, In addition, By contrast...)' },
        { id: 'lx1', category: 'Vocabulary', item: 'Tôi đã dùng nhiều hơn 1 từ để diễn tả "tăng" hoặc "giảm"' },
        { id: 'lx2', category: 'Vocabulary', item: 'Tôi không lặp lại từ quá nhiều' },
        { id: 'gr1', category: 'Grammar', item: 'Tôi kiểm tra lỗi subject-verb agreement' },
        { id: 'gr2', category: 'Grammar', item: 'Tôi đã dùng past tense phù hợp cho dữ liệu lịch sử' },
      ],
    },
    {
      id: 'wt1_2',
      type: 'Bar Chart',
      typeVi: 'Biểu đồ cột',
      emoji: '📊',
      title: 'Average Weekly Screen Time by Age Group',
      prompt: 'The bar chart below shows the average number of hours spent on screens per week by different age groups in a European country in 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      chartDescription: 'Biểu đồ cột so sánh thời gian dùng màn hình (giờ/tuần) năm 2022 theo độ tuổi:\n• 13–17 tuổi: 42 giờ\n• 18–24 tuổi: 38 giờ\n• 25–34 tuổi: 30 giờ\n• 35–44 tuổi: 24 giờ\n• 45–54 tuổi: 18 giờ\n• 55–64 tuổi: 12 giờ\n• 65+: 8 giờ\nNhóm trẻ nhất dùng nhiều nhất, nhóm cao tuổi nhất dùng ít nhất.',
      xpReward: 60,
      template: `**STRUCTURE (Band 5.5–6.0)**

Paragraph 1 – Introduction (paraphrase)
→ "The bar chart compares [what] in [place/time]."

Paragraph 2 – Overview (key contrasts, NO data)
→ "Overall, younger age groups spent considerably more time on screens than older groups."

Paragraph 3 – Body 1 (highest groups with comparison)
→ Describe the top 2–3 groups.

Paragraph 4 – Body 2 (remaining groups)
→ Describe middle to lowest groups.

**KEY LANGUAGE (comparisons):**
• significantly / considerably / slightly higher than
• twice as much as / three times more than
• the highest / the lowest / the second highest
• in contrast / while / whereas / compared to`,
      sampleAnswer: `The bar chart compares the average number of hours that people in different age groups spent on screens per week in a European country in 2022.

Overall, screen time decreased consistently with age, with the youngest group spending the most time on screens and the oldest group spending the least. The difference between the extremes was substantial.

Teenagers aged 13 to 17 recorded the highest screen time at 42 hours per week. Young adults aged 18 to 24 spent only slightly less time at 38 hours, while the 25 to 34 age group averaged 30 hours. This suggests that people under 35 were heavy screen users in general.

In contrast, screen use declined markedly among older groups. Adults aged 35 to 44 averaged 24 hours per week, while those in the 45 to 54 bracket spent just 18 hours. The 55 to 64 age group recorded 12 hours, and those aged 65 and over spent the fewest hours on screens at just 8 hours per week — approximately five times less than teenagers.

In summary, the data reveals a clear inverse relationship between age and screen time in this country.

[Word count: ~165]`,
      checklist: [
        { id: 'tr1', category: 'Task Achievement', item: 'Tôi đã viết ít nhất 150 từ' },
        { id: 'tr2', category: 'Task Achievement', item: 'Tôi đã paraphrase đề bài trong câu mở đầu' },
        { id: 'tr3', category: 'Task Achievement', item: 'Tôi đã viết overview nêu xu hướng tổng thể' },
        { id: 'tr4', category: 'Task Achievement', item: 'Tôi đã so sánh các nhóm với nhau' },
        { id: 'cc1', category: 'Coherence', item: 'Tôi đã nhóm dữ liệu hợp lý (không đề cập từng cột riêng lẻ)' },
        { id: 'cc2', category: 'Coherence', item: 'Tôi đã dùng từ nối tương phản (In contrast, while, whereas)' },
        { id: 'lx1', category: 'Vocabulary', item: 'Tôi đã dùng ngôn ngữ so sánh đa dạng (twice as much, significantly higher...)' },
        { id: 'gr1', category: 'Grammar', item: 'Tôi đã dùng comparative forms đúng (higher than, the highest...)' },
      ],
    },
    {
      id: 'wt1_3',
      type: 'Process Diagram',
      typeVi: 'Sơ đồ quy trình',
      emoji: '⚙️',
      title: 'How Recycled Paper Is Produced',
      prompt: 'The diagram below shows the process by which used paper is recycled into new paper. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      chartDescription: 'Sơ đồ quy trình tái chế giấy gồm 6 bước:\n1. Thu gom giấy đã qua sử dụng (waste paper collected)\n2. Phân loại theo loại giấy (sorted by grade)\n3. Trộn với nước thành bột giấy (mixed with water → pulp)\n4. Lọc bỏ mực và tạp chất (ink and impurities removed)\n5. Bột giấy được làm khô và ép thành tấm (dried and pressed into sheets)\n6. Cuộn thành giấy mới để sử dụng (rolled into new paper).\nĐây là quy trình tuần hoàn (cyclical process).',
      xpReward: 60,
      template: `**STRUCTURE – Process Diagram (Band 5.5–6.0)**

Paragraph 1 – Introduction (paraphrase)
→ "The diagram illustrates the process of [what], which involves [number] main stages."

Paragraph 2 – Overview (NO detail)
→ "Overall, the process begins with [first step] and ends with [last step]. It is a [linear/cyclical] process."

Paragraph 3 – Body 1 (first half of steps)
Paragraph 4 – Body 2 (remaining steps)

**KEY LANGUAGE (sequencing + passive):**
• First / Then / After that / Subsequently / Finally
• Once X has been done, Y takes place.
• The paper IS collected / IS mixed / IS dried (PASSIVE VOICE)
• This is followed by... / The next stage involves...`,
      sampleAnswer: `The diagram illustrates the process by which used paper is recycled and turned into new paper. Overall, the process consists of six distinct stages, beginning with the collection of waste paper and ending with the production of new paper. It is a cyclical process, as the final product can eventually re-enter the cycle.

At the first stage, used paper is collected from homes and businesses. Once gathered, the paper is sorted according to its grade, separating different types and qualities of paper.

After sorting, the paper is mixed with water to create a soft substance known as pulp. In the following stage, ink and other impurities are removed from this pulp to ensure the recycled paper is clean.

The cleaned pulp is then dried and pressed into thin sheets. Finally, these sheets are rolled into large reels of new paper, which are ready to be used once again, thereby completing the recycling cycle.

[Word count: ~150]`,
      checklist: [
        { id: 'tr1', category: 'Task Achievement', item: 'Tôi đã viết ít nhất 150 từ' },
        { id: 'tr2', category: 'Task Achievement', item: 'Tôi đã paraphrase đề bài trong câu mở đầu' },
        { id: 'tr3', category: 'Task Achievement', item: 'Tôi đã viết overview nêu điểm đầu, điểm cuối và loại quy trình (cyclical/linear)' },
        { id: 'tr4', category: 'Task Achievement', item: 'Tôi đã mô tả TẤT CẢ các bước theo đúng thứ tự' },
        { id: 'cc1', category: 'Coherence', item: 'Tôi đã dùng từ chỉ trình tự (First, Then, After that, Finally)' },
        { id: 'cc2', category: 'Coherence', item: 'Tôi đã chia đoạn hợp lý (intro → overview → body)' },
        { id: 'lx1', category: 'Vocabulary', item: 'Tôi đã dùng từ vựng đúng cho quy trình (pulp, impurities, sheets...)' },
        { id: 'gr1', category: 'Grammar', item: 'Tôi đã dùng câu BỊ ĐỘNG (passive voice) cho các bước' },
        { id: 'gr2', category: 'Grammar', item: 'Tôi đã dùng present simple cho quy trình chung' },
      ],
    },
    {
      id: 'wt1_4',
      type: 'Table',
      typeVi: 'Bảng số liệu',
      emoji: '📋',
      title: 'Household Spending in Three Countries',
      prompt: 'The table below shows the percentage of household income spent on three categories — food, housing, and leisure — in three countries in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      chartDescription: 'Bảng số liệu: % thu nhập hộ gia đình chi cho 3 nhóm năm 2023.\n• Country A — Food: 15%, Housing: 35%, Leisure: 20%\n• Country B — Food: 30%, Housing: 25%, Leisure: 10%\n• Country C — Food: 22%, Housing: 40%, Leisure: 8%\nNhận xét: Housing chiếm tỉ trọng lớn nhất ở A và C; Food cao nhất ở B; Leisure cao nhất ở A.',
      xpReward: 60,
      template: `**STRUCTURE – Table (Band 5.5–6.0)**

Paragraph 1 – Introduction (paraphrase)
→ "The table compares the proportion of household income spent on [categories] in [places] in [year]."

Paragraph 2 – Overview (key patterns, NO detail)
→ "Overall, housing represented the largest expense in most countries, while leisure accounted for the smallest share."

Paragraph 3 – Body 1 (group by highest figures)
Paragraph 4 – Body 2 (remaining comparisons)

**KEY LANGUAGE:**
• accounted for / represented / made up
• the largest / smallest proportion
• a significantly higher percentage than
• by comparison / whereas / in contrast
• spent X% of their income on...`,
      sampleAnswer: `The table compares the percentage of household income that families in three countries — A, B, and C — spent on food, housing, and leisure in 2023.

Overall, housing represented the largest expense in Countries A and C, whereas food consumed the greatest share of income in Country B. In all three countries, leisure accounted for a relatively small proportion of spending.

In Country A, housing made up the highest percentage at 35%, followed by leisure at 20% and food at just 15%. Country C showed a similar pattern, with housing dominating at 40% — the highest housing figure of all three — while food accounted for 22% and leisure for only 8%.

Country B, by contrast, presented a notably different picture. Here, food was the largest category at 30%, exceeding housing, which stood at 25%. Leisure spending in Country B, at 10%, was half that of Country A.

In summary, while housing and food were the dominant areas of household expenditure, the balance between them varied considerably from country to country.

[Word count: ~165]`,
      checklist: [
        { id: 'tr1', category: 'Task Achievement', item: 'Tôi đã viết ít nhất 150 từ' },
        { id: 'tr2', category: 'Task Achievement', item: 'Tôi đã paraphrase đề bài trong câu mở đầu' },
        { id: 'tr3', category: 'Task Achievement', item: 'Tôi đã viết overview nêu các xu hướng chính (không số liệu)' },
        { id: 'tr4', category: 'Task Achievement', item: 'Tôi đã chọn lọc và so sánh các số liệu nổi bật (không liệt kê hết)' },
        { id: 'cc1', category: 'Coherence', item: 'Tôi đã nhóm dữ liệu hợp lý theo quốc gia/danh mục' },
        { id: 'cc2', category: 'Coherence', item: 'Tôi đã dùng từ nối so sánh (whereas, by contrast, while)' },
        { id: 'lx1', category: 'Vocabulary', item: 'Tôi đã dùng nhiều cách diễn đạt tỉ lệ (accounted for, made up, represented)' },
        { id: 'gr1', category: 'Grammar', item: 'Tôi đã dùng past tense (dữ liệu năm 2023)' },
        { id: 'gr2', category: 'Grammar', item: 'Tôi đã dùng cấu trúc so sánh đúng (the highest, higher than)' },
      ],
    },
  ],
  task2: [
    {
      id: 'wt2_1',
      type: 'Opinion Essay',
      typeVi: 'Bài luận ý kiến',
      emoji: '💭',
      title: 'Living with Parents Until Marriage',
      prompt: 'In some cultures, young people are expected to live with their parents until they get married. Other people believe that young adults should live independently as soon as possible. Discuss both views and give your own opinion.',
      xpReward: 60,
      template: `**STRUCTURE – Discussion + Opinion (Band 5.5–6.0)**

Paragraph 1 – Introduction
→ Paraphrase + state your opinion clearly.
→ "While some argue that [view 1], I believe [your view]."

Paragraph 2 – View 1 (living with parents)
→ Reason 1 + example/explanation

Paragraph 3 – View 2 / Your view (living independently)
→ Reason 1 + example
→ Reason 2 + example

Paragraph 4 – Conclusion
→ Restate opinion + brief summary.

**KEY LANGUAGE:**
• Those who argue... / Proponents of...
• However, I would argue that...
• Furthermore / Moreover / In addition
• It is widely believed that... / Some people contend that...
• In conclusion / To sum up`,
      sampleAnswer: `In many Asian cultures, it is traditional for young people to remain in the family home until marriage. However, in Western societies, early independence is generally encouraged. While there are clear benefits to both approaches, I firmly believe that living independently better prepares young adults for the challenges of modern life.

Those who support living with parents often cite financial advantages. Housing costs in many major cities are extremely high, and sharing a family home allows young people to save money more effectively. Moreover, in cultures where family bonds are highly valued, living together can strengthen relationships and provide emotional support during difficult times.

Despite these points, I would argue that the benefits of independent living are more significant. Firstly, managing a household alone — paying bills, cooking, and resolving problems without parental assistance — develops crucial life skills that cannot be learned otherwise. Young adults who live independently tend to be more self-reliant and confident. Secondly, having personal space gives people the freedom to focus on their careers and take opportunities, such as working in a different city, without family obligations holding them back.

Furthermore, early independence promotes personal growth. When young people are responsible for their own decisions and consequences, they mature more quickly and develop a stronger sense of personal identity.

In conclusion, while living with parents offers some practical benefits, I believe that the independence gained from living alone is ultimately more valuable in preparing young adults for the realities of adult life.

[Word count: ~255]`,
      checklist: [
        { id: 'tr1', category: 'Task Achievement', item: 'Tôi đã viết ít nhất 250 từ' },
        { id: 'tr2', category: 'Task Achievement', item: 'Tôi đã trả lời đúng yêu cầu: thảo luận CẢ HAI quan điểm VÀ đưa ra ý kiến' },
        { id: 'tr3', category: 'Task Achievement', item: 'Ý kiến của tôi được nêu rõ ràng trong phần intro và kết luận' },
        { id: 'cc1', category: 'Coherence', item: 'Bài của tôi có ít nhất 4 đoạn văn (intro, body 1, body 2, conclusion)' },
        { id: 'cc2', category: 'Coherence', item: 'Mỗi đoạn có ý chính rõ ràng và dẫn chứng/giải thích' },
        { id: 'cc3', category: 'Coherence', item: 'Tôi đã dùng từ nối giữa các đoạn và trong đoạn' },
        { id: 'lx1', category: 'Vocabulary', item: 'Tôi đã tránh lặp lại từ giống nhau trong bài' },
        { id: 'lx2', category: 'Vocabulary', item: 'Tôi đã dùng ít nhất 3–4 từ học thuật / từ cấp độ cao' },
        { id: 'gr1', category: 'Grammar', item: 'Tôi đã dùng nhiều hơn 1 cấu trúc ngữ pháp (complex sentences)' },
        { id: 'gr2', category: 'Grammar', item: 'Tôi kiểm tra lỗi thì động từ và article (a/an/the)' },
      ],
    },
    {
      id: 'wt2_2',
      type: 'Problem / Solution',
      typeVi: 'Vấn đề và Giải pháp',
      emoji: '🔧',
      title: 'Traffic Congestion in Modern Cities',
      prompt: 'Traffic congestion is becoming a major problem in many cities around the world. What are the causes of this problem? What measures can be taken to solve it?',
      xpReward: 60,
      template: `**STRUCTURE – Problem/Solution (Band 5.5–6.0)**

Paragraph 1 – Introduction
→ Paraphrase the problem + state you will discuss causes and solutions.

Paragraph 2 – Causes (2–3 causes)
→ Cause 1 + explanation
→ Cause 2 + explanation
→ [Cause 3 optional]

Paragraph 3 – Solutions (2–3 solutions)
→ Solution 1 + how it helps
→ Solution 2 + how it helps
→ [Solution 3 optional]

Paragraph 4 – Conclusion
→ Briefly summarise key points.

**KEY LANGUAGE:**
• A primary cause of... is...
• This is largely due to...
• One effective solution would be to...
• Governments could / should / need to...
• If [action], then [result]...`,
      sampleAnswer: `Traffic congestion has become one of the most pressing urban challenges of the 21st century, with commuters in many major cities losing hundreds of hours each year to gridlocked roads. This essay will examine the key causes of this problem and propose practical solutions.

There are several factors contributing to traffic congestion. The most significant is the rapid increase in private car ownership. As incomes have risen in many developing countries, more families have purchased their own vehicles, placing enormous pressure on road networks that were not designed for such high volumes. Another major cause is inadequate public transportation. In cities where buses and trains are unreliable, overcrowded, or expensive, people have little incentive to abandon their cars. Additionally, poor urban planning, such as the separation of residential and commercial areas, forces residents to travel long distances for work, shopping, and services.

Addressing these issues requires a combination of measures. Firstly, governments should invest heavily in expanding and improving public transport networks. If buses and trains are fast, affordable, and comfortable, more commuters will choose them over private vehicles. Secondly, congestion pricing — charging drivers a fee to enter city centres during peak hours — has proven effective in cities such as London and Singapore, reducing traffic volumes by up to 30%. Finally, promoting remote working and flexible hours can help distribute traffic more evenly throughout the day, reducing pressure at peak times.

In conclusion, while traffic congestion is a complex problem with multiple causes, a combination of improved public transport, smart pricing, and flexible work policies can significantly reduce its impact on urban life.

[Word count: ~265]`,
      checklist: [
        { id: 'tr1', category: 'Task Achievement', item: 'Tôi đã viết ít nhất 250 từ' },
        { id: 'tr2', category: 'Task Achievement', item: 'Tôi đã đề cập ít nhất 2 nguyên nhân với giải thích' },
        { id: 'tr3', category: 'Task Achievement', item: 'Tôi đã đề cập ít nhất 2 giải pháp với giải thích' },
        { id: 'cc1', category: 'Coherence', item: 'Bài của tôi có cấu trúc rõ ràng: intro → causes → solutions → conclusion' },
        { id: 'cc2', category: 'Coherence', item: 'Tôi đã dùng từ nối liệt kê (Firstly, Secondly, Additionally...)' },
        { id: 'lx1', category: 'Vocabulary', item: 'Tôi đã paraphrase từ "problem" và "solve" bằng các từ khác' },
        { id: 'lx2', category: 'Vocabulary', item: 'Tôi đã dùng ví dụ cụ thể trong giải pháp' },
        { id: 'gr1', category: 'Grammar', item: 'Tôi đã dùng conditional sentences (If..., then...) ít nhất một lần' },
        { id: 'gr2', category: 'Grammar', item: 'Tôi kiểm tra lỗi subject-verb agreement và sentence fragments' },
      ],
    },
    {
      id: 'wt2_3',
      type: 'Advantages / Disadvantages',
      typeVi: 'Lợi ích và Bất lợi',
      emoji: '⚖️',
      title: 'Working from Home',
      prompt: 'An increasing number of people now work from home rather than in a traditional office. Do the advantages of this development outweigh the disadvantages?',
      xpReward: 60,
      template: `**STRUCTURE – Advantages/Disadvantages (Band 5.5–6.0)**

Paragraph 1 – Introduction
→ Paraphrase + state your position (do advantages outweigh disadvantages?).

Paragraph 2 – Advantages
→ Advantage 1 + explanation/example
→ Advantage 2 + explanation

Paragraph 3 – Disadvantages
→ Disadvantage 1 + explanation
→ Disadvantage 2 + explanation

Paragraph 4 – Conclusion
→ Restate your position clearly (which side outweighs).

**KEY LANGUAGE:**
• One of the main benefits / drawbacks is...
• A further advantage is that...
• On the downside / Conversely...
• outweigh / counterbalance
• On balance, I believe that...`,
      sampleAnswer: `Over the past decade, and particularly since the pandemic, working from home has shifted from a rare privilege to a mainstream practice. While this trend has some clear drawbacks, I believe that its advantages ultimately outweigh them.

The benefits of remote work are considerable. The most obvious advantage is flexibility. Employees can organise their schedules around personal commitments, which often leads to a better work-life balance and reduced stress. Furthermore, working from home eliminates the daily commute, saving people both time and money while also reducing traffic congestion and carbon emissions. For employers, there are savings too, as less office space is required.

Nevertheless, there are genuine disadvantages. The most significant is the blurring of boundaries between work and personal life; without a clear separation, some employees end up working longer hours and struggle to switch off. In addition, remote work can be isolating. The lack of face-to-face interaction with colleagues may weaken teamwork and harm mental wellbeing, particularly for those who live alone.

On balance, however, I am convinced that the advantages are more substantial. Many of the disadvantages, such as isolation and overwork, can be managed through good habits and company policies, for example by scheduling regular team meetings and setting clear working hours. The fundamental benefits of flexibility, time saved, and environmental impact, by contrast, are difficult to replicate in a traditional office.

In conclusion, although working from home presents certain challenges, its considerable benefits for employees, employers, and the environment mean that, in my view, the advantages clearly outweigh the disadvantages.

[Word count: ~270]`,
      checklist: [
        { id: 'tr1', category: 'Task Achievement', item: 'Tôi đã viết ít nhất 250 từ' },
        { id: 'tr2', category: 'Task Achievement', item: 'Tôi đã nêu rõ quan điểm: lợi ích CÓ/KHÔNG vượt trội bất lợi' },
        { id: 'tr3', category: 'Task Achievement', item: 'Tôi đã trình bày cả advantages VÀ disadvantages' },
        { id: 'cc1', category: 'Coherence', item: 'Bài có 4 đoạn rõ ràng (intro → advantages → disadvantages → conclusion)' },
        { id: 'cc2', category: 'Coherence', item: 'Tôi đã dùng từ nối tương phản (However, Nevertheless, Conversely)' },
        { id: 'lx1', category: 'Vocabulary', item: 'Tôi đã dùng "outweigh" và các từ đánh giá (considerable, significant)' },
        { id: 'lx2', category: 'Vocabulary', item: 'Tôi đã tránh lặp từ "advantage/disadvantage" quá nhiều' },
        { id: 'gr1', category: 'Grammar', item: 'Tôi đã dùng câu phức và mệnh đề quan hệ' },
        { id: 'gr2', category: 'Grammar', item: 'Tôi kiểm tra lỗi thì động từ và article (a/an/the)' },
      ],
    },
    {
      id: 'wt2_4',
      type: 'Two-Part Question',
      typeVi: 'Câu hỏi hai phần',
      emoji: '❓',
      title: 'The Decline of Reading for Pleasure',
      prompt: 'In many countries, fewer people are reading books for pleasure, especially among young people. Why might this be the case? What can be done to encourage more people to read?',
      xpReward: 60,
      template: `**STRUCTURE – Two-Part Question (Band 5.5–6.0)**

Paragraph 1 – Introduction
→ Paraphrase the situation + state you will address both questions.

Paragraph 2 – Answer Part 1 (reasons / why)
→ Reason 1 + explanation
→ Reason 2 + explanation

Paragraph 3 – Answer Part 2 (solutions / what can be done)
→ Solution 1 + how it helps
→ Solution 2 + how it helps

Paragraph 4 – Conclusion
→ Summarise the main reason and the main solution.

**KEY LANGUAGE:**
• One possible reason for this is...
• This can largely be attributed to...
• To address this, schools/parents could...
• A practical step would be to...
• In conclusion, although... , ...`,
      sampleAnswer: `In recent years, reading books for pleasure has become less popular, particularly among younger generations. This essay will explore the reasons behind this trend and suggest some practical ways to reverse it.

There are several reasons why fewer people read for enjoyment. The most significant is undoubtedly the rise of digital entertainment. Smartphones, streaming services, and social media offer instant, effortless stimulation, which makes the slower, more demanding activity of reading seem less appealing by comparison. A further reason is the pressure of modern life. Many young people are overwhelmed by academic workloads and extracurricular commitments, leaving them with little time or mental energy to sit down with a book.

Nevertheless, there are effective measures that could encourage more reading. Firstly, schools play a crucial role and should foster a love of reading from an early age, for example by allowing students to choose books that genuinely interest them rather than forcing them to study texts they find dull. Secondly, parents can set a positive example by reading themselves and creating a home environment in which books are valued. Public initiatives, such as well-funded libraries and community reading events, can also make books more accessible and reading more sociable.

In conclusion, while the decline in reading is largely driven by the appeal of digital media and busy lifestyles, encouraging greater choice in schools and stronger support at home could do much to revive interest in reading for pleasure.

[Word count: ~260]`,
      checklist: [
        { id: 'tr1', category: 'Task Achievement', item: 'Tôi đã viết ít nhất 250 từ' },
        { id: 'tr2', category: 'Task Achievement', item: 'Tôi đã trả lời CẢ HAI câu hỏi (lý do VÀ giải pháp)' },
        { id: 'tr3', category: 'Task Achievement', item: 'Mỗi phần có ít nhất 2 ý được giải thích' },
        { id: 'cc1', category: 'Coherence', item: 'Bài có 4 đoạn rõ ràng, mỗi phần trả lời 1 câu hỏi' },
        { id: 'cc2', category: 'Coherence', item: 'Tôi đã dùng từ nối phù hợp (Firstly, A further reason, Nevertheless)' },
        { id: 'lx1', category: 'Vocabulary', item: 'Tôi đã paraphrase đề bài thay vì copy nguyên văn' },
        { id: 'lx2', category: 'Vocabulary', item: 'Tôi đã dùng từ vựng đa dạng, tránh lặp' },
        { id: 'gr1', category: 'Grammar', item: 'Tôi đã dùng câu phức và mệnh đề quan hệ' },
        { id: 'gr2', category: 'Grammar', item: 'Tôi kiểm tra lỗi thì động từ và sự hòa hợp chủ-vị' },
      ],
    },
  ],
}
