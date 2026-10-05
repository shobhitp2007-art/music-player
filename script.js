/* =========================================================
   MUSICFLOW - FINAL JAVASCRIPT

   DATA STRUCTURES:

   1. Hash Table
      -> Song lookup / search

   2. Circular Doubly Linked List
      -> Playlist
      -> Next / Previous
      -> Circular navigation

   3. Stack
      -> Recently Played History

   API:
   -> iTunes Search API
   -> Used as the PRIMARY source of songs
   -> Fixed songs are ONLY an offline fallback
   ========================================================= */


/* =========================================================
   OFFLINE FALLBACK
   These are used ONLY if the API is unavailable.
   ========================================================= */

const FALLBACK_SONGS = [

    {
        id: "fallback-1",
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        artwork: "",
        previewUrl: "",
        color: "#ef4444"
    },

    {
        id: "fallback-2",
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "Divide",
        artwork: "",
        previewUrl: "",
        color: "#f59e0b"
    },

    {
        id: "fallback-3",
        title: "Believer",
        artist: "Imagine Dragons",
        album: "Evolve",
        artwork: "",
        previewUrl: "",
        color: "#8b5cf6"
    },

    {
        id: "fallback-4",
        title: "Faded",
        artist: "Alan Walker",
        album: "Different World",
        artwork: "",
        previewUrl: "",
        color: "#06b6d4"
    },

    {
        id: "fallback-5",
        title: "Perfect",
        artist: "Ed Sheeran",
        album: "Divide",
        artwork: "",
        previewUrl: "",
        color: "#ec4899"
    },

    {
        id: "fallback-6",
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        artwork: "",
        previewUrl: "",
        color: "#22c55e"
    }

];


/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_BASE =
    "https://itunes.apple.com/search";

const API_LIMIT = 24;


/* =========================================================
   1. CIRCULAR DOUBLY LINKED LIST
   ========================================================= */

class PlaylistNode {

    constructor(song) {

        this.song = song;

        this.next = null;

        this.prev = null;
    }

}


class CircularDoublyLinkedList {

    constructor() {

        this.head = null;

        this.tail = null;

        this.current = null;

        this.size = 0;

    }


    /*
        Insert song at the end.

        Example:

        A <-> B <-> C

        becomes

        A <-> B <-> C <-> D

        with D connected back to A.
    */

    append(song) {

        const newNode =
            new PlaylistNode(song);


        /* Empty list */

        if (this.head === null) {

            this.head = newNode;

            this.tail = newNode;


            /*
                Circular connections
            */

            newNode.next = newNode;

            newNode.prev = newNode;

        }


        /* Existing list */

        else {

            newNode.prev =
                this.tail;

            newNode.next =
                this.head;


            this.tail.next =
                newNode;

            this.head.prev =
                newNode;


            this.tail =
                newNode;

        }


        this.size++;


        /*
            First added song becomes
            current song.
        */

        if (this.current === null) {

            this.current =
                newNode;

        }


        return newNode;

    }


    /*
        Find a node by ID
    */

    findNode(id) {

        if (!this.head) {

            return null;

        }


        let node =
            this.head;


        for (
            let i = 0;
            i < this.size;
            i++
        ) {

            if (
                String(node.song.id) ===
                String(id)
            ) {

                return node;

            }


            node =
                node.next;

        }


        return null;

    }


    /*
        Set current node
    */

    setCurrent(id) {

        const node =
            this.findNode(id);


        if (!node) {

            return null;

        }


        this.current =
            node;


        return node.song;

    }


    /*
        NEXT SONG

        Circular DLL:
        current -> current.next

        Time Complexity:
        O(1)
    */

    nextSong() {

        if (!this.current) {

            return null;

        }


        this.current =
            this.current.next;


        return this.current.song;

    }


    /*
        PREVIOUS SONG

        Circular DLL:
        current -> current.prev

        Time Complexity:
        O(1)
    */

    previousSong() {

        if (!this.current) {

            return null;

        }


        this.current =
            this.current.prev;


        return this.current.song;

    }


    /*
        Remove song
    */

    remove(id) {

        if (!this.head) {

            return false;

        }


        const node =
            this.findNode(id);


        if (!node) {

            return false;

        }


        /*
            Only one node
        */

        if (this.size === 1) {

            this.head = null;

            this.tail = null;

            this.current = null;

            this.size = 0;

            return true;

        }


        /*
            Connect previous and next
        */

        node.prev.next =
            node.next;

        node.next.prev =
            node.prev;


        /*
            Update head
        */

        if (node === this.head) {

            this.head =
                node.next;

        }


        /*
            Update tail
        */

        if (node === this.tail) {

            this.tail =
                node.prev;

        }


        /*
            If current node was removed,
            move current to next node.
        */

        if (node === this.current) {

            this.current =
                node.next;

        }


        this.size--;


        return true;

    }


    /*
        Convert linked list to array
        only for displaying in UI.
    */

    toArray() {

        const result = [];


        if (!this.head) {

            return result;

        }


        let node =
            this.head;


        for (
            let i = 0;
            i < this.size;
            i++
        ) {

            result.push(node.song);

            node =
                node.next;

        }


        return result;

    }


    /*
        Clear complete list
    */

    clear() {

        this.head = null;

        this.tail = null;

        this.current = null;

        this.size = 0;

    }

}


/* =========================================================
   2. STACK
   ========================================================= */

class Stack {

    constructor() {

        this.items = [];

    }


    /*
        Add item to top
    */

    push(item) {

        this.items.push(item);

    }


    /*
        Remove top item
    */

    pop() {

        if (
            this.items.length === 0
        ) {

            return null;

        }


        return this.items.pop();

    }


    /*
        View top item
    */

    peek() {

        if (
            this.items.length === 0
        ) {

            return null;

        }


        return this.items[
            this.items.length - 1
        ];

    }


    /*
        Clear stack
    */

    clear() {

        this.items = [];

    }


    /*
        Number of items
    */

    size() {

        return this.items.length;

    }


