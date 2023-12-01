import React, {useState} from 'react';

const Input: React.FC<{
  onTextChange: (newText: string) => void,
  attemptPublish: boolean,
}> = ({onTextChange, attemptPublish}) => {
  const [textLength, setTextLength] = useState(0);
  const inputBoxStyle: React.CSSProperties = {
    background: '#333', // Dark background
    color: 'white', // Text color
    border: 'none', // No border
    // outline: '2px solid #4A4A4A', // Gray outline, 2px width
    outline: textLength > 1 ? '2px solid #4A4A4A' : (attemptPublish ? '2px solid red' : '2px solid #4A4A4A'), // Conditional outline
    borderRadius: '10px', // Rounded corners
    padding: '12px 20px', // Padding inside the input box
    width: '200px', // Width of the input box
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Box shadow effect
    margin: '8px 0' // Margin for spacing
  };
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextLength(event.target.value.length);
    onTextChange(event.target.value);
  };

  return (
    <div>
        {attemptPublish && textLength <= 1 && <span style={{ marginRight: '10px', color: 'red' }}>Enter a language</span>}
      <input
        type="text"
        placeholder="language of subs"
        style={inputBoxStyle}
        onChange={handleTextChange}
      />
    </div>
  );
};

export default Input;
