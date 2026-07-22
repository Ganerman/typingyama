import type { TypingResult } from '../types';

const createCard = async (result: TypingResult): Promise<File> => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable.');

  const gradient = context.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#07111f');
  gradient.addColorStop(1, '#172554');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1200, 630);
  context.strokeStyle = '#35f48c';
  context.lineWidth = 8;
  context.strokeRect(32, 32, 1136, 566);

  context.fillStyle = '#35f48c';
  context.font = '700 34px system-ui';
  context.fillText('TYPERUSH', 80, 105);
  context.fillStyle = '#ffffff';
  context.font = '900 58px system-ui';
  context.fillText(result.mode === 'Daily Challenge' ? 'Bisaya Daily Challenge' : 'Typing Result', 80, 190);

  context.fillStyle = '#35f48c';
  context.font = '900 150px system-ui';
  context.fillText(String(result.wpm), 75, 385);
  context.font = '800 34px system-ui';
  context.fillText('WPM', 365, 375);

  context.fillStyle = '#7dd3fc';
  context.font = '900 72px system-ui';
  context.fillText(`${result.accuracy}%`, 680, 360);
  context.font = '700 28px system-ui';
  context.fillText('ACCURACY', 690, 405);

  context.fillStyle = '#cbd5e1';
  context.font = '600 27px system-ui';
  context.fillText(`${result.language} • ${result.difficulty} • +${result.xpEarned} XP`, 80, 520);
  context.fillText('Kaya nimo akong score?', 780, 520);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not create result card.')), 'image/png'),
  );
  return new File([blob], `typerush-${result.mode.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' });
};

export const shareTypingResult = async (result: TypingResult): Promise<'shared' | 'downloaded'> => {
  const file = await createCard(result);
  const text = `Naka-${result.wpm} WPM ko with ${result.accuracy}% accuracy sa ${result.mode}! Kaya nimo akong score?`;
  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    await navigator.share({ title: 'TypeRush Result', text, files: [file] });
    return 'shared';
  }

  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
};
