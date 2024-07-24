"use client"
import { useState } from 'react';
import parse from 'html-react-parser';
import { diffWords } from 'diff';

// Function to split text into sentences
function splitIntoSentences(text) {
  return text.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+/g);
}

export default function Home() {
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('');
  const [highlightedContent1, setHighlightedContent1] = useState('');
  const [highlightedContent2, setHighlightedContent2] = useState('');

  const handleCompare = () => {
    const sentences1 = splitIntoSentences(content1);
    const sentences2 = splitIntoSentences(content2);

    const highlighted1 = [];
    const highlighted2 = [];

    const maxLength = Math.max(sentences1.length, sentences2.length);

    for (let i = 0; i < maxLength; i++) {
      const sentence1 = sentences1[i] || '';
      const sentence2 = sentences2[i] || '';

      const diff = diffWords(sentence1, sentence2);

      const highlightedSentence1 = [];
      const highlightedSentence2 = [];

      diff.forEach((part) => {
        if (part.added) {
          highlightedSentence2.push(`<span class="bg-red-600 text-white">${part.value}</span>`);
        } else if (part.removed) {
          highlightedSentence1.push(`<span class="bg-red-600 text-white">${part.value}</span>`);
        } else {
          highlightedSentence1.push(part.value);
          highlightedSentence2.push(part.value);
        }
      });

      highlighted1.push(highlightedSentence1.join(''));
      highlighted2.push(highlightedSentence2.join(''));
    }

    setHighlightedContent1(highlighted1.join(' '));
    setHighlightedContent2(highlighted2.join(' '));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Content Difference Checker</h1>
      <div className="flex space-x-4 mb-4">
        <textarea
          value={content1}
          onChange={(e) => setContent1(e.target.value)}
          placeholder="Prediction"
          rows="10"
          className="w-96 p-2 border border-gray-300 rounded shadow-sm bg-black text-white"
        />
        <textarea
          value={content2}
          onChange={(e) => setContent2(e.target.value)}
          placeholder="Label"
          rows="10"
          className="w-96 p-2 border border-gray-300 rounded shadow-sm bg-black text-white"
        />
      </div>
      <button
        onClick={handleCompare}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Compare
      </button>
      <div className="flex space-x-4 mt-6">
        <div className="w-96 p-2 border border-gray-300 rounded shadow-sm bg-black text-white h-64 overflow-y-auto">
          {parse(highlightedContent1)}
        </div>
        <div className="w-96 p-2 border border-gray-300 rounded shadow-sm bg-black text-white h-64 overflow-y-auto">
          {parse(highlightedContent2)}
        </div>
      </div>
    </div>
  );
}
