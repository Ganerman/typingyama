import type { Difficulty, TestLanguage } from '../types';

export const typingTexts: Record<TestLanguage, Record<Difficulty, string[]>> = {
  English: {
    Easy: [
      'Practice every day and your fingers will slowly learn the rhythm of confident typing. Keep your shoulders relaxed, look at the screen, and press each key with steady control instead of rushing through the sentence.',
      'Small wins become faster words when you stay calm and focused. A short practice session in the morning and another in the evening can build accuracy, confidence, and a comfortable typing rhythm.',
    ],
    Medium: [
      'Accuracy creates lasting speed because fewer mistakes mean less time repairing a sentence. Train your hands to follow a consistent rhythm, return to the home row, and correct each error without losing focus.',
      'Modern students need keyboard fluency for taking notes, conducting research, writing programs, and collaborating online. Strong typing habits make every digital task feel smoother and more manageable.',
    ],
    Hard: [
      'Consistency under pressure separates quick typists from reliable high-performing competitors. When the timer begins, protect your accuracy, read several words ahead, and avoid letting one mistake destroy your rhythm.',
      'A clean typing flow depends on posture, breathing, anticipation, and controlled corrections. Skilled typists balance speed with precision while adapting to punctuation, unfamiliar vocabulary, and sudden changes in sentence structure.',
    ],
    Expert: [
      'Exceptional keyboard mastery combines precision, endurance, vocabulary recognition, and calm decision-making across unfamiliar passages. The strongest competitors maintain deliberate control even when technical terms, punctuation marks, and complex sentence patterns appear without warning.',
      'When programmers type complex syntax, every bracket, quotation mark, operator, and indentation choice becomes part of the performance. Reliable speed emerges from understanding the structure, anticipating the next token, and correcting small errors before they spread through the entire solution.',
    ],
  },
  Filipino: {
    Easy: [
      'Ang mabilis na pagta-type ay nagsisimula sa tamang pagsasanay araw-araw. Panatilihing magaan ang pagpindot, tumingin sa screen, at unahin ang malinaw at wastong mga salita bago dagdagan ang bilis.',
      'Panatilihing kalmado ang kamay at isip habang sumusulat sa keyboard. Ang maikling ensayo tuwing umaga at gabi ay nakatutulong upang maging mas pamilyar ang bawat letra at galaw ng daliri.',
    ],
    Medium: [
      'Mas madaling matuto kapag malinaw ang layunin at tuloy-tuloy ang pagsubok. Sukatin ang bilis, bantayan ang katumpakan, at ayusin ang mga karaniwang pagkakamali sa halip na magmadali sa bawat pangungusap.',
      'Ang teknolohiya ay nagbubukas ng maraming pagkakataon para sa masipag na mag-aaral. Sa mahusay na pagta-type, mas mabilis gumawa ng ulat, maghanap ng impormasyon, at makipagtulungan sa mga kaklase.',
    ],
    Hard: [
      'Sa bawat hamon, nasusukat ang bilis, tiyaga, at katumpakan ng isang mahusay na typist. Mahalagang manatiling kalmado kapag may mahirap na salita, bantas, o pangungusap na nangangailangan ng masusing pag-unawa.',
      'Mahusay ang resulta kapag pinagsama ang disiplina, pag-unawa, at regular na pagsasanay. Ang tunay na progreso ay nakikita sa kakayahang mapanatili ang maayos na ritmo kahit humahaba at nagiging mas teknikal ang teksto.',
    ],
    Expert: [
      'Ang propesyonal na kasanayan sa keyboard ay mahalaga sa pananaliksik, komunikasyon, pagbuo ng programa, at malikhaing gawain. Kailangang pagsabayin ang mabilis na pagkilala sa salita, eksaktong paggamit ng bantas, at maingat na pagwawasto upang makagawa ng malinaw at mapagkakatiwalaang output.',
      'Kapag mabilis ang daliri ngunit maingat ang pag-iisip, nagiging mas matatag ang bawat pangungusap. Ang mahusay na typist ay marunong magbasa nang mas maaga, umangkop sa komplikadong bokabularyo, at panatilihin ang katumpakan kahit may mahigpit na oras at matinding kompetisyon.',
    ],
  },
  Cebuano: {
    Easy: [
      'Ang paspas nga pag-type magsugod sa klaro ug makanunayong praktis. Hinaya ang pagpislit, tan-awa ang screen, ug siguroha nga husto ang matag pulong sa dili pa nimo dugangan ang imong tulin.',
      'Ayaw pagdali pag-ayo aron malikayan ang daghang sayop. Ang mubo nga praktis kada buntag ug gabii makatabang sa imong mga tudlo nga maanad sa husto nga lugar sa matag letra.',
    ],
    Medium: [
      'Ang husto nga ritmo makatabang sa estudyante nga mas mopaspas ug molig-on. Bantayi ang imong katukma, balik kanunay sa home row, ug ayaw tugoti nga ang usa ka sayop makaguba sa tibuok dagan.',
      'Sa matag pagsulay, mas mailhan nimo ang imong kusog ug kulang. Isulat ang imong resulta, praktisi ang lisod nga mga pulong, ug hinay-hinay nga dugangi ang tulin samtang nagpabiling kalma.',
    ],
    Hard: [
      'Kinahanglan ang kalma, tukma nga pagtan-aw, ug lig-on nga konsentrasyon sa keyboard. Kung magsugod na ang oras, basaha daan ang sunod nga mga pulong ug kontrola ang mga correction aron dili mawala ang ritmo.',
      'Ang maayong typist kahibalo mopadayon bisan adunay lisod nga mga pulong, punctuation, ug taas nga mga sentence. Ang tinuod nga kahanas makita sa makanunayong katukma bisan nagkadako ang pressure sa kompetisyon.',
    ],
    Expert: [
      'Ang teknikal nga kahibalo ug paspas nga pag-type makahatag og dako nga bentaha sa moderno nga pagkat-on. Ang eksperyensiyadong typist makahimo sa pag-ila sa komplikadong bokabularyo, pagdumala sa punctuation, ug pagpadayon sa tukma nga ritmo bisan dili pamilyar ang teksto.',
      'Kung ang katukma ug kadali magtinabangay, ang matag output mahimong limpyo ug kasaligan. Ang kusgan nga performer mobasa og pipila ka pulong sa unahan, motubag dayon sa sayop, ug magpabiling kontrolado samtang nag-atubang sa taas ug teknikal nga paragraph.',
    ],
  },
};