    /*
        Newest first
    */

    toArray() {

        return [
            ...this.items
        ].reverse();

    }

}


/* =========================================================
   3. CUSTOM HASH TABLE
   ========================================================= */

class HashTable {

    constructor(capacity = 53) {

        this.capacity =
            capacity;


        /*
            Array of buckets

            Each bucket can contain
            multiple key-value pairs.
        */

        this.buckets =
            Array.from(
                {
                    length:
                        capacity
                },
                () => []
            );


        this.count = 0;

    }


    /*
        Hash function
    */

    hash(key) {

        const text =
            String(key)
                .toLowerCase()
                .trim();


        let hashValue = 0;


        for (
            let i = 0;
            i < text.length;
            i++
        ) {

            hashValue =
                (
                    hashValue * 31 +
                    text.charCodeAt(i)
                ) % this.capacity;

        }


        return hashValue;

    }


    /*
        Insert value
    */

    set(key, value) {

        const normalizedKey =
            String(key)
                .toLowerCase()
                .trim();


        const index =
            this.hash(
                normalizedKey
            );


        const bucket =
            this.buckets[index];


        /*
            Update if key already exists
        */

        const existing =
            bucket.find(
                pair =>
                    pair.key ===
                    normalizedKey
            );


        if (existing) {

            existing.value =
                value;

            return;

        }


        /*
            Add new key-value pair
        */

        bucket.push({

            key:
                normalizedKey,

            value:
                value

        });


        this.count++;

    }


    /*
        Exact search
    */

    get(key) {

        const normalizedKey =
            String(key)
                .toLowerCase()
                .trim();


        const index =
            this.hash(
                normalizedKey
            );


        const bucket =
            this.buckets[index];


        for (
            const pair of bucket
        ) {

            if (
                pair.key ===
                normalizedKey
            ) {

                return pair.value;

            }

        }


        return null;

    }


    /*
        Check whether key exists
    */

    has(key) {

        return (
            this.get(key) !==
            null
        );

    }


    /*
        Clear table
    */

    clear() {

        this.buckets =
            Array.from(
                {
                    length:
                        this.capacity
                },
                () => []
            );


        this.count = 0;

    }

}


/* =========================================================
   CREATE DATA STRUCTURES
   ========================================================= */

const playlist =
    new CircularDoublyLinkedList();


const history =
    new Stack();


const songTable =
    new HashTable(53);


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let catalogue = [];

let currentResults = [];

let currentSong = null;

let isPlaying = false;

let shuffle = false;

let repeat = false;

let lastVolume = 0.7;

let searchTimer = null;

let featuredRequestId = 0;

let searchRequestId = 0;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const audio =
    document.getElementById(
        "audio"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const clearSearch =
    document.getElementById(
        "clearSearch"
    );


const songGrid =
    document.getElementById(
        "songGrid"
    );


const songHeading =
    document.getElementById(
        "songHeading"
    );


const songCount =
    document.getElementById(
        "songCount"
    );


const playerImage =
    document.getElementById(
        "playerImage"
    );


const playerTitle =
    document.getElementById(
        "playerTitle"
    );


const playerArtist =
    document.getElementById(
        "playerArtist"
    );


const playPauseBtn =
    document.getElementById(
        "playPauseBtn"
    );


const previousBtn =
    document.getElementById(
        "previousBtn"
    );


const nextBtn =
    document.getElementById(
        "nextBtn"
    );


const progressBar =
    document.getElementById(
        "progressBar"
    );


const currentTime =
    document.getElementById(
        "currentTime"
    );


const duration =
    document.getElementById(
        "duration"
    );


const volumeBar =
    document.getElementById(
        "volumeBar"
    );


const toast =
    document.getElementById(
        "toast"
    );


const playlistList =
    document.getElementById(
        "playlistList"
    );


const playlistEmpty =
    document.getElementById(
        "playlistEmpty"
    );


const historyList =
    document.getElementById(
        "historyList"
    );


const historyEmpty =
    document.getElementById(
        "historyEmpty"
    );


/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function normalize(text) {

    return String(text || "")
        .toLowerCase()
        .trim();

}


function escapeHTML(text) {

    return String(text || "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secondsPart =
        Math.floor(
            seconds % 60
        )
            .toString()
            .padStart(
                2,
                "0"
            );


    return `${minutes}:${secondsPart}`;

}


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


function setStatus(
    message,
    type = "ok"
) {

    const statusText =
        document.getElementById(
            "statusText"
        );


    const statusDot =
        document.getElementById(
            "statusDot"
        );


    if (
        !statusText ||
        !statusDot
    ) {

        return;

    }


    statusText.textContent =
        message;


    if (
        type === "loading"
    ) {

        statusDot.style.background =
            "#3b82f6";

    }

    else if (
        type === "offline"
    ) {

        statusDot.style.background =
            "#f59e0b";

    }

    else {

        statusDot.style.background =
            "#22c55e";

    }

}


/* =========================================================
   FALLBACK COVER
   ========================================================= */

function getInitials(title) {

    return String(title || "Music")
        .split(" ")
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0)
        )
        .join("")
        .toUpperCase();

}


function fallbackCover(song) {

    const color =
        song.color ||
        "#8b5cf6";


    const initials =
        getInitials(
            song.title
        );


    return `

        <div
            class="cover-letter"
            style="
                background:
                linear-gradient(
                    135deg,
                    ${color},
                    #111827
                )
            "
        >

            ${escapeHTML(initials)}

        </div>

    `;

}


/* =========================================================
   HASH TABLE MANAGEMENT
   ========================================================= */

function addSongToHashTable(song) {

    /*
        Store song by ID
    */

    songTable.set(
        String(song.id),
        song
    );


    /*
        Store by exact title
    */

    songTable.set(
        normalize(
            song.title
        ),
        song
    );


    /*
        Store artist + title
    */

    songTable.set(

        normalize(
            `${song.artist} ${song.title}`
        ),

        song

    );

}


