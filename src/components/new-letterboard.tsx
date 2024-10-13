import React, { useState } from "react";
import { X, Check } from "lucide-react";

const CustomKeyboard = () => {
  const [inputText, setInputText] = useState("");

  const keys = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O"],
    ["P", "Q", "R", "S", "T"],
    ["U", "V", "W", "X", "Y", "Z"],
    ["!", "@", "#", "%", "&", "?"],
  ];

  const handleKeyPress = (key) => {
    setInputText((prevText) => prevText + key);
  };

  const handleBackspace = () => {
    setInputText((prevText) => prevText.slice(0, -1));
  };

  const handleSpace = () => {
    setInputText((prevText) => prevText + " ");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 p-4">
        <input
          type="text"
          value={inputText}
          readOnly
          className="w-full p-2 text-lg border border-gray-300 rounded"
        />
      </div>
      <div className="bg-gray-200 p-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between mb-2">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="flex-1 h-12 mx-0.5 text-lg bg-white rounded-lg shadow"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-between">
          <button
            onClick={handleBackspace}
            className="flex-1 h-12 mx-0.5 text-lg bg-white rounded-lg shadow flex items-center justify-center"
          >
            <X size={20} />
          </button>
          <button
            onClick={() => handleKeyPress("123")}
            className="flex-1 h-12 mx-0.5 text-sm bg-white rounded-lg shadow"
          >
            123
          </button>
          <button
            onClick={handleSpace}
            className="flex-grow-[3] h-12 mx-0.5 text-sm bg-white rounded-lg shadow"
          >
            Space
          </button>
          <button className="flex-1 h-12 mx-0.5 text-sm bg-blue-600 text-white rounded-lg shadow flex items-center justify-center">
            <Check size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomKeyboard;