export const codeSnippets = {
  HTML: '<main class="game-shell">\n  <section class="race-card" aria-labelledby="race-title">\n    <h1 id="race-title">TypeRush Championship</h1>\n    <p>Complete the passage before your opponents cross the finish line.</p>\n    <button type="button" data-action="start">Start New Race</button>\n  </section>\n</main>',
  CSS: '.race-card {\n  display: grid;\n  gap: 1rem;\n  padding: 1.5rem;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 0.75rem;\n  background: linear-gradient(135deg, #101827, #172554);\n  color: #f8fafc;\n}\n.race-card button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 0 24px rgba(53, 244, 140, 0.4);\n}',
  JavaScript: 'function calculateRaceScore(results, multiplier = 1) {\n  const correctWords = results.filter((word) => word.correct);\n  const accuracy = results.length ? correctWords.length / results.length : 0;\n  const baseScore = correctWords.reduce((total, word) => total + word.length, 0);\n  return Math.round(baseScore * accuracy * multiplier);\n}\nconsole.log(calculateRaceScore(words, 1.25));',
  TypeScript: 'type RaceResult = {\n  username: string;\n  wpm: number;\n  accuracy: number;\n  finishedAt: number;\n};\n\nfunction rankPlayers(results: RaceResult[]): RaceResult[] {\n  return [...results].sort((first, second) => {\n    if (first.finishedAt !== second.finishedAt) return first.finishedAt - second.finishedAt;\n    return second.accuracy - first.accuracy;\n  });\n}',
  Python: 'def calculate_wpm(correct_characters, elapsed_seconds):\n    if correct_characters <= 0 or elapsed_seconds <= 0:\n        return 0.0\n    minutes = elapsed_seconds / 60\n    standard_words = correct_characters / 5\n    return round(standard_words / minutes, 1)\n\nresult = calculate_wpm(245, 60)\nprint(f"Typing speed: {result} WPM")',
  Java: 'public final class TypingResult {\n    private final int correctCharacters;\n    private final double elapsedSeconds;\n\n    public TypingResult(int correctCharacters, double elapsedSeconds) {\n        this.correctCharacters = Math.max(0, correctCharacters);\n        this.elapsedSeconds = Math.max(1.0, elapsedSeconds);\n    }\n\n    public double calculateWpm() {\n        return (correctCharacters / 5.0) / (elapsedSeconds / 60.0);\n    }\n}',
  PHP: '<?php\nfunction calculateAccuracy(int $correct, int $typed): float {\n    if ($typed <= 0 || $correct <= 0) {\n        return 0.0;\n    }\n    $percentage = ($correct / $typed) * 100;\n    return round(max(0, min(100, $percentage)), 1);\n}\n\n$accuracy = calculateAccuracy(238, 250);\necho "Accuracy: {$accuracy}%";',
  SQL: 'select\n  p.username,\n  round(avg(t.wpm), 1) as average_wpm,\n  round(max(t.accuracy), 1) as best_accuracy,\n  count(t.id) as completed_tests\nfrom profiles as p\njoin typing_tests as t on t.user_id = p.id\nwhere t.completed_at >= current_date - interval \'30 days\'\ngroup by p.id, p.username\nhaving count(t.id) >= 3\norder by average_wpm desc, best_accuracy desc\nlimit 20;',
};

export const studentLessons = [
  { level: 'Beginner', topic: 'Computer Basics', text: 'A computer receives input, follows stored instructions, processes information, and produces useful output. People use computers to write documents, communicate with others, organize records, explore creative ideas, and solve practical problems at school, work, and home.' },
  { level: 'Beginner', topic: 'Information Technology', text: 'Information technology connects people, systems, data, and services through useful digital tools. IT professionals install equipment, maintain applications, assist users, protect important files, and make sure that everyday technology remains dependable and accessible.' },
  { level: 'Intermediate', topic: 'Networking', text: 'A computer network allows connected devices to exchange data and share resources by following agreed rules called protocols. Routers guide traffic between networks, switches connect local devices, and administrators monitor performance to keep communication fast, stable, and secure.' },
  { level: 'Intermediate', topic: 'Database Systems', text: 'Database systems organize related records so applications can search, update, protect, and report information efficiently. A thoughtful design reduces duplication, preserves consistency, controls access, and helps users turn large collections of raw data into reliable decisions.' },
  { level: 'Advanced', topic: 'Cybersecurity', text: 'Cybersecurity teams reduce risk by protecting identities, monitoring systems, correcting vulnerable software, and responding quickly to suspicious activity. Strong security combines trained people, clear procedures, layered technical controls, careful testing, and regular recovery exercises.' },
  { level: 'Advanced', topic: 'Artificial Intelligence', text: 'Artificial intelligence systems learn useful patterns from examples to support predictions, recommendations, language processing, and automation. Responsible development requires representative data, measurable evaluation, human oversight, privacy safeguards, and honest communication about uncertainty and limitations.' },
];