function rebuildHashTable() {

    songTable.clear();


    catalogue.forEach(
        song =>
            addSongToHashTable(song)
    );

}


/* =========================================================
   FIND SONG
   ========================================================= */

function findSongById(id) {

    /*
        First check Hash Table.
    */

    const hashResult =
        songTable.get(
            String(id)
        );


    if (hashResult) {

        return hashResult;

    }


    /*
        Then current search results.
    */

    const result =
        currentResults.find(
            song =>
                String(song.id) ===
                String(id)
        );


    if (result) {

        return result;

    }


    /*
        Finally catalogue.
    */

    return catalogue.find(
        song =>
            String(song.id) ===
            String(id)
    ) || null;

}

/* =========================================================
   PROFESSIONAL COVER SYSTEM
   ========================================================= */

/*
   These are the songs whose original covers
   will be replaced with professional-looking
   MusicFlow covers.
*/

const PROFESSIONAL_COVER_THEMES = {

    "nashe se chadh gyi": [
        "#111827",
        "#7c3aed",
        "#ec4899"
    ],

    "chaleya": [
        "#0f172a",
        "#2563eb",
        "#8b5cf6"
    ],

    "pardesiya": [
        "#111827",
        "#0f766e",
        "#14b8a6"
    ],

    "crew": [
        "#18181b",
        "#be123c",
        "#f97316"
    ],

    "soni soni": [
        "#172554",
        "#1d4ed8",
        "#06b6d4"
    ],

    "pop": [
        "#111827",
        "#c026d3",
        "#7c3aed"
    ],

    "janiye": [
        "#18181b",
        "#db2777",
        "#f59e0b"
    ],

    "illahi": [
        "#172554",
        "#0891b2",
        "#f59e0b"
    ],

    "closure": [
        "#111827",
        "#334155",
        "#8b5cf6"
    ]

};


/* =========================================================
   CREATE PROFESSIONAL SVG COVER
   ========================================================= */

