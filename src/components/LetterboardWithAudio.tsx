import { WithAudioPlayback } from '../components/WithAudioPlayback';
import { Letterboard } from '../components/letterboard';

const LetterboardWithAudio: React.FC = () => {
  return (
    <WithAudioPlayback>
      <Letterboard />
    </WithAudioPlayback>
  );
};

export default LetterboardWithAudio;
