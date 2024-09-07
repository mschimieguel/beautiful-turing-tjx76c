import React, { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const TextEditor: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const updateHistory = (newText: string) => {
    const updatedHistory = [...history.slice(0, historyIndex + 1), newText];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleFormat = (tag: string) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (!selectedText) return;

    let formattedText = '';
    switch (tag) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'strike':
        formattedText = `<s>${selectedText}</s>`;
        break;
      default:
        break;
    }
    const newText = text + formattedText;
    setText(newText);
    updateHistory(newText);
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    const newText = text + emojiData.emoji;
    setText(newText);
    updateHistory(newText);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setText(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setText(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => handleFormat('bold')}>Negrito</button>
        <button onClick={() => handleFormat('italic')}>Itálico</button>
        <button onClick={() => handleFormat('strike')}>Texto Cortado</button>
        <button onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
          Emoji
        </button>
        <button onClick={handleUndo} disabled={historyIndex === 0}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={historyIndex === history.length - 1}>
          Redo
        </button>
      </div>

      {emojiPickerVisible && (
        <div>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}

      <div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            updateHistory(e.target.value);
          }}
          rows={10}
          cols={50}
          placeholder="Digite aqui seu texto..."
        />
      </div>
      <div>
        <h3>Pré-visualização:</h3>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

export default TextEditor;