function professionalCoverSVG(
    title,
    artist,
    theme
) {

    const [c1, c2, c3] = theme;


    /*
       Escape text so that it can safely
       be placed inside SVG.
    */

    const safeTitle =
        String(title || "Music")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");


    const safeArtist =
        String(artist || "Artist")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");


    /*
       Keep very long titles from
       overflowing the cover.
    */

    const shortTitle =
        safeTitle.length > 23
            ? safeTitle.slice(0, 22) + "…"
            : safeTitle;


    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="800"
            viewBox="0 0 800 800"
        >

            <defs>

                <linearGradient
                    id="bg"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >

                    <stop
                        offset="0%"
                        stop-color="${c1}"
                    />

                    <stop
                        offset="52%"
                        stop-color="${c2}"
                    />

                    <stop
                        offset="100%"
                        stop-color="${c3}"
                    />

                </linearGradient>


                <radialGradient
                    id="glow1"
                    cx="75%"
                    cy="18%"
                    r="55%"
                >

                    <stop
                        offset="0%"
                        stop-color="#ffffff"
                        stop-opacity=".22"
                    />

                    <stop
                        offset="100%"
                        stop-color="#ffffff"
                        stop-opacity="0"
                    />

                </radialGradient>


                <radialGradient
                    id="glow2"
                    cx="20%"
                    cy="80%"
                    r="48%"
                >

                    <stop
                        offset="0%"
                        stop-color="#ffffff"
                        stop-opacity=".14"
                    />

                    <stop
                        offset="100%"
                        stop-color="#ffffff"
                        stop-opacity="0"
                    />

                </radialGradient>

            </defs>


            <!-- Background -->

            <rect
                width="800"
                height="800"
                fill="url(#bg)"
            />


            <!-- Soft lighting -->

            <rect
                width="800"
                height="800"
                fill="url(#glow1)"
            />


            <rect
                width="800"
                height="800"
                fill="url(#glow2)"
            />


            <!-- Decorative circles -->

            <circle
                cx="650"
                cy="145"
                r="120"
                fill="none"
                stroke="#ffffff"
                stroke-opacity=".16"
                stroke-width="2"
            />


            <circle
                cx="650"
                cy="145"
                r="88"
                fill="none"
                stroke="#ffffff"
                stroke-opacity=".11"
                stroke-width="2"
            />


            <circle
                cx="150"
                cy="650"
                r="150"
                fill="none"
                stroke="#ffffff"
                stroke-opacity=".10"
                stroke-width="2"
            />


            <!-- Brand -->

            <text
                x="64"
                y="94"
                font-family="Arial, Helvetica, sans-serif"
                font-size="25"
                font-weight="700"
                letter-spacing="7"
                fill="#ffffff"
                fill-opacity=".82"
            >
                MUSICFLOW
            </text>


            <!-- Song title -->

            <text
                x="64"
                y="525"
                font-family="Arial, Helvetica, sans-serif"
                font-size="61"
                font-weight="800"
                fill="#ffffff"
            >
                ${shortTitle}
            </text>


            <!-- Artist -->

            <text
                x="64"
                y="575"
                font-family="Arial, Helvetica, sans-serif"
                font-size="24"
                font-weight="500"
                fill="#ffffff"
                fill-opacity=".76"
            >
                ${safeArtist}
            </text>


            <!-- Accent line -->

            <rect
                x="64"
                y="628"
                width="120"
                height="5"
                rx="3"
                fill="#ffffff"
                fill-opacity=".75"
            />


            <!-- Footer -->

            <text
                x="64"
                y="705"
                font-family="Arial, Helvetica, sans-serif"
                font-size="18"
                font-weight="600"
                letter-spacing="4"
                fill="#ffffff"
                fill-opacity=".55"
            >
                SMART MUSIC PLAYER
            </text>

        </svg>

    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* =========================================================
   GET PROFESSIONAL COVER
   ========================================================= */

/* =========================================================
   GET PROFESSIONAL COVER
   ========================================================= */

/* =========================================================
   GET PROFESSIONAL COVER
   ========================================================= */

function getProfessionalCover(
    title,
    artist = "",
    album = ""
) {

    const cleanTitle =
        normalize(title)
            .replace(/[^a-z0-9]+/g, " ")
            .trim();

    const cleanArtist =
        normalize(artist)
            .replace(/[^a-z0-9]+/g, " ")
            .trim();

    const cleanAlbum =
        normalize(album)
            .replace(/[^a-z0-9]+/g, " ")
            .trim();


    /*
       Combine title, artist and album.

       This makes the matching much more reliable
       when iTunes adds extra text.
    */

    const combined =
        `${cleanTitle} ${cleanArtist} ${cleanAlbum}`;


    let theme = null;


    /* =====================================================
       NASHE SE CHADH GYI
       ===================================================== */

    if (
        combined.includes("nashe se chadh gyi") ||
        combined.includes("nashe se chadh gayi") ||
        combined.includes("nashe si chadh gayi")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "nashe se chadh gyi"
            ];

    }


    /* =====================================================
       CHALEYA
       ===================================================== */

    else if (
        combined.includes("chaleya")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "chaleya"
            ];

    }


    /* =====================================================
       PARDESIYA
       ===================================================== */

    else if (
        combined.includes("pardesiya")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "pardesiya"
            ];

    }


    /* =====================================================
       CREW
       ===================================================== */

    else if (
        cleanTitle === "crew" ||
        cleanTitle.includes(" crew ") ||
        cleanTitle.startsWith("crew ") ||
        cleanTitle.endsWith(" crew") ||
        cleanAlbum === "crew" ||
        cleanAlbum.includes("crew")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "crew"
            ];

    }


    /* =====================================================
       SONI SONI
       ===================================================== */

    else if (
        combined.includes("soni soni")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "soni soni"
            ];

    }


    /* =====================================================
       POP
       ===================================================== */

    else if (
        cleanTitle === "pop" ||
        cleanTitle.startsWith("pop ") ||
        cleanTitle.endsWith(" pop") ||
        cleanTitle.includes(" pop ") ||
        cleanAlbum === "pop" ||
        cleanAlbum.includes("pop")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "pop"
            ];

    }


    /* =====================================================
       JANIYE
       ===================================================== */

    else if (
        combined.includes("janiye")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "janiye"
            ];

    }


    /* =====================================================
       ILLAHI
       ===================================================== */

    else if (
        combined.includes("illahi")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "illahi"
            ];

    }

        /* =====================================================
       POI SONNAL
       ===================================================== */

    else if (
        cleanTitle.includes("poi sonnal") ||
        cleanAlbum.includes("run")
    ) {

        theme = [
            "#0f172a",
            "#7c2d12",
            "#f97316"
        ];

    }

        /* =====================================================
       ENNA VILAI
       ===================================================== */

    else if (
        cleanTitle.includes("enna vilai")
    ) {

        theme = [
            "#172554",
            "#9333ea",
            "#ec4899"
        ];

    }

    /* =====================================================
       CLOSER
       ===================================================== */

    else if (
        cleanTitle === "closer" ||
        cleanTitle.startsWith("closer ") ||
        cleanTitle.includes(" closer ") ||
        cleanTitle.endsWith(" closer") ||
        cleanAlbum === "closer" ||
        cleanAlbum.includes("closer")
    ) {

        theme = [
            "#111827",
            "#334155",
            "#8b5cf6"
        ];

    }


    /* =====================================================
       CLOSURE
       ===================================================== */

    else if (
        cleanTitle === "closure" ||
        cleanTitle.startsWith("closure ") ||
        cleanTitle.includes(" closure ") ||
        cleanAlbum === "closure" ||
        cleanAlbum.includes("closure")
    ) {

        theme =
            PROFESSIONAL_COVER_THEMES[
                "closure"
            ];

    }


    /* =====================================================
       NO MATCH
       ===================================================== */

    if (!theme) {

        return null;

    }


    /* =====================================================
       GENERATE PROFESSIONAL COVER
       ===================================================== */

    return professionalCoverSVG(
        title,
        artist,
        theme
    );

    function getArtworkForSong(item) {

    const title =
        normalize(item.trackName)
            .replace(/[^a-z0-9]+/g, " ")
            .trim();


    /* POI SONNAL */

    if (
        title.includes("poi") &&
        title.includes("sonnal")
    ) {

        return professionalCoverSVG(
            item.trackName,
            item.artistName || "Hariharan & Sadhana Sargam",
            [
                "#0f172a",
                "#7c2d12",
                "#f97316"
            ]
        );

    }


    /* ENNA VILAI */

    if (
        title.includes("enna") &&
        title.includes("vilai")
    ) {

        return professionalCoverSVG(
            item.trackName,
            item.artistName || "Unni Menon",
            [
                "#172554",
                "#9333ea",
                "#ec4899"
            ]
        );

    }


    /* ALL OTHER PROFESSIONAL COVERS */

    return getProfessionalCover(
        item.trackName,
        item.artistName,
        item.collectionName
    );

}

}

/* =========================================================
   NORMALIZE API RESPONSE
   ========================================================= */

function normalizeApiResults(data) {

    if (
        !data ||
        !Array.isArray(
            data.results
        )
    ) {

        return [];

    }


    return data.results

        .filter(
            item =>
                item.trackName &&
                item.previewUrl
        )

        .map(
            item => ({

                id:
                    `api-${item.trackId}`,


                title:
                    item.trackName,


                artist:
                    item.artistName ||
                    "Unknown Artist",


                album:
                    item.collectionName ||
                    "Single",


                /*
                   FIRST:
                   Use our professional cover
                   when the song is one of
                   the selected songs.

                   OTHERWISE:
                   Use the original iTunes cover.
                */

                artwork:

                    getProfessionalCover(
    item.trackName,
    item.artistName,
    item.collectionName
)

                    ||

                    (
                        item.artworkUrl100

                            ?

                        item.artworkUrl100.replace(
                            "100x100",
                            "600x600"
                        )

                            :

                        ""
                    ),


                previewUrl:
                    item.previewUrl,


                color:
                    "#8b5cf6"

            })
        );

}

    


