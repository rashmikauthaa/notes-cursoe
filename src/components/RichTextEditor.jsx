import { useEffect, useRef } from 'react';

const RichTextEditor = ({ value, onChange }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Adjust textarea height to content
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleChange = (e) => {
    const textarea = e.target;
    // Adjust height as user types
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    onChange(textarea.value);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        className="w-full min-h-[300px] p-4 focus:outline-none resize-none font-mono whitespace-pre-wrap"
        placeholder="Start typing..."
      />
    </div>
  );
};

export default RichTextEditor; 