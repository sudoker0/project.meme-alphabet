const letterContainer = document.querySelector("#letter_container")
const alphabet = "abcdefghijklmnopqrstuvwxyz"

interface Template {
    [key: string]: string
}
interface HTMLElement {
    replace(data: Template, prefix?: string): void
}

/**
 * Returns the first element that is a descendant of node that matches selectors.
 * @param selector CSS selector to select the element
 * @returns The element
 */
function qSel<T extends Element>(selector: string) { return document.querySelector<T>(selector) }

/**
 * Returns all element descendants of node that match selectors.
 * @param sel CSS selector to select elements
 * @returns List of elements
 */
function qSelAll<T extends Node>(sel: string) { return document.querySelectorAll(sel) as unknown as NodeListOf<T> }

HTMLElement.prototype.replace = function (data: Template, prefix: string = "$_") {
    const alternate_prefix = "id_dlr_";
    const _this: () => HTMLElement = () => this;
    for (const i in data) {
        const old = _this().innerHTML;
        const span: () => HTMLElement | null = () =>
            _this().querySelector(`span.reactive#${alternate_prefix}${encodeURIComponent(i)}`)
        if (span() == null) _this().innerHTML =
            old.replace(`${prefix}${i}`, `
                <span class="reactive" id="${alternate_prefix}${encodeURIComponent(i)}"></span>`)
        span().innerText = data[i]
    }
}

const alphabetData = {
    "a": {
        "audioData": [
            {
                "name": "ay im walking here",
                "src": "../sound/a/1.mp3"
            },
            {
                "name": "ahhhhhhhhhh",
                "src": "../sound/a/2.mp3"
            },
            {
                "name": "amogus",
                "src": "../sound/a/3.mp3"
            }
        ],
        "details": {
            "ipa": "/'ei/",
            "information": "A, or a, iz the 1st lettr and da 1st vowl of the latin alphabet, used in za modrn engrish alphabet, the alphabets of othr westrn european language & othr worldwide",
            "examples": [
                "clickb[a]it",
                "m[a]te",
                "gre[a]t"
            ],
            "images": [
                {
                    "name": "apple",
                    "src": "../img/example_image/a/1.jpg"
                },
                {
                    "name": "amazon",
                    "src": "../img/example_image/a/2.png"
                },
                {
                    "name": "ant",
                    "src": "../img/example_image/a/3.jpg"
                },
                {
                    "name": "australia",
                    "src": "../img/example_image/a/4.jpg"
                },
                {
                    "name": "among us",
                    "src": "../img/example_image/a/5.png"
                },
            ]
        }
    },
}

async function init() {
    qSel("#disable_animation")["checked"] = false;
}

async function createImageElm(src: string, alt: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
        const imgElm = document.createElement("img")
        imgElm.src = src
        imgElm.alt = alt

        imgElm.onload = () => {
            res(imgElm)
        }
        imgElm.onerror = rej
    })
}

async function generateAlphabet() {
    return new Promise(async (res, rej) => {
        for (const i of alphabet) {
            const letter = document.createElement("div")
            letter.setAttribute("tabindex", "0")
            letter.classList.add("letter")
            letter.setAttribute("data-letter", i)

            letter.onclick = () => {
                qSel("#letter_container").classList.add("hidden")
                qSel("#letter_display").classList.remove("hidden")

                showLetterDetail(i)
            }

            const imgElm = await createImageElm(`img/letters/letter-${i}.gif`, `Letter ${i.toLocaleUpperCase()}`)

            letter.appendChild(imgElm)
            letterContainer.appendChild(letter)
        }

        res("")
    })
}

function disableAlphabetAnim() {
    const condition: boolean = qSel<HTMLInputElement>("#disable_animation").checked
    if (condition) {
        for (const i of letterContainer.children) {
            const img = i.querySelector("img")
            img.setAttribute("prev-src", img.src)

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            const dataURL = canvas.toDataURL('image/png');
            img.src = dataURL
        }
    } else {
        for (const i of letterContainer.children) {
            const img = i.querySelector("img")
            img.src = img.getAttribute("prev-src")
        }
    }
}

function showLetterDetail(letter: string) {
    if (letter.length > 1) return;
    if (!alphabet.includes(letter)) return;

    const data = alphabetData[letter as keyof typeof alphabetData]
    const elm = qSel<HTMLElement>("#letter_display")
    elm.replace({
        "letter": letter,
        "ipa": data.details.ipa,
        "informations": data.details.information
    })

    const audioSamplesElm = elm.querySelector("#audio_samples")
    const letterExamplesElm = elm.querySelector("#letter_examples")
    const imageExamplesElm = elm.querySelector("#image_examples")

    while (audioSamplesElm.firstChild) {
        audioSamplesElm.removeChild(audioSamplesElm.lastChild)
    }

    while (letterExamplesElm.firstChild) {
        letterExamplesElm.removeChild(letterExamplesElm.lastChild)
    }

    while (imageExamplesElm.firstChild) {
        imageExamplesElm.removeChild(imageExamplesElm.lastChild)
    }

    qSel("#back_button")["onclick"] = returnToMainPage

    data.audioData.forEach(v => {
        const audioElm = document.createElement("div")
        audioElm.classList.add("audio_sample_container")
        const hr = document.createElement("hr")

        const p = document.createElement("p")
        const audio = document.createElement("audio")

        p.innerText = v.name
        audio.controls = true
        audio.src = v.src

        audioElm.append(p, audio)

        audioSamplesElm.append(audioElm, hr)
    })

    data.details.examples.forEach(v => {
        const liElm = document.createElement("li")
        liElm.innerText = v

        letterExamplesElm.append(liElm)
    })

    data.details.images.forEach(v => {
        const elm = document.createElement("img")
        elm.src = v.src
        elm.alt = v.name

        imageExamplesElm.append(elm)
    })
}

function returnToMainPage() {
    qSel("#letter_container").classList.remove("hidden")
    qSel("#letter_display").classList.add("hidden")
}

;
(async () => {
    await init()
    await generateAlphabet()

    qSel("#disable_animation")["onchange"] = disableAlphabetAnim
})()