/* =========================================================
   API REQUEST
   ========================================================= */

async function requestSongs(
    term,
    limit = API_LIMIT
) {

    const params =
        new URLSearchParams({

            term:
                term,

            entity:
                "song",

            media:
                "music",

            country:
                "IN",

            limit:
                String(limit)

        });


    const response =
        await fetch(

            `${API_BASE}?${params.toString()}`

        );


    if (
        !response.ok
    ) {

        throw new Error(
            `API error: ${response.status}`
        );

    }


    const data =
        await response.json();


    return normalizeApiResults(
        data
    );

}


/* =========================================================
   LOAD LIVE FEATURED SONGS
   ========================================================= */

async function loadFeaturedSongs() {

    const requestId =
        ++featuredRequestId;


    setStatus(
        "Loading live music...",
        "loading"
    );


    songHeading.textContent =
        "Loading Live Music...";


    songCount.textContent =
        "";


    songGrid.innerHTML = `

        <div
            class="empty"
            style="grid-column:1/-1"
        >

            <div>♫</div>

            <h3>
                Fetching songs...
            </h3>

            <p>
                Loading live songs from the music API.
            </p>

        </div>

    `;


    try {

        /*
            We use broad searches to populate
            the Home page.

            The actual song data is fetched
            from the API.
        */

        const queries = [

            "popular songs",

            "bollywood songs",

            "pop hits"

        ];


        const responses =
            await Promise.all(

                queries.map(
                    query =>
                        requestSongs(
                            query,
                            12
                        )
                )

            );


        /*
            Ignore outdated requests.
        */

        if (
            requestId !==
            featuredRequestId
        ) {

            return;

        }


        /*
            Merge and remove duplicates.
        */

        const merged = [];

        const seen =
            new Set();


        responses
            .flat()
            .forEach(song => {

                const key =
                    String(song.id);


                if (
                    !seen.has(key)
                ) {

                    seen.add(key);

                    merged.push(song);

                }

            });


        if (
            merged.length === 0
        ) {

            throw new Error(
                "No songs returned by API"
            );

        }


        /*
            API becomes our main catalogue.
        */

        catalogue =
            merged;


        currentResults =
            [...merged];


        /*
            Insert API songs into
            our own Hash Table.
        */

        rebuildHashTable();


        displaySongs(
            catalogue,
            "Live Music"
        );


        setStatus(
            "API Online",
            "ok"
        );

    }


    catch (error) {

        console.error(
            "Featured songs error:",
            error
        );


        /*
            API failed.

            Use fixed data ONLY as fallback.
        */

        catalogue =
            [...FALLBACK_SONGS];


        currentResults =
            [...catalogue];


        rebuildHashTable();


        displaySongs(
            catalogue,
            "Offline Demo Catalogue"
        );


        setStatus(
            "Offline Fallback",
            "offline"
        );


        showToast(
            "API unavailable. Offline demo loaded."
        );

    }

}


/* =========================================================
   SONG SEARCH
   ========================================================= */

async function searchSongs(query) {

    const cleanQuery =
        normalize(query);


    /*
        Empty search:
        show live catalogue.
    */

    if (!cleanQuery) {

        currentResults =
            [...catalogue];


        displaySongs(
            currentResults,
            "Live Music"
        );


        return;

    }


    /*
        FIRST:

        Search our custom Hash Table.

        Exact title lookup is O(1)
        on average.
    */

    const exact =
        songTable.get(
            cleanQuery
        );


    if (exact) {

        currentResults =
            [exact];


        displaySongs(
            currentResults,
            "Hash Table Exact Match"
        );


        setStatus(
            "Hash Table Search",
            "ok"
        );


        return;

    }


    const requestId =
        ++searchRequestId;


    setStatus(
        "Searching API...",
        "loading"
    );


    try {

        /*
            Search ANY song/artist
        */

        const results =
            await requestSongs(
                cleanQuery,
                API_LIMIT
            );


        /*
            Ignore older request.
        */

        if (
            requestId !==
            searchRequestId
        ) {

            return;

        }


        /*
            Insert API results into
            our custom Hash Table.
        */

        results.forEach(
            addSongToHashTable
        );


        currentResults =
            results;


        displaySongs(

            results,

            `Search Results for "${query}"`

        );


        setStatus(
            "API Online",
            "ok"
        );


        if (
            results.length === 0
        ) {

            showToast(
                "No playable songs found."
            );

        }

    }


    catch (error) {

        console.error(
            "Search error:",
            error
        );


        /*
            Offline search fallback.
        */

        const localResults =
            catalogue.filter(
                song =>

                    normalize(
                        song.title
                    ).includes(
                        cleanQuery
                    )

                    ||

                    normalize(
                        song.artist
                    ).includes(
                        cleanQuery
                    )
            );


        currentResults =
            localResults;


        displaySongs(
            localResults,
            "Offline Search Results"
        );


        setStatus(
            "Offline Fallback",
            "offline"
        );

    }

}


/* =========================================================
   DISPLAY SONG CARDS
   ========================================================= */

function displaySongs(
    songs,
    heading
) {

    songHeading.textContent =
        heading;


    songCount.textContent =
        `${songs.length} songs`;


    if (
        songs.length === 0
    ) {

        songGrid.innerHTML = `

            <div
                class="empty"
                style="grid-column:1/-1"
            >

                <div>🔍</div>

                <h3>
                    No songs found
                </h3>

                <p>
                    Try another title or artist.
                </p>

            </div>

        `;

        return;

    }


    songGrid.innerHTML =

        songs.map(
            song => `

                <article
                    class="song-card"
                >

                    <div
                        class="cover"
                    >

                        ${
                            song.artwork

                            ?

                            `

                            <img
                                src="${escapeHTML(
                                    song.artwork
                                )}"
                                alt="${escapeHTML(
                                    song.title
                                )}"
                                onerror="
    this.onerror=null;
    this.parentElement.innerHTML =
    '<div class=&quot;cover-letter&quot; style=&quot;background:linear-gradient(135deg,#172554,#9333ea,#ec4899)&quot;>♪</div>';
