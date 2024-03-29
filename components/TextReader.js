import React from 'react';
import { Text } from 'react-native';

// Component that highlights a sentence within an array of sentences
export default function TextReader({ text, currSentence, style, highlightStyle }) {
  /**
   * @param {array} text an array of sentences
   * @param {number} currSentence the number of the sentence to highlight. starts from 1
   * @param {object} style style to apply on the text
   * @param {object} highlightStyle style to apply for the highlighted sentence
   */

  // A space is added after every sentence
  // Separate Text component for adding a space to prevent it from being highlighted
  return (
    text !== null ? (
      <Text style={style}>
        {text.map((sentence, index) => {
          return index+1 !== currSentence ? 
            (
              <Text key={index}>{sentence.trim()+" "}</Text>
            ) : (
              <Text key={index}>
                <Text style={highlightStyle}>
                  {sentence.trim()}
                </Text>
                {" "}
              </Text>
            )
        })}
      </Text>
    ) : ( //For rendering of pages that have no text
      <Text style={[style, {textAlign: 'center', textAlignVertical: 'center', fontStyle: 'italic'}]}>
        This page is blank. Please change pages to continue playing.
      </Text>
    )
  )
}