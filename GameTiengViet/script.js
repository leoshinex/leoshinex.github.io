let words = [];
let preloadedWords = [];
let currentWord = null;
let score = 0;

// ======================
// LOAD DATA
// ======================
fetch("words.json")
    .then(res => res.json())
    .then(data => {
        words = data;
        preloadWords();
        nextWord();
    });

// ======================
// PRELOAD WORDS (giống Python)
// ======================
function preloadWords() {
    preloadedWords = words.filter(w => !w.played);
    shuffleArray(preloadedWords);
}

// ======================
// SCRAMBLE WORD
// ======================
function scrambleWord(word) {
    let processed = word.replace(/\s+/g, "");
    let chars = processed.split("");

    if (chars.length > 0) {
        chars[0] = chars[0].toUpperCase();
    }

    shuffleArray(chars);
    return chars.join(" / ");
}

// ======================
// ANAGRAM CHECK
// ======================
function isAnagram(a, b) {
    let w1 = a.replace(/\s+/g, "").toLowerCase();
    let w2 = b.replace(/\s+/g, "").toLowerCase();

    if (w1.length !== w2.length) return false;

    return w1.split("").sort().join("") ===
           w2.split("").sort().join("");
}

// ======================
// NEXT WORD
// ======================
function nextWord() {
    if (preloadedWords.length === 0) {
        document.getElementById("scrambled-word").innerText =
            "HẾT TỪ!";
        return;
    }

    currentWord = preloadedWords.shift();
    currentWord.played = true;

    document.getElementById("scrambled-word").innerText =
        scrambleWord(currentWord.word);

    document.getElementById("guess-input").value = "";
    document.getElementById("guess-input").focus();
    document.getElementById("status").innerText = "";
}

// ======================
// CHECK GUESS
// ======================
document.getElementById("guess-input")
    .addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;

        if (!currentWord) return;

        let guess = this.value.trim();
        let correct = currentWord.word.trim();

        let isCorrect = false;

        // ĐÚNG TUYỆT ĐỐI
        if (guess.toLowerCase() === correct.toLowerCase()) {
            isCorrect = true;
        }
        // ANAGRAM HỢP LỆ
        else {
            let validWords = words.map(w => w.word.toLowerCase());
            if (
                validWords.includes(guess.toLowerCase()) &&
                isAnagram(guess, correct)
            ) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            score++;
            document.getElementById("status").innerText = "ĐÚNG!";
            document.getElementById("status").style.color = "green";
        } else {
            document.getElementById("status").innerText = "SAI!";
            document.getElementById("status").style.color = "red";
        }

        document.getElementById("score").innerText =
            `Điểm: ${score}`;

        setTimeout(nextWord, 200);
    });

// ======================
// UTILS
// ======================
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