"
                            >

                            `

                            :

                            fallbackCover(
                                song
                            )

                        }

                    </div>


                    <div
                        class="song-info"
                    >

                        <h3
                            title="${escapeHTML(
                                song.title
                            )}"
                        >

                            ${escapeHTML(
                                song.title
                            )}

                        </h3>


                        <p
                            title="${escapeHTML(
                                song.artist
                            )}"
                        >

                            ${escapeHTML(
                                song.artist
                            )}

                        </p>


                        <div
                            class="song-actions"
                        >

                            <button
                                class="play-song"
                                onclick="
                                    playById(
                                        '${escapeHTML(
                                            String(song.id)
                                        )}'
                                    )
                                "
                            >

                                ▶ Play

                            </button>


                            <button
                                onclick="
                                    addSongById(
                                        '${escapeHTML(
                                            String(song.id)
                                        )}'
                                    )
                                "
                            >

                                + Playlist

                            </button>

                        </div>

                    </div>

                </article>

            `
        )

        .join("");

}


/* =========================================================
   ADD SONG
   ========================================================= */

function addSong(song) {

    if (!song) {

        showToast(
            "Song not available."
        );

        return;

    }


    /*
        Check whether song is already
        in Circular DLL.
    */

    const exists =
        playlist
            .toArray()
            .some(
                item =>
                    String(item.id) ===
                    String(song.id)
            );


    if (exists) {

        showToast(
            "Song already in playlist."
        );

        return;

    }


    /*
        Insert into Circular DLL.
    */

    playlist.append(
        song
    );


    renderPlaylist();


    showToast(
        `"${song.title}" added to playlist.`
    );

}


function addSongById(id) {

    const song =
        findSongById(id);


    addSong(song);

}


window.addSongById =
    addSongById;


/* =========================================================
   PLAY SONG
   ========================================================= */

function playSong(
    song,
    options = {}
) {

    if (!song) {

        showToast(
            "Song not available."
        );

        return;

    }


    const pushHistory =
        options.pushHistory !== false;


    currentSong =
        song;


    /*
        If song exists in playlist,
        move the current DLL node
        to that song.
    */

    if (
        playlist.size > 0
    ) {

        playlist.setCurrent(
            song.id
        );

    }


    /*
        STACK

        Push song into recently played.
    */

    if (pushHistory) {

        const last =
            history.peek();


        if (
            !last ||
            String(last.id) !==
            String(song.id)
        ) {

            history.push(
                song
            );

        }

    }


    /*
        Update player UI.
    */
    
        playerTitle.innerHTML = `
    <span class="title-track">

        <span>
            ${escapeHTML(song.title)}
        </span>

        <span aria-hidden="true">
            ${escapeHTML(song.title)}
        </span>

    </span>
`;

playerTitle.classList.remove(
    "scroll-title"
);

requestAnimationFrame(() => {

    const track =
        playerTitle.querySelector(
            ".title-track"
        );

    const firstTitle =
        track?.firstElementChild;

    if (
        firstTitle &&
        firstTitle.scrollWidth >
        playerTitle.clientWidth
    ) {

        playerTitle.classList.add(
            "scroll-title"
        );

    }

});


    playerArtist.textContent =
        song.artist;


    if (
        song.artwork
    ) {

        playerImage.src =
            song.artwork;

        playerImage.style.background =
            "";

    }

    else {

        playerImage.src =
            "";

        playerImage.style.background =

            `linear-gradient(
                135deg,
                ${song.color || "#8b5cf6"},
                #111827
            )`;

    }


    /*
        API songs normally have
        previewUrl.
    */

    if (
        !song.previewUrl
    ) {

        audio.pause();

        audio.removeAttribute(
            "src"
        );

        audio.load();


        isPlaying =
            false;


        updatePlayButton();


        showToast(
            "No audio preview available in offline mode."
        );


        renderHistory();


        return;

    }


    /*
        Load new audio.
    */

    audio.pause();

    audio.src =
        song.previewUrl;

    audio.load();


    /*
        Start playback.
    */

    audio.play()

        .then(() => {

            isPlaying =
                true;

            updatePlayButton();

        })

        .catch(error => {

            console.error(
                "Playback error:",
                error
            );


            isPlaying =
                false;


            updatePlayButton();


            showToast(
                "Could not play this preview."
            );

        });


    renderHistory();

}


/* =========================================================
   PLAY BY ID
   ========================================================= */

window.playById =
function(id) {

    const song =
        findSongById(id);


    playSong(song);

};


/* =========================================================
   NEXT
   ========================================================= */

function nextSong() {

    /*
        We want Next/Previous to
        demonstrate the Circular DLL.

        Therefore playlist is required.
    */

    if (
        playlist.size === 0
    ) {

        showToast(
            "Add songs to My Playlist first."
        );

        return;

    }


    let next;


    /*
        Shuffle mode
    */

    if (shuffle) {

        const songs =
            playlist.toArray();


        const randomIndex =

            Math.floor(
                Math.random() *
                songs.length
            );


        next =
            songs[randomIndex];


        playlist.setCurrent(
            next.id
        );

    }


    /*
        Normal Circular DLL mode

        current.next

        O(1)
    */

    else {

        next =
            playlist.nextSong();

    }


    playSong(
        next
    );

}


/* =========================================================
   PREVIOUS
   ========================================================= */

function previousSong() {

    if (
        playlist.size === 0
    ) {

        showToast(
            "Add songs to My Playlist first."
        );

        return;

    }


    /*
        Circular DLL

        current.prev

        O(1)
    */

    const previous =
        playlist.previousSong();


    playSong(
        previous
    );

}


/* =========================================================
   PLAY / PAUSE
   ========================================================= */

