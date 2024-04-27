import fs from 'fs';
import { ElevenLabsClient, play } from 'elevenlabs';

async function manipulatePronunciationAndGenerateAudio() {
    const apiKey = 'YOUR_API_KEY';
    const elevenlabs = new ElevenLabsClient({ apiKey });

    // Step 1: Create a Pronunciation Dictionary from an XML File
    const xmlFile = fs.createReadStream('path/to/your/dictionary.xml');
    const dictionaryResponse = await elevenlabs.pronunciationDictionary.addFromFile(xmlFile, {
        name: "CustomPronunciation",
        description: "Dictionary including custom pronunciations for words."
    });
    console.log("Pronunciation Dictionary ID:", dictionaryResponse.id);

    // Step 2: Generate Audio for the Word "tomato" with Pronunciation Dictionary
    const audio = await elevenlabs.textToSpeech.convert("voice_id_of_Rachel", {
        text: "tomato",
        model_id: "eleven_multilingual_v2",
        pronunciation_dictionary_locators: [{ pronunciation_dictionary_id: dictionaryResponse.id, version_id: dictionaryResponse.version_id }]
    });
    await play(audio);

    // Step 3: Remove Tomato Rules from the Pronunciation Dictionary
    const removalResponse = await elevenlabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary(dictionaryResponse.id, {
        rule_strings: ["tomato", "Tomato"]
    });
    console.log("Rules Removal Status:", removalResponse);

    // Step 4: Generate Audio for "tomato" Without Pronunciation Adjustments
    const audioPlain = await elevenlabs.textToSpeech.convert("voice_id_of_Rachel", {
        text: "tomato",
        model_id: "eleven_multilingual_v2"
    });
    await play(audioPlain);

    // Step 5: Add Tomato Rules Again Using Phonemes
    const addResponse = await elevenlabs.pronunciationDictionary.addRulesToThePronunciationDictionary(dictionaryResponse.id, {
        rules: [{
            type: "phoneme",
            string_to_replace: "tomato",
            phoneme: "tə'mɑː.toʊ",
            alphabet: "ipa"
        }]
    });
    console.log("Rules Added Status:", addResponse);

    // Step 6: Generate and Play Audio for "tomato" After Re-adding Custom Pronunciations
    const audioCustom = await elevenlabs.textToSpeech.convert("voice_id_of_Rachel", {
        text: "tomato",
        model_id: "eleven_multilingual_v2",
        pronunciation_dictionary_locators: [{ pronunciation_dictionary_id: dictionaryResponse.id, version_id: dictionaryResponse.version_id }]
    });
    await play(audioCustom);
}

manipulatePronunciationAndGenerateAudio().catch(console.error);
