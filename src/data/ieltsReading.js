export const readingPassages = [
  {
    id: 'r1',
    title: 'The Rise of Urban Farming',
    level: 'Band 5.0–5.5',
    wordCount: 260,
    xpReward: 50,
    passage: `Urban farming — the practice of growing food within cities — has gained remarkable momentum over the past two decades. Driven by concerns about **food security**, **sustainability**, and the desire for fresher produce, city dwellers across the globe are transforming rooftops, abandoned lots, and even vertical walls into productive growing spaces.

One of the key advantages of urban farming is its ability to reduce the **environmental impact** of food production. By growing food close to where it is consumed, urban farms significantly cut the carbon emissions associated with long-distance transportation. Studies suggest that food transported over long distances can account for up to 11% of total greenhouse gas emissions in the food system.

Urban farms also contribute to mental health and community wellbeing. Research from the University of Exeter found that people who regularly engage in gardening activities report lower levels of stress and greater feelings of **community cohesion**. In densely populated cities, shared growing spaces create opportunities for social interaction that might otherwise be absent.

However, urban farming does face significant **challenges**. Land in cities is expensive, and many urban farmers struggle to obtain affordable space. Additionally, soil **contamination** from industrial activity can make growing food in some urban areas hazardous without expensive remediation. Water availability is another concern, as urban agriculture can place considerable demands on municipal water supplies.

Despite these obstacles, governments in several countries, including Singapore, the Netherlands, and Canada, have begun offering **subsidies** and dedicated zones for urban farming. As **technology** improves, vertical farms using LED lighting and hydroponic systems are making urban food production increasingly viable, even in the most crowded cities.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'Urban farming has only recently become popular in the last few years.',
        answer: 'False',
        explanation: 'The passage says it has gained momentum "over the past two decades" — not just a few years.'
      },
      {
        id: 2, type: 'tfng',
        statement: 'Food transported over long distances accounts for up to 11% of greenhouse gas emissions in the food system.',
        answer: 'True',
        explanation: 'The passage states: "food transported over long distances can account for up to 11% of total greenhouse gas emissions in the food system."'
      },
      {
        id: 3, type: 'tfng',
        statement: 'All urban soil is safe for growing food without any preparation.',
        answer: 'False',
        explanation: 'The passage warns that soil contamination "can make growing food in some urban areas hazardous without expensive remediation."'
      },
      {
        id: 4, type: 'mcq',
        question: 'According to the passage, what is ONE benefit of urban farming for mental health?',
        options: [
          'It provides a source of income for urban residents',
          'It reduces stress and increases feelings of community cohesion',
          'It eliminates the need for supermarkets',
          'It improves air quality in cities'
        ],
        correct: 1,
        explanation: 'The passage cites research showing people who garden "report lower levels of stress and greater feelings of community cohesion."'
      },
      {
        id: 5, type: 'mcq',
        question: 'What is the main purpose of government subsidies for urban farming mentioned in the final paragraph?',
        options: [
          'To make urban farming more commercially profitable',
          'To encourage and support the development of urban agriculture',
          'To replace traditional rural farming',
          'To reduce unemployment in cities'
        ],
        correct: 1,
        explanation: 'Governments offering "subsidies and dedicated zones" is presented as supporting the growth of urban farming despite its challenges.'
      },
      {
        id: 81,
        type: "matching_headings",
        instruction: "Match each paragraph to the correct heading.",
        paragraphLabel: "Paragraph A",
        options: [
          "i. The benefits of vertical farming",
          "ii. Urban farming as a global movement",
          "iii. Challenges of urban soil",
          "iv. Reducing food miles",
        ],
        answer: 1,
        answerKey: "ii. Urban farming as a global movement",
        explanation: "Paragraph A introduces urban farming worldwide."
      },
      {
        id: 82,
        type: "matching_features",
        instruction: "Match the description to the correct option.",
        question: "What contributes up to 11% of greenhouse emissions in the food system?",
        options: [
          "Food packaging",
          "Long-distance food transport",
          "Urban farms",
          "Soil contamination",
        ],
        answer: 1,
        explanation: "The passage states long-distance transport accounts for up to 11%."
      }
    ],
  },
  {
    id: 'r2',
    title: 'The Electric Vehicle Revolution',
    level: 'Band 5.5–6.0',
    wordCount: 275,
    xpReward: 50,
    passage: `The **transition** to electric vehicles (EVs) represents one of the most significant shifts in **transportation** since the invention of the internal combustion engine. Global EV sales surpassed ten million units in 2022, and analysts **project** this figure will grow to over 40 million by 2030, fundamentally reshaping the automotive industry.

The environmental **case** for EVs is compelling. When charged using renewable electricity, an electric car produces virtually zero direct carbon emissions over its lifetime. Even when powered by electricity from fossil fuels, EVs typically emit around 50% less carbon dioxide than comparable petrol vehicles, owing to the greater **efficiency** of electric motors.

Nevertheless, the EV industry faces persistent challenges. The upfront cost of electric vehicles remains considerably higher than petrol equivalents, placing them out of reach for many **consumers** in lower-income brackets. Although battery prices have fallen by 90% since 2010, further reductions are needed to achieve true price **parity** with conventional vehicles.

Charging **infrastructure** also presents a major obstacle. In many regions, public charging networks are insufficient, and the time required to recharge a vehicle remains far longer than refuelling with petrol. Range anxiety — the fear of running out of power before reaching a charging point — continues to deter potential buyers.

**Governments** have responded with a mix of financial incentives, including purchase subsidies and tax breaks, alongside regulatory measures such as banning the sale of new petrol cars from 2035 in the European Union. These policies are accelerating **adoption**, but ensuring equitable access to EV technology across different income groups remains an **unresolved** challenge.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'According to the passage, how much less carbon dioxide do EVs emit compared to petrol cars when powered by fossil fuel electricity?',
        options: ['Around 20% less', 'Around 30% less', 'Around 50% less', 'Around 70% less'],
        correct: 2,
        explanation: 'The passage states EVs "typically emit around 50% less carbon dioxide than comparable petrol vehicles."'
      },
      {
        id: 2, type: 'mcq',
        question: 'By how much have battery prices fallen since 2010?',
        options: ['40%', '60%', '75%', '90%'],
        correct: 3,
        explanation: 'The passage clearly states: "battery prices have fallen by 90% since 2010."'
      },
      {
        id: 3, type: 'tfng',
        statement: 'Range anxiety is the main reason people do not buy electric vehicles.',
        answer: 'Not Given',
        explanation: 'The passage says range anxiety "continues to deter potential buyers" but does not state it is the MAIN reason. High cost is also mentioned.'
      },
      {
        id: 4, type: 'tfng',
        statement: 'The European Union plans to ban the sale of new petrol cars from 2035.',
        answer: 'True',
        explanation: 'The passage explicitly states: "banning the sale of new petrol cars from 2035 in the European Union."'
      },
      {
        id: 5, type: 'sentence_completion',
        instruction: 'Complete the sentence using NO MORE THAN TWO WORDS from the passage:',
        stem: 'The fear of running out of power before reaching a charging point is known as ______.',
        answer: 'range anxiety',
        explanation: 'The passage defines this: "Range anxiety — the fear of running out of power before reaching a charging point."'
      },
    ],
  },
  {
    id: 'r3',
    title: 'Protecting Cultural Heritage in the Digital Age',
    level: 'Band 6.0',
    wordCount: 280,
    xpReward: 50,
    passage: `In an era defined by rapid technological change, the **preservation** of cultural heritage has taken on new urgency and new possibilities. Museums, libraries, and government agencies worldwide are investing heavily in digital technologies to safeguard artefacts, manuscripts, and architectural sites that face threats from **deterioration**, conflict, and natural disaster.

The benefits of digital **preservation** are substantial. High-resolution scanning technology can capture objects in extraordinary detail, creating records that will outlast the physical originals. The British Museum, for example, has digitised over four million of its **artefacts**, making them freely accessible to researchers worldwide. Such initiatives democratise access to cultural knowledge that was previously restricted to those who could afford to travel.

However, critics argue that digital copies, however **sophisticated**, cannot fully substitute for the physical experience of engaging with authentic objects. The tactile qualities of a centuries-old manuscript or the spatial atmosphere of a historic building are dimensions that no digital **reproduction** can adequately convey. Furthermore, digital files themselves are vulnerable to **obsolescence** — storage formats that are standard today may be unreadable within decades.

Another concern relates to cultural **sovereignty**. Many digitisation projects are led by institutions in wealthy nations, raising questions about who ultimately controls the digital **representations** of other cultures' heritage. Indigenous communities, in particular, have called for greater agency over how their cultural materials are digitised and shared.

Despite these tensions, most heritage professionals agree that digital technology, used responsibly, represents an invaluable tool for ensuring that human cultural achievements are not lost to future generations. The key lies in treating digitisation as a **complement** to physical preservation, rather than a replacement for it.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'The British Museum has made all of its artefacts available online.',
        answer: 'False',
        explanation: 'The passage says the British Museum has digitised "over four million of its artefacts" — not all of them.'
      },
      {
        id: 2, type: 'tfng',
        statement: 'Digital files can become unreadable over time due to changes in storage formats.',
        answer: 'True',
        explanation: 'The passage states: "digital files themselves are vulnerable to obsolescence — storage formats that are standard today may be unreadable within decades."'
      },
      {
        id: 3, type: 'tfng',
        statement: 'All heritage professionals are opposed to digital preservation.',
        answer: 'False',
        explanation: 'The passage says "most heritage professionals agree that digital technology...represents an invaluable tool" — the opposite of opposing it.'
      },
      {
        id: 4, type: 'mcq',
        question: 'What concern do indigenous communities have about digitisation projects?',
        options: [
          'The quality of digital images is too low',
          'They want greater control over how their cultural materials are shared',
          'Digitisation is too expensive',
          'Digital preservation replaces physical museums'
        ],
        correct: 1,
        explanation: 'The passage states: "Indigenous communities...have called for greater agency over how their cultural materials are digitised and shared."'
      },
      {
        id: 5, type: 'mcq',
        question: 'What is the writer\'s overall view on digital preservation?',
        options: [
          'It is a waste of money and should be stopped',
          'It should completely replace physical preservation',
          'It is a valuable tool when used alongside physical preservation',
          'It is only useful for wealthy nations'
        ],
        correct: 2,
        explanation: 'The passage concludes that digitisation should be "a complement to physical preservation, rather than a replacement for it."'
      },
    ],
  },
  {
    id: 'r4',
    title: 'The Science of Sleep',
    level: 'Band 6.0',
    wordCount: 285,
    xpReward: 50,
    passage: `Sleep is one of the most fundamental biological processes, yet it remains one of the least understood. For much of the twentieth century, scientists viewed sleep as a passive state — a simple shutdown of brain activity. Modern research has thoroughly **overturned** this view, revealing sleep to be an extraordinarily active and complex process essential for physical health, cognitive function, and emotional wellbeing.

During sleep, the brain cycles through distinct stages, broadly categorised into **non-REM** (non-rapid eye movement) and REM (rapid eye movement) sleep. Non-REM sleep, which occupies the majority of a night's sleep, is associated with physical restoration — the body repairs tissues, strengthens the **immune system**, and consolidates memories. REM sleep, characterised by vivid dreaming, plays a critical role in emotional processing and creative thinking.

Research has consistently shown that **chronic** sleep deprivation carries severe health consequences. Adults who regularly sleep fewer than seven hours per night face significantly elevated risks of obesity, type 2 diabetes, cardiovascular disease, and **cognitive decline**. The immune system is particularly vulnerable; even a single night of poor sleep can reduce the effectiveness of **natural killer cells** — a key component of immune defence — by up to 70%.

Despite this evidence, many modern societies continue to undervalue sleep. Cultural narratives in many countries celebrate **productivity** and long working hours, implicitly treating sleep as a form of laziness or lost time. Some research suggests that sleep loss costs the United States economy over 400 billion dollars annually in lost productivity — a striking **paradox**, given that the solution would simply involve sleeping more.

Scientists and public health experts increasingly argue that sleep should be treated as a public health priority, alongside diet and **exercise**, rather than a personal lifestyle choice.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'Scientists in the twentieth century believed sleep was a very active process.',
        answer: 'False',
        explanation: 'The passage states scientists viewed sleep as "a passive state — a simple shutdown of brain activity."',
      },
      {
        id: 2, type: 'mcq',
        question: 'What does REM sleep primarily help with, according to the passage?',
        options: [
          'Physical repair of body tissues',
          'Strengthening the immune system',
          'Emotional processing and creative thinking',
          'Regulating body temperature',
        ],
        correct: 2,
        explanation: 'The passage states REM sleep "plays a critical role in emotional processing and creative thinking."',
      },
      {
        id: 3, type: 'tfng',
        statement: 'Sleeping fewer than seven hours per night increases the risk of cardiovascular disease.',
        answer: 'True',
        explanation: 'The passage lists "cardiovascular disease" among the elevated risks for adults sleeping fewer than seven hours per night.',
      },
      {
        id: 4, type: 'mcq',
        question: 'What does the passage describe as a "paradox"?',
        options: [
          'The fact that sleep deprivation causes obesity',
          'The high cost of sleep loss despite the easy solution of sleeping more',
          'The idea that dreaming helps creativity',
          'The difference between REM and non-REM sleep',
        ],
        correct: 1,
        explanation: 'The passage calls it "a striking paradox" that sleep loss costs billions yet the solution is simply to sleep more.',
      },
      {
        id: 5, type: 'sentence_completion',
        instruction: 'Complete the sentence using NO MORE THAN TWO WORDS from the passage:',
        stem: 'Scientists argue that sleep should be treated as a public health priority alongside diet and ______.',
        answer: 'exercise',
        explanation: 'The final sentence lists "diet and exercise" as the things sleep should be treated alongside.',
      },
    ],
  },
  {
    id: 'r5',
    title: 'Microplastics and the Global Ocean Crisis',
    level: 'Band 6.0+',
    wordCount: 290,
    xpReward: 60,
    passage: `Microplastics — fragments of plastic smaller than five millimetres — have emerged as one of the most **pervasive** environmental contaminants of the twenty-first century. They are now found in virtually every corner of the planet, from the deepest ocean trenches to the peaks of remote mountain ranges, and increasingly within the human body itself.

The primary sources of microplastics include the **degradation** of larger plastic debris, synthetic fibres released during laundry, and microbeads deliberately added to cosmetic products. A single cycle of a washing machine can release more than 700,000 synthetic fibres into the water supply. While many countries have banned microbeads in cosmetics, the far larger problem of **textile** microplastics remains largely unaddressed.

The consequences for marine ecosystems are severe. Small marine organisms, including zooplankton and filter-feeding shellfish, **ingest** microplastics, mistaking them for food. These particles then accumulate through the food chain in a process known as **biomagnification**, reaching increasingly high concentrations in larger predators, including fish consumed by humans. Studies have detected microplastics in commercial seafood, drinking water, and even in human blood and lung tissue.

The health implications remain a subject of intense **research**. While the full long-term effects on human health are not yet established, laboratory studies suggest that certain plastic compounds can act as endocrine disruptors, interfering with hormonal systems. The **nanoplastics** — particles smaller than one micrometre — are considered particularly concerning because they can penetrate cell membranes.

International efforts to address the crisis have accelerated. In 2022, the United Nations launched negotiations on a **legally binding** global plastics treaty, widely described as the most significant environmental agreement since the Paris Climate Accord. However, reaching consensus among nearly 200 nations with different economic interests remains an enormous challenge.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'Microplastics are only found in the ocean and not in mountain areas.',
        answer: 'False',
        explanation: 'The passage states microplastics are found "from the deepest ocean trenches to the peaks of remote mountain ranges."',
      },
      {
        id: 2, type: 'mcq',
        question: 'How many synthetic fibres can a single washing machine cycle release?',
        options: [
          'More than 70,000',
          'More than 700,000',
          'More than 7 million',
          'More than 70 million',
        ],
        correct: 1,
        explanation: 'The passage states: "A single cycle of a washing machine can release more than 700,000 synthetic fibres."',
      },
      {
        id: 3, type: 'mcq',
        question: 'What is "biomagnification" as described in the passage?',
        options: [
          'The process by which plastics break down into smaller particles',
          'The accumulation of microplastics through the food chain at increasing concentrations',
          'A method scientists use to study microplastics under a microscope',
          'The process of filtering microplastics from drinking water',
        ],
        correct: 1,
        explanation: 'The passage defines biomagnification as the process where particles "accumulate through the food chain...reaching increasingly high concentrations in larger predators."',
      },
      {
        id: 4, type: 'tfng',
        statement: 'The full long-term health effects of microplastics on humans are currently well understood.',
        answer: 'False',
        explanation: 'The passage states "the full long-term effects on human health are not yet established."',
      },
      {
        id: 5, type: 'tfng',
        statement: 'The United Nations began negotiations on a global plastics treaty in 2022.',
        answer: 'True',
        explanation: 'The passage explicitly states: "In 2022, the United Nations launched negotiations on a legally binding global plastics treaty."',
      },
    ],
  },
  {
    id: 'r6',
    title: 'The Return of the Night Train',
    level: 'Band 5.5–6.0',
    wordCount: 270,
    xpReward: 50,
    passage: `For decades, **night trains** were seen as a relic of a slower era, gradually pushed aside by cheap flights and high-speed rail. Yet across Europe, the sleeper train is experiencing a remarkable **revival**, driven largely by growing concern over the environmental cost of aviation.

The appeal is straightforward. A passenger travelling from Vienna to Paris by night train produces a fraction of the **carbon emissions** generated by the equivalent flight. Travellers also save the cost of a night's accommodation, since they sleep on board and arrive refreshed in the city centre the following morning, avoiding the long transfers associated with airports on the outskirts of cities.

Austria's national railway has been at the forefront of this trend. After other operators abandoned their loss-making sleeper services, the Austrian company acquired the carriages and expanded the network, betting that demand would recover. That gamble has paid off: passenger numbers have risen steadily, and new routes continue to be added.

Nevertheless, significant **obstacles** remain. Night trains are expensive to operate, requiring more staff and specialised carriages than ordinary services. Crossing multiple national borders also creates **technical** difficulties, as different countries use incompatible signalling and electrical systems. Critics argue that without government subsidies, many routes would never be profitable.

Despite these challenges, supporters insist that the night train has a future. As governments introduce policies to discourage short-haul flights, and as passengers increasingly weigh the environmental impact of their choices, the romantic image of falling asleep in one country and waking in another may once again become an ordinary way to travel.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'Night trains became less popular in the past because of cheap flights and high-speed rail.',
        answer: 'True',
        explanation: 'The passage says sleeper trains were "gradually pushed aside by cheap flights and high-speed rail."',
      },
      {
        id: 2, type: 'tfng',
        statement: 'A flight from Vienna to Paris produces fewer carbon emissions than the night train.',
        answer: 'False',
        explanation: 'The opposite is stated: the night train produces "a fraction of the carbon emissions generated by the equivalent flight."',
      },
      {
        id: 3, type: 'tfng',
        statement: 'The Austrian railway expected demand for sleeper trains to fall further after taking them over.',
        answer: 'False',
        explanation: 'It was "betting that demand would recover" — the opposite of expecting it to fall.',
      },
      {
        id: 4, type: 'mcq',
        question: 'According to the passage, why is crossing national borders difficult for night trains?',
        options: [
          'Passengers need multiple passports',
          'Countries use incompatible signalling and electrical systems',
          'Border guards delay the trains',
          'Each country charges a different fare',
        ],
        correct: 1,
        explanation: 'The passage states different countries "use incompatible signalling and electrical systems."',
      },
      {
        id: 5, type: 'mcq',
        question: 'What does the passage suggest may help night trains in the future?',
        options: [
          'Lower staff costs',
          'Faster carriages',
          'Government policies that discourage short-haul flights',
          'The closure of city-centre airports',
        ],
        correct: 2,
        explanation: 'It mentions "governments introduce policies to discourage short-haul flights" as a factor supporting the night train.',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with NO MORE THAN TWO WORDS from the passage.',
        stem: 'Many night-train routes would never be profitable without government ____.',
        answer: 'subsidies',
        explanation: 'Critics argue that "without government subsidies, many routes would never be profitable."',
      },
    ],
  },
  {
    id: 'r7',
    title: 'How Bees Communicate',
    level: 'Band 6.0–6.5',
    wordCount: 285,
    xpReward: 55,
    passage: `Honeybees possess one of the most sophisticated **communication** systems in the animal kingdom, allowing a single colony of tens of thousands of individuals to function as a coordinated whole. At the heart of this system is a behaviour known as the **waggle dance**, first decoded by the Austrian scientist Karl von Frisch in the mid-twentieth century.

When a foraging bee discovers a rich source of nectar, it returns to the hive and performs a figure-of-eight movement on the vertical surface of the honeycomb. The direction of the central "waggle" portion, relative to the vertical, indicates the direction of the food in relation to the sun. The duration of the waggle, meanwhile, signals the **distance**: the longer the dance, the farther away the source.

Remarkably, bees can compensate for the movement of the sun across the sky during the day, adjusting the angle of their dance accordingly. This suggests they possess an internal sense of time, an ability that continues to fascinate researchers.

Communication within the hive is not limited to dance. Bees also exchange **chemical** signals known as pheromones. The queen, for example, releases a pheromone that suppresses the development of rival queens and signals her continued presence. When the queen dies, the disappearance of this chemical triggers the workers to begin raising a replacement.

Vibration and sound play a role too. Scientists have recorded distinct acoustic signals that appear to "stop" dancing bees, possibly warning them of danger at a particular food source. Together, these overlapping channels allow the colony to respond rapidly to a constantly changing environment.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Who first decoded the meaning of the waggle dance?',
        options: [
          'A British naturalist in the 1800s',
          'Karl von Frisch in the mid-twentieth century',
          'A team of modern researchers',
          'Beekeepers in Austria',
        ],
        correct: 1,
        explanation: 'The passage says the dance was "first decoded by the Austrian scientist Karl von Frisch in the mid-twentieth century."',
      },
      {
        id: 2, type: 'mcq',
        question: 'What does the duration of the waggle indicate?',
        options: [
          'The quality of the nectar',
          'The number of bees needed',
          'The distance to the food source',
          'The time of day',
        ],
        correct: 2,
        explanation: '"The duration of the waggle...signals the distance: the longer the dance, the farther away the source."',
      },
      {
        id: 3, type: 'tfng',
        statement: 'Bees adjust their dance to account for the sun moving across the sky.',
        answer: 'True',
        explanation: 'The passage states bees "can compensate for the movement of the sun across the sky during the day, adjusting the angle of their dance."',
      },
      {
        id: 4, type: 'tfng',
        statement: 'The queen bee releases a pheromone that encourages rival queens to develop.',
        answer: 'False',
        explanation: 'The queen\'s pheromone "suppresses the development of rival queens" — it discourages, not encourages.',
      },
      {
        id: 5, type: 'matching_features',
        instruction: 'Which signal type does the description refer to? Choose the correct option.',
        question: 'A signal that appears to "stop" dancing bees and may warn of danger.',
        options: [
          'The waggle dance',
          'Pheromones',
          'Acoustic (sound) signals',
          'The internal sense of time',
        ],
        answer: 2,
        explanation: 'The passage describes recorded "acoustic signals that appear to stop dancing bees, possibly warning them of danger."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'The death of the queen is detected when her ____ disappears, prompting workers to raise a replacement.',
        answer: 'pheromone',
        explanation: '"When the queen dies, the disappearance of this chemical [pheromone] triggers the workers to begin raising a replacement."',
      },
    ],
  },
  {
    id: 'r8',
    title: 'The Psychology of Procrastination',
    level: 'Band 6.0–6.5',
    wordCount: 280,
    xpReward: 55,
    passage: `Most people assume that **procrastination** is simply a matter of poor time management or laziness. Psychologists, however, increasingly view it as a problem of **emotion** regulation rather than a failure of organisation. According to this view, we put off tasks not because we cannot manage our schedules, but because we are trying to avoid the negative feelings those tasks provoke.

When a task seems boring, difficult, or threatening to our sense of competence, the brain seeks relief by turning to something more pleasant. Checking social media or tidying a desk offers an immediate, if temporary, mood boost. The underlying task remains undone, and the **anxiety** associated with it often grows, creating a cycle that is difficult to break.

This emotional account helps explain why procrastination is so resistant to conventional advice. Telling a chronic procrastinator to "just get organised" misses the point, because the real obstacle is the discomfort the task triggers, not a lack of planning tools. Researchers have found that people who are more self-critical tend to procrastinate more, as harsh self-judgement only intensifies the negative emotions they are trying to escape.

Interestingly, one of the most effective remedies appears to be **self-forgiveness**. In one study, students who forgave themselves for procrastinating before an exam were less likely to delay studying for the next one. By reducing the burden of guilt, they removed one of the emotional triggers that fuelled the behaviour.

Breaking large tasks into smaller, less intimidating steps can also help, as can focusing on the next concrete action rather than the daunting whole.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'Psychologists increasingly see procrastination mainly as a time-management problem.',
        answer: 'False',
        explanation: 'They "view it as a problem of emotion regulation rather than a failure of organisation."',
      },
      {
        id: 2, type: 'tfng',
        statement: 'Activities like checking social media provide only a temporary improvement in mood.',
        answer: 'True',
        explanation: 'The passage says these offer "an immediate, if temporary, mood boost."',
      },
      {
        id: 3, type: 'tfng',
        statement: 'People who are more self-critical tend to procrastinate less.',
        answer: 'False',
        explanation: 'The passage states the more self-critical "tend to procrastinate more."',
      },
      {
        id: 4, type: 'mcq',
        question: 'Why is the advice to "just get organised" considered ineffective?',
        options: [
          'Procrastinators already have good planning tools',
          'The real obstacle is the discomfort the task triggers, not a lack of planning',
          'Organisation takes too much time',
          'It only works for students',
        ],
        correct: 1,
        explanation: 'The advice "misses the point, because the real obstacle is the discomfort the task triggers, not a lack of planning tools."',
      },
      {
        id: 5, type: 'mcq',
        question: 'What did the study on students before an exam find?',
        options: [
          'Self-forgiveness made students procrastinate more',
          'Students who forgave themselves were less likely to delay studying next time',
          'Guilt improved exam performance',
          'Breaking tasks into steps had no effect',
        ],
        correct: 1,
        explanation: 'Students who "forgave themselves for procrastinating...were less likely to delay studying for the next one."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'Self-forgiveness works partly by reducing the burden of ____ that fuels procrastination.',
        answer: 'guilt',
        explanation: '"By reducing the burden of guilt, they removed one of the emotional triggers."',
      },
    ],
  },
  {
    id: 'r9',
    title: 'The Lost Art of Memory',
    level: 'Band 6.0–6.5',
    wordCount: 290,
    xpReward: 55,
    passage: `In the ancient world, before the spread of cheap paper and printing, a trained **memory** was one of the most valuable skills a person could possess. Orators, philosophers, and scholars relied on elaborate **techniques** to store vast amounts of information in their minds, and treatises on the art of memory were widely studied.

The most famous of these techniques is the so-called "memory palace", or method of loci. A practitioner imagines a familiar building and mentally places vivid images representing the items to be remembered in specific locations along a route. To recall the information, the person simply walks through the building in their imagination, retrieving each image in turn. The more striking or unusual the image, the more firmly it lodges in the mind.

This method works because human memory is far better at recalling places and pictures than abstract words or numbers. By converting dry information into a memorable journey, the technique exploits the brain's natural strengths.

With the arrival of printed books, and later digital devices, the need to memorise declined. Why commit a fact to memory when it can be looked up instantly? Some commentators worry that this has weakened our mental faculties, leaving us dependent on external storage.

Others disagree, arguing that **offloading** routine information frees the mind for higher-order thinking and creativity. What is clear is that the ancient techniques still work: modern "memory athletes", who compete to memorise long strings of numbers or the order of shuffled cards, almost all rely on the same method of loci that Roman orators used two thousand years ago.`,
    questions: [
      {
        id: 1, type: 'matching_headings',
        instruction: 'Choose the best heading for the described paragraph.',
        paragraphLabel: 'Paragraph 2 (the "memory palace")',
        options: [
          'Why memorisation declined',
          'How the method of loci works',
          'The value of memory in ancient times',
          'A debate about modern minds',
        ],
        answer: 1,
        explanation: 'Paragraph 2 explains the technique of placing images along a route — how the method of loci works.',
      },
      {
        id: 2, type: 'tfng',
        statement: 'In the ancient world, a trained memory was highly valued.',
        answer: 'True',
        explanation: 'It was "one of the most valuable skills a person could possess."',
      },
      {
        id: 3, type: 'tfng',
        statement: 'Human memory recalls abstract numbers more easily than places and pictures.',
        answer: 'False',
        explanation: 'The opposite: memory is "far better at recalling places and pictures than abstract words or numbers."',
      },
      {
        id: 4, type: 'mcq',
        question: 'According to those who are not worried about declining memorisation, what is the benefit of "offloading" information?',
        options: [
          'It saves money on books',
          'It frees the mind for higher-order thinking and creativity',
          'It makes memory palaces unnecessary',
          'It improves digital devices',
        ],
        correct: 1,
        explanation: 'They argue offloading "frees the mind for higher-order thinking and creativity."',
      },
      {
        id: 5, type: 'mcq',
        question: 'What does the passage say about modern "memory athletes"?',
        options: [
          'They have invented entirely new techniques',
          'They avoid the method of loci',
          'They almost all use the same method of loci as Roman orators',
          'They rely on digital devices to compete',
        ],
        correct: 2,
        explanation: 'They "almost all rely on the same method of loci that Roman orators used two thousand years ago."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with TWO WORDS from the passage.',
        stem: 'The method of loci is also known as the ____.',
        answer: 'memory palace',
        explanation: 'The passage calls it \'the so-called "memory palace", or method of loci.\'',
      },
    ],
  },
  {
    id: 'r10',
    title: 'The Science of Sleep',
    level: 'Band 5.5–6.0',
    wordCount: 275,
    xpReward: 50,
    passage: `For something we spend roughly a third of our lives doing, **sleep** remains surprisingly mysterious. Scientists once assumed it was simply a period of rest, when the body and brain shut down. Research over the past few decades, however, has revealed that sleep is an intensely active process essential to physical and mental health.

During the night, the brain cycles through several distinct **stages**. The deepest stage, known as slow-wave sleep, is when the body repairs tissue, builds bone and muscle, and strengthens the immune system. Another stage, called REM sleep, is when most vivid dreaming occurs and when the brain consolidates **memories**, transferring information from short-term to long-term storage.

A lack of sleep has serious **consequences**. Studies have consistently linked chronic sleep deprivation to impaired concentration, weakened immunity, weight gain, and a higher risk of conditions such as heart disease and diabetes. Even a single night of poor sleep can noticeably reduce a person's ability to focus and make decisions the following day.

Modern lifestyles, unfortunately, often work against good sleep. The blue light emitted by phones and computers can suppress the production of melatonin, the hormone that signals to the body it is time to sleep. Irregular schedules, caffeine, and stress further disrupt natural sleep patterns.

Experts recommend a number of simple measures: keeping a consistent bedtime, avoiding screens before bed, and limiting caffeine in the afternoon. While individual needs vary, most adults function best with seven to nine hours of sleep per night.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'Scientists once believed that the brain shuts down completely during sleep.',
        answer: 'True',
        explanation: 'The passage says scientists "once assumed it was simply a period of rest, when the body and brain shut down."',
      },
      {
        id: 2, type: 'tfng',
        statement: 'REM sleep is the stage when the body mainly repairs tissue and builds muscle.',
        answer: 'False',
        explanation: 'Tissue repair and muscle building happen in slow-wave sleep; REM is when dreaming and memory consolidation occur.',
      },
      {
        id: 3, type: 'mcq',
        question: 'What does the passage say happens during REM sleep?',
        options: [
          'The immune system is strengthened',
          'The brain consolidates memories',
          'Bone and muscle are built',
          'Melatonin is produced',
        ],
        correct: 1,
        explanation: 'In REM sleep "the brain consolidates memories, transferring information from short-term to long-term storage."',
      },
      {
        id: 4, type: 'mcq',
        question: 'How does blue light from screens affect sleep?',
        options: [
          'It increases melatonin production',
          'It suppresses melatonin production',
          'It has no measurable effect',
          'It causes vivid dreaming',
        ],
        correct: 1,
        explanation: 'Blue light "can suppress the production of melatonin, the hormone that signals to the body it is time to sleep."',
      },
      {
        id: 5, type: 'sentence_completion',
        instruction: 'Complete the sentence with TWO WORDS from the passage.',
        stem: 'The deepest stage of sleep is known as ____ sleep.',
        answer: 'slow-wave',
        explanation: '"The deepest stage, known as slow-wave sleep..."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with A NUMBER.',
        stem: 'Most adults function best with seven to ____ hours of sleep per night.',
        answer: 'nine',
        explanation: '"Most adults function best with seven to nine hours of sleep per night."',
      },
    ],
  },
  {
    id: 'r11',
    title: 'The Rediscovery of Ancient Grains',
    level: 'Band 6.0–6.5',
    wordCount: 285,
    xpReward: 55,
    passage: `For thousands of years, humans cultivated a remarkable **diversity** of grains. Yet over the last century, global agriculture came to rely on just a handful of high-yield crops, chiefly wheat, rice, and maize. Recently, however, so-called "ancient grains" such as quinoa, amaranth, and teff have enjoyed a striking **resurgence** in popularity.

The appeal of these grains is partly **nutritional**. Quinoa, for example, contains all nine essential amino acids, making it a rare plant-based complete protein. Many ancient grains are also rich in fibre, minerals, and antioxidants, and a number of them are naturally free of gluten, which makes them suitable for people with certain dietary restrictions.

There are environmental arguments too. Crops such as teff and millet are remarkably **resilient**, able to grow in poor soils and withstand drought far better than conventional wheat. As climate change makes weather increasingly unpredictable, such hardiness could prove invaluable for food security in vulnerable regions.

The revival is not without complications, however. As Western demand for quinoa surged, prices rose sharply, and there were concerns that farmers in the Andes, where it has been grown for millennia, could no longer afford their own staple crop. Fortunately, studies suggest the long-term effects on local communities have been more positive than initially feared, as higher prices boosted farmers' incomes.

Ultimately, the renewed interest in ancient grains reflects a broader shift in attitudes towards food, with consumers increasingly valuing nutrition, sustainability, and variety over sheer quantity.`,
    questions: [
      {
        id: 1, type: 'matching_headings',
        instruction: 'Choose the best heading for the described paragraph.',
        paragraphLabel: 'Paragraph 3 (teff, millet and drought)',
        options: [
          'The nutritional benefits of ancient grains',
          'Environmental advantages and resilience',
          'Problems caused by rising demand',
          'A shift in consumer attitudes',
        ],
        answer: 1,
        explanation: 'Paragraph 3 focuses on grains being resilient, drought-resistant, and good for food security — environmental advantages.',
      },
      {
        id: 2, type: 'tfng',
        statement: 'Over the last century, global agriculture relied on a wide variety of grain crops.',
        answer: 'False',
        explanation: 'Agriculture "came to rely on just a handful of high-yield crops, chiefly wheat, rice, and maize."',
      },
      {
        id: 3, type: 'mcq',
        question: 'Why is quinoa described as a rare plant-based complete protein?',
        options: [
          'It is free of gluten',
          'It contains all nine essential amino acids',
          'It is rich in antioxidants',
          'It grows in poor soils',
        ],
        correct: 1,
        explanation: 'Quinoa "contains all nine essential amino acids, making it a rare plant-based complete protein."',
      },
      {
        id: 4, type: 'matching_features',
        instruction: 'Which grain is described? Choose the correct option.',
        question: 'A grain noted for containing all nine essential amino acids.',
        options: ['Teff', 'Millet', 'Quinoa', 'Maize'],
        answer: 2,
        explanation: 'The passage attributes the complete-protein property to quinoa.',
      },
      {
        id: 5, type: 'tfng',
        statement: 'Studies suggest rising quinoa prices ultimately harmed Andean farmers more than expected.',
        answer: 'False',
        explanation: 'Studies suggest the effects were "more positive than initially feared, as higher prices boosted farmers\' incomes."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'Crops such as teff and millet are valued for being able to withstand ____.',
        answer: 'drought',
        explanation: 'They can "withstand drought far better than conventional wheat."',
      },
    ],
  },
  {
    id: 'r12',
    title: 'The Vanishing Dark Sky',
    level: 'Band 6.0–6.5',
    wordCount: 280,
    xpReward: 55,
    passage: `For most of human history, the night sky was a source of wonder, navigation, and inspiration. Today, however, an estimated eighty per cent of the world's population lives under skies polluted by artificial light, and a third of humanity can no longer see the Milky Way. This phenomenon, known as **light pollution**, is growing rapidly as cities expand.

Light pollution takes several forms. "Skyglow" is the diffuse brightening of the night sky over urban areas, caused by light scattering in the atmosphere. "Glare" is excessive brightness that causes visual discomfort, while "light trespass" occurs when unwanted light spills into areas where it is not needed, such as a streetlight shining into a bedroom window.

The consequences extend far beyond astronomy. Many **species** depend on natural cycles of light and darkness. Newly hatched sea turtles, for instance, instinctively head towards the brightest horizon, which was historically the sea reflecting the moon; artificial lights now lure them inland, where many die. Migratory birds, which navigate by the stars, become disoriented by bright city lights, sometimes colliding with illuminated buildings.

There is a human cost too. Exposure to artificial light at night disrupts the body's production of melatonin, potentially affecting sleep and overall health.

Encouragingly, light pollution is one of the easiest environmental problems to **reverse**. Simply shielding lights so they point downwards, using warmer colours, and switching off unnecessary lighting can restore the night sky almost immediately, without sacrificing safety or convenience.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'According to the passage, what fraction of humanity can no longer see the Milky Way?',
        options: ['One fifth', 'One third', 'One half', 'Four fifths'],
        correct: 1,
        explanation: '"A third of humanity can no longer see the Milky Way."',
      },
      {
        id: 2, type: 'mcq',
        question: 'What is "light trespass"?',
        options: [
          'The diffuse brightening of the sky over cities',
          'Excessive brightness causing visual discomfort',
          'Unwanted light spilling into areas where it is not needed',
          'Light scattering in the atmosphere',
        ],
        correct: 2,
        explanation: 'Light trespass "occurs when unwanted light spills into areas where it is not needed."',
      },
      {
        id: 3, type: 'tfng',
        statement: 'Newly hatched sea turtles are drawn towards artificial lights on land.',
        answer: 'True',
        explanation: 'Artificial lights "now lure them inland, where many die."',
      },
      {
        id: 4, type: 'tfng',
        statement: 'Light pollution is one of the most difficult environmental problems to reverse.',
        answer: 'False',
        explanation: 'It is described as "one of the easiest environmental problems to reverse."',
      },
      {
        id: 5, type: 'matching_features',
        instruction: 'Which term is being described? Choose the correct option.',
        question: 'The diffuse brightening of the night sky over urban areas.',
        options: ['Glare', 'Light trespass', 'Skyglow', 'Melatonin'],
        answer: 2,
        explanation: '"Skyglow is the diffuse brightening of the night sky over urban areas."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'Artificial light at night can disrupt the body\'s production of ____.',
        answer: 'melatonin',
        explanation: 'Exposure "disrupts the body\'s production of melatonin."',
      },
    ],
  },
  {
    id: 'r13',
    title: 'The Surprising Intelligence of Crows',
    level: 'Band 6.0–6.5',
    wordCount: 280,
    xpReward: 55,
    passage: `When we think of intelligent animals, we tend to picture dolphins, chimpanzees, or elephants. Yet a growing body of research suggests that some of the cleverest creatures on the planet are **birds** — specifically, members of the crow family, known as corvids.

Crows and their relatives have demonstrated **abilities** once thought to be unique to humans and great apes. In laboratory experiments, New Caledonian crows have shown that they can not only use tools but also manufacture them, bending wire into hooks to retrieve food that is otherwise out of reach. Even more remarkably, they appear capable of solving multi-step puzzles, using one tool to obtain another.

Memory is another area in which corvids excel. Certain species hide thousands of food items across a wide area and are able to **recall** the precise locations months later. Some can even remember which caches they were observed hiding and will return to move them, suggesting an awareness that others might steal their food.

Perhaps most striking is their capacity for **recognition**. Studies have shown that crows can distinguish between individual human faces, remembering people who have threatened them and reacting with alarm when they reappear — sometimes even passing this information on to other crows that were not present during the original encounter.

Such findings have forced scientists to reconsider long-held assumptions about the relationship between brain size and intelligence. Although a crow's brain is tiny compared to a primate's, it is extremely densely packed with neurons, which may explain why these unassuming birds are capable of such sophisticated behaviour.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'New Caledonian crows can both use and make tools.',
        answer: 'True',
        explanation: 'They "can not only use tools but also manufacture them, bending wire into hooks."',
      },
      {
        id: 2, type: 'tfng',
        statement: 'Crows forget where they have hidden food within a few days.',
        answer: 'False',
        explanation: 'They "are able to recall the precise locations months later."',
      },
      {
        id: 3, type: 'mcq',
        question: 'Why do some crows return to move food they have hidden?',
        options: [
          'The food has gone bad',
          'They were observed hiding it and others might steal it',
          'They forgot the original location',
          'To find a better hiding place at random',
        ],
        correct: 1,
        explanation: 'They move caches they "were observed hiding," suggesting awareness that others might steal the food.',
      },
      {
        id: 4, type: 'mcq',
        question: 'What ability did studies of human-face recognition reveal?',
        options: [
          'Crows cannot tell humans apart',
          'Crows can recognise individual faces and warn other crows',
          'Crows only recognise people who feed them',
          'Crows fear all humans equally',
        ],
        correct: 1,
        explanation: 'Crows "can distinguish between individual human faces" and pass the information to other crows.',
      },
      {
        id: 5, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'Members of the crow family are scientifically known as ____.',
        answer: 'corvids',
        explanation: '"Members of the crow family, known as corvids."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'A crow\'s brain is small but densely packed with ____.',
        answer: 'neurons',
        explanation: 'It "is extremely densely packed with neurons."',
      },
    ],
  },
  {
    id: 'r14',
    title: 'The Four-Day Working Week',
    level: 'Band 6.0–6.5',
    wordCount: 285,
    xpReward: 55,
    passage: `The idea of a **four-day working week** — in which employees work fewer days for the same pay — has moved from the fringes of economic debate into mainstream discussion. A number of companies and even entire countries have begun trialling the concept, with results that have surprised many sceptics.

The most commonly cited benefit is improved **productivity**. Supporters argue that workers who are well rested and have more time for their personal lives are more focused and efficient during working hours. In a widely reported trial in Iceland, involving thousands of public-sector employees, productivity remained the same or even improved, while reported levels of stress and burnout fell significantly.

There are wider **social** arguments too. A shorter week could allow parents to spend more time with their children, reduce the need for childcare, and distribute paid work more evenly across society. Some environmentalists also point out that fewer commuting days could lower carbon emissions.

However, the model is not suitable for every industry. In sectors such as healthcare, hospitality, and manufacturing, where services must be provided continuously, simply reducing hours is far more **complicated**. Critics also warn that compressing the same workload into fewer days could increase daily pressure rather than reduce it.

Despite these concerns, interest continues to grow. As automation reshapes the labour market and attitudes towards work-life balance shift, many analysts believe that some form of reduced working week may eventually become the norm, even if the traditional five-day model proves difficult to abandon entirely.`,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What happened to productivity in the Icelandic trial?',
        options: [
          'It fell sharply',
          'It remained the same or improved',
          'It could not be measured',
          'It doubled',
        ],
        correct: 1,
        explanation: 'In the trial, "productivity remained the same or even improved."',
      },
      {
        id: 2, type: 'tfng',
        statement: 'The four-day week is considered equally suitable for all industries.',
        answer: 'False',
        explanation: 'The passage says "the model is not suitable for every industry," citing healthcare, hospitality, and manufacturing.',
      },
      {
        id: 3, type: 'tfng',
        statement: 'Some environmentalists believe fewer commuting days could reduce carbon emissions.',
        answer: 'True',
        explanation: '"Some environmentalists also point out that fewer commuting days could lower carbon emissions."',
      },
      {
        id: 4, type: 'mcq',
        question: 'What concern do critics raise about compressing work into fewer days?',
        options: [
          'It reduces total pay',
          'It could increase daily pressure rather than reduce it',
          'It requires more childcare',
          'It always lowers productivity',
        ],
        correct: 1,
        explanation: 'Critics warn it "could increase daily pressure rather than reduce it."',
      },
      {
        id: 5, type: 'matching_features',
        instruction: 'Which is given as a SOCIAL argument for the four-day week? Choose the correct option.',
        question: 'A benefit relating to families and society rather than company output.',
        options: [
          'Higher productivity during working hours',
          'Allowing parents more time with their children',
          'Reduced stress and burnout',
          'Greater profits for companies',
        ],
        answer: 1,
        explanation: 'The social arguments include allowing "parents to spend more time with their children."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'In the Icelandic trial, levels of stress and ____ fell significantly.',
        answer: 'burnout',
        explanation: '"Reported levels of stress and burnout fell significantly."',
      },
    ],
  },
  {
    id: 'r15',
    title: 'The Hidden World of Fungi',
    level: 'Band 6.0–6.5',
    wordCount: 285,
    xpReward: 55,
    passage: `When most people think of **fungi**, they picture mushrooms growing on a forest floor. Yet the mushroom is merely the visible fruiting body of a vast, hidden organism. Beneath the surface lies a sprawling network of thread-like filaments called **mycelium**, which can extend across enormous distances and form one of the largest living systems on Earth.

For a long time, fungi were misclassified as plants. In fact, they are genetically closer to animals, and unlike plants they cannot produce their own food through photosynthesis. Instead, they obtain nutrients by breaking down organic matter, playing a crucial role as the planet's primary **decomposers**. Without fungi, dead leaves, wood, and other debris would accumulate indefinitely, and the nutrients locked within them would never be returned to the soil.

Perhaps the most fascinating discovery in recent years is the extent to which fungi cooperate with plants. Most land plants form partnerships with fungi in their roots, an arrangement known as a **mycorrhizal** relationship. The fungi extend the reach of the plant's roots, supplying water and minerals, and in return receive sugars produced by the plant. Some scientists have even described vast underground fungal networks as a "wood wide web", through which trees may exchange nutrients and warning signals.

Beyond their ecological importance, fungi have proved invaluable to humans. They give us bread, beer, and cheese, and they are the source of life-saving medicines such as penicillin. Researchers are now exploring their potential to break down pollutants and even to create sustainable building materials.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'The mushroom is the entire fungal organism.',
        answer: 'False',
        explanation: 'The mushroom is "merely the visible fruiting body" of a larger organism with a hidden mycelium network.',
      },
      {
        id: 2, type: 'tfng',
        statement: 'Fungi are genetically closer to animals than to plants.',
        answer: 'True',
        explanation: '"They are genetically closer to animals."',
      },
      {
        id: 3, type: 'mcq',
        question: 'How do fungi obtain nutrients?',
        options: [
          'Through photosynthesis like plants',
          'By breaking down organic matter',
          'By absorbing sunlight',
          'By producing their own sugars',
        ],
        correct: 1,
        explanation: 'They "obtain nutrients by breaking down organic matter," acting as decomposers.',
      },
      {
        id: 4, type: 'mcq',
        question: 'What does a plant receive in a mycorrhizal relationship?',
        options: [
          'Sugars from the fungi',
          'Water and minerals from the fungi',
          'Sunlight from the fungi',
          'Nothing at all',
        ],
        correct: 1,
        explanation: 'The fungi supply "water and minerals," and in return receive sugars from the plant.',
      },
      {
        id: 5, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'The hidden network of thread-like filaments is called ____.',
        answer: 'mycelium',
        explanation: '"A sprawling network of thread-like filaments called mycelium."',
      },
      {
        id: 6, type: 'matching_features',
        instruction: 'Which is given as a HUMAN use of fungi? Choose the correct option.',
        question: 'A benefit of fungi to people rather than to ecosystems.',
        options: [
          'Acting as decomposers',
          'Forming mycorrhizal relationships',
          'Providing the source of penicillin',
          'Returning nutrients to the soil',
        ],
        answer: 2,
        explanation: 'Fungi "are the source of life-saving medicines such as penicillin" — a human use.',
      },
    ],
  },
  {
    id: 'r16',
    title: 'The Power of the Placebo',
    level: 'Band 6.0–6.5',
    wordCount: 285,
    xpReward: 55,
    passage: `One of the most puzzling phenomena in medicine is the **placebo effect** — the tendency for patients to feel better after receiving a treatment that contains no active ingredient at all. A sugar pill, a harmless injection of salt water, or even a fake surgical procedure can sometimes produce genuine improvements in a patient's condition.

For a long time, the placebo effect was dismissed as little more than imagination. However, modern research has shown that it is a real, measurable **biological** response. Brain scans reveal that when patients expect relief, their brains may release natural painkillers called endorphins, producing effects similar to those of actual medication.

The strength of the effect depends on a number of surprising factors. Studies have found that larger pills tend to work better than smaller ones, that two pills are more effective than one, and that a pill's colour can influence its perceived benefits — blue pills, for example, are generally more effective as sleep aids. The manner of the doctor also matters: a confident, **reassuring** physician tends to produce stronger placebo responses than a hurried or indifferent one.

This has important implications for medical research. To prove that a new drug actually works, scientists must show that it performs better than a placebo in controlled trials, since some improvement is expected from the placebo alone.

Intriguingly, the effect can persist even when patients are told they are taking a placebo. This raises profound questions about the relationship between the mind and the body, and suggests that belief and expectation are powerful forces in the process of healing.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'The placebo effect is now considered to be purely imaginary.',
        answer: 'False',
        explanation: 'Modern research shows it is "a real, measurable biological response," not merely imagination.',
      },
      {
        id: 2, type: 'mcq',
        question: 'According to the passage, what may the brain release when patients expect relief?',
        options: ['Adrenaline', 'Endorphins', 'Insulin', 'Melatonin'],
        correct: 1,
        explanation: 'Their brains "may release natural painkillers called endorphins."',
      },
      {
        id: 3, type: 'tfng',
        statement: 'The colour of a pill can affect how beneficial it seems.',
        answer: 'True',
        explanation: '"A pill\'s colour can influence its perceived benefits — blue pills...are generally more effective as sleep aids."',
      },
      {
        id: 4, type: 'mcq',
        question: 'Why must new drugs be compared with a placebo in trials?',
        options: [
          'Placebos are cheaper to produce',
          'Some improvement is expected from the placebo alone',
          'Placebos have no effect at all',
          'It is required by law',
        ],
        correct: 1,
        explanation: 'A drug must perform better than a placebo "since some improvement is expected from the placebo alone."',
      },
      {
        id: 5, type: 'matching_features',
        instruction: 'Which factor is said to strengthen the placebo effect? Choose the correct option.',
        question: 'A characteristic of the doctor that produces stronger placebo responses.',
        options: [
          'Being hurried',
          'Being indifferent',
          'Being confident and reassuring',
          'Prescribing smaller pills',
        ],
        answer: 2,
        explanation: '"A confident, reassuring physician tends to produce stronger placebo responses."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'The placebo effect can persist even when patients are ____ they are taking a placebo.',
        answer: 'told',
        explanation: '"The effect can persist even when patients are told they are taking a placebo."',
      },
    ],
  },
  {
    id: 'r17',
    title: 'The Revival of the Bicycle',
    level: 'Band 5.5–6.0',
    wordCount: 275,
    xpReward: 50,
    passage: `The bicycle, invented more than two centuries ago, is enjoying an unexpected **renaissance** in cities around the world. Once seen by many as merely a child's toy or a poor person's transport, it is increasingly regarded as a smart, modern solution to some of the most pressing urban problems.

Several factors lie behind this **shift**. Concerns about air pollution and climate change have made people reconsider the daily car journey. Cycling produces no emissions, takes up little space, and, unlike driving, actively improves the rider's health. In congested city centres, a bicycle is often faster than a car during rush hour.

Many city governments have actively **encouraged** the trend. Cities such as Copenhagen and Amsterdam, long famous for their cycling culture, have invested heavily in dedicated bike lanes, secure parking, and traffic rules that prioritise cyclists. More recently, public bike-sharing schemes have spread to hundreds of cities, allowing people to rent a bicycle for short journeys at low cost.

Nevertheless, **obstacles** remain. In many cities, cyclists still feel unsafe sharing roads with fast-moving traffic, and a lack of proper infrastructure deters potential riders. Bad weather and hilly terrain can also discourage cycling, although the rapid rise of electric bicycles is helping to overcome the problem of physical effort.

Despite these challenges, the direction of travel seems clear. As cities continue to grow and the need for sustainable transport becomes ever more urgent, the humble bicycle looks set to play a central role in the urban future.`,
    questions: [
      {
        id: 1, type: 'tfng',
        statement: 'In the past, many people viewed the bicycle as a serious form of modern transport.',
        answer: 'False',
        explanation: 'It was "once seen by many as merely a child\'s toy or a poor person\'s transport."',
      },
      {
        id: 2, type: 'mcq',
        question: 'According to the passage, when is a bicycle often faster than a car?',
        options: [
          'On long journeys',
          'During rush hour in congested city centres',
          'In rural areas',
          'At night',
        ],
        correct: 1,
        explanation: '"In congested city centres, a bicycle is often faster than a car during rush hour."',
      },
      {
        id: 3, type: 'tfng',
        statement: 'Public bike-sharing schemes have spread to hundreds of cities.',
        answer: 'True',
        explanation: '"Public bike-sharing schemes have spread to hundreds of cities."',
      },
      {
        id: 4, type: 'mcq',
        question: 'What is helping to overcome the problem of physical effort in cycling?',
        options: [
          'Bike-sharing schemes',
          'Dedicated bike lanes',
          'The rise of electric bicycles',
          'Better weather',
        ],
        correct: 2,
        explanation: '"The rapid rise of electric bicycles is helping to overcome the problem of physical effort."',
      },
      {
        id: 5, type: 'sentence_completion',
        instruction: 'Complete the sentence with TWO WORDS from the passage.',
        stem: 'Copenhagen and Amsterdam have invested heavily in dedicated ____.',
        answer: 'bike lanes',
        explanation: 'They "invested heavily in dedicated bike lanes, secure parking..."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'A lack of proper ____ deters potential riders in many cities.',
        answer: 'infrastructure',
        explanation: '"A lack of proper infrastructure deters potential riders."',
      },
    ],
  },
  {
    id: 'r18',
    title: 'The Story of Tea',
    level: 'Band 6.0–6.5',
    wordCount: 285,
    xpReward: 55,
    passage: `After water, **tea** is the most widely consumed beverage on the planet. Its journey from a wild plant in the mountains of south-west China to a global drink enjoyed by billions is a remarkable story spanning thousands of years.

According to Chinese legend, tea was discovered by accident around 2737 BC, when leaves from a wild bush blew into a pot of boiling water being prepared for the emperor. Whatever the truth of this tale, tea was certainly being **cultivated** in China by the time of the Tang dynasty, when it became deeply woven into the culture and an elaborate art of tea preparation developed.

Tea reached Europe in the seventeenth century, brought by Portuguese and Dutch traders. In Britain, it was initially an expensive luxury enjoyed only by the wealthy, but as imports grew and prices fell, it gradually became the **national** drink, central to social life at all levels of society.

The global tea trade also had far-reaching political **consequences**. The high taxes the British government placed on tea were one of the grievances that helped spark the American Revolution. Later, Britain's desire to balance its enormous tea purchases from China contributed to a series of damaging conflicts.

Today, tea is grown across a wide belt of countries, from India and Sri Lanka to Kenya and Argentina. Beyond its refreshing taste, it continues to play a significant cultural and ceremonial role, from the formal tea ceremonies of Japan to the sweet, milky chai of the Indian subcontinent.`,
    questions: [
      {
        id: 1, type: 'matching_headings',
        instruction: 'Choose the best heading for the described paragraph.',
        paragraphLabel: 'Paragraph 4 (taxes and conflicts)',
        options: [
          'The legendary discovery of tea',
          'Tea arrives in Europe',
          'The political consequences of the tea trade',
          'Tea around the world today',
        ],
        answer: 2,
        explanation: 'Paragraph 4 discusses taxes sparking the American Revolution and conflicts with China — political consequences.',
      },
      {
        id: 2, type: 'tfng',
        statement: 'Tea is the most consumed drink in the world after water.',
        answer: 'True',
        explanation: '"After water, tea is the most widely consumed beverage on the planet."',
      },
      {
        id: 3, type: 'mcq',
        question: 'Who first brought tea to Europe in the seventeenth century?',
        options: [
          'British colonists',
          'Portuguese and Dutch traders',
          'Chinese emperors',
          'Indian merchants',
        ],
        correct: 1,
        explanation: 'Tea reached Europe "brought by Portuguese and Dutch traders."',
      },
      {
        id: 4, type: 'tfng',
        statement: 'When tea first arrived in Britain, ordinary people could easily afford it.',
        answer: 'False',
        explanation: 'It was "initially an expensive luxury enjoyed only by the wealthy."',
      },
      {
        id: 5, type: 'mcq',
        question: 'What does the passage say about high taxes on tea in Britain?',
        options: [
          'They made tea cheaper',
          'They were a grievance that helped spark the American Revolution',
          'They ended the tea trade',
          'They had no real effect',
        ],
        correct: 1,
        explanation: 'The high taxes "were one of the grievances that helped spark the American Revolution."',
      },
      {
        id: 6, type: 'sentence_completion',
        instruction: 'Complete the sentence with ONE WORD from the passage.',
        stem: 'Tea became deeply woven into Chinese culture during the ____ dynasty.',
        answer: 'Tang',
        explanation: 'Tea "was certainly being cultivated in China by the time of the Tang dynasty."',
      },
    ],
  },
]