function togglePlay() {

    /*
        No song selected
    */

    if (
        !currentSong
    ) {

        if (
            playlist.size > 0
        ) {

            playSong(
                playlist.toArray()[0]
            );

        }

        else if (
            catalogue.length > 0
        ) {

            playSong(
                catalogue[0]
            );

        }

        return;

    }


    /*
        No audio loaded
    */

    if (
        !audio.src
    ) {

        showToast(
            "No playable preview loaded."
        );

        return;

    }


    /*
        PLAY
    */

    if (
        audio.paused
    ) {

        audio.play()

            .then(() => {

                isPlaying =
                    true;

                updatePlayButton();

            })

            .catch(() => {

                showToast(
                    "Unable to start playback."
                );

            });

    }


    /*
        PAUSE
    */

    else {

        audio.pause();

        isPlaying =
            false;

        updatePlayButton();

    }

}


/* =========================================================
   PLAYER BUTTON
   ========================================================= */

function updatePlayButton() {

    playPauseBtn.textContent =

        isPlaying
            ? "❚❚"
            : "▶";

}


/* =========================================================
   HISTORY - STACK
   ========================================================= */

function renderHistory() {

    const songs =
        history.toArray();


    /*
        Hide/show empty message
    */

    historyEmpty.style.display =

        songs.length === 0
            ? "block"
            : "none";


    /*
        Newest song first.
    */

    historyList.innerHTML =

        songs.map(
            (song, index) => {

                const image =
                    song.artwork

                    ?

                    `

                    <img
                        src="${escapeHTML(
                            song.artwork
                        )}"
                        alt=""
                    >

                    `

                    :

                    `

                    <img
                        src=""
                        alt=""
                        style="
                            background:
                            ${song.color || "#8b5cf6"}
                        "
                    >

                    `;


                return `

                    <div
                        class="list-row"
                    >

                        ${image}


                        <div
                            class="list-info"
                        >

                            <h4>
                                ${escapeHTML(
                                    song.title
                                )}
                            </h4>


                            <p>
                                ${escapeHTML(
                                    song.artist
                                )}
                            </p>

                        </div>


                        <span
                            class="position"
                        >

                            ${
                                index === 0
                                    ? "TOP"
                                    : "#" + (index + 1)
                            }

                        </span>


                        <div
                            class="list-buttons"
                        >

                            <button
                                onclick="
                                    playById(
                                        '${escapeHTML(
                                            String(song.id)
                                        )}'
                                    )
                                "
                            >

                                ▶

                            </button>

                        </div>

                    </div>

                `;

            }
        )

        .join("");

}


/* =========================================================
   PLAYLIST - CIRCULAR DLL
   ========================================================= */

function renderPlaylist() {

    const songs =
        playlist.toArray();


    /*
        Show empty state if required.
    */

    playlistEmpty.style.display =

        songs.length === 0
            ? "block"
            : "none";


    playlistList.innerHTML =

        songs.map(
            (song, index) => {

                const image =
                    song.artwork

                    ?

                    `

                    <img
                        src="${escapeHTML(
                            song.artwork
                        )}"
                        alt=""
                    >

                    `

                    :

                    `

                    <img
                        src=""
                        alt=""
                        style="
                            background:
                            ${song.color || "#8b5cf6"}
                        "
                    >

                    `;


                return `

                    <div
                        class="list-row"
                    >

                        ${image}


                        <div
                            class="list-info"
                        >

                            <h4>
                                ${escapeHTML(
                                    song.title
                                )}
                            </h4>


                            <p>
                                ${escapeHTML(
                                    song.artist
                                )}
                            </p>

                        </div>


                        <span
                            class="position"
                        >

                            ${index + 1}/${songs.length}

                        </span>


                        <div
                            class="list-buttons"
                        >

                            <button
                                onclick="
                                    playById(
                                        '${escapeHTML(
                                            String(song.id)
                                        )}'
                                    )
                                "
                            >

                                ▶

                            </button>


                            <button
                                onclick="
                                    removePlaylistSong(
                                        '${escapeHTML(
                                            String(song.id)
                                        )}'
                                    )
                                "
                            >

                                ×

                            </button>

                        </div>

                    </div>

                `;

            }
        )

        .join("");

}


/* =========================================================
   REMOVE FROM PLAYLIST
   ========================================================= */

window.removePlaylistSong =
function(id) {

    playlist.remove(
        id
    );


    renderPlaylist();


    showToast(
        "Song removed from playlist."
    );

};


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

document
    .querySelectorAll(
        ".nav-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;


                /*
                    Remove old active state
                */

                document
                    .querySelectorAll(
                        ".nav-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                /*
                    Activate clicked button
                */

                button.classList.add(
                    "active"
                );


                /*
                    Hide all pages
                */

                document
                    .querySelectorAll(
                        ".page"
                    )
                    .forEach(pageSection =>
                        pageSection.classList.remove(
                            "active"
                        )
                    );


                /*
                    Show selected page
                */

                const target =
                    document.getElementById(
                        `${page}Page`
                    );


                if (target) {

                    target.classList.add(
                        "active"
                    );

                }

            }
        );

    });


/* =========================================================
   SEARCH INPUT
   ========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(
            searchTimer
        );


        const value =
            searchInput.value.trim();


        /*
            Show/hide clear button
        */

        clearSearch.style.display =

            value
                ? "block"
                : "none";


        /*
            Small delay prevents
            API call on every keystroke.
        */

        searchTimer =
            setTimeout(
                () => {

                    searchSongs(
                        value
                    );

                },
                450
            );

    }
);


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value =
            "";


        clearSearch.style.display =
            "none";


        currentResults =
            [...catalogue];


        displaySongs(
            currentResults,
            "Live Music"
        );

    }
);


/* =========================================================
   PLAYER EVENTS
   ========================================================= */

playPauseBtn.addEventListener(
    "click",
    togglePlay
);


nextBtn.addEventListener(
    "click",
    nextSong
);


previousBtn.addEventListener(
    "click",
    previousSong
);


/* =========================================================
   SHUFFLE
   ========================================================= */

