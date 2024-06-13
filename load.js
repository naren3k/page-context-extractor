
/* Import tensor */ 
async function loadScripts() {
  const tfjsScript = document.createElement('script');
  tfjsScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
  document.head.appendChild(tfjsScript);

  const useScript = document.createElement('script');
  useScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder';
  document.head.appendChild(useScript);

  await new Promise(resolve => {
    useScript.onload = resolve;
  });
}

async function loadModel() {
  const model = await use.load();
  return model;
}

async function extractKeywords(text) {
  const model = await loadModel();
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]; // Split text into sentences

  const embeddings = await model.embed(sentences);
  const averageEmbedding = embeddings.mean(0);

  const sentenceScores = await embeddings.dot(averageEmbedding.transpose());

  const sortedSentences = sentences.map((sentence, index) => ({
    sentence,
    score: sentenceScores.arraySync()[index],
  })).sort((a, b) => b.score - a.score);

  const keywords = sortedSentences.slice(0, 5).map(item => item.sentence); // Extract top 5 sentences as keywords

  console.log('Extracted Keywords:', keywords);
  return keywords;
}

async function sendKeywordsToAPI(keywords) {
  const apiEndpoint = 'https://co-assistant.ui/feed';
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keywords })
    });
    const result = await response.json();
    console.log('API Response:', result);
  } catch (error) {
    console.error('Error sending keywords to API:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadScripts();
  const text = document.body.innerText;
  const keywords = await extractKeywords(text);
  await sendKeywordsToAPI(keywords);
});