document
    .getElementById(
        "shuffleBtn"
    )
    .addEventListener(
        "click",
        () => {

            shuffle =
                !shuffle;


            document
                .getElementById(
                    "shuffleBtn"
                )
                .classList.toggle(
                    "active",
                    shuffle
                );


            showToast(

                shuffle
                    ? "Shuffle enabled"
                    : "Shuffle disabled"

            );

        }
    );


/* =========================================================
   REPEAT
   ========================================================= */

document
    .getElementById(
        "repeatBtn"
    )
    .addEventListener(
        "click",
        () => {

            repeat =
                !repeat;


            document
                .getElementById(
                    "repeatBtn"
                )
                .classList.toggle(
                    "active",
                    repeat
                );


            showToast(

                repeat
                    ? "Repeat enabled"
                    : "Repeat disabled"

            );

        }
    );


/* =========================================================
   AUDIO EVENTS
   ========================================================= */

/*
    Metadata loaded
*/

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


/*
    Progress update
*/

audio.addEventListener(
    "timeupdate",
    () => {

        if (
            !audio.duration
        ) {

            return;

        }


        const percentage =

            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progressBar.value =
            percentage;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

    }
);


/*
    Audio started
*/

audio.addEventListener(
    "play",
    () => {

        isPlaying =
            true;


        updatePlayButton();

    }
);


/*
    Audio paused
*/

audio.addEventListener(
    "pause",
    () => {

        isPlaying =
            false;


        updatePlayButton();

    }
);


/*
    Audio error
*/

audio.addEventListener(
    "error",
    () => {

        isPlaying =
            false;


        updatePlayButton();


        console.warn(
            "Audio preview failed."
        );

    }
);


/*
    Audio ended
*/

audio.addEventListener(
    "ended",
    () => {

        /*
            Repeat current song
        */

        if (repeat) {

            audio.currentTime =
                0;


            audio.play()
                .catch(() => {});


            return;

        }


        /*
            Otherwise go to next
        */

        nextSong();

    }
);


/* =========================================================
   PROGRESS BAR
   ========================================================= */

progressBar.addEventListener(
    "input",
    () => {

        if (
            !audio.duration
        ) {

            return;

        }


        audio.currentTime =

            (
                Number(
                    progressBar.value
                ) / 100
            )

            *

            audio.duration;

    }
);


/* =========================================================
   VOLUME
   ========================================================= */

volumeBar.addEventListener(
    "input",
    () => {

        lastVolume =
            Number(
                volumeBar.value
            );


        audio.volume =
            lastVolume;

    }
);


/* =========================================================
   LOAD DEMO BUTTON
   ========================================================= */

document
    .getElementById(
        "demoBtn"
    )
    .addEventListener(
        "click",
        () => {

            /*
                This intentionally loads
                offline fallback data.
            */

            catalogue =
                [...FALLBACK_SONGS];


            currentResults =
                [...catalogue];


            rebuildHashTable();


            playlist.clear();

            history.clear();


            /*
                Add first four songs
                to demonstrate DLL.
            */

            catalogue
                .slice(0, 4)
                .forEach(
                    song =>
                        playlist.append(
                            song
                        )
                );


            currentSong =
                null;


            audio.pause();

            audio.removeAttribute(
                "src"
            );

            audio.load();


            isPlaying =
                false;


            playerTitle.textContent =
                "Select a song";


            playerArtist.textContent =
                "MusicFlow";


            displaySongs(
                catalogue,
                "Offline Demo Catalogue"
            );


            renderPlaylist();

            renderHistory();

            updatePlayButton();


            setStatus(
                "Offline Demo",
                "offline"
            );


            showToast(
                "Offline demo loaded."
            );

        }
    );


/* =========================================================
   PLAY MUSIC BUTTON
   ========================================================= */

document
    .getElementById(
        "playDemo"
    )
    .addEventListener(
        "click",
        () => {

            /*
                Prefer playlist first.
            */

            if (
                playlist.size > 0
            ) {

                playSong(
                    playlist.toArray()[0]
                );

            }

            else if (
                catalogue.length > 0
            ) {

                playSong(
                    catalogue[0]
                );

            }

        }
    );


/* =========================================================
   DATA STRUCTURE ARCHITECTURE
   ========================================================= */

document
    .getElementById(
        "architectureBtn"
    )
    .addEventListener(
        "click",
        () => {

            const panel =
                document.getElementById(
                    "architecture"
                );


            panel.classList.remove(
                "hidden"
            );


            panel.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }
    );


document
    .getElementById(
        "closeArchitecture"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "architecture"
                )
                .classList.add(
                    "hidden"
                );

        }
    );


/* =========================================================
   CLEAR PLAYLIST
   ========================================================= */

document
    .getElementById(
        "clearPlaylist"
    )
    .addEventListener(
        "click",
        () => {

            playlist.clear();


            renderPlaylist();


            showToast(
                "Playlist cleared."
            );

        }
    );


/* =========================================================
   CLEAR HISTORY
   ========================================================= */

document
    .getElementById(
        "clearHistory"
    )
    .addEventListener(
        "click",
        () => {

            history.clear();


            renderHistory();


            showToast(
                "History cleared."
            );

        }
    );


/* =========================================================
   INITIALIZATION
   ========================================================= */

/*
    Set volume
*/

audio.volume =
    lastVolume;


volumeBar.value =
    lastVolume;


/*
    Hide clear button
*/

clearSearch.style.display =
    "none";


/*
    IMPORTANT:

    Start with EMPTY catalogue.

    Then call API.

    Therefore normal Home page
    is NOT based on fixed songs.
*/

catalogue = [];

currentResults = [];


/*
    Build empty Hash Table
*/

rebuildHashTable();


/*
    Render empty playlist/history
*/

renderPlaylist();

renderHistory();


/*
    Initial player state
*/

playerTitle.textContent =
    "Loading music...";


playerArtist.textContent =
    "MusicFlow";


/*
    MAIN API CALL
*/

loadFeaturedSongs